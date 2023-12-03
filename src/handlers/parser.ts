import {ZERO_ADDRESS} from "../constants";
import {parserMap} from "../parserData";


export class ParsedEvent {
    constructor(public name: string, public event: any, public params: any) {}
}


export function parseEventLogs(baseEvent: any, contractAddress: string = ZERO_ADDRESS, logIndexFrom: bigint = 0n, logIndexTo: bigint = 0n): ParsedEvent[] {
    const events: ParsedEvent[] = [];

    let receipt = baseEvent.transaction;
    if (receipt && receipt.logs.length > 1) {
        for (let i = 0; i < receipt.logs.length; i++) {
            // skip events out of indexes range
            if (
                (logIndexFrom !== 0n && receipt.logs[i].logIndex < logIndexFrom) ||
                (logIndexTo !== 0n && receipt.logs[i].logIndex > logIndexTo) ||
                (contractAddress !== ZERO_ADDRESS &&
                    receipt.logs[i].address.toLowerCase() !== contractAddress)
            ) continue;

            const eventParserOpts = parserMap.get(receipt.logs[i].topics[0]);
            if (eventParserOpts) {
                const name = eventParserOpts.name;
                const params = eventParserOpts.log.decode(receipt.logs[i]);
                events.push(new ParsedEvent(name, receipt.logs[i] , params));

            } else {
                console.warn(`eventParserOpts not found for topic0: ${receipt.logs[i].topics[0]} block: ${baseEvent.block.height} txHash: ${baseEvent.transactionHash} logIdx: ${receipt.logs[i].logIndex}`);
            }
        }
    }
    return events;
}


export function extractPairedEvent(events: ParsedEvent[], leftName: string, rightName: string, logIndexFrom: bigint = 0n, logIndexTo: bigint = 0n): ParsedEvent[][] {
    let eventPairs: ParsedEvent[][] = [];
    // 1 based index
    let idx0 = 0
    let idx1 = 0

    for (let i = 0; i < events.length; i++) {
        if (
            (logIndexFrom !== 0n && events[i].event.logIndex < logIndexFrom) ||
            (logIndexTo !== 0n && events[i].event.logIndex > logIndexTo)
        ) continue;

        if (events[i].name === leftName && !idx0) {
            idx0 = i + 1
            if (!idx1) {
                continue
            }
        }
        if (events[i].name === rightName && !idx1) {
            idx1 = i + 1
            if (!idx0) {
                continue
            }
        }

        if (idx0 && idx1) {
            eventPairs.push([events[idx0 - 1], events[idx1 - 1]]);
            idx0 = 0;
            idx1 = 0;
        } else if ((idx0 && !idx1) || (idx1 && !idx0)) {
            console.error('Pair not found for events <{}, {}>', [leftName, rightName]);
            throw new Error('Pair event missed');
        }
        // eventPairs.push([events[i]])
    }

    return eventPairs;
}


export function getParsedEvent(events: ParsedEvent[], pos: number = 0): ParsedEvent {
    return events[pos];
}

export function getRightPairedEventByLeftLogIndex(events: ParsedEvent[][], logIndex: bigint): ParsedEvent | null {
    for (let i = 0; i < events.length; i++) {
        if (events[i][0].event.logIndex === logIndex) {
            return getParsedEvent(events[i], 1);
        }
    }
    return null;
}

