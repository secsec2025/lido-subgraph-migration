import {EntityCache} from "../entity-cache";
import {getChainConfigFromHashConsensusContract} from "../helpers/contract-helper";
import {_loadOracleConfig} from "./helpers";

export const handleFrameConfigSet = async (newInitialEpoch: bigint, newEpochsPerFrame: bigint, ctx: any, logEvent: any, entityCache: EntityCache) => {
    const chainConfig = await getChainConfigFromHashConsensusContract(logEvent.address, ctx, logEvent);

    const entity = await _loadOracleConfig(entityCache);
    entity.epochsPerFrame = newEpochsPerFrame;
    entity.slotsPerEpoch = chainConfig.slotsPerEpoch
    entity.secondsPerSlot = chainConfig.secondsPerSlot;
    entity.genesisTime = chainConfig.genesisTime;
    entityCache.saveOracleConfig(entity);
}