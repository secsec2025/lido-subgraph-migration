import {EntityCache} from "../entity-cache";
import {WithdrawalClaimed, WithdrawalQueueConfig, WithdrawalRequested, WithdrawalsFinalized} from "../model";

export const handleBunkerModeDisabled = async (logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadWQConfig(entityCache);
    entity.isBunkerMode = false;
    entity.bunkerModeSince = 0n;
    entityCache.saveWithdrawalQueueConfig(entity);
}

export const handleBunkerModeEnabled = async (_sinceTimestamp: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadWQConfig(entityCache);
    entity.isBunkerMode = true;
    entity.bunkerModeSince = _sinceTimestamp;
    entityCache.saveWithdrawalQueueConfig(entity);
}

export const handleContractVersionSetWithdrawalQueue = async (version: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadWQConfig(entityCache);
    entity.contractVersion = version;
    entityCache.saveWithdrawalQueueConfig(entity);
}

export const handleResumedWithdrawalQueue = async (logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadWQConfig(entityCache);
    entity.isPaused = false;
    entity.pauseDuration = 0n;
    entityCache.saveWithdrawalQueueConfig(entity);
}

export const handlePausedWithdrawalQueue = async (duration: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadWQConfig(entityCache);
    entity.isPaused = true;
    entity.pauseDuration = duration;
    entityCache.saveWithdrawalQueueConfig(entity);
}

export const handleWithdrawalClaimed = async (requestId: bigint, owner: string, receiver: string, amountOfETH: bigint, logEvent: any, entityCache: EntityCache) => {
    let entity = new WithdrawalClaimed({
        id: `${logEvent.transactionHash}${logEvent.logIndex}`,
        requestId: requestId,
        owner: owner,
        receiver: receiver,
        amountOfETH: amountOfETH,
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        logIndex: BigInt(logEvent.logIndex)
    });
    entityCache.saveWithdrawalClaimed(entity);
}

export const handleWithdrawalRequested = async (requestId: bigint, requestor: string, owner: string, amountOfStETH: bigint, amountOfShares: bigint, logEvent: any, entityCache: EntityCache) => {
    let entity = new WithdrawalRequested({
        id: `${logEvent.transactionHash}${logEvent.logIndex}`,
        requestId: requestId,
        requestor: requestor,
        owner: owner,
        amountOfStETH: amountOfStETH,
        amountOfShares: amountOfShares,
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        logIndex: BigInt(logEvent.logIndex)
    });
    entityCache.saveWithdrawalRequested(entity);
}


export const handleWithdrawalsFinalized = async (from: bigint, to: bigint, amountOfETHLocked: bigint, sharesToBurn: bigint, timestamp: bigint, logEvent: any, entityCache: EntityCache) => {
    let entity = new WithdrawalsFinalized({
        id: `${logEvent.transactionHash}${logEvent.logIndex}`,
        from: from,
        to: to,
        amountOfETHLocked: amountOfETHLocked,
        sharesToBurn: sharesToBurn,
        timestamp: timestamp,
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        logIndex: BigInt(logEvent.logIndex)
    });
    entityCache.saveWithdrawalFinalized(entity);
}



async function _loadWQConfig(entityCache: EntityCache): Promise<WithdrawalQueueConfig> {
    let entity = await entityCache.getWithdrawalQueueConfig('');
    if (!entity) {
        entity = new WithdrawalQueueConfig({
            id: '',
            isBunkerMode: false,
            bunkerModeSince: 0n,
            contractVersion: 0n,
            isPaused: true,
            pauseDuration: 0n
        });
    }
    return entity;
}

