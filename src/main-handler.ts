import {events as lidoEvents} from "./abi/Lido";
import {handleSharesBurnt} from "./handlers/Lido";
import {EntityCache} from "./entity-cache";

export const mainHandleSharesBurnt = async (logEvent: any, entityCache: EntityCache) => {
    const {account,preRebaseTokenAmount, postRebaseTokenAmount, sharesAmount } = lidoEvents.SharesBurnt.decode(logEvent);
    await handleSharesBurnt(account.toLowerCase(), preRebaseTokenAmount, postRebaseTokenAmount, sharesAmount, logEvent, entityCache);
}