import {EntityCache} from "../entity-cache";
import {Vote, Voting, VotingObjection} from "../model";
import assert from "assert";
import {_loadSharesEntity, _loadTotalsEntity} from "./helpers";

export const handleStartVote = async (voteId: bigint, creator: string, metadata: string, logEvent: any, entityCache: EntityCache) => {
    let entity = new Voting({
        id: voteId.toString(),
        index: Number(voteId),
        creator: creator,
        metadata: metadata,
        executed: false,
        block: BigInt(logEvent.block.height),
        blockTime: BigInt(logEvent.block.timestamp),
        transactionHash: logEvent.transactionHash,
        logIndex: BigInt(logEvent.logIndex)
    });
    entityCache.saveVoting(entity);
}

export const handleCastVote = async (voteId: bigint, voter: string, supports: boolean, stake: bigint, logEvent: any, entityCache: EntityCache) => {
    let entity = new Vote({
        id: `${logEvent.transactionHash}${logEvent.logIndex}`,
        votingId: voteId.toString(),
        voter: voter,
        supports: supports,
        stake: stake
    });
    entityCache.saveVote(entity);
}

export const handleCastObjection = async (voteId: bigint, voter: string, stake: bigint, logEvent: any, entityCache: EntityCache) => {
    let entity = new VotingObjection({
        id: `${logEvent.transactionHash}${logEvent.logIndex}`,
        votingId: voteId.toString(),
        voter: voter,
        stake: stake
    });
    entityCache.saveVotingObjection(entity);
}

export const handleExecuteVote = async (voteId: bigint, logEvent: any, entityCache: EntityCache) => {
    let entity = await entityCache.getVoting(voteId.toString());
    assert(entity, `Undefined voteId - ${voteId}`);
    entity.executed = true;

    /**
     Accounting for calling burnShares() on Mainnet as we didn't yet have a proper event.
     This one-off operation allows us not to enable tracing.
     **/
    if (logEvent.transactionHash === '0x55eb29bda8d96a9a92295c358edbcef087d09f24bd684e6b4e88b166c99ea6a7') {
        const accToBurn: string = '0x3e40d73eb977dc6a537af587d48316fee66e9c8c'.toLowerCase();
        const sharesToSubtract = BigInt('32145684728326685744');

        const shares = await _loadSharesEntity(accToBurn, false, entityCache);
        assert(shares, `Undefined burnAccount - ${accToBurn}`);

        shares.shares = shares.shares - sharesToSubtract;
        assert(shares.shares >= 0n, 'Negative shares.hares!');
        entityCache.saveShares(shares);

        const totals = await _loadTotalsEntity(false, entityCache);
        assert(totals, `Undefined totals Object - ${logEvent.transactionHash}`);

        totals.totalShares = totals.totalShares - sharesToSubtract;
        assert(totals.totalShares >= 0n, 'Negative totals.totalShares!');
        entityCache.saveTotals(totals);
    }

    entityCache.saveVoting(entity);
}
