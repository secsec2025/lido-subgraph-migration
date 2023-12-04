import {EntityCache} from "../entity-cache";
import {Voting} from "../model";

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