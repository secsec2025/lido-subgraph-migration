import {AppVersion} from "./model";
import {DataHandlerContext} from "@subsquid/evm-processor";
import {Store} from "@subsquid/typeorm-store";
import {ZERO_ADDRESS} from "./constants";

export class EntityCache {
    public appVersions!: Map<string, AppVersion>;

    public ctx: DataHandlerContext<Store, {}>;

    constructor(ctx: DataHandlerContext<Store, {}>) {
        this.ctx = ctx;
        this.initializeMaps();
    }

    private initializeMaps = () => {
        this.appVersions = new Map<string, AppVersion>();
    }

    private getAppVersion = async (appId: string): Promise<AppVersion | undefined> => {
        // Check if entity exists in cache
        if (this.appVersions.has(appId)) return this.appVersions.get(appId);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(AppVersion, appId);
        if (a) this.appVersions.set(appId, a);
        return a;
    }

    getOrCreateAppVersion = async (appId: string): Promise<AppVersion> => {
        let a = await this.getAppVersion(appId);

        if (!a) {
            a = new AppVersion({
                id: appId,
                impl: ZERO_ADDRESS
            });
            this.appVersions.set(appId, a);
        }
        return a;
    }

    saveAppVersion = (av: AppVersion) => {
        this.appVersions.set(av.id, av);
    }




    // Persist Cache to DB
    persistCacheToDatabase = async (flushCache: boolean) => {
        await this.ctx.store.upsert([...this.appVersions.values()]);

        if (flushCache) {
            this.initializeMaps();
        }
    }
}