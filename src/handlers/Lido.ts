import {EntityCache} from "../entity-cache";
import {LidoSubmission, LidoTransfer, NodeOperatorFees, SharesBurn} from "../model";
import {
    _loadLidoTransferEntity,
    _loadSharesEntity, _loadTotalRewardEntity,
    _loadTotalsEntity, _processTokenRebase, _updateHolders, _updateTransferBalances,
    _updateTransferShares,
    isLidoTransferShares,
    isLidoV2
} from "./helpers";
import {
    extractPairedEvent,
    getParsedEvent, getParsedEventByName,
    getRightPairedEventByLeftLogIndex,
    ParsedEvent,
    parseEventLogs
} from "./parser";
import {getAddress, LIDO_ADDRESS, ZERO_ADDRESS} from "../constants";
import assert from "assert";
import {mainHandleSharesBurnt} from "../main-handler";

export const handleSubmitted = async (sender: string, amount: bigint, referral: string, ctx: any, logEvent: any, entityCache: EntityCache) => {

    let entity = new LidoSubmission({
        id: logEvent.transactionHash + logEvent.logIndex.toString()
    });
    // let entity = new LidoSubmission(event.transaction.hash.toHex() + '-' + event.logIndex.toString())

    entity.sender = sender;
    entity.amount = amount;
    entity.referral = referral;

    entity.block = BigInt(logEvent.block.height);
    entity.blockTime = BigInt(logEvent.block.timestamp);
    entity.transactionHash = logEvent.transactionHash;
    entity.transactionIndex = BigInt(logEvent.transactionIndex);
    entity.logIndex = BigInt(logEvent.logIndex);

    // Loading totals
    const totals = await _loadTotalsEntity(true, entityCache);
    if (!totals) return;

    let shares: bigint;
    // after TransferShares event has been added just take shares value from it
    // calc shares value otherwise
    if (await isLidoTransferShares(logEvent.block.height, entityCache)) {
        // limit parsing by 2 next events
        // such approach cover both cases when Transfer was emitted before and wise versa
        const parsedEvents = parseEventLogs(logEvent, LIDO_ADDRESS, logEvent.logIndex, logEvent.logIndex + 2n);
        // extracting only 'Transfer' and 'TransferShares' pairs
        const transferEventPairs = extractPairedEvent(parsedEvents, 'Transfer', 'TransferShares');

        // expecting at only one Transfer events pair
        assert(transferEventPairs.length == 1, 'no Transfer/TransferShares events on submit');

        // const eventTransfer = getParsedEvent<Transfer>(transferEventPairs[0], 0)
        const eventTransferShares = getParsedEvent(transferEventPairs[0], 1);
        shares = eventTransferShares.params['sharesValue']!;
    } else {
        /**
         * Use 1:1 ether-shares ratio when:
         * 1. Nothing was staked yet
         * 2. Someone staked something, but shares got rounded to 0 eg staking 1 wei
         **/

        // Check if contract has no ether or shares yet
        shares = totals.totalPooledEther === 0n ? amount : (amount * totals.totalShares) / totals.totalPooledEther;

        // handle the case when staked amount ~1 wei, that shares to mint got rounded to 0
        if (shares === 0n) shares = amount;

    }

    entity.shares = shares;

    const sharesEntity = await _loadSharesEntity(sender, true, entityCache);
    if (!sharesEntity) return;
    entity.sharesBefore = sharesEntity.shares;
    entity.sharesAfter = entity.sharesBefore + shares;

    entity.totalPooledEtherBefore = totals.totalPooledEther;
    entity.totalSharesBefore = totals.totalShares;

    // Increasing Total
    totals.totalPooledEther = totals.totalPooledEther + amount;
    totals.totalShares = totals.totalShares + shares;
    entityCache.saveTotals(totals);

    entity.totalPooledEtherAfter = totals.totalPooledEther;
    entity.totalSharesAfter = totals.totalShares;

    // Calculating new balance
    entity.balanceAfter = (entity.sharesAfter * totals.totalPooledEther) / totals.totalShares;
    entityCache.saveLidoSubmission(entity);

    entityCache.saveShares(sharesEntity);
}


export const handleTransfer = async (from: string, to: string, value: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadLidoTransferEntity(from, to, value, logEvent, entityCache);

    // Entity is already created at this point
    const totals = await _loadTotalsEntity(false, entityCache);
    if (!totals) return;
    assert(totals.totalPooledEther > 0n, 'transfer with zero totalPooledEther');

    entity.totalPooledEther = totals.totalPooledEther;
    entity.totalShares = totals.totalShares;

    let eventTransferShares: ParsedEvent | null = null;
    // now we should parse the whole tx receipt to be sure pair extraction is accurate
    if (await isLidoTransferShares(logEvent.block.height, entityCache)) {
        const parsedEvents = parseEventLogs(logEvent, LIDO_ADDRESS);
        // TransferShares should exist after according upgrade
        eventTransferShares =
            getRightPairedEventByLeftLogIndex(extractPairedEvent(parsedEvents, 'Transfer', 'TransferShares'), logEvent.logIndex)!;
        entity.shares = eventTransferShares.params['sharesValue']!;

        // skip handling if nothing to handle
        if (entity.value === 0n && entity.shares === 0n) return;
    } else {
        // usual transfer without TransferShares event, so calc shares
        entity.shares = (entity.value * totals.totalShares) / totals.totalPooledEther;
    }



    if (entity.from === ZERO_ADDRESS) {
        // process mint transfers

        // check if totalReward record exists, so assuming it's mint during Oracle report
        const totalRewardsEntity = await entityCache.getTotalReward(logEvent.transactionHash);
        if (totalRewardsEntity) {
            /// @deprecated
            // entity.mintWithoutSubmission = true

            if (await isLidoV2(entity.block, entityCache)) {
                // after V2 upgrade, TotalReward is handled by handleETHDistributed
            } else {
                /**
                 * Handling fees during oracle report, in order:
                 * 1. Insurance Fund Transfer
                 * 2. Node Operator Reward Transfers
                 * 3. Treasury Fund Transfer with remaining dust or just rounding dust
                 **/

                // in case TreasuryAddress = InsuranceAddress and insuranceFeeBasisPoints no zero assuming the first tx should go to Insurance
                if (
                    entity.to === await getAddress('INSURANCE_FUND', entityCache) &&
                    totalRewardsEntity.insuranceFeeBasisPoints !== 0n &&
                    totalRewardsEntity.insuranceFee === 0n
                ) {
                    // Handling the Insurance Fee transfer event
                    totalRewardsEntity.insuranceFee =
                        totalRewardsEntity.insuranceFee + entity.value;

                    // sanity assertion
                    if (eventTransferShares) {
                        assert(
                            entity.shares === totalRewardsEntity.sharesToInsuranceFund,
                            'Unexpected sharesToInsuranceFund'
                        )
                    } else {
                        // overriding calculated value
                        entity.shares = totalRewardsEntity.sharesToInsuranceFund
                    }
                } else if (entity.to === await getAddress('TREASURY', entityCache)) {
                    // Handling the Treasury Fund transfer event

                    // log.warning('before: treasuryFee {} dust {}', [
                    //   totalRewardsEntity.treasuryFee.toString(),
                    //   totalRewardsEntity.dust.toString()
                    // ])
                    // log.warning('before: sharesToTreasury {} dustSharesToTreasury {}', [
                    //   totalRewardsEntity.sharesToTreasury.toString(),
                    //   totalRewardsEntity.dustSharesToTreasury.toString()
                    // ])

                    let shares: bigint;
                    // Dust exists only when treasuryFeeBasisPoints is 0 and prior Lido v2
                    if (totalRewardsEntity.treasuryFeeBasisPoints === 0n) {
                        totalRewardsEntity.dust = totalRewardsEntity.dust + entity.value;
                        shares = totalRewardsEntity.dustSharesToTreasury;
                    } else {
                        totalRewardsEntity.treasuryFee =
                            totalRewardsEntity.treasuryFee + entity.value;
                        shares = totalRewardsEntity.sharesToTreasury;
                    }

                    // log.warning('entity.value {} entity.shares {} shares {}', [
                    //   entity.value.toString(),
                    //   entity.shares.toString(),
                    //   shares.toString()
                    // ])
                    // log.warning('after: treasuryFee {} dust {}', [
                    //   totalRewardsEntity.treasuryFee.toString(),
                    //   totalRewardsEntity.dust.toString()
                    // ])
                    // log.warning('after: sharesToTreasury {} dustSharesToTreasury {}', [
                    //   totalRewardsEntity.sharesToTreasury.toString(),
                    //   totalRewardsEntity.dustSharesToTreasury.toString()
                    // ])

                    if (eventTransferShares) {
                        assert(entity.shares === shares, 'Unexpected sharesToTreasury');
                    } else {
                        // overriding calculated value
                        entity.shares = shares;
                    }
                } else {
                    // Handling fee transfer to node operator prior v2 upgrade
                    // after v2 there are only transfers to SR modules

                    const nodeOperatorFee = new NodeOperatorFees({
                        id: `${logEvent.transactionHash}${logEvent.logIndex}`,
                        totalRewardId: totalRewardsEntity.id,
                        address: entity.to,
                        fee: entity.value
                    });
                    // const nodeOperatorFee = new NodeOperatorFees(event.transaction.hash.toHex() + '-' + event.logIndex.toString())
                    entityCache.saveNodeOperatorFee(nodeOperatorFee);

                    // Entity should already exist at this point
                    const nodeOperatorShare = await entityCache.getNodeOperatorsShare(`${logEvent.transactionHash}${entity.to}`);
                    if (!nodeOperatorShare) return;
                    // const nodeOperatorShare = NodeOperatorsShares.load(event.transaction.hash.toHex() + '-' + entity.to.toHexString())!

                    if (eventTransferShares) {
                        assert(
                            entity.shares === nodeOperatorShare.shares,
                            'Unexpected nodeOperatorsShares'
                        )
                    } else {
                        entity.shares = nodeOperatorShare.shares;
                    }
                    totalRewardsEntity.operatorsFee =
                        totalRewardsEntity.operatorsFee + entity.value;
                }

                if (entity.value !== 0n) {
                    // decreasing saved total rewards to (remainder will be users reward)
                    assert(
                        totalRewardsEntity.totalRewards >= entity.value,
                        'negative totalRewards'
                    );
                    totalRewardsEntity.totalRewards =
                        totalRewardsEntity.totalRewards - entity.value;
                    // increasing total system fee value
                    totalRewardsEntity.totalFee = totalRewardsEntity.totalFee + entity.value;
                    entityCache.saveTotalReward(totalRewardsEntity);
                }
            }
        } else {
            // transfer after submit
            /// @deprecated
            // entity.mintWithoutSubmission = false

            if (!eventTransferShares) {
                // prior TransferShares logic
                // Submission entity should exist with the previous logIndex (as mint Transfer occurs only after Submit event)
                let submissionEntity = await entityCache.getLidoSubmission(`${logEvent.transactionHash}${logEvent.logIndex-1}`);
                if (!submissionEntity) return;
                // let submissionEntity = LidoSubmission.load(
                //   event.transaction.hash.toHex() + '-' + event.logIndex.minus(ONE).toString()
                // )!

                // throws error if no submissionEntity
                entity.shares = submissionEntity.shares;
            }
        }
    }
    // upd account's shares and stats
    await _updateTransferShares(entity, entityCache);
    _updateTransferBalances(entity);
    await _updateHolders(entity, entityCache);
    entityCache.saveLidoTransfer(entity);
}


export const handleSharesBurnt = async (account: string,preRebaseTokenAmount: bigint, postRebaseTokenAmount: bigint, sharesAmount: bigint, logEvent: any, entityCache: EntityCache) => {
    // shares are burned only during oracle report from LidoBurner contract
    const id = `${logEvent.transactionHash}${logEvent.logIndex}`;
    let entity = await entityCache.getSharesBurn(id);
    // process totals only if entity not yet exists, i.e. not yet handled before
    if (!!entity) return;

    entity = new SharesBurn({
        id: id,
        account: account,
        postRebaseTokenAmount: postRebaseTokenAmount,
        preRebaseTokenAmount: preRebaseTokenAmount,
        sharesAmount: sharesAmount
    });
    entityCache.saveSharesBurn(entity);

    // Totals should be already non-null here
    const totals = await _loadTotalsEntity(false, entityCache);
    if (!totals) return;
    totals.totalShares = totals.totalShares - sharesAmount;
    assert(totals.totalShares >= 0n, 'negative totalShares after shares burn')
    entityCache.saveTotals(totals);

    // create Transfer event
    const txEntity = new LidoTransfer({
        id: id,
        from: account,
        to: ZERO_ADDRESS,
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        transactionIndex: BigInt(logEvent.transactionIndex),
        logIndex: BigInt(logEvent.logIndex),
        value: postRebaseTokenAmount,
        shares: sharesAmount,
        totalPooledEther: totals.totalPooledEther,
        totalShares: totals.totalShares,
        sharesBeforeDecrease: 0n,
        sharesAfterDecrease: 0n,
        balanceAfterDecrease: 0n,
        sharesBeforeIncrease: 0n,
        sharesAfterIncrease: 0n,
        balanceAfterIncrease: 0n
    });

    // upd account's shares and stats
    await _updateTransferShares(txEntity, entityCache);
    _updateTransferBalances(txEntity);
    await _updateHolders(txEntity, entityCache);

    entityCache.saveLidoTransfer(txEntity);

}


export const handleETHDistributed = async (reportTimestamp: bigint,preCLBalance: bigint, postCLBalance: bigint, withdrawalsWithdrawn: bigint, executionLayerRewardsWithdrawn: bigint, postBufferedEther: bigint, logEvent: any, entityCache: EntityCache) => {
    // we should process token rebase here as TokenRebased event fired last, but we need new values before transfers
    // parse all events from tx receipt
    const parsedEvents = parseEventLogs(logEvent, LIDO_ADDRESS);

    // TokenRebased event should exist
    const tokenRebasedEvent = getParsedEventByName(parsedEvents, 'TokenRebased', BigInt(logEvent.logIndex));
    if (!tokenRebasedEvent) {
        console.warn(
            'Event TokenRebased not found when ETHDistributed! block: {} txHash: {} logIdx: {} ',
            [
                logEvent.block.height.toString(),
                logEvent.transactionHash,
                logEvent.logIndex.toString(),
            ]
        );
        return;
    }

    // Totals should be already non-null on oracle report
    const totals = await _loadTotalsEntity(false, entityCache);
    if (!totals) return;
    assert(
        totals.totalPooledEther === tokenRebasedEvent.params['preTotalEther'],
        "totalPooledEther mismatch report's preTotalEther"
    );
    assert(
        totals.totalShares === tokenRebasedEvent.params['preTotalShares'],
        "totalShares mismatch report's preTotalShares"
    );

    // update totalPooledEther for correct SharesBurnt
    totals.totalPooledEther = tokenRebasedEvent.params['postTotalEther'];
    entityCache.saveTotals(totals);

    // @note saved Transfer event from WQ to Burner will contain wrong totalPooledEther value due to internal update of CL_BALANCE without event
    // try to find and handle SharesBurnt event which expect not yet changed totalShares
    const sharesBurntEvent = getParsedEventByName(parsedEvents, 'SharesBurnt', BigInt(logEvent.logIndex), BigInt(tokenRebasedEvent.event.logIndex));
    if (sharesBurntEvent) {
        await mainHandleSharesBurnt(sharesBurntEvent.event, entityCache);
    }

    // override and save correct totalShares for next mint transfers
    // (i.e. for calculation minted rewards), as we need new values before transfers
    totals.totalShares = tokenRebasedEvent.params['postTotalShares'];
    entityCache.saveTotals(totals);

    // Don’t mint/distribute any protocol fee on the non-profitable Lido oracle report
    // (when consensus layer balance delta is zero or negative).
    // See LIP-12 for details:
    // https://research.lido.fi/t/lip-12-on-chain-part-of-the-rewards-distribution-after-the-merge/1625
    const postCLTotalBalance = postCLBalance + withdrawalsWithdrawn;
    if (postCLTotalBalance <= preCLBalance) return;

    const totalRewards = postCLTotalBalance - preCLBalance + executionLayerRewardsWithdrawn;

    const totalRewardsEntity = await _loadTotalRewardEntity(logEvent, true, entityCache);
    if (!totalRewardsEntity) return;

    totalRewardsEntity.totalRewards = totalRewards;
    totalRewardsEntity.totalRewardsWithFees = totalRewardsEntity.totalRewards;
    totalRewardsEntity.mevFee = executionLayerRewardsWithdrawn;

    await _processTokenRebase(totalRewardsEntity, logEvent, tokenRebasedEvent, parsedEvents, entityCache);

    entityCache.saveTotalReward(totalRewardsEntity);
}
