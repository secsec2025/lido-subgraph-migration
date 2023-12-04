import {EntityCache} from "../entity-cache";
import {_loadOracleReport} from "./helpers";
import assert from "assert";

export const handleProcessingStarted = async (refSlot: bigint, hash: string, logEvent: any, entityCache: EntityCache) => {
    // OracleReport could exist already at this moment in case repeated report for the same epoch
    let oracleReportEntity = await _loadOracleReport(refSlot, true, entityCache);
    assert(oracleReportEntity, `Undefined oracleReportEntity at ${logEvent.transactionHash}`);
    // link to totalReward
    oracleReportEntity.totalRewardId = logEvent.transactionHash;
    oracleReportEntity.hash = hash;
    entityCache.saveOracleReport(oracleReportEntity);
}