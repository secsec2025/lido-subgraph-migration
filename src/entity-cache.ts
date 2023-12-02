import {AppVersion, LidoSubmission, Shares, Totals} from "./model";
import {DataHandlerContext} from "@subsquid/evm-processor";
import {Store} from "@subsquid/typeorm-store";
import {ZERO_ADDRESS} from "./constants";

export class EntityCache {
    public appVersions!: Map<string, AppVersion>;
    public totals!: Map<string, Totals>;
    public shares!: Map<string, Shares>;
    public lidoSubmissions!: Map<string, LidoSubmission>;

    public ctx: DataHandlerContext<Store, {}>;

    constructor(ctx: DataHandlerContext<Store, {}>) {
        this.ctx = ctx;
        this.initializeMaps();
    }

    private initializeMaps = () => {
        this.appVersions = new Map<string, AppVersion>();
        this.totals = new Map<string, Totals>();
        this.shares = new Map<string, Shares>();
        this.lidoSubmissions = new Map<string, LidoSubmission>();
    }

    getAppVersion = async (appId: string): Promise<AppVersion | undefined> => {
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

    getTotals = async (id: string): Promise<Totals | undefined> => {
        // Check if entity exists in cache
        if (this.totals.has(id)) return this.totals.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(Totals, id);
        if (a) this.totals.set(id, a);
        return a;
    }

    saveTotals = (t: Totals) => {
        this.totals.set(t.id, t);
    }

    getShares = async (id: string): Promise<Shares | undefined> => {
        // Check if entity exists in cache
        if (this.shares.has(id)) return this.shares.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(Shares, id);
        if (a) this.shares.set(id, a);
        return a;
    }

    saveShares = (t: Shares) => {
        this.shares.set(t.id, t);
    }


    getLidoSubmission = async (id: string): Promise<LidoSubmission | undefined> => {
        // Check if entity exists in cache
        if (this.lidoSubmissions.has(id)) return this.lidoSubmissions.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(LidoSubmission, id);
        if (a) this.lidoSubmissions.set(id, a);
        return a;
    }

    saveLidoSubmission = (ls: LidoSubmission) => {
        this.lidoSubmissions.set(ls.id, ls);
    }




    // Persist Cache to DB
    persistCacheToDatabase = async (flushCache: boolean) => {
        await this.ctx.store.upsert([...this.appVersions.values()]);
        await this.ctx.store.upsert([...this.totals.values()]);
        await this.ctx.store.upsert([...this.shares.values()]);
        await this.ctx.store.upsert([...this.lidoSubmissions.values()]);

        if (flushCache) {
            this.initializeMaps();
        }
    }
}