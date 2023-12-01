import {lookupArchive} from '@subsquid/archive-registry';
import {
    EvmBatchProcessor
} from '@subsquid/evm-processor';
import {LIDO_DAO_ADDRESS} from "./constants";

import {events as lidoDAOEvents} from './abi/LidoDAO';

export const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive('eth-mainnet'),
        chain: 'https://rpc.ankr.com/eth',
    })
    .setFinalityConfirmation(75)
    .addLog({
        address: [LIDO_DAO_ADDRESS],
        topic0: [lidoDAOEvents.SetApp.topic],
        range: {from: 11473216 }
    });


