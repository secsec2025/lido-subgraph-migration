import {Shares, Totals} from "../model";
import {
    LIDO_APP_ID,
    NETWORK,
    PROTOCOL_UPG_APP_VERS,
    PROTOCOL_UPG_BLOCKS,
    PROTOCOL_UPG_IDX_V1_SHARES,
    PROTOCOL_UPG_IDX_V2
} from "../constants";
import {EntityCache} from "../entity-cache";

export async function _loadTotalsEntity(create: boolean = false, entityCache: EntityCache): Promise<Totals | undefined> {
    let totals = await entityCache.getTotals(' ');
    if (!totals && create) {
        totals = new Totals({
            id: '',
            totalPooledEther: 0n,
            totalShares: 0n
        });
    }
    return totals;
}


export async function _loadSharesEntity(id: string, create: boolean = false, entityCache: EntityCache): Promise<Shares | undefined> {
    let entity = await entityCache.getShares(id);
    if (!entity && create) {
        entity = new Shares({id: id, shares: 0n});
    }
    return entity;
}


export const checkAppVer = async (block: bigint, appId: string | undefined, minUpgId: number, entityCache: EntityCache): Promise<boolean> => {
    // first we check block for faster detection
    // if block check fails, try to check app ver
    if (block !== 0n) {
        const upgBlocks = PROTOCOL_UPG_BLOCKS.get(NETWORK);
        if (upgBlocks && minUpgId < upgBlocks.length && upgBlocks[minUpgId] != block) {
            // note: we need a block strictly larger than upgBlock, since it
            // is possible that there are transactions in the same block before and after the upgrade
            return upgBlocks[minUpgId] < block;
        }
    }

    // if no appId provided or there is no records about appId in DB, assuming check pass
    if (!appId) return true;

    const appVer = await entityCache.getAppVersion(appId);
    if (!appVer) return true;

    const upgVers = PROTOCOL_UPG_APP_VERS.get(appId);
    // if no upgrades defined assuming subgraph code fully compatible with deployed contracts
    if (!upgVers || upgVers.length == 0 || minUpgId >= upgVers.length) return true;

    // check requested minUpgId is defined and it's contract version is below requested curVer
    return upgVers[minUpgId] <= appVer.major;
}

export async function isLidoV2(block: bigint = 0n, entityCache: EntityCache): Promise<boolean> {
    return await checkAppVer(block, LIDO_APP_ID, PROTOCOL_UPG_IDX_V2, entityCache);
}

export async function isLidoTransferShares(block: bigint = 0n, entityCache: EntityCache): Promise<boolean> {
    return await checkAppVer(block, LIDO_APP_ID, PROTOCOL_UPG_IDX_V1_SHARES, entityCache);
}

