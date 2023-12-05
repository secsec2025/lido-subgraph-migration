import {EntityCache} from "../entity-cache";
import {EasyTrackConfig, EVMScriptFactory, Motion, Objection, Role} from "../model";
import {ZERO_ADDRESS} from "../constants";
import assert from "assert";

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

export const handleEVMScriptFactoryRemoved = async (_evmScriptFactory: string, logEvent: any, entityCache: EntityCache) => {
    const entity = await entityCache.getEVMScriptFactory(_evmScriptFactory);
    assert(entity, `Undefined EVMScriptFactory at ${logEvent.transactionHash}`);
    entity.isActive = false;
    entityCache.saveEVMScriptFactory(entity);
}

export const handleMotionCanceled = async (_motionId: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await entityCache.getMotion(_motionId.toString());
    assert(entity, `Undefined Motion at ${logEvent.transactionHash}`);
    entity.status = 'CANCELED';
    entity.canceledAt = BigInt(logEvent.block.timestamp);
    entityCache.saveMotion(entity);
}

export const handleMotionCreated = async (_motionId: bigint, _creator: string, _evmScriptFactory: string, _evmScriptCallData: string, _evmScript: string, logEvent: any, entityCache: EntityCache) => {
    let config = await _loadETConfig(entityCache);

    const entity = new Motion({
        id: _motionId.toString(),
        snapshotBlock: BigInt(logEvent.block.height),
        startDate: BigInt(logEvent.block.timestamp),
        creator: _creator,
        duration: config.motionDuration,
        evmScriptHash: _evmScript,
        evmScriptFactory: _evmScriptFactory,
        objectionsAmountPct: 0n,
        objectionsThreshold: config.objectionsThreshold,
        objectionsAmount: 0n,
        evmScriptCalldata: _evmScriptCallData,
        status: 'ACTIVE',
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        logIndex: BigInt(logEvent.logIndex)
    });
    entityCache.saveMotion(entity);
}

export const handleMotionDurationChanged = async (_motionDuration: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadETConfig(entityCache);
    entity.motionDuration = _motionDuration;
    entityCache.saveEasyTrackConfig(entity);
}

export const handleMotionEnacted = async (_motionId: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await entityCache.getMotion(_motionId.toString());
    assert(entity, `Undefined Motion at ${logEvent.transactionHash}`);
    entity.status = 'ENACTED';
    entity.enactedAt = BigInt(logEvent.block.timestamp)
    entityCache.saveMotion(entity);
}

export const handleMotionObjected = async (_motionId: bigint, _objector: string, _weight: bigint, _newObjectionsAmount: bigint, _newObjectionsAmountPct: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await entityCache.getMotion(_motionId.toString());
    assert(entity, `Undefined Motion at ${logEvent.transactionHash}`);

    entity.objectionsAmount = _newObjectionsAmount;
    entity.objectionsAmountPct = _newObjectionsAmountPct;
    entityCache.saveMotion(entity);

    const objectionEntity = new Objection({
        id: `${_objector}${_motionId.toString()}`,
        objector: _objector,
        motionId: entity.id,
        weight: _weight,
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        logIndex: BigInt(logEvent.logIndex)
    });
    entityCache.saveObjection(objectionEntity);
}

export const handleMotionRejected = async (_motionId: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await entityCache.getMotion(_motionId.toString());
    assert(entity, `Undefined Motion at ${logEvent.transactionHash}`);
    entity.status = 'REJECTED';
    entity.rejectedAt = BigInt(logEvent.block.timestamp);
    entityCache.saveMotion(entity);
}

export const handleMotionsCountLimitChanged = async (_newMotionsCountLimit: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadETConfig(entityCache);
    entity.motionsCountLimit = _newMotionsCountLimit;
    entityCache.saveEasyTrackConfig(entity);
}

export const handleObjectionsThresholdChanged = async (_newThreshold: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadETConfig(entityCache);
    entity.objectionsThreshold = _newThreshold;
    entityCache.saveEasyTrackConfig(entity);
}

export const handlePausedEasyTrack = async (account: string, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadETConfig(entityCache);
    entity.isPaused = true;
    entityCache.saveEasyTrackConfig(entity);
}

export const handleUnpausedEasyTrack = async (account: string, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadETConfig(entityCache);
    entity.isPaused = false;
    entityCache.saveEasyTrackConfig(entity);
}

export const handleRoleGrantedEasyTrack = async (role: string, account: string, sender: string, logEvent: any, entityCache: EntityCache) => {
    const entity = new Role({
        id: `${account}${role}`,
        role: role,
        address: account,
        creator: sender,
        isActive: true
    });
    entityCache.saveRole(entity);
}

export const handleRoleRevokedEasyTrack = async (role: string, account: string, sender: string, logEvent: any, entityCache: EntityCache) => {
    const entity = await entityCache.getRole(`${account}${role}`);
    assert(entity, `Undefined Role (${role}) at ${logEvent.transactionHash}`);
    entity.isActive = false;
    entityCache.saveRole(entity);
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

