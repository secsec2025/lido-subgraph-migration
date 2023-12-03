import {EntityCache} from "../entity-cache";
import {
    _calcAPR_v1,
    _loadOracleConfig,
    _loadStatsEntity,
    _loadTotalRewardEntity,
    _loadTotalsEntity,
    isLidoV2
} from "./helpers";
import {BeaconReport, NodeOperatorsShares, OracleCompleted, OracleExpectedEpoch, OracleMember} from "../model";
import {CALCULATION_UNIT, DEPOSIT_AMOUNT, getAddress, NETWORK} from "../constants";
import {getParsedEventByName, parseEventLogs} from "./parser";
import {getRewardsDistributionFromNodeOperatorsRegistryContract} from "../helpers/contract-helper";

export const handleCompleted = async (epochId: bigint, beaconBalance: bigint, beaconValidators: bigint, ctx: any,  logEvent: any, entityCache: EntityCache) => {
    // keep backward compatibility
    const stats = await _loadStatsEntity(entityCache);
    const previousCompleted = await entityCache.getOracleCompleted(stats.lastOracleCompletedId.toString());
    stats.lastOracleCompletedId = stats.lastOracleCompletedId + 1n;

    const newCompleted = new OracleCompleted({
        id: stats.lastOracleCompletedId.toString(),
        epochId: epochId,
        beaconBalance: beaconBalance,
        beaconValidators: beaconValidators,
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        logIndex: BigInt(logEvent.logIndex)
    });
    entityCache.saveOracleCompleted(newCompleted);
    entityCache.saveStats(stats);

    const config = await _loadOracleConfig(entityCache);

    const beaconReportEntity = new BeaconReport({
        id: `${logEvent.transactionHash}${logEvent.logIndex}`,
        epochId: epochId,
        beaconBalance: beaconBalance,
        beaconValidators: beaconValidators,
        caller: logEvent.transaction?.from,
    });
    entityCache.saveBeaconReport(beaconReportEntity);

    const expectedEpochEntity = new OracleExpectedEpoch({
        id: `${logEvent.transactionHash}${logEvent.logIndex}`,
        epochId: epochId + config.epochsPerFrame
    });
    entityCache.saveOracleExpectedEpoch(expectedEpochEntity);

    if (await isLidoV2(BigInt(logEvent.block.height), entityCache)) return;

    /**
     Appeared validators can be negative if active keys are deleted, which can happen on Testnet.
     As we are comparing previous Oracle report, by the time of a new report validator removal can happen.

     In such cases, we override appearedValidatorsDeposits to ZERO as:
     Our Subgraph 10 - 20 = -10 validatorsAmount math is 10 - 10 = 0 validatorsAmount in contract.

     Context:

     totalPooledEther = bufferedBalance (in the contract) + beaconBalance (validator balances) + transientBalance (sent to validators, but not yet there)

     transientBalance is tricky, it's (depositedValidators - beaconValidators) * 32eth

     DEPOSITED_VALIDATORS_POSITION is incremented on ETH deposit to deposit contract
     BEACON_VALIDATORS_POSITION is incremented on oracle reports

     As we saw on testnet, manual active key removal will adjust totalPooledEther straight away as there will be a difference between validators deposited and beacon validators.

     DEPOSITED_VALIDATORS_POSITION was left intact
     BEACON_VALIDATORS_POSITION was decreased

     This would increase totalPooledEther until an oracle report is made.
     **/

    const oldBeaconValidators = previousCompleted
        ? previousCompleted.beaconValidators
        : 0n;
    const oldBeaconBalance = previousCompleted
        ? previousCompleted.beaconBalance
        : 0n;
    const newBeaconValidators = beaconValidators;
    const newBeaconBalance = beaconBalance;

    const appearedValidators = newBeaconValidators - oldBeaconValidators;
    const appearedValidatorsDeposits =
        appearedValidators > 0n ? appearedValidators * DEPOSIT_AMOUNT : 0n;
    const rewardBase = appearedValidatorsDeposits + oldBeaconBalance;

    // try to find MEV rewards, parse all events from tx receipt
    const parsedEvents = parseEventLogs(logEvent);
    const elRewardsEvent = getParsedEventByName(parsedEvents, 'ELRewardsReceived', logEvent.logIndex);
    const mevTxFeeEvent = getParsedEventByName(parsedEvents, 'MevTxFeeReceived', logEvent.logIndex);
    const mevFee: bigint = elRewardsEvent
        ? elRewardsEvent.params['amount']
        : mevTxFeeEvent
            ? mevTxFeeEvent.params['amount']
            : 0n;

    const rewards = newBeaconBalance - rewardBase + mevFee;

    // Totals should be already non-null on first oracle report
    const totals = await _loadTotalsEntity(false, entityCache);
    if (!totals) return;

    // save the value before increase
    let totalPooledEtherBefore = totals.totalPooledEther;
    // pre-calculation
    let totalPooledEtherAfter = totalPooledEtherBefore + rewards;

    /**
     * WARNING: this correction should exist for Goerli testnet, otherwise subgraph will break
     *
     * Note: Also see the`BeaconValidatorsUpdated` event handler at `Lido` contract
     */
    if (NETWORK === 'goerli') {
        // check manually corrected values on testnet
        // 0 - no correction
        // 1 - correct value "before"
        // 2 - correct value "after"
        let doCorrection = 0;
        if (BigInt(logEvent.block.height) === BigInt(6014700)) {
            // there are direct calls of setValidatorsNumber() without event in blocks: 6014681 and 6014696
            // But there is no one Transfer or Submission events until the oracle report in block 6014700
            // https://goerli.etherscan.io/tx/0x0c12d51ac03edd94ed09300336ed62ffc38610dd15744891e6fa1fa02972bfb1#eventlog
            //
            // So it's lucky moment to correct totalPooledEtherBefore value!
            doCorrection = 1;
        } else if (BigInt(logEvent.block.height) === BigInt(7225143)) {
            // At block 7225143 we have broken Oracle report after long broken state:
            // totalPooledEther was decreased after the report.
            // https://goerli.etherscan.io/tx/0xde2667f834746bdbe0872163d632ce79c4930a82ec7c3c11cb015373b691643b
            //
            // So we handle correction right during report!
            // Using the similar logic, but correcting totalPooledEtherAfter
            doCorrection = 2;
        }

        if (doCorrection !== 0) {
            // We know that the correct values are emitted in PostTotalShares event, so we just grab it
            // find PostTotalShares logIndex, event should exist
            const postTotalSharesEvent = getParsedEventByName(parsedEvents, 'PostTotalShares', logEvent.logIndex)!;

            if (doCorrection === 1) {
                totalPooledEtherBefore = postTotalSharesEvent.params['preTotalPooledEther'];
                totalPooledEtherAfter = totalPooledEtherBefore + rewards;
            } else if (doCorrection === 2) {
                totalPooledEtherAfter = postTotalSharesEvent.params['postTotalPooledEther'];
            }
        }
    }

    // set the new total pooled eth value
    totals.totalPooledEther = totalPooledEtherAfter;

    // Don’t mint/distribute any protocol fee on the non-profitable Lido oracle report
    // (when beacon chain balance delta is zero or negative).
    // See ADR #3 for details: https://research.lido.fi/t/rewards-distribution-after-the-merge-architecture-decision-record/1535
    if (newBeaconBalance <= rewardBase) {
        entityCache.saveTotals(totals);
        return;
    }

    // Create an empty TotalReward entity that will be filled on Transfer events
    // We know that in this transaction there will be Transfer events which we can identify by existence of TotalReward entity with transaction hash as its id
    const totalRewardsEntity = await _loadTotalRewardEntity(logEvent, true, entityCache);
    if (!totalRewardsEntity) return;

    // save prev values
    totalRewardsEntity.totalSharesBefore = totals.totalShares;
    totalRewardsEntity.totalPooledEtherBefore = totalPooledEtherBefore;
    totalRewardsEntity.totalPooledEtherAfter = totalPooledEtherAfter;

    totalRewardsEntity.mevFee = mevFee;

    totalRewardsEntity.totalRewardsWithFees = rewards;
    // Setting totalRewards to totalRewardsWithFees, so we can subtract fees from it
    totalRewardsEntity.totalRewards = rewards;

    const curFee = await entityCache.getCurrentFees('');
    if (!curFee) return;
    // Total fee of the protocol eg 1000 / 100 = 10% fee
    // feeBasisPoints = 1000

    // Overall shares for all rewards cut
    // Note, here we use corrected values
    const shares2mint = (rewards * curFee.feeBasisPoints * totals.totalShares) / ((totalPooledEtherAfter * CALCULATION_UNIT) - (curFee.feeBasisPoints * rewards));

    // set the new shares value
    totals.totalShares = totals.totalShares + shares2mint; // totalSharesAfter
    entityCache.saveTotals(totals);

    totalRewardsEntity.totalSharesAfter = totals.totalShares;

    // Further shares calculations
    // There are currently 3 possible fees

    // Storing contract calls data so we don't need to fetch it again
    // We will load them in handleMevTxFeeReceived in Lido handlers
    totalRewardsEntity.feeBasis = curFee.feeBasisPoints;
    totalRewardsEntity.treasuryFeeBasisPoints = curFee.treasuryFeeBasisPoints; // 0
    totalRewardsEntity.insuranceFeeBasisPoints = curFee.insuranceFeeBasisPoints; // 5000
    totalRewardsEntity.operatorsFeeBasisPoints = curFee.operatorsFeeBasisPoints; // 5000

    const sharesToInsuranceFund = (shares2mint * totalRewardsEntity.insuranceFeeBasisPoints) / CALCULATION_UNIT;
    const sharesToOperators = (shares2mint * totalRewardsEntity.operatorsFeeBasisPoints) / CALCULATION_UNIT;

    totalRewardsEntity.shares2mint = shares2mint;
    totalRewardsEntity.sharesToInsuranceFund = sharesToInsuranceFund;
    totalRewardsEntity.sharesToOperators = sharesToOperators;

    // We will save the entity later

    const registry = await getAddress('NO_REGISTRY', entityCache);
    if (!registry) {
        console.warn(`Cannot find NO_ADDRESS for this network`);
        return;
    }
    const distr = await getRewardsDistributionFromNodeOperatorsRegistryContract(registry, ctx, logEvent, sharesToOperators);

    const opAddresses = distr.recipients;
    const opShares = distr.shares;

    let sharesToOperatorsActual = 0n;

    for (let i = 0; i < opAddresses.length; i++) {
        const addr = opAddresses[i].toLowerCase();
        const shares = opShares[i];

        // Incrementing total of actual shares distributed
        sharesToOperatorsActual = sharesToOperatorsActual + shares;

        const nodeOperatorShare = new NodeOperatorsShares({
            id: `${logEvent.transactionHash}${addr}`,
            totalReward: logEvent.transactionHash,
            address: addr,
            shares: shares
        });
        entityCache.saveNodeOperatorsShare(nodeOperatorShare);
    }

    // sharesToTreasury either:w11
    // - contain dust already and dustSharesToTreasury is 0
    // or
    // - 0 and there's dust

    let treasuryShares = shares2mint - sharesToInsuranceFund - sharesToOperatorsActual;

    if (totalRewardsEntity.treasuryFeeBasisPoints === 0n) {
        totalRewardsEntity.sharesToTreasury = 0n;
        totalRewardsEntity.dustSharesToTreasury = treasuryShares;
    } else {
        totalRewardsEntity.sharesToTreasury = treasuryShares;
        totalRewardsEntity.dustSharesToTreasury = 0n;
    }

    // calc preliminarily APR (if there is no PostTotalShares event yet)
    // will be recalculated in PostTotalShares handler
    const timeElapsed = previousCompleted
        ? newCompleted.blockTime - previousCompleted.blockTime
        : 0n;
    totalRewardsEntity.timeElapsed = timeElapsed;
    _calcAPR_v1(
        totalRewardsEntity,
        totalRewardsEntity.totalPooledEtherBefore,
        totalRewardsEntity.totalPooledEtherAfter,
        timeElapsed,
        totalRewardsEntity.feeBasis
    );

    entityCache.saveTotalReward(totalRewardsEntity);
}


export const handlePostTotalShares = async (postTotalPooledEther: bigint, preTotalPooledEther: bigint, timeElapsed: bigint, totalShares: bigint, logEvent: any, entityCache: EntityCache) => {
    if (await isLidoV2(BigInt(logEvent.block.height), entityCache)) return;

    const totalRewardsEntity = await _loadTotalRewardEntity(logEvent, false, entityCache);
    if (!totalRewardsEntity) return;

    totalRewardsEntity.timeElapsed = timeElapsed;
    _calcAPR_v1(
        totalRewardsEntity,
        preTotalPooledEther,
        postTotalPooledEther,
        timeElapsed,
        totalRewardsEntity.feeBasis
    );
    entityCache.saveTotalReward(totalRewardsEntity);
}


export const handleMemberAdded = async (member: string, logEvent: any, entityCache: EntityCache) => {
    let entity = new OracleMember({
        id: member,
        member: member,
        removed: false,
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        logIndex: BigInt(logEvent.logIndex)
    });
    entityCache.saveOracleMember(entity);
}

export const handleMemberRemoved = async (member: string, logEvent: any, entityCache: EntityCache) => {
    let entity = await entityCache.getOracleMember(member);
    if (!entity) return;
    entity.removed = true;
    entityCache.saveOracleMember(entity);
}

export const handleContractVersionSet = async (version: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOracleConfig(entityCache);
    entity.contractVersion = version;
    entityCache.saveOracleConfig(entity);
}

export const handleQuorumChanged = async (quorum: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOracleConfig(entityCache);
    entity.quorum = quorum;
    entityCache.saveOracleConfig(entity);
}

export const handleBeaconSpecSet = async (epochsPerFrame: bigint, slotsPerEpoch: bigint, secondsPerSlot: bigint, genesisTime: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOracleConfig(entityCache);
    entity.epochsPerFrame = epochsPerFrame;
    entity.slotsPerEpoch = slotsPerEpoch;
    entity.secondsPerSlot = secondsPerSlot;
    entity.genesisTime = genesisTime;
    entityCache.saveOracleConfig(entity);
}

export const handleBeaconReportReceiverSet = async (callback: string, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOracleConfig(entityCache);
    entity.beaconReportReceiver = callback;
    entityCache.saveOracleConfig(entity);
}

export const handleAllowedBeaconBalanceRelativeDecreaseSet = async (value: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOracleConfig(entityCache);
    entity.allowedBeaconBalanceRelativeDecrease = value;
    entityCache.saveOracleConfig(entity);
}

export const handleAllowedBeaconBalanceAnnualRelativeIncreaseSet = async (value: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOracleConfig(entityCache);
    entity.allowedBeaconBalanceAnnualRelativeIncrease = value;
    entityCache.saveOracleConfig(entity);
}



