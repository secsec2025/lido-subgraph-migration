import {lookupArchive} from '@subsquid/archive-registry';
import {
    EvmBatchProcessor
} from '@subsquid/evm-processor';
import {LIDO_ADDRESS, LIDO_DAO_ADDRESS} from "./constants";

import {events as lidoDAOEvents} from './abi/LidoDAO';
import {events as lidoEvents} from './abi/Lido';

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
    }).addLog({
        address: [LIDO_ADDRESS],
        topic0: [lidoEvents.Submitted.topic, lidoEvents.Transfer.topic, lidoEvents.TransferShares.topic,
            lidoEvents.SharesBurnt.topic, lidoEvents.ETHDistributed.topic, lidoEvents.TokenRebased.topic ],
        range: {from: 11473216},
        transaction: true
    }).addLog({
        address: [LIDO_ADDRESS],
        topic0: [lidoEvents.LidoLocatorSet.topic, lidoEvents.Stopped.topic, lidoEvents.Resumed.topic,
            lidoEvents.StakingLimitRemoved.topic, lidoEvents.StakingLimitSet.topic, lidoEvents.StakingResumed.topic,
            lidoEvents.StakingPaused.topic, lidoEvents.Approval.topic, lidoEvents.FeeSet.topic, lidoEvents.FeeDistributionSet.topic,
            lidoEvents.WithdrawalCredentialsSet.topic],
        range: {from: 11473216},
    }).setFields({
        log: {
            address: true,
            topics: true,
            data: true,
            transactionHash: true
        }
    });


