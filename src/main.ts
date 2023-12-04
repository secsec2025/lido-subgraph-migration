import {TypeormDatabase} from '@subsquid/typeorm-store'
import {processor} from './processor'
import {
    LEGACY_ORACLE_ADDRESS, LIDO_ACCOUNTING_ORACLE_ADDRESS,
    LIDO_ADDRESS,
    LIDO_DAO_ADDRESS, LIDO_HASH_CONSENSUS_ADDRESS, LIDO_STAKING_ROUTER_ADDRESS,
    LIDO_VOTING_ADDRESS, LIDO_WITHDRAWAL_QUEUE_ADDRESS,
    NODE_OPERATORS_REGISTRY_ADDRESS
} from "./constants";

import {events as lidoDAOEvents} from './abi/LidoDAO';
import {events as lidoEvents} from './abi/Lido';
import {events as nodeOperatorEvents} from './abi/NodeOperatorsRegistry';
import {events as votingEvents} from './abi/Voting';
import {events as stakingRouterEvents} from './abi/StakingRouter';
import {events as accountingOracleEvents} from './abi/AccountingOracle';
import {events as withdrawalQueueEvents} from './abi/WithdrawalQueue';
import {events as hashConsensusEvents} from './abi/HashConsensus';

import {handleSetApp} from './handlers/LidoDAO';

import {EntityCache} from './entity-cache';
import {
    handleApproval, handleBeaconValidatorsUpdated, handleELRewardsVaultSet, handleELRewardsWithdrawalLimitSet,
    handleETHDistributed, handleFeeDistributionSet, handleFeeSet,
    handleLidoLocatorSet, handleProtocolContractsSet,
    handleResumed,
    handleStakingLimitRemoved,
    handleStakingLimitSet,
    handleStakingPaused,
    handleStakingResumed,
    handleStopped,
    handleSubmitted,
    handleTransfer, handleWithdrawalCredentialsSet
} from "./handlers/Lido";
import {mainHandleSharesBurnt} from "./main-handler";
import {events as legacyOracleEvents} from "./abi/LegacyOracle";
import {
    handleAllowedBeaconBalanceAnnualRelativeIncreaseSet,
    handleAllowedBeaconBalanceRelativeDecreaseSet,
    handleBeaconReportReceiverSet,
    handleBeaconSpecSet,
    handleCompleted,
    handleContractVersionSet,
    handleMemberAdded,
    handleMemberRemoved,
    handlePostTotalShares, handleQuorumChanged
} from "./handlers/LegacyOracle";
import {
    handleKeysOpIndexSet,
    handleNodeOperatorActiveSet,
    handleNodeOperatorAdded,
    handleNodeOperatorNameSet,
    handleNodeOperatorRewardAddressSet, handleNodeOperatorStakingLimitSet,
    handleNodeOperatorTotalKeysTrimmed, handleNodeOperatorTotalStoppedValidatorsReported,
    handleSigningKeyAdded,
    handleSigningKeyRemoved
} from "./handlers/NodeOperatorsRegistry";
import {
    handleCastObjection,
    handleCastVote, handleChangeMinQuorum, handleChangeObjectionPhaseTime,
    handleChangeSupportRequired, handleChangeVoteTime,
    handleExecuteVote,
    handleStartVote
} from "./handlers/Voting";
import {handleWithdrawalCredentialsSetStakingRouter} from "./handlers/StakingRouter";
import {handleExtraDataSubmitted, handleProcessingStarted} from "./handlers/AccountingOracle";
import {
    handleBunkerModeDisabled,
    handleBunkerModeEnabled,
    handleContractVersionSetWithdrawalQueue,
    handlePausedWithdrawalQueue,
    handleResumedWithdrawalQueue,
    handleWithdrawalClaimed, handleWithdrawalRequested, handleWithdrawalsFinalized
} from "./handlers/WithdrawalQueue";
import {handleFrameConfigSet} from "./handlers/HashConsensus";

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
                await mainHandleSharesBurnt(e, entityCache);
            }

            // Lido.handleETHDistributed
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.ETHDistributed.topic) {
                const {reportTimestamp,preCLBalance, postCLBalance, withdrawalsWithdrawn, executionLayerRewardsWithdrawn, postBufferedEther } = lidoEvents.ETHDistributed.decode(e);
                await handleETHDistributed(reportTimestamp,preCLBalance, postCLBalance, withdrawalsWithdrawn, executionLayerRewardsWithdrawn, postBufferedEther, e, entityCache);
            }

            // Lido.handleLidoLocatorSet
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.LidoLocatorSet.topic) {
                console.log(`Lido.handleLidoLocatorSet - Start`);
                const { lidoLocator } = lidoEvents.LidoLocatorSet.decode(e);
                await handleLidoLocatorSet(lidoLocator.toLowerCase(), e, entityCache);
                console.log(`Lido.handleLidoLocatorSet - End`);
            }

            // Lido.handleStopped
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.Stopped.topic) {
                console.log(`Lido.handleStopped - Start`);
                await handleStopped(e, entityCache);
                console.log(`Lido.handleStopped - End`);
            }

            // Lido.handleResumed
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.Resumed.topic) {
                await handleResumed(e, entityCache);
            }

            // Lido.handleStakingLimitRemoved
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.StakingLimitRemoved.topic) {
                console.log(`Lido.handleStakingLimitRemoved - Start`);
                await handleStakingLimitRemoved(e, entityCache);
                console.log(`Lido.handleStakingLimitRemoved - End`);
            }

            // Lido.handleStakingLimitSet
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.StakingLimitSet.topic) {
                const { maxStakeLimit, stakeLimitIncreasePerBlock } = lidoEvents.StakingLimitSet.decode(e);
                await handleStakingLimitSet(maxStakeLimit, stakeLimitIncreasePerBlock, e, entityCache);
            }

            // Lido.handleStakingResumed
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.StakingResumed.topic) {
                await handleStakingResumed(e, entityCache);
            }

            // Lido.handleStakingPaused
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.StakingPaused.topic) {
                console.log(`Lido.handleStakingPaused - Start`);
                await handleStakingPaused(e, entityCache);
                console.log(`Lido.handleStakingPaused - End`);
            }

            // Lido.handleApproval
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.Approval.topic) {
                const { owner, spender, value } = lidoEvents.Approval.decode(e);
                await handleApproval(owner.toLowerCase(), spender.toLowerCase(), value, e, entityCache);
            }

            // Lido.handleFeeSet
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.FeeSet.topic) {
                const { feeBasisPoints } = lidoEvents.FeeSet.decode(e);
                await handleFeeSet(feeBasisPoints, e, entityCache);
            }

            // Lido.handleFeeDistributionSet
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.FeeDistributionSet.topic) {
                const { treasuryFeeBasisPoints, insuranceFeeBasisPoints, operatorsFeeBasisPoints } = lidoEvents.FeeDistributionSet.decode(e);
                await handleFeeDistributionSet(treasuryFeeBasisPoints, insuranceFeeBasisPoints, operatorsFeeBasisPoints, e, entityCache);
            }

            // Lido.handleWithdrawalCredentialsSet
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.WithdrawalCredentialsSet.topic) {
                const { withdrawalCredentials } = lidoEvents.WithdrawalCredentialsSet.decode(e);
                await handleWithdrawalCredentialsSet(withdrawalCredentials, e, entityCache);
            }

            // Lido.handleProtocolContractsSet
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.ProtocolContactsSet.topic) {
                console.log(`Lido.handleProtocolContractsSet - Start`);
                const { oracle, treasury, insuranceFund } = lidoEvents.ProtocolContactsSet.decode(e);
                await handleProtocolContractsSet(oracle.toLowerCase(), treasury.toLowerCase(), insuranceFund.toLowerCase(), e, entityCache);
                console.log(`Lido.handleProtocolContractsSet - End`);
            }

            // Lido.handleELRewardsWithdrawalLimitSet
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.ELRewardsWithdrawalLimitSet.topic) {
                const { limitPoints } = lidoEvents.ELRewardsWithdrawalLimitSet.decode(e);
                await handleELRewardsWithdrawalLimitSet(limitPoints, e, entityCache);
            }

            // Lido.handleELRewardsVaultSet
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.ELRewardsVaultSet.topic) {
                const { executionLayerRewardsVault } = lidoEvents.ELRewardsVaultSet.decode(e);
                await handleELRewardsVaultSet(executionLayerRewardsVault.toLowerCase(), e, entityCache);
            }

            // Lido.handleBeaconValidatorsUpdated
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.BeaconValidatorsUpdated.topic) {
                console.log(`Lido.handleBeaconValidatorsUpdated - Start`);
                const { beaconValidators } = lidoEvents.BeaconValidatorsUpdated.decode(e);
                await handleBeaconValidatorsUpdated(beaconValidators, ctx, e, entityCache);
                console.log(`Lido.handleBeaconValidatorsUpdated - End`);
            }

            // LegacyOracle.handleCompleted
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.Completed.topic) {
                const { epochId, beaconBalance, beaconValidators } = legacyOracleEvents.Completed.decode(e);
                await handleCompleted(epochId, beaconBalance, beaconValidators, ctx, e, entityCache);
            }

            // LegacyOracle.handlePostTotalShares
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.PostTotalShares.topic) {
                const { postTotalPooledEther, preTotalPooledEther, timeElapsed, totalShares } = legacyOracleEvents.PostTotalShares.decode(e);
                await handlePostTotalShares(postTotalPooledEther, preTotalPooledEther, timeElapsed, totalShares, e, entityCache);
            }

            // LegacyOracle.handleMemberAdded
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.MemberAdded.topic) {
                const { member } = legacyOracleEvents.MemberAdded.decode(e);
                await handleMemberAdded(member.toLowerCase(), e, entityCache);
            }

            // LegacyOracle.handleMemberRemoved
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.MemberRemoved.topic) {
                console.log(`LegacyOracle.handleMemberRemoved - Start`);
                const { member } = legacyOracleEvents.MemberRemoved.decode(e);
                await handleMemberRemoved(member.toLowerCase(), e, entityCache);
                console.log(`LegacyOracle.handleMemberRemoved - End`);
            }

            // LegacyOracle.handleContractVersionSet
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.ContractVersionSet.topic) {
                const { version } = legacyOracleEvents.ContractVersionSet.decode(e);
                await handleContractVersionSet(version, e, entityCache);
            }

            // LegacyOracle.handleQuorumChanged
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.QuorumChanged.topic) {
                const { quorum } = legacyOracleEvents.QuorumChanged.decode(e);
                await handleQuorumChanged(quorum, e, entityCache);
            }

            // LegacyOracle.handleBeaconSpecSet
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.BeaconSpecSet.topic) {
                console.log(`LegacyOracle.handleBeaconSpecSet - Start`);
                const { epochsPerFrame, slotsPerEpoch, secondsPerSlot, genesisTime } = legacyOracleEvents.BeaconSpecSet.decode(e);
                await handleBeaconSpecSet(epochsPerFrame, slotsPerEpoch, secondsPerSlot, genesisTime, e, entityCache);
                console.log(`LegacyOracle.handleBeaconSpecSet - End`);
            }

            // LegacyOracle.handleBeaconReportReceiverSet
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.BeaconReportReceiverSet.topic) {
                const { callback } = legacyOracleEvents.BeaconReportReceiverSet.decode(e);
                await handleBeaconReportReceiverSet(callback.toLowerCase(), e, entityCache);
            }

            // LegacyOracle.handleAllowedBeaconBalanceRelativeDecreaseSet
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.AllowedBeaconBalanceRelativeDecreaseSet.topic) {
                const { value } = legacyOracleEvents.AllowedBeaconBalanceRelativeDecreaseSet.decode(e);
                await handleAllowedBeaconBalanceRelativeDecreaseSet(value, e, entityCache);
            }

            // LegacyOracle.handleAllowedBeaconBalanceAnnualRelativeIncreaseSet
            else if (e.address.toLowerCase() === LEGACY_ORACLE_ADDRESS && e.topics[0] === legacyOracleEvents.AllowedBeaconBalanceAnnualRelativeIncreaseSet.topic) {
                const { value } = legacyOracleEvents.AllowedBeaconBalanceAnnualRelativeIncreaseSet.decode(e);
                await handleAllowedBeaconBalanceAnnualRelativeIncreaseSet(value, e, entityCache);
            }

            // NodeOperatorRegistry.handleNodeOperatorAdded
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.NodeOperatorAdded.topic) {
                const { id, name, rewardAddress, stakingLimit } = nodeOperatorEvents.NodeOperatorAdded.decode(e);
                await handleNodeOperatorAdded(id, name, rewardAddress.toLowerCase(), stakingLimit, e, entityCache);
            }

            // NodeOperatorRegistry.handleNodeOperatorActiveSet
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.NodeOperatorActiveSet.topic) {
                console.log(`NodeOperatorRegistry.handleNodeOperatorActiveSet - Start`);
                const { id, active } = nodeOperatorEvents.NodeOperatorActiveSet.decode(e);
                await handleNodeOperatorActiveSet(id, active, e, entityCache);
                console.log(`NodeOperatorRegistry.handleNodeOperatorActiveSet - End`);
            }

            // NodeOperatorRegistry.handleNodeOperatorNameSet
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.NodeOperatorNameSet.topic) {
                console.log(`NodeOperatorRegistry.handleNodeOperatorNameSet - Start`);
                const { id, name } = nodeOperatorEvents.NodeOperatorNameSet.decode(e);
                await handleNodeOperatorNameSet(id, name, e, entityCache);
                console.log(`NodeOperatorRegistry.handleNodeOperatorNameSet - End`);
            }

            // NodeOperatorRegistry.handleNodeOperatorRewardAddressSet
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.NodeOperatorRewardAddressSet.topic) {
                console.log(`NodeOperatorRegistry.handleNodeOperatorRewardAddressSet - Start`);
                const { id, rewardAddress } = nodeOperatorEvents.NodeOperatorRewardAddressSet.decode(e);
                await handleNodeOperatorRewardAddressSet(id, rewardAddress.toLowerCase(), e, entityCache);
                console.log(`NodeOperatorRegistry.handleNodeOperatorRewardAddressSet - End`);
            }

            // NodeOperatorRegistry.handleSigningKeyAdded
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.SigningKeyAdded.topic) {
                const { operatorId, pubkey } = nodeOperatorEvents.SigningKeyAdded.decode(e);
                await handleSigningKeyAdded(operatorId, pubkey, e, entityCache);
            }

            // NodeOperatorRegistry.handleSigningKeyRemoved
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.SigningKeyRemoved.topic) {
                const { operatorId, pubkey } = nodeOperatorEvents.SigningKeyRemoved.decode(e);
                await handleSigningKeyRemoved(operatorId, pubkey, e, entityCache);
            }

            // NodeOperatorRegistry.handleNodeOperatorTotalKeysTrimmed
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.NodeOperatorTotalKeysTrimmed.topic) {
                console.log(`NodeOperatorRegistry.handleNodeOperatorTotalKeysTrimmed - Start`);
                const { id, totalKeysTrimmed } = nodeOperatorEvents.NodeOperatorTotalKeysTrimmed.decode(e);
                await handleNodeOperatorTotalKeysTrimmed(id, totalKeysTrimmed, e, entityCache);
                console.log(`NodeOperatorRegistry.handleNodeOperatorTotalKeysTrimmed - End`);
            }

            // NodeOperatorRegistry.handleKeysOpIndexSet
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.KeysOpIndexSet.topic) {
                const { keysOpIndex } = nodeOperatorEvents.KeysOpIndexSet.decode(e);
                await handleKeysOpIndexSet(keysOpIndex, e, entityCache);
            }

            // NodeOperatorRegistry.handleNodeOperatorStakingLimitSet
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.NodeOperatorStakingLimitSet.topic) {
                const { id, stakingLimit } = nodeOperatorEvents.NodeOperatorStakingLimitSet.decode(e);
                await handleNodeOperatorStakingLimitSet(id, stakingLimit, e, entityCache);
            }

            // NodeOperatorRegistry.handleNodeOperatorTotalStoppedValidatorsReported
            else if (e.address.toLowerCase() === NODE_OPERATORS_REGISTRY_ADDRESS && e.topics[0] === nodeOperatorEvents.NodeOperatorTotalStoppedValidatorsReported.topic) {
                console.log(`NodeOperatorRegistry.handleNodeOperatorTotalStoppedValidatorsReported - Start`);
                const { id, totalStopped } = nodeOperatorEvents.NodeOperatorTotalStoppedValidatorsReported.decode(e);
                await handleNodeOperatorTotalStoppedValidatorsReported(id, totalStopped, e, entityCache);
                console.log(`NodeOperatorRegistry.handleNodeOperatorTotalStoppedValidatorsReported - End`);
            }

            // Voting.handleStartVote
            else if (e.address.toLowerCase() === LIDO_VOTING_ADDRESS && e.topics[0] === votingEvents.StartVote.topic) {
                const { voteId, creator, metadata } = votingEvents.StartVote.decode(e);
                await handleStartVote(voteId, creator.toLowerCase(), metadata, e, entityCache);
            }

            // Voting.handleCastVote
            else if (e.address.toLowerCase() === LIDO_VOTING_ADDRESS && e.topics[0] === votingEvents.CastVote.topic) {
                const { voteId, voter, supports, stake } = votingEvents.CastVote.decode(e);
                await handleCastVote(voteId, voter.toLowerCase(), supports, stake, e, entityCache);
            }

            // Voting.handleCastObjection
            else if (e.address.toLowerCase() === LIDO_VOTING_ADDRESS && e.topics[0] === votingEvents.CastObjection.topic) {
                const { voteId, voter, stake } = votingEvents.CastObjection.decode(e);
                await handleCastObjection(voteId, voter.toLowerCase(), stake, e, entityCache);
            }

            // Voting.handleExecuteVote
            else if (e.address.toLowerCase() === LIDO_VOTING_ADDRESS && e.topics[0] === votingEvents.ExecuteVote.topic) {
                const { voteId } = votingEvents.ExecuteVote.decode(e);
                await handleExecuteVote(voteId, e, entityCache);
            }

            // Voting.handleChangeSupportRequired
            else if (e.address.toLowerCase() === LIDO_VOTING_ADDRESS && e.topics[0] === votingEvents.ChangeSupportRequired.topic) {
                console.log(`Voting.handleChangeSupportRequired - Start`);
                const { supportRequiredPct } = votingEvents.ChangeSupportRequired.decode(e);
                await handleChangeSupportRequired(supportRequiredPct, e, entityCache);
                console.log(`Voting.handleChangeSupportRequired - End`);
            }

            // Voting.handleChangeMinQuorum
            else if (e.address.toLowerCase() === LIDO_VOTING_ADDRESS && e.topics[0] === votingEvents.ChangeMinQuorum.topic) {
                console.log(`Voting.handleChangeMinQuorum - Start`);
                const { minAcceptQuorumPct } = votingEvents.ChangeMinQuorum.decode(e);
                await handleChangeMinQuorum(minAcceptQuorumPct, e, entityCache);
                console.log(`Voting.handleChangeMinQuorum - End`);
            }

            // Voting.handleChangeVoteTime
            else if (e.address.toLowerCase() === LIDO_VOTING_ADDRESS && e.topics[0] === votingEvents.ChangeVoteTime.topic) {
                console.log(`Voting.handleChangeVoteTime - Start`);
                const { voteTime } = votingEvents.ChangeVoteTime.decode(e);
                await handleChangeVoteTime(voteTime, e, entityCache);
                console.log(`Voting.handleChangeVoteTime - End`);
            }

            // Voting.handleChangeObjectionPhaseTime
            else if (e.address.toLowerCase() === LIDO_VOTING_ADDRESS && e.topics[0] === votingEvents.ChangeObjectionPhaseTime.topic) {
                const { objectionPhaseTime } = votingEvents.ChangeObjectionPhaseTime.decode(e);
                await handleChangeObjectionPhaseTime(objectionPhaseTime, e, entityCache);
            }

            // StakingRouter.handleWithdrawalCredentialsSet
            else if (e.address.toLowerCase() === LIDO_STAKING_ROUTER_ADDRESS && e.topics[0] === stakingRouterEvents.WithdrawalCredentialsSet.topic) {
                console.log(`StakingRouter.handleWithdrawalCredentialsSet - Start`);
                const { withdrawalCredentials, setBy } = stakingRouterEvents.WithdrawalCredentialsSet.decode(e);
                await handleWithdrawalCredentialsSetStakingRouter(withdrawalCredentials, setBy.toLowerCase(), e, entityCache);
                console.log(`StakingRouter.handleWithdrawalCredentialsSet - End`);
            }

            // AccountingOracle.handleProcessingStarted
            else if (e.address.toLowerCase() === LIDO_ACCOUNTING_ORACLE_ADDRESS && e.topics[0] === accountingOracleEvents.ProcessingStarted.topic) {
                const { refSlot, hash } = accountingOracleEvents.ProcessingStarted.decode(e);
                await handleProcessingStarted(refSlot, hash, e, entityCache);
            }

            // AccountingOracle.handleExtraDataSubmitted
            else if (e.address.toLowerCase() === LIDO_ACCOUNTING_ORACLE_ADDRESS && e.topics[0] === accountingOracleEvents.ExtraDataSubmitted.topic) {
                const { refSlot, itemsProcessed, itemsCount } = accountingOracleEvents.ExtraDataSubmitted.decode(e);
                await handleExtraDataSubmitted(refSlot, itemsProcessed, itemsCount, ctx, e, entityCache);
            }

            // WithdrawalQueue.handleBunkerModeDisabled
            else if (e.address.toLowerCase() === LIDO_WITHDRAWAL_QUEUE_ADDRESS && e.topics[0] === withdrawalQueueEvents.BunkerModeDisabled.topic) {
                console.log(`WithdrawalQueue.handleBunkerModeDisabled - Start`);
                await handleBunkerModeDisabled(e, entityCache);
                console.log(`WithdrawalQueue.handleBunkerModeDisabled - End`);
            }

            // WithdrawalQueue.handleBunkerModeEnabled
            else if (e.address.toLowerCase() === LIDO_WITHDRAWAL_QUEUE_ADDRESS && e.topics[0] === withdrawalQueueEvents.BunkerModeEnabled.topic) {
                console.log(`WithdrawalQueue.handleBunkerModeEnabled - Start`);
                const { _sinceTimestamp } = withdrawalQueueEvents.BunkerModeEnabled.decode(e);
                await handleBunkerModeEnabled(_sinceTimestamp, e, entityCache);
                console.log(`WithdrawalQueue.handleBunkerModeEnabled - End`);
            }

            // WithdrawalQueue.handleContractVersionSet
            else if (e.address.toLowerCase() === LIDO_WITHDRAWAL_QUEUE_ADDRESS && e.topics[0] === withdrawalQueueEvents.ContractVersionSet.topic) {
                console.log(`WithdrawalQueue.handleContractVersionSet - Start`);
                const { version } = withdrawalQueueEvents.ContractVersionSet.decode(e);
                await handleContractVersionSetWithdrawalQueue(version, e, entityCache);
                console.log(`WithdrawalQueue.handleContractVersionSet - End`);
            }

            // WithdrawalQueue.handlePaused
            else if (e.address.toLowerCase() === LIDO_WITHDRAWAL_QUEUE_ADDRESS && e.topics[0] === withdrawalQueueEvents.Paused.topic) {
                console.log(`WithdrawalQueue.handlePaused - Start`);
                const { duration } = withdrawalQueueEvents.Paused.decode(e);
                await handlePausedWithdrawalQueue(duration, e, entityCache);
                console.log(`WithdrawalQueue.handlePaused - End`);
            }

            // WithdrawalQueue.handleResumed
            else if (e.address.toLowerCase() === LIDO_WITHDRAWAL_QUEUE_ADDRESS && e.topics[0] === withdrawalQueueEvents.Resumed.topic) {
                console.log(`WithdrawalQueue.handleResumed - Start`);
                await handleResumedWithdrawalQueue(e, entityCache);
                console.log(`WithdrawalQueue.handleResumed - End`);
            }

            // WithdrawalQueue.handleWithdrawalClaimed
            else if (e.address.toLowerCase() === LIDO_WITHDRAWAL_QUEUE_ADDRESS && e.topics[0] === withdrawalQueueEvents.WithdrawalClaimed.topic) {
                const { requestId, owner, receiver, amountOfETH  } = withdrawalQueueEvents.WithdrawalClaimed.decode(e);
                await handleWithdrawalClaimed(requestId, owner.toLowerCase(), receiver.toLowerCase(), amountOfETH, e, entityCache);
            }

            // WithdrawalQueue.handleWithdrawalRequested
            else if (e.address.toLowerCase() === LIDO_WITHDRAWAL_QUEUE_ADDRESS && e.topics[0] === withdrawalQueueEvents.WithdrawalRequested.topic) {
                const { requestId, requestor, owner, amountOfStETH, amountOfShares  } = withdrawalQueueEvents.WithdrawalRequested.decode(e);
                await handleWithdrawalRequested(requestId, requestor.toLowerCase(), owner.toLowerCase(), amountOfStETH, amountOfShares, e, entityCache);
            }

            // WithdrawalQueue.handleWithdrawalsFinalized
            else if (e.address.toLowerCase() === LIDO_WITHDRAWAL_QUEUE_ADDRESS && e.topics[0] === withdrawalQueueEvents.WithdrawalsFinalized.topic) {
                const { from, to, amountOfETHLocked, sharesToBurn, timestamp  } = withdrawalQueueEvents.WithdrawalsFinalized.decode(e);
                await handleWithdrawalsFinalized(from, to, amountOfETHLocked, sharesToBurn, timestamp, e, entityCache);
            }

            // WithdrawalQueue.handleWithdrawalBatchFinalized
            else if (e.address.toLowerCase() === LIDO_WITHDRAWAL_QUEUE_ADDRESS && e.topics[0] === withdrawalQueueEvents.WithdrawalBatchFinalized.topic) {
                console.log(`WithdrawalQueue.handleWithdrawalBatchFinalized - Start`);
                const { from, to, amountOfETHLocked, sharesToBurn, timestamp  } = withdrawalQueueEvents.WithdrawalBatchFinalized.decode(e);
                await handleWithdrawalsFinalized(from, to, amountOfETHLocked, sharesToBurn, timestamp, e, entityCache);
                console.log(`WithdrawalQueue.handleWithdrawalBatchFinalized - End`);
            }

            // HashConsensus.handleFrameConfigSet
            else if (e.address.toLowerCase() === LIDO_HASH_CONSENSUS_ADDRESS && e.topics[0] === hashConsensusEvents.FrameConfigSet.topic) {
                console.log(`HashConsensus.handleFrameConfigSet - Start`);
                const { newInitialEpoch, newEpochsPerFrame  } = hashConsensusEvents.FrameConfigSet.decode(e);
                await handleFrameConfigSet(newInitialEpoch, newEpochsPerFrame, ctx, e, entityCache);
                console.log(`HashConsensus.handleFrameConfigSet - End`);
            }

        }
    }


    await entityCache.persistCacheToDatabase(false);
});
