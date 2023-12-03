import {EntityCache} from "../entity-cache";
import {NodeOperator} from "../model";
import {ZERO_ADDRESS} from "../constants";

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