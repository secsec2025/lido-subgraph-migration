import {
    AppVersion,
    BeaconReport,
    CurrentFees,
    Holder,
    LidoApproval,
    LidoConfig,
    LidoSubmission,
    LidoTransfer,
    NodeOperator,
    NodeOperatorFees, NodeOperatorKeysOpIndex,
    NodeOperatorSigningKey,
    NodeOperatorsShares,
    OracleCompleted,
    OracleConfig,
    OracleExpectedEpoch,
    OracleMember, OracleReport,
    Shares,
    SharesBurn,
    Stats,
    TotalReward,
    Totals,
    Vote,
    Voting,
    VotingConfig,
    VotingObjection, WithdrawalClaimed, WithdrawalQueueConfig, WithdrawalRequested, WithdrawalsFinalized
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
    public nodeOperators!: Map<string, NodeOperator>;
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
    public oracleReports!: Map<string, OracleReport>;
    public beaconReports!: Map<string, BeaconReport>;
    public oracleMembers!: Map<string, OracleMember>;
    public voting!: Map<string, Voting>;
    public votes!: Map<string, Vote>;
    public votingObjections!: Map<string, VotingObjection>;
    public votingConfig!: Map<string, VotingConfig>;
    public nodeOperatorSigningKeys!: Map<string, NodeOperatorSigningKey>;
    public nodeOperatorKeysOpIndex!: Map<string, NodeOperatorKeysOpIndex>;
    public withdrawalQueueConfig!: Map<string, WithdrawalQueueConfig>;
    public withdrawalClaims!: Map<string, WithdrawalClaimed>;
    public withdrawalRequests!: Map<string, WithdrawalRequested>;
    public withdrawalFinalized!: Map<string, WithdrawalsFinalized>;

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
        this.nodeOperators = new Map<string, NodeOperator>();
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
        this.oracleReports = new Map<string, OracleReport>();
        this.beaconReports = new Map<string, BeaconReport>();
        this.oracleMembers = new Map<string, OracleMember>();
        this.voting = new Map<string, Voting>();
        this.votes = new Map<string, Vote>();
        this.votingObjections = new Map<string, VotingObjection>();
        this.votingConfig = new Map<string, VotingConfig>();
        this.nodeOperatorSigningKeys = new Map<string, NodeOperatorSigningKey>();
        this.nodeOperatorKeysOpIndex = new Map<string, NodeOperatorKeysOpIndex>();
        this.withdrawalQueueConfig = new Map<string, WithdrawalQueueConfig>();
        this.withdrawalClaims = new Map<string, WithdrawalClaimed>();
        this.withdrawalRequests = new Map<string, WithdrawalRequested>();
        this.withdrawalFinalized = new Map<string, WithdrawalsFinalized>();
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

    getOracleReport = async (id: string): Promise<OracleReport | undefined> => {
        // Check if entity exists in cache
        if (this.oracleReports.has(id)) return this.oracleReports.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(OracleReport, id);
        if (a) this.oracleReports.set(id, a);
        return a;
    }

    saveOracleReport = (ls: OracleReport) => {
        this.oracleReports.set(ls.id, ls);
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

    getOracleMember = async (id: string): Promise<OracleMember | undefined> => {
        // Check if entity exists in cache
        if (this.oracleMembers.has(id)) return this.oracleMembers.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(OracleMember, id);
        if (a) this.oracleMembers.set(id, a);
        return a;
    }

    saveOracleMember = (ls: OracleMember) => {
        this.oracleMembers.set(ls.id, ls);
    }

    getNodeOperator = async (id: string): Promise<NodeOperator | undefined> => {
        // Check if entity exists in cache
        if (this.nodeOperators.has(id)) return this.nodeOperators.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(NodeOperator, id);
        if (a) this.nodeOperators.set(id, a);
        return a;
    }

    saveNodeOperator = (ls: NodeOperator) => {
        this.nodeOperators.set(ls.id, ls);
    }

    getVoting = async (id: string): Promise<Voting | undefined> => {
        // Check if entity exists in cache
        if (this.voting.has(id)) return this.voting.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(Voting, id);
        if (a) this.voting.set(id, a);
        return a;
    }

    saveVoting = (ls: Voting) => {
        this.voting.set(ls.id, ls);
    }

    getVote = async (id: string): Promise<Vote | undefined> => {
        // Check if entity exists in cache
        if (this.votes.has(id)) return this.votes.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(Vote, id);
        if (a) this.votes.set(id, a);
        return a;
    }

    saveVote = (ls: Vote) => {
        this.votes.set(ls.id, ls);
    }

    getVotingObjection = async (id: string): Promise<VotingObjection | undefined> => {
        // Check if entity exists in cache
        if (this.votingObjections.has(id)) return this.votingObjections.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(VotingObjection, id);
        if (a) this.votingObjections.set(id, a);
        return a;
    }

    saveVotingObjection = (ls: VotingObjection) => {
        this.votingObjections.set(ls.id, ls);
    }

    getVotingConfig = async (id: string): Promise<VotingConfig | undefined> => {
        // Check if entity exists in cache
        if (this.votingConfig.has(id)) return this.votingConfig.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(VotingConfig, id);
        if (a) this.votingConfig.set(id, a);
        return a;
    }

    saveVotingConfig = (ls: VotingConfig) => {
        this.votingConfig.set(ls.id, ls);
    }

    getNodeOperatorSigningKey = async (id: string): Promise<NodeOperatorSigningKey | undefined> => {
        // Check if entity exists in cache
        if (this.nodeOperatorSigningKeys.has(id)) return this.nodeOperatorSigningKeys.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(NodeOperatorSigningKey, id);
        if (a) this.nodeOperatorSigningKeys.set(id, a);
        return a;
    }

    saveNodeOperatorSigningKey = (ls: NodeOperatorSigningKey) => {
        this.nodeOperatorSigningKeys.set(ls.id, ls);
    }

    getNodeOperatorKeysOpIndex = async (id: string): Promise<NodeOperatorKeysOpIndex | undefined> => {
        // Check if entity exists in cache
        if (this.nodeOperatorKeysOpIndex.has(id)) return this.nodeOperatorKeysOpIndex.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(NodeOperatorKeysOpIndex, id);
        if (a) this.nodeOperatorKeysOpIndex.set(id, a);
        return a;
    }

    saveNodeOperatorKeysOpIndex = (ls: NodeOperatorKeysOpIndex) => {
        this.nodeOperatorKeysOpIndex.set(ls.id, ls);
    }

    getWithdrawalQueueConfig = async (id: string): Promise<WithdrawalQueueConfig | undefined> => {
        // Check if entity exists in cache
        if (this.withdrawalQueueConfig.has(id)) return this.withdrawalQueueConfig.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(WithdrawalQueueConfig, id);
        if (a) this.withdrawalQueueConfig.set(id, a);
        return a;
    }

    saveWithdrawalQueueConfig = (ls: WithdrawalQueueConfig) => {
        this.withdrawalQueueConfig.set(ls.id, ls);
    }

    getWithdrawalClaimed = async (id: string): Promise<WithdrawalClaimed | undefined> => {
        // Check if entity exists in cache
        if (this.withdrawalClaims.has(id)) return this.withdrawalClaims.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(WithdrawalClaimed, id);
        if (a) this.withdrawalClaims.set(id, a);
        return a;
    }

    saveWithdrawalClaimed = (ls: WithdrawalClaimed) => {
        this.withdrawalClaims.set(ls.id, ls);
    }

    getWithdrawalRequested = async (id: string): Promise<WithdrawalRequested | undefined> => {
        // Check if entity exists in cache
        if (this.withdrawalRequests.has(id)) return this.withdrawalRequests.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(WithdrawalRequested, id);
        if (a) this.withdrawalRequests.set(id, a);
        return a;
    }

    saveWithdrawalRequested = (ls: WithdrawalRequested) => {
        this.withdrawalRequests.set(ls.id, ls);
    }

    getWithdrawalFinalized = async (id: string): Promise<WithdrawalsFinalized | undefined> => {
        // Check if entity exists in cache
        if (this.withdrawalFinalized.has(id)) return this.withdrawalFinalized.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(WithdrawalsFinalized, id);
        if (a) this.withdrawalFinalized.set(id, a);
        return a;
    }

    saveWithdrawalFinalized = (ls: WithdrawalsFinalized) => {
        this.withdrawalFinalized.set(ls.id, ls);
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
        await this.ctx.store.upsert([...this.nodeOperators.values()]);
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
        await this.ctx.store.upsert([...this.oracleReports.values()]);
        await this.ctx.store.upsert([...this.beaconReports.values()]);
        await this.ctx.store.upsert([...this.oracleMembers.values()]);
        await this.ctx.store.upsert([...this.voting.values()]);
        await this.ctx.store.upsert([...this.votes.values()]);
        await this.ctx.store.upsert([...this.votingObjections.values()]);
        await this.ctx.store.upsert([...this.votingConfig.values()]);
        await this.ctx.store.upsert([...this.nodeOperatorSigningKeys.values()]);
        await this.ctx.store.upsert([...this.nodeOperatorKeysOpIndex.values()]);
        await this.ctx.store.upsert([...this.withdrawalQueueConfig.values()]);
        await this.ctx.store.upsert([...this.withdrawalClaims.values()]);
        await this.ctx.store.upsert([...this.withdrawalRequests.values()]);
        await this.ctx.store.upsert([...this.withdrawalFinalized.values()]);

        if (flushCache) {
            this.initializeMaps();
        }
    }
}