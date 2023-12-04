import {EntityCache} from "../entity-cache";
import {_loadLidoConfig} from "./helpers";

export const handleWithdrawalCredentialsSetStakingRouter = async (withdrawalCredentials: string, setBy: string, logEvent: any, entityCache: EntityCache) => {
    const entity = await _loadLidoConfig(entityCache);
    entity.withdrawalCredentials = withdrawalCredentials;
    entity.wcSetBy = setBy;
    entityCache.saveLidoConfig(entity);
}