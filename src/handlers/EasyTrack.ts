import {EntityCache} from "../entity-cache";
import {EasyTrackConfig, EVMScriptFactory} from "../model";
import {ZERO_ADDRESS} from "../constants";

export const handleEVMScriptExecutorChanged = async (_evmScriptExecutor: string, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadETConfig(entityCache);
    entity.evmScriptExecutor = _evmScriptExecutor;
    entityCache.saveEasyTrackConfig(entity);
}

export const handleEVMScriptFactoryAdded = async (_evmScriptFactory: string, _permissions: string, logEvent: any, entityCache: EntityCache) => {
    const entity = new EVMScriptFactory({
        id: _evmScriptFactory,
        address: _evmScriptFactory,
        permissions: _permissions,
        isActive: true
    });
    entityCache.saveEVMScriptFactory(entity);
}



async function _loadETConfig(entityCache: EntityCache): Promise<EasyTrackConfig> {
    let entity = await entityCache.getEasyTrackConfig('');
    if (!entity) {
        entity = new EasyTrackConfig({
            id: '',
            evmScriptExecutor: ZERO_ADDRESS,
            motionDuration: 0n,
            motionsCountLimit: 0n,
            objectionsThreshold: 0n,
            isPaused: false
        });
    }
    return entity;
}

