import {Holder, LidoConfig, LidoTransfer, Shares, Stats, TotalReward, Totals} from "../model";
import {
    CALCULATION_UNIT, E27_PRECISION_BASE,
    getAddress,
    LIDO_APP_ID,
    NETWORK, ONE_HUNDRED_PERCENT,
    PROTOCOL_UPG_APP_VERS,
    PROTOCOL_UPG_BLOCKS,
    PROTOCOL_UPG_IDX_V1_SHARES,
    PROTOCOL_UPG_IDX_V2, SECONDS_PER_YEAR, ZERO_ADDRESS
} from "../constants";
import {EntityCache} from "../entity-cache";
import assert from "assert";
import {BigDecimal} from "@subsquid/big-decimal";
import {extractPairedEvent, getParsedEvent, ParsedEvent} from "./parser";

export async function _loadTotalsEntity(create: boolean = false, entityCache: EntityCache): Promise<Totals | undefined> {
    let totals = await entityCache.getTotals('');
    if (!totals && create) {
        totals = new Totals({
            id: '',
            totalPooledEther: 0n,
            totalShares: 0n
        });
    }
    return totals;
}


export async function _loadSharesEntity(id: string, create: boolean = false, entityCache: EntityCache): Promise<Shares | undefined> {
    let entity = await entityCache.getShares(id);
    if (!entity && create) {
        entity = new Shares({id: id, shares: 0n});
    }
    return entity;
}

export async function _loadLidoTransferEntity(from: string, to: string, value: bigint, logEvent: any, entityCache: EntityCache): Promise<LidoTransfer> {
    const id = `${logEvent.transactionHash}${logEvent.logIndex}`;
    let entity = await entityCache.getLidoTransfer(id);
    if (!entity) {
        entity = new LidoTransfer({
            id: id,
            from: from,
            to: to,
            block: BigInt(logEvent.block.height),
            blockTime: BigInt(logEvent.block.timestamp),
            transactionHash: logEvent.transactionHash,
            transactionIndex: BigInt(logEvent.transactionIndex),
            logIndex: BigInt(logEvent.logIndex),
            value: value,
            shares: 0n,
            totalPooledEther: 0n,
            totalShares: 0n,
            sharesBeforeDecrease: 0n,
            sharesAfterDecrease: 0n,
            balanceAfterDecrease: 0n,
            sharesBeforeIncrease: 0n,
            sharesAfterIncrease: 0n,
            balanceAfterIncrease: 0n
        });
    }
    return entity;
}

export async function _loadStatsEntity(entityCache: EntityCache): Promise<Stats> {
    let stats = await entityCache.getStats('');
    if (!stats) {
        stats = new Stats({
            id: '',
            uniqueHolders: 0n,
            uniqueAnytimeHolders: 0n,
            lastOracleCompletedId: 0n
        });
        entityCache.saveStats(stats);
    }
    return stats;
}


export function _calcAPR_v2(entity: TotalReward, preTotalEther: bigint, postTotalEther: bigint, preTotalShares: bigint, postTotalShares: bigint, timeElapsed: bigint): void {
    // Lido v2 new approach
    // https://docs.lido.fi/integrations/api/#last-lido-apr-for-steth

    const preShareRate = BigDecimal(preTotalEther).times(E27_PRECISION_BASE).div(BigDecimal(preTotalShares));

    const postShareRate = BigDecimal(postTotalEther).times(E27_PRECISION_BASE).div(BigDecimal(postTotalShares));
    const secondsInYear = BigDecimal(SECONDS_PER_YEAR);

    entity.apr = secondsInYear
        .times(postShareRate.minus(preShareRate))
        .times(ONE_HUNDRED_PERCENT)
        .div(preShareRate)
        .div(timeElapsed);

    entity.aprRaw = entity.apr;
    entity.aprBeforeFees = entity.apr;
}


export const checkAppVer = async (block: bigint, appId: string | undefined, minUpgId: number, entityCache: EntityCache): Promise<boolean> => {
    // first we check block for faster detection
    // if block check fails, try to check app ver
    if (block !== 0n) {
        const upgBlocks = PROTOCOL_UPG_BLOCKS.get(NETWORK);
        if (upgBlocks && minUpgId < upgBlocks.length && upgBlocks[minUpgId] != block) {
            // note: we need a block strictly larger than upgBlock, since it
            // is possible that there are transactions in the same block before and after the upgrade
            return upgBlocks[minUpgId] < block;
        }
    }

    // if no appId provided or there is no records about appId in DB, assuming check pass
    if (!appId) return true;

    const appVer = await entityCache.getAppVersion(appId);
    if (!appVer) return true;

    const upgVers = PROTOCOL_UPG_APP_VERS.get(appId);
    // if no upgrades defined assuming subgraph code fully compatible with deployed contracts
    if (!upgVers || upgVers.length == 0 || minUpgId >= upgVers.length) return true;

    // check requested minUpgId is defined and it's contract version is below requested curVer
    return upgVers[minUpgId] <= appVer.major;
}

export async function isLidoV2(block: bigint = 0n, entityCache: EntityCache): Promise<boolean> {
    return await checkAppVer(block, LIDO_APP_ID, PROTOCOL_UPG_IDX_V2, entityCache);
}

export async function isLidoTransferShares(block: bigint = 0n, entityCache: EntityCache): Promise<boolean> {
    return await checkAppVer(block, LIDO_APP_ID, PROTOCOL_UPG_IDX_V1_SHARES, entityCache);
}



export function _updateTransferBalances(entity: LidoTransfer): void {
    if (entity.totalShares === 0n) {
        entity.balanceAfterIncrease = entity.value;
        entity.balanceAfterDecrease = 0n;
    } else {
        entity.balanceAfterIncrease = (entity.sharesAfterIncrease! * entity.totalPooledEther) / entity.totalShares;
        entity.balanceAfterDecrease = (entity.sharesAfterDecrease! * entity.totalPooledEther) / entity.totalShares;
    }
}

export async function _updateTransferShares(entity: LidoTransfer, entityCache: EntityCache): Promise<void> {
    // Decreasing from address shares
    if (entity.from !== ZERO_ADDRESS) {
        // Address must already have shares, HOWEVER:
        // Someone can and managed to produce events of 0 to 0 transfers
        const sharesFromEntity = await _loadSharesEntity(entity.from, true, entityCache);
        if (!sharesFromEntity) return;
        entity.sharesBeforeDecrease = sharesFromEntity.shares;

        if (entity.from !== entity.to && entity.shares !== 0n) {
            // if (sharesFromEntity.shares < entity.shares) {
            //   log.critical(
            //     'negative shares decrease on transfer: from {} to {} sharesBefore {} sharesAfter {} tx {} log {}',
            //     [
            //       entity.from.toHexString(),
            //       entity.to.toHexString(),
            //       sharesFromEntity.shares.toString(),
            //       entity.shares.toString(),
            //       entity.transactionHash.toHexString(),
            //       entity.logIndex.toString()
            //     ]
            //   )
            // }
            assert(
                sharesFromEntity.shares >= entity.shares,
                'negative shares decrease on transfer'
            )
            sharesFromEntity.shares = sharesFromEntity.shares - entity.shares;
            entityCache.saveShares(sharesFromEntity);
        }
        entity.sharesAfterDecrease = sharesFromEntity.shares;
    }
    // Increasing to address shares
    if (entity.to !== ZERO_ADDRESS) {
        const sharesToEntity = await _loadSharesEntity(entity.to, true, entityCache);
        if (!sharesToEntity) return;;
        entity.sharesBeforeIncrease = sharesToEntity.shares;
        if (entity.to !== entity.from && entity.shares !== 0n) {
            sharesToEntity.shares = sharesToEntity.shares + entity.shares;
            entityCache.saveShares(sharesToEntity);
        }
        entity.sharesAfterIncrease = sharesToEntity.shares;
    }
}

export async function _updateHolders(entity: LidoTransfer, entityCache: EntityCache): Promise<void> {
    // Saving recipient address as a unique stETH holder
    const stats = await _loadStatsEntity(entityCache);

    // skip zero destination for any case
    if (entity.to !== ZERO_ADDRESS && entity.balanceAfterIncrease! !== 0n) {
        let holder = await entityCache.getHolder(entity.to);
        if (!holder) {
            holder = new Holder({
                id: entity.to,
                address: entity.to,
                hasBalance: false
            });

            stats.uniqueAnytimeHolders = stats.uniqueAnytimeHolders + 1n;
        }
        if (!holder.hasBalance) {
            holder.hasBalance = true;
            stats.uniqueHolders = stats.uniqueHolders + 1n;
        }
        entityCache.saveHolder(holder);
    }

    if (entity.from !== ZERO_ADDRESS) {
        const holder = await entityCache.getHolder(entity.from);
        if (holder) {
            if (holder.hasBalance && entity.balanceAfterDecrease! === 0n) {
                holder.hasBalance = false;
                stats.uniqueHolders = stats.uniqueHolders - 1n;
            }
            entityCache.saveHolder(holder);
        } // else should not be
    }
    entityCache.saveStats(stats);
}



export async function _loadTotalRewardEntity(logEvent: any, create: boolean = false, entityCache: EntityCache): Promise<TotalReward | undefined> {
    let entity = await entityCache.getTotalReward(logEvent.transactionHash);
    if (!entity && create) {
        entity = new TotalReward({
            id: logEvent.transactionHash,
            block: BigInt(logEvent.block.height),
            blockTime: BigInt(logEvent.block.timestamp),
            transactionHash: logEvent.transactionHash,
            transactionIndex: BigInt(logEvent.transactionIndex),
            logIndex: BigInt(logEvent.logIndex),
            feeBasis: 0n,
            treasuryFeeBasisPoints: 0n,
            insuranceFeeBasisPoints: 0n,
            operatorsFeeBasisPoints: 0n,
            totalRewardsWithFees: 0n,
            totalRewards: 0n,
            totalFee: 0n,
            treasuryFee: 0n,
            insuranceFee: 0n,
            operatorsFee: 0n,
            dust: 0n,
            mevFee: 0n,
            apr: BigDecimal(0),
            aprRaw: BigDecimal(0),
            aprBeforeFees: BigDecimal(0),
            timeElapsed: 0n,
            totalPooledEtherAfter: 0n,
            totalSharesAfter: 0n,
            shares2mint: 0n,
            sharesToOperators: 0n,
            sharesToTreasury: 0n,
            sharesToInsuranceFund: 0n,
            dustSharesToTreasury: 0n
        });
    }

    return entity;
}



export async function _processTokenRebase(entity: TotalReward, ethDistributedEvent: any, tokenRebasedEvent: ParsedEvent, parsedEvents: ParsedEvent[], entityCache: EntityCache): Promise<void> {
    entity.totalPooledEtherBefore = tokenRebasedEvent.params['preTotalEther'];
    entity.totalSharesBefore = tokenRebasedEvent.params['preTotalShares'];
    entity.totalPooledEtherAfter = tokenRebasedEvent.params['postTotalEther'];
    entity.totalSharesAfter = tokenRebasedEvent.params['postTotalShares'];
    entity.shares2mint = tokenRebasedEvent.params['sharesMintedAsFees'];
    entity.timeElapsed = tokenRebasedEvent.params['timeElapsed'];

    // extracting only 'Transfer' and 'TransferShares' pairs between ETHDistributed to TokenRebased
    // assuming the ETHDistributed and TokenRebased events are presents in tx only once
    const transferEventPairs = extractPairedEvent(
        parsedEvents,
        'Transfer',
        'TransferShares',
        BigInt(ethDistributedEvent.logIndex), // start from ETHDistributed event
        BigInt(tokenRebasedEvent.event.logIndex) // and to the TokenRebased event
    );

    let sharesToTreasury = 0n;
    let sharesToOperators = 0n;
    let treasuryFee = 0n;
    let operatorsFee = 0n;

    // NB: there is no insurance fund anymore since v2
    for (let i = 0; i < transferEventPairs.length; i++) {
        const eventTransfer = getParsedEvent(
            transferEventPairs[i],
            0
        );
        const eventTransferShares = getParsedEvent(
            transferEventPairs[i],
            1
        );

        const treasuryAddress = await getAddress('TREASURY', entityCache);
        // log.warning('treasuryAddress {}', [treasuryAddress.toHexString()])
        // process only mint events
        if (eventTransfer.params.from === ZERO_ADDRESS) {
            // log.warning('eventTransfer.params.to {}', [eventTransfer.params.to.toHexString()])

            if (eventTransfer.params.to === treasuryAddress) {
                // mint to treasury
                sharesToTreasury = sharesToTreasury + eventTransferShares.params['sharesValue'];
                treasuryFee = treasuryFee + eventTransfer.params['value'];

                // log.warning('sharesToTreasury": transfer  {} total {} totalFee {}', [
                //   eventTransferShares.params.sharesValue.toString(),
                //   sharesToTreasury.toString(),
                //   treasuryFee.toString()
                // ])
            } else {
                // mint to SR module
                sharesToOperators = sharesToOperators + eventTransferShares.params['sharesValue'];
                operatorsFee = operatorsFee + eventTransfer.params['value'];

                // log.warning('operatorsFee: transfer {} total {} totalFee {}', [
                //   eventTransferShares.params.sharesValue.toString(),
                //   sharesToOperators.toString(),
                //   operatorsFee.toString()
                // ])
            }
        }
    }

    entity.sharesToTreasury = sharesToTreasury;
    entity.treasuryFee = treasuryFee;
    entity.sharesToOperators = sharesToOperators;
    entity.operatorsFee = operatorsFee;
    entity.totalFee = treasuryFee + operatorsFee;
    entity.totalRewards = entity.totalRewardsWithFees - entity.totalFee;

    if (entity.shares2mint !== sharesToTreasury + sharesToOperators) {
        console.warn(
            'totalRewardsEntity.shares2mint != sharesToTreasury + sharesToOperators: shares2mint {} sharesToTreasury {} sharesToOperators {}',
            [
                entity.shares2mint.toString(),
                sharesToTreasury.toString(),
                sharesToOperators.toString(),
            ]
        );
    }
    // @todo calc for compatibility
    // Total fee of the protocol eg 1000 / 100 = 10% fee
    // feeBasisPoints = 1000
    // const sharesToInsuranceFund = shares2mint.times(totalRewardsEntity.insuranceFeeBasisPoints).div(CALCULATION_UNIT)
    // const sharesToOperators = shares2mint.times(totalRewardsEntity.operatorsFeeBasisPoints).div(CALCULATION_UNIT)

    entity.treasuryFeeBasisPoints = (treasuryFee * CALCULATION_UNIT) / entity.totalFee;
    entity.operatorsFeeBasisPoints = (operatorsFee * CALCULATION_UNIT) / entity.totalFee;
    entity.feeBasis = (entity.totalFee * CALCULATION_UNIT) / entity.totalRewardsWithFees;

    // APR
    _calcAPR_v2(
        entity,
        tokenRebasedEvent.params['preTotalEther'],
        tokenRebasedEvent.params['postTotalEther'],
        tokenRebasedEvent.params['preTotalShares'],
        tokenRebasedEvent.params['postTotalShares'],
        tokenRebasedEvent.params['timeElapsed']
    );

    entityCache.saveTotalReward(entity);
}


export async function _loadLidoConfig(entityCache: EntityCache): Promise<LidoConfig> {
    let entity = await entityCache.getLidoConfig('');
    if (!entity) {
        entity = new LidoConfig({
            id: '',
            isStopped: true,
            isStakingPaused: true,
            maxStakeLimit: 0n,
            stakeLimitIncreasePerBlock: 0n,
            elRewardsVault: ZERO_ADDRESS,
            elRewardsWithdrawalLimitPoints: 0n,
            withdrawalCredentials: ZERO_ADDRESS,
            wcSetBy: ZERO_ADDRESS,
            lidoLocator: ZERO_ADDRESS,
        });
    }
    return entity;
}


