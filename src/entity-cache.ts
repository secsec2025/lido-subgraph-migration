import {
    AppVersion, BeaconReport, CurrentFees, Holder, LidoApproval,
    LidoConfig,
    LidoSubmission,
    LidoTransfer,
    NodeOperatorFees, NodeOperatorsShares, OracleCompleted, OracleConfig, OracleExpectedEpoch,
    Shares, SharesBurn, Stats,
    TotalReward,
    Totals
} from "./model";
import {DataHandlerContext} from "@subsquid/evm-processor";
import {Store} from "@subsquid/typeorm-store";
import {ZERO_ADDRESS} from "./constants";

export class EntityCache {
    public appVersions!: Map<string, AppVersion>;
    public lidoConfigs!: Map<string, LidoConfig>;
    public totals!: Map<string, Totals>;
    public shares!: Map<string, Shares>;
    public lidoSubmissions!: Map<string, LidoSubmission>;
    public lidoTransfers!: Map<string, LidoTransfer>;
    public totalRewards!: Map<string, TotalReward>;
    public nodeOperatorFees!: Map<string, NodeOperatorFees>;
    public nodeOperatorsShares!: Map<string, NodeOperatorsShares>;
    public stats!: Map<string, Stats>;
    public holders!: Map<string, Holder>;
    public sharesBurn!: Map<string, SharesBurn>;
    public lidoApprovals!: Map<string, LidoApproval>;
    public currentFees!: Map<string, CurrentFees>;
    public oracleCompleted!: Map<string, OracleCompleted>;
    public oracleConfig!: Map<string, OracleConfig>;
    public oracleExpectedEpoch!: Map<string, OracleExpectedEpoch>;
    public beaconReports!: Map<string, BeaconReport>;

    public ctx: DataHandlerContext<Store, {}>;

    constructor(ctx: DataHandlerContext<Store, {}>) {
        this.ctx = ctx;
        this.initializeMaps();
    }

    private initializeMaps = () => {
        this.appVersions = new Map<string, AppVersion>();
        this.lidoConfigs = new Map<string, LidoConfig>();
        this.totals = new Map<string, Totals>();
        this.shares = new Map<string, Shares>();
        this.lidoSubmissions = new Map<string, LidoSubmission>();
        this.lidoTransfers = new Map<string, LidoTransfer>();
        this.totalRewards = new Map<string, TotalReward>();
        this.nodeOperatorFees = new Map<string, NodeOperatorFees>();
        this.nodeOperatorsShares = new Map<string, NodeOperatorsShares>();
        this.stats = new Map<string, Stats>();
        this.holders = new Map<string, Holder>();
        this.sharesBurn = new Map<string, SharesBurn>();
        this.lidoApprovals = new Map<string, LidoApproval>();
        this.currentFees = new Map<string, CurrentFees>();
        this.oracleCompleted = new Map<string, OracleCompleted>();
        this.oracleConfig = new Map<string, OracleConfig>();
        this.oracleExpectedEpoch = new Map<string, OracleExpectedEpoch>();
        this.beaconReports = new Map<string, BeaconReport>();
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

    getLidoTransfer = async (id: string): Promise<LidoTransfer | undefined> => {
        // Check if entity exists in cache
        if (this.lidoTransfers.has(id)) return this.lidoTransfers.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(LidoTransfer, id);
        if (a) this.lidoTransfers.set(id, a);
        return a;
    }

    saveLidoTransfer = (t: LidoTransfer) => {
        this.lidoTransfers.set(t.id, t);
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


    getTotalReward = async (id: string): Promise<TotalReward | undefined> => {
        // Check if entity exists in cache
        if (this.totalRewards.has(id)) return this.totalRewards.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(TotalReward, id);
        if (a) this.totalRewards.set(id, a);
        return a;
    }

    saveTotalReward = (ls: TotalReward) => {
        this.totalRewards.set(ls.id, ls);
    }

    getLidoConfig = async (id: string): Promise<LidoConfig | undefined> => {
        // Check if entity exists in cache
        if (this.lidoConfigs.has(id)) return this.lidoConfigs.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(LidoConfig, id);
        if (a) this.lidoConfigs.set(id, a);
        return a;
    }

    saveLidoConfig = (ls: LidoConfig) => {
        this.lidoConfigs.set(ls.id, ls);
    }

    getNodeOperatorFee = async (id: string): Promise<NodeOperatorFees | undefined> => {
        // Check if entity exists in cache
        if (this.nodeOperatorFees.has(id)) return this.nodeOperatorFees.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(NodeOperatorFees, id);
        if (a) this.nodeOperatorFees.set(id, a);
        return a;
    }

    saveNodeOperatorFee = (ls: NodeOperatorFees) => {
        this.nodeOperatorFees.set(ls.id, ls);
    }


    getNodeOperatorsShare = async (id: string): Promise<NodeOperatorsShares | undefined> => {
        // Check if entity exists in cache
        if (this.nodeOperatorsShares.has(id)) return this.nodeOperatorsShares.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(NodeOperatorsShares, id);
        if (a) this.nodeOperatorsShares.set(id, a);
        return a;
    }

    saveNodeOperatorsShare = (ls: NodeOperatorsShares) => {
        this.nodeOperatorsShares.set(ls.id, ls);
    }

    getStats = async (id: string): Promise<Stats | undefined> => {
        // Check if entity exists in cache
        if (this.stats.has(id)) return this.stats.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(Stats, id);
        if (a) this.stats.set(id, a);
        return a;
    }

    saveStats = (ls: Stats) => {
        this.stats.set(ls.id, ls);
    }

    getHolder = async (id: string): Promise<Holder | undefined> => {
        // Check if entity exists in cache
        if (this.holders.has(id)) return this.holders.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(Holder, id);
        if (a) this.holders.set(id, a);
        return a;
    }

    saveHolder = (ls: Holder) => {
        this.holders.set(ls.id, ls);
    }

    getSharesBurn = async (id: string): Promise<SharesBurn | undefined> => {
        // Check if entity exists in cache
        if (this.sharesBurn.has(id)) return this.sharesBurn.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(SharesBurn, id);
        if (a) this.sharesBurn.set(id, a);
        return a;
    }

    saveSharesBurn = (ls: SharesBurn) => {
        this.sharesBurn.set(ls.id, ls);
    }

    getLidoApproval = async (id: string): Promise<LidoApproval | undefined> => {
        // Check if entity exists in cache
        if (this.lidoApprovals.has(id)) return this.lidoApprovals.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(LidoApproval, id);
        if (a) this.lidoApprovals.set(id, a);
        return a;
    }

    saveLidoApproval = (ls: LidoApproval) => {
        this.lidoApprovals.set(ls.id, ls);
    }

    getCurrentFees = async (id: string): Promise<CurrentFees | undefined> => {
        // Check if entity exists in cache
        if (this.currentFees.has(id)) return this.currentFees.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(CurrentFees, id);
        if (a) this.currentFees.set(id, a);
        return a;
    }

    saveCurrentFees = (ls: CurrentFees) => {
        this.currentFees.set(ls.id, ls);
    }

    getOracleCompleted = async (id: string): Promise<OracleCompleted | undefined> => {
        // Check if entity exists in cache
        if (this.oracleCompleted.has(id)) return this.oracleCompleted.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(OracleCompleted, id);
        if (a) this.oracleCompleted.set(id, a);
        return a;
    }

    saveOracleCompleted = (ls: OracleCompleted) => {
        this.oracleCompleted.set(ls.id, ls);
    }

    getOracleConfig = async (id: string): Promise<OracleConfig | undefined> => {
        // Check if entity exists in cache
        if (this.oracleConfig.has(id)) return this.oracleConfig.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(OracleConfig, id);
        if (a) this.oracleConfig.set(id, a);
        return a;
    }

    saveOracleConfig = (ls: OracleConfig) => {
        this.oracleConfig.set(ls.id, ls);
    }

    getOracleExpectedEpoch = async (id: string): Promise<OracleExpectedEpoch | undefined> => {
        // Check if entity exists in cache
        if (this.oracleExpectedEpoch.has(id)) return this.oracleExpectedEpoch.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(OracleExpectedEpoch, id);
        if (a) this.oracleExpectedEpoch.set(id, a);
        return a;
    }

    saveOracleExpectedEpoch = (ls: OracleExpectedEpoch) => {
        this.oracleExpectedEpoch.set(ls.id, ls);
    }

    getBeaconReport = async (id: string): Promise<BeaconReport | undefined> => {
        // Check if entity exists in cache
        if (this.beaconReports.has(id)) return this.beaconReports.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(BeaconReport, id);
        if (a) this.beaconReports.set(id, a);
        return a;
    }

    saveBeaconReport = (ls: BeaconReport) => {
        this.beaconReports.set(ls.id, ls);
    }




    // Persist Cache to DB
    persistCacheToDatabase = async (flushCache: boolean) => {
        await this.ctx.store.upsert([...this.appVersions.values()]);
        await this.ctx.store.upsert([...this.lidoConfigs.values()]);
        await this.ctx.store.upsert([...this.totals.values()]);
        await this.ctx.store.upsert([...this.shares.values()]);
        await this.ctx.store.upsert([...this.lidoSubmissions.values()]);
        await this.ctx.store.upsert([...this.lidoTransfers.values()]);
        await this.ctx.store.upsert([...this.totalRewards.values()]);
        await this.ctx.store.upsert([...this.nodeOperatorFees.values()]);
        await this.ctx.store.upsert([...this.nodeOperatorsShares.values()]);
        await this.ctx.store.upsert([...this.stats.values()]);
        await this.ctx.store.upsert([...this.holders.values()]);
        await this.ctx.store.upsert([...this.sharesBurn.values()]);
        await this.ctx.store.upsert([...this.lidoApprovals.values()]);
        await this.ctx.store.upsert([...this.currentFees.values()]);
        await this.ctx.store.upsert([...this.oracleCompleted.values()]);
        await this.ctx.store.upsert([...this.oracleConfig.values()]);
        await this.ctx.store.upsert([...this.oracleExpectedEpoch.values()]);
        await this.ctx.store.upsert([...this.beaconReports.values()]);

        if (flushCache) {
            this.initializeMaps();
        }
    }
}