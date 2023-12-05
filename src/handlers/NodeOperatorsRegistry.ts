import {EntityCache} from "../entity-cache";
import {NodeOperator, NodeOperatorKeysOpIndex, NodeOperatorSigningKey} from "../model";
import {ZERO_ADDRESS} from "../constants";
import assert from "assert";

export const handleNodeOperatorAdded = async (id: bigint, name: string, rewardAddress: string, stakingLimit: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOperator(id.toString(), true, entityCache);
    if (!entity) return;
    entity.name = name;
    entity.rewardAddress = rewardAddress;
    entity.stakingLimit = stakingLimit;
    entity.active = true;
    entity.block = BigInt(logEvent.block.height);
    entity.blockTime = BigInt(logEvent.block.timestamp);
    entity.transactionHash = logEvent.transactionHash;
    entity.logIndex = BigInt(logEvent.logIndex);
    entityCache.saveNodeOperator(entity);
}

export const handleNodeOperatorActiveSet = async (id: bigint, active: boolean, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOperator(id.toString(), false, entityCache);
    assert(entity, `Undefined Node operator for ID - ${id} at ${logEvent.transactionHash}`);
    entity.active = active;
    entityCache.saveNodeOperator(entity);
}

export const handleNodeOperatorNameSet = async (id: bigint, name: string, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOperator(id.toString(), false, entityCache);
    assert(entity, `Undefined Node operator for ID - ${id} at ${logEvent.transactionHash}`);
    entity.name = name;
    entityCache.saveNodeOperator(entity);
}

export const handleNodeOperatorRewardAddressSet = async (id: bigint, rewardAddress: string, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOperator(id.toString(), false, entityCache);
    assert(entity, `Undefined Node operator for ID - ${id} at ${logEvent.transactionHash}`);
    entity.rewardAddress = rewardAddress;
    entityCache.saveNodeOperator(entity);
}

export const handleSigningKeyAdded = async (operatorId: bigint, pubkey: string, logEvent: any, entityCache: EntityCache) => {
    const noEntity = await _loadOperator(operatorId.toString(), false, entityCache);
    assert(noEntity, `Undefined Node operator for ID - ${operatorId} at ${logEvent.transactionHash}`);

    const entity = new NodeOperatorSigningKey({
        id: pubkey,
        operatorId: operatorId.toString(),
        pubkey: pubkey,
        removed: false,
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        logIndex: BigInt(logEvent.logIndex)
    });
    entityCache.saveNodeOperatorSigningKey(entity);
}

export const handleSigningKeyRemoved = async (operatorId: bigint, pubkey: string, logEvent: any, entityCache: EntityCache) => {
    const noEntity = await _loadOperator(operatorId.toString(), false, entityCache);
    assert(noEntity, `Undefined Node operator for ID - ${operatorId} at ${logEvent.transactionHash}`);

    let entity = await entityCache.getNodeOperatorSigningKey(pubkey);
    if (!entity) {
        entity = new NodeOperatorSigningKey({
            id: pubkey,
            operatorId: operatorId.toString(),
            pubkey: pubkey
        });
    }

    entity.block = BigInt(logEvent.block.height);
    entity.blockTime = BigInt(logEvent.block.timestamp);
    entity.transactionHash = logEvent.transactionHash;
    entity.logIndex = BigInt(logEvent.logIndex);
    entity.removed = true;

    entityCache.saveNodeOperatorSigningKey(entity);
}

export const handleNodeOperatorTotalKeysTrimmed = async (id: bigint, totalKeysTrimmed: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOperator(id.toString(), false, entityCache);
    assert(entity, `Undefined Node operator for ID - ${id} at ${logEvent.transactionHash}`);
    entity.totalKeysTrimmed = totalKeysTrimmed;
    entityCache.saveNodeOperator(entity);
}

export const handleKeysOpIndexSet = async (keysOpIndex: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = new NodeOperatorKeysOpIndex({
        id: `${logEvent.transactionHash}${logEvent.logIndex}`,
        index: keysOpIndex
    });
    entityCache.saveNodeOperatorKeysOpIndex(entity);
}

export const handleNodeOperatorStakingLimitSet = async (id: bigint, stakingLimit: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOperator(id.toString(), false, entityCache);
    assert(entity, `Undefined Node operator for ID - ${id} at ${logEvent.transactionHash}`);
    entity.stakingLimit = stakingLimit;
    entityCache.saveNodeOperator(entity);
}

export const handleNodeOperatorTotalStoppedValidatorsReported = async (id: bigint, totalStopped: bigint, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadOperator(id.toString(), false, entityCache);
    assert(entity, `Undefined Node operator for ID - ${id} at ${logEvent.transactionHash}`);
    entity.totalStoppedValidators = totalStopped;
    entityCache.saveNodeOperator(entity);
}



async function _loadOperator(id: string, create: boolean = false, entityCache: EntityCache): Promise<NodeOperator | undefined> {
    let entity = await entityCache.getNodeOperator(id);
    if (!entity && create) {
        entity = new NodeOperator({
            id: id,
            name: '',
            rewardAddress: ZERO_ADDRESS,
            stakingLimit: 0n,
            active: true,
            totalStoppedValidators: 0n,
            totalKeysTrimmed: 0n,
            nonce: 0n
        });
    }
    return entity;
}