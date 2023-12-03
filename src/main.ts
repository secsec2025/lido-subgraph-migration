import {TypeormDatabase} from '@subsquid/typeorm-store'
import {processor} from './processor'
import {LIDO_ADDRESS, LIDO_DAO_ADDRESS} from "./constants";

import {events as lidoDAOEvents} from './abi/LidoDAO';
import {events as lidoEvents} from './abi/Lido';

import {handleSetApp} from './handlers/LidoDAO';

import {EntityCache} from './entity-cache';
import {handleETHDistributed, handleSubmitted, handleTransfer} from "./handlers/Lido";
import {mainHandleSharesBurnt} from "./main-handler";

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    console.log(`Batch Size - ${ctx.blocks.length} blocks`);

    const entityCache: EntityCache = new EntityCache(ctx);

    for (const c of ctx.blocks) {
        for (const e of c.logs) {
            // LidoDAO.handleSetApp
            if (e.address.toLowerCase() === LIDO_DAO_ADDRESS && e.topics[0] === lidoDAOEvents.SetApp.topic) {
                const {namespace, appId, app} = lidoDAOEvents.SetApp.decode(e);
                await handleSetApp(namespace, appId, app.toLowerCase(), ctx, e, entityCache);
            }

            // Lido.handleSubmitted
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.Submitted.topic) {
                const {sender, amount, referral} = lidoEvents.Submitted.decode(e);
                await handleSubmitted(sender.toLowerCase(), amount, referral.toLowerCase(), ctx, e, entityCache);
            }

            // Lido.handleTransfer
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.Transfer.topic) {
                const {from, to, value} = lidoEvents.Transfer.decode(e);
                await handleTransfer(from.toLowerCase(), to.toLowerCase(), value, e, entityCache);
            }

            // Lido.handleSharesBurnt
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.SharesBurnt.topic) {
                console.log(`Lido.handleSharesBurnt - Start`);
                await mainHandleSharesBurnt(e, entityCache);
                console.log(`Lido.handleSharesBurnt - End`);
            }

            // Lido.handleETHDistributed
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.ETHDistributed.topic) {
                console.log(`Lido.handleETHDistributed - Start`);
                const {reportTimestamp,preCLBalance, postCLBalance, withdrawalsWithdrawn, executionLayerRewardsWithdrawn, postBufferedEther } = lidoEvents.ETHDistributed.decode(e);
                await handleETHDistributed(reportTimestamp,preCLBalance, postCLBalance, withdrawalsWithdrawn, executionLayerRewardsWithdrawn, postBufferedEther, e, entityCache);
                console.log(`Lido.handleETHDistributed - End`);
            }
        }
    }


    await entityCache.persistCacheToDatabase(false);
});
