import {APP_REPOS, KERNEL_APP_BASES_NAMESPACE} from "../constants";
import {EntityCache} from "../entity-cache";
import {appRepoGetLatestForContractAddress} from "../helpers/app-repo-contract-helper";

export const handleSetApp = async (namespace: string, appId: string, app: string, ctx: any, logEvent: any, entityCache: EntityCache) => {
    if (namespace !== KERNEL_APP_BASES_NAMESPACE) return;
    const repoAddr = APP_REPOS.get(appId);
    // process only known apps
    if (!repoAddr) return;

    let entity = await entityCache.getOrCreateAppVersion(appId);

    // updating only in case of a new contract address
    if (entity.impl !== app) {
        const {semanticVersion} = await appRepoGetLatestForContractAddress(repoAddr, app, ctx, logEvent);

        entity.major = semanticVersion[0];
        entity.minor = semanticVersion[1];
        entity.patch = semanticVersion[2];
        entity.impl = app;

        entity.block = BigInt(logEvent.block.height);
        entity.blockTime = BigInt(logEvent.block.timestamp);
        entity.transactionHash = logEvent.transactionHash;
        entity.logIndex = BigInt(logEvent.logIndex);
        entityCache.saveAppVersion(entity);
    }
}