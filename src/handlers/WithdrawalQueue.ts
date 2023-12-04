import {EntityCache} from "../entity-cache";
import {WithdrawalQueueConfig} from "../model";

export const handleBunkerModeDisabled = async (logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadWQConfig(entityCache);
    entity.isBunkerMode = false;
    entity.bunkerModeSince = 0n;
    entityCache.saveWithdrawalQueueConfig(entity);
}

export const handleBunkerModeEnabled = async (_sinceTimestamp:bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadWQConfig(entityCache);
    entity.isBunkerMode = true;
    entity.bunkerModeSince = _sinceTimestamp;
    entityCache.saveWithdrawalQueueConfig(entity);
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

