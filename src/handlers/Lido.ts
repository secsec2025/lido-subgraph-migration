import {EntityCache} from "../entity-cache";
import {LidoSubmission} from "../model";
import {_loadSharesEntity, _loadTotalsEntity, isLidoTransferShares} from "./helpers";
import {extractPairedEvent, getParsedEvent, parseEventLogs} from "./parser";
import {LIDO_ADDRESS} from "../constants";
import assert from "assert";

export const handleSubmitted = async (sender: string, amount: bigint, referral: string, ctx: any, logEvent: any, entityCache: EntityCache) => {

    let entity = new LidoSubmission({
        id: logEvent.transactionHash + logEvent.logIndex.toString()
    });
    // let entity = new LidoSubmission(event.transaction.hash.toHex() + '-' + event.logIndex.toString())

    entity.sender = sender;
    entity.amount = amount;
    entity.referral = referral;

    entity.block = BigInt(logEvent.block.height);
    entity.blockTime = BigInt(logEvent.block.timestamp);
    entity.transactionHash = logEvent.transactionHash;
    entity.transactionIndex = BigInt(logEvent.transactionIndex);
    entity.logIndex = BigInt(logEvent.logIndex);

    // Loading totals
    const totals = await _loadTotalsEntity(true, entityCache);
    if (!totals) return;

    let shares: bigint;
    // after TransferShares event has been added just take shares value from it
    // calc shares value otherwise
    if (await isLidoTransferShares(logEvent.block.height, entityCache)) {
        // limit parsing by 2 next events
        // such approach cover both cases when Transfer was emitted before and wise versa
        const parsedEvents = parseEventLogs(logEvent, LIDO_ADDRESS, logEvent.logIndex, logEvent.logIndex + 2n);
        // extracting only 'Transfer' and 'TransferShares' pairs
        const transferEventPairs = extractPairedEvent(parsedEvents, 'Transfer', 'TransferShares');

        // expecting at only one Transfer events pair
        assert(transferEventPairs.length == 1, 'no Transfer/TransferShares events on submit');

        // const eventTransfer = getParsedEvent<Transfer>(transferEventPairs[0], 0)
        const eventTransferShares = getParsedEvent(transferEventPairs[0], 1);
        shares = eventTransferShares.params['sharesValue']!;
    } else {
        /**
         * Use 1:1 ether-shares ratio when:
         * 1. Nothing was staked yet
         * 2. Someone staked something, but shares got rounded to 0 eg staking 1 wei
         **/

        // Check if contract has no ether or shares yet
        shares = totals.totalPooledEther === 0n ? amount : BigInt(Math.round(Number(amount * totals.totalShares / totals.totalPooledEther)));

        // handle the case when staked amount ~1 wei, that shares to mint got rounded to 0
        if (shares === 0n) shares = amount;

    }

    entity.shares = shares;

    const sharesEntity = await _loadSharesEntity(sender, true, entityCache);
    if (!sharesEntity) return;
    entity.sharesBefore = sharesEntity.shares;
    entity.sharesAfter = entity.sharesBefore + shares;

    entity.totalPooledEtherBefore = totals.totalPooledEther;
    entity.totalSharesBefore = totals.totalShares;

    // Increasing Total
    totals.totalPooledEther = totals.totalPooledEther + amount;
    totals.totalShares = totals.totalShares + shares;
    entityCache.saveTotals(totals);

    entity.totalPooledEtherAfter = totals.totalPooledEther;
    entity.totalSharesAfter = totals.totalShares;

    // Calculating new balance
    entity.balanceAfter = BigInt(Math.round(Number(entity.sharesAfter * totals.totalPooledEther / totals.totalShares)));
    entityCache.saveLidoSubmission(entity);

    entityCache.saveShares(sharesEntity);
}
