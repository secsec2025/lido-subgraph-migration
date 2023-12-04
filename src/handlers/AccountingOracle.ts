import {EntityCache} from "../entity-cache";
import {_loadOracleReport} from "./helpers";
import assert from "assert";
import {getAddress} from "../constants";
import {getStakingRouterModules} from "../helpers/contract-helper";
import {extractPairedEvent, getParsedEvent, parseEventLogs} from "./parser";
import {NodeOperatorFees, NodeOperatorsShares} from "../model";

export const handleProcessingStarted = async (refSlot: bigint, hash: string, logEvent: any, entityCache: EntityCache) => {
    // OracleReport could exist already at this moment in case repeated report for the same epoch
    let oracleReportEntity = await _loadOracleReport(refSlot, true, entityCache);
    assert(oracleReportEntity, `Undefined oracleReportEntity at ${logEvent.transactionHash}`);
    // link to totalReward
    oracleReportEntity.totalRewardId = logEvent.transactionHash;
    oracleReportEntity.hash = hash;
    entityCache.saveOracleReport(oracleReportEntity);
}

export const handleExtraDataSubmitted = async (refSlot: bigint, itemsProcessed: bigint, itemsCount: bigint, ctx: any, logEvent: any, entityCache: EntityCache) => {
    // OracleReport should exist at this moment
    const oracleReportEntity = await _loadOracleReport(refSlot, false, entityCache);
    assert(oracleReportEntity, `Undefined oracleReportEntity at ${logEvent.transactionHash}`);

    oracleReportEntity.itemsProcessed = itemsProcessed;
    oracleReportEntity.itemsCount = itemsCount;
    entityCache.saveOracleReport(oracleReportEntity);

    // load all SR modules
    const stakingRouterAddress = await getAddress('STAKING_ROUTER', entityCache);
    assert(stakingRouterAddress, `Undefined Staking Router Address at ${logEvent.transactionHash}`);
    const modules = await getStakingRouterModules(stakingRouterAddress, ctx, logEvent);

    // parse all events from tx receipt
    const lidoAddress = await getAddress('LIDO', entityCache);
    assert(lidoAddress, `Undefined Lido Address at ${logEvent.transactionHash}`);
    const parsedEvents = parseEventLogs(logEvent, lidoAddress);

    // extracting all 'Transfer' and 'TransferShares' pairs from tx receipt
    const transferEventPairs = extractPairedEvent(parsedEvents, 'Transfer', 'TransferShares');

    const burnerAddress = await getAddress('BURNER', entityCache);
    assert(burnerAddress, `Undefined BURNER Address at ${logEvent.transactionHash}`);

    for (let i = 0; i < transferEventPairs.length; i++) {
        const eventTransfer = getParsedEvent(transferEventPairs[i], 0);
        const eventTransferShares = getParsedEvent(transferEventPairs[i], 1);

        // creating reward records for NOs to preserve data structure compatibility
        for (let j = 0; j < modules.length; j++) {
            // process transfers from module's addresses, excluding transfers to burner
            if (
                eventTransfer.params['from'].toLowerCase() === modules[j].stakingModuleAddress.toLowerCase() &&
                eventTransfer.params['to'].toLowerCase() !== burnerAddress
            ) {
                let id = `${eventTransfer.event.transactionHash}${eventTransfer.event.logIndex}`;

                // @todo merge NodeOperatorFees & NodeOperatorsShares ?
                const nodeOperatorFees = new NodeOperatorFees({
                    id: id
                });
                // Reference to TotalReward entity
                nodeOperatorFees.totalRewardId = oracleReportEntity.totalRewardId;
                nodeOperatorFees.address = eventTransfer.params['to'].toLowerCase();
                nodeOperatorFees.fee = eventTransfer.params['value'];
                entityCache.saveNodeOperatorFee(nodeOperatorFees);

                id = `${logEvent.transactionHash}${eventTransfer.params['to'].toLowerCase()}`;
                let nodeOperatorShare = await entityCache.getNodeOperatorsShare(id);
                if (!nodeOperatorShare) {
                    nodeOperatorShare = new NodeOperatorsShares({
                        id: id
                    });
                    // Reference to TotalReward entity
                    nodeOperatorShare.totalRewardId = oracleReportEntity.totalRewardId;
                    nodeOperatorShare.address = eventTransfer.params['to'].toLowerCase();
                    nodeOperatorShare.shares = 0n;
                }
                nodeOperatorShare.shares = nodeOperatorShare.shares + eventTransferShares.params['sharesValue'];
                entityCache.saveNodeOperatorsShare(nodeOperatorShare);
            }
        }
    }
}