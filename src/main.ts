import {TypeormDatabase} from '@subsquid/typeorm-store'
import {processor} from './processor'
import {LEGACY_ORACLE_ADDRESS, LIDO_ADDRESS, LIDO_DAO_ADDRESS} from "./constants";

import {events as lidoDAOEvents} from './abi/LidoDAO';
import {events as lidoEvents} from './abi/Lido';

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
import {handleCompleted} from "./handlers/LegacyOracle";

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
                console.log(`Lido.handleStakingLimitSet - Start`);
                const { maxStakeLimit, stakeLimitIncreasePerBlock } = lidoEvents.StakingLimitSet.decode(e);
                await handleStakingLimitSet(maxStakeLimit, stakeLimitIncreasePerBlock, e, entityCache);
                console.log(`Lido.handleStakingLimitSet - End`);
            }

            // Lido.handleStakingResumed
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.StakingResumed.topic) {
                console.log(`Lido.handleStakingResumed - Start`);
                await handleStakingResumed(e, entityCache);
                console.log(`Lido.handleStakingResumed - End`);
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
                console.log(`Lido.handleELRewardsWithdrawalLimitSet - Start`);
                const { limitPoints } = lidoEvents.ELRewardsWithdrawalLimitSet.decode(e);
                await handleELRewardsWithdrawalLimitSet(limitPoints, e, entityCache);
                console.log(`Lido.handleELRewardsWithdrawalLimitSet - End`);
            }

            // Lido.handleELRewardsVaultSet
            else if (e.address.toLowerCase() === LIDO_ADDRESS && e.topics[0] === lidoEvents.ELRewardsVaultSet.topic) {
                console.log(`Lido.handleELRewardsVaultSet - Start`);
                const { executionLayerRewardsVault } = lidoEvents.ELRewardsVaultSet.decode(e);
                await handleELRewardsVaultSet(executionLayerRewardsVault.toLowerCase(), e, entityCache);
                console.log(`Lido.handleELRewardsVaultSet - End`);
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

        }
    }


    await entityCache.persistCacheToDatabase(false);
});
