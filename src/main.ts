import {TypeormDatabase} from '@subsquid/typeorm-store'
import {processor} from './processor'
import {LIDO_DAO_ADDRESS} from "./constants";

import {events as lidoDAOEvents} from './abi/LidoDAO';

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    console.log(`Batch Size - ${ctx.blocks.length} blocks`);

    for (const c of ctx.blocks) {
        for (const e of c.logs) {
            // handleSetApp
            if (e.address.toLowerCase() === LIDO_DAO_ADDRESS && e.topics[0] === lidoDAOEvents.SetApp.topic) {
                const {namespace, appId, app} = lidoDAOEvents.SetApp.decode(e);
                console.log(`Found one Log. with ${namespace} - ${appId} - ${app}`);
            }
        }
    }
});
