import {lookupArchive} from '@subsquid/archive-registry';
import {
    EvmBatchProcessor
} from '@subsquid/evm-processor';
import {
    LEGACY_ORACLE_ADDRESS,
    LIDO_ADDRESS,
    LIDO_DAO_ADDRESS,
    LIDO_VOTING_ADDRESS,
    NODE_OPERATORS_REGISTRY_ADDRESS
} from "./constants";

import {events as lidoDAOEvents} from './abi/LidoDAO';
import {events as lidoEvents} from './abi/Lido';
import {events as legacyOracleEvents} from './abi/LegacyOracle';
import {events as nodeOperatorEvents} from './abi/NodeOperatorsRegistry';
import {events as votingEvents} from './abi/Voting';

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
            lidoEvents.WithdrawalCredentialsSet.topic, lidoEvents.ProtocolContactsSet.topic, lidoEvents.ELRewardsWithdrawalLimitSet.topic,
            lidoEvents.ELRewardsVaultSet.topic, lidoEvents.BeaconValidatorsUpdated.topic,
            lidoEvents.ELRewardsReceived.topic, lidoEvents.MevTxFeeReceived.topic],
        range: {from: 11473216},
    }).addLog({
        address: [LEGACY_ORACLE_ADDRESS],
        topic0: [legacyOracleEvents.Completed.topic, legacyOracleEvents.PostTotalShares.topic],
        range: {from: 11473216},
        transaction: true
    }).addLog({
        address: [LEGACY_ORACLE_ADDRESS],
        topic0: [legacyOracleEvents.PostTotalShares.topic, legacyOracleEvents.MemberAdded.topic, legacyOracleEvents.MemberRemoved.topic,
            legacyOracleEvents.ContractVersionSet.topic, legacyOracleEvents.QuorumChanged.topic, legacyOracleEvents.BeaconSpecSet.topic,
            legacyOracleEvents.BeaconReportReceiverSet.topic, legacyOracleEvents.AllowedBeaconBalanceRelativeDecreaseSet.topic,
            legacyOracleEvents.AllowedBeaconBalanceAnnualRelativeIncreaseSet.topic],
        range: {from: 11473216}
    }).addLog({
        address: [NODE_OPERATORS_REGISTRY_ADDRESS],
        topic0: [nodeOperatorEvents.NodeOperatorAdded.topic, nodeOperatorEvents.NodeOperatorActiveSet.topic,
            nodeOperatorEvents.NodeOperatorNameSet.topic, nodeOperatorEvents.NodeOperatorRewardAddressSet.topic,
            nodeOperatorEvents.SigningKeyAdded.topic, nodeOperatorEvents.SigningKeyRemoved.topic,
            nodeOperatorEvents.NodeOperatorTotalKeysTrimmed.topic, nodeOperatorEvents.KeysOpIndexSet.topic,
            nodeOperatorEvents.NodeOperatorStakingLimitSet.topic, nodeOperatorEvents.NodeOperatorTotalStoppedValidatorsReported.topic],
        range: {from: 11473216}
    }).addLog({
        address: [LIDO_VOTING_ADDRESS],
        topic0: [votingEvents.StartVote.topic, votingEvents.CastVote.topic, votingEvents.CastObjection.topic,
            votingEvents.ExecuteVote.topic, votingEvents.ChangeSupportRequired.topic, votingEvents.ChangeMinQuorum.topic,
            votingEvents.ChangeVoteTime.topic, votingEvents.ChangeObjectionPhaseTime.topic],
        range: {from: 11473216}
    }).setFields({
        log: {
            address: true,
            topics: true,
            data: true,
            transactionHash: true
        }
    });


