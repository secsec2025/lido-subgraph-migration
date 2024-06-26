import {LogEvent} from './abi/abi.support';
import {events as AccountingOracle} from './abi/AccountingOracle';
import {events as EasyTrack} from './abi/EasyTrack';
import {events as HashConsensus} from './abi/HashConsensus';
import {events as LegacyOracle} from './abi/LegacyOracle';
import {events as Lido} from './abi/Lido';
import {events as LidoDAO} from './abi/LidoDAO';
import {events as NodeOperatorsRegistry} from './abi/NodeOperatorsRegistry';
import {events as StakingRouter} from './abi/StakingRouter';
import {events as Voting} from './abi/Voting';
import {events as WithdrawalQueue} from './abi/WithdrawalQueue';

type EventLogWithName = {
    log: LogEvent<any>,
    name: string
}

export const parserMap = new Map<string, EventLogWithName>();

parserMap.set('0x25421480fb7f52d18947876279a213696b58d7e0e5416ce5e2c9f9942661c34c', { log: AccountingOracle.ConsensusHashContractSet, name: 'ConsensusHashContractSet'});
parserMap.set('0xfa5304972d4ec3e3207f0bbf91155a49d0dfa62488f9529403a2a49e4b29a895', { log: AccountingOracle.ConsensusVersionSet, name: 'ConsensusVersionSet'});
parserMap.set('0xfddcded6b4f4730c226821172046b48372d3cd963c159701ae1b7c3bcac541bb', { log: AccountingOracle.ContractVersionSet, name: 'ContractVersionSet'});
parserMap.set('0x6d8abc91d336688c551c9bae92a74fa116852ac20bb9b2df4c12bd2fcf1cd46a', { log: AccountingOracle.ExtraDataSubmitted, name: 'ExtraDataSubmitted'});
parserMap.set('0xf73febded7d4502284718948a3e1d75406151c6326bde069424a584a4f6af87a', { log: AccountingOracle.ProcessingStarted, name: 'ProcessingStarted'});
parserMap.set('0xaed7d1a7a1831158dcda1e4214f5862f450bd3eb5721a5f322bf8c9fe1790b0a', { log: AccountingOracle.ReportSubmitted, name: 'ReportSubmitted'});
parserMap.set('0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff', { log: AccountingOracle.RoleAdminChanged, name: 'RoleAdminChanged'});
parserMap.set('0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d', { log: AccountingOracle.RoleGranted, name: 'RoleGranted'});
parserMap.set('0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b', { log: AccountingOracle.RoleRevoked, name: 'RoleRevoked'});
parserMap.set('0x801a93267f699b033e11b662b16b36c41b6f9a59a5b5ad967d4cb84232e523c2', { log: AccountingOracle.WarnExtraDataIncompleteProcessing, name: 'WarnExtraDataIncompleteProcessing'});
parserMap.set('0x800b849c8bf80718cf786c99d1091c079fe2c5e420a3ba7ba9b0ef8179ef2c38', { log: AccountingOracle.WarnProcessingMissed, name: 'WarnProcessingMissed'});
parserMap.set('0x5ed6ba59d23ef79b1a31c9f04da9f879ef6cdb89ad0241716ebdc1f02f5f465a', { log: EasyTrack.EVMScriptExecutorChanged, name: 'EVMScriptExecutorChanged'});
parserMap.set('0xa95e7ae5870d8fc3c3f7b7a378c9c4f469e724c240ee45fbab61758fe7eb9817', { log: EasyTrack.EVMScriptFactoryAdded, name: 'EVMScriptFactoryAdded'});
parserMap.set('0x158e73cc156a7591e8e04fa6cdfc13d89de9e19fdc692bf0502e2a622c08a12a', { log: EasyTrack.EVMScriptFactoryRemoved, name: 'EVMScriptFactoryRemoved'});
parserMap.set('0x801fcb98a9fa2e695209772f0a24f3f7ac36f6568659ae2e0cd7763fb73f2862', { log: EasyTrack.MotionCanceled, name: 'MotionCanceled'});
parserMap.set('0x2775db1f1f2dd97c60ba2903b3ca235c9cecb3cb47a9cb464f86578b9877f4a4', { log: EasyTrack.MotionCreated, name: 'MotionCreated'});
parserMap.set('0x03765c4aa18fde3bfe4015073c2b138ce5a02536dd88ceae9739d3e0dbad5d0e', { log: EasyTrack.MotionDurationChanged, name: 'MotionDurationChanged'});
parserMap.set('0xd4fbbd7bf63590ce72807eb770b83aaf2f3a7958a4b2093fd9ab89b276096942', { log: EasyTrack.MotionEnacted, name: 'MotionEnacted'});
parserMap.set('0xa64d606df8b3e72e8f53ac4185170bbd4348d0ee03c2cfceadeafc2b316c3e6b', { log: EasyTrack.MotionObjected, name: 'MotionObjected'});
parserMap.set('0x6a4120e111f0bfb3586b7dc9317f9ae5441ce866d1ad9d221ce6d76431f84426', { log: EasyTrack.MotionRejected, name: 'MotionRejected'});
parserMap.set('0x5e368703b7ab35fe9ef4dbc482cd414476841204c7484b8e834d0d3ac4ed8672', { log: EasyTrack.MotionsCountLimitChanged, name: 'MotionsCountLimitChanged'});
parserMap.set('0xd60715ce58337415334d06256811f30ed8db120287970870d8505e5ed9074c60', { log: EasyTrack.ObjectionsThresholdChanged, name: 'ObjectionsThresholdChanged'});
parserMap.set('0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258', { log: EasyTrack.Paused, name: 'Paused'});
parserMap.set('0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa', { log: EasyTrack.Unpaused, name: 'Unpaused'});
parserMap.set('0xde3f4ea5aa67881831e8fad2b0855d47e75aa63a2fae6ef657ffd5f856c4a613', { log: HashConsensus.ConsensusLost, name: 'ConsensusLost'});
parserMap.set('0x2b6bc782c916fa763822f1e50c6db0f95dade36d6541a8a4cbe070735b8b226d', { log: HashConsensus.ConsensusReached, name: 'ConsensusReached'});
parserMap.set('0xab8b22776606cc75c47792d32af7e63ed9ca74e85c9780a7fc7994fdbd6fde2b', { log: HashConsensus.FastLaneConfigSet, name: 'FastLaneConfigSet'});
parserMap.set('0xe343afa5219eaf28c50ce9cd658acd69cbe28b34fa773eb3a523e28007f64afc', { log: HashConsensus.FrameConfigSet, name: 'FrameConfigSet'});
parserMap.set('0xe17e0e2cd88e2144dd54f3d823c30d4569092bcac1aabaec1129883e9cc12d2e', { log: HashConsensus.MemberAdded, name: 'MemberAdded'});
parserMap.set('0xa182730913550d27dc6c5813fad297cb0785871bec3d0152c5650e59c5d39d60', { log: HashConsensus.MemberRemoved, name: 'MemberRemoved'});
parserMap.set('0x9f40cfd22fe91777c78f252bd21a710f3fb007dc2f321876891e7644ba0ae175', { log: HashConsensus.QuorumSet, name: 'QuorumSet'});
parserMap.set('0x3b59429457a41af89ea682ac9ed8abb8e99eb5c7d3363d5eedfc6bff6271a81e', { log: HashConsensus.ReportProcessorSet, name: 'ReportProcessorSet'});
parserMap.set('0x92f77576dabd7bad26f75c36abb3021b5bbb66a3e5688570a0355daddd417488', { log: HashConsensus.ReportReceived, name: 'ReportReceived'});
parserMap.set('0x5229a5dba83a54ae8cb5b51bdd6de9474cacbe9dd332f5185f3a4f4f2e3f4ad9', { log: LegacyOracle.ScriptResult, name: 'ScriptResult'});
parserMap.set('0x596caf56044b55fb8c4ca640089bbc2b63cae3e978b851f5745cbb7c5b288e02', { log: LegacyOracle.RecoverToVault, name: 'RecoverToVault'});
parserMap.set('0x15befe448b41dd28cf3e1b9db42dbb489e7bd480093345e3dbb132ab2993b537', { log: LegacyOracle.AllowedBeaconBalanceAnnualRelativeIncreaseSet, name: 'AllowedBeaconBalanceAnnualRelativeIncreaseSet'});
parserMap.set('0x0116349092cceaec6172fcd61b2b801a45663783c9dca24919105b66a62da84a', { log: LegacyOracle.AllowedBeaconBalanceRelativeDecreaseSet, name: 'AllowedBeaconBalanceRelativeDecreaseSet'});
parserMap.set('0x10bdb8bba3913c9e1b7ffbf8759dfcf1c355d9796d58906b147ff0b4c3e31448', { log: LegacyOracle.BeaconReportReceiverSet, name: 'BeaconReportReceiverSet'});
parserMap.set('0xb251eb052afc73ffd02ffe85ad79990a8b3fed60d76dbc2fa2fdd7123dffd914', { log: LegacyOracle.MemberAdded, name: 'MemberAdded'});
parserMap.set('0x6e76fb4c77256006d9c38ec7d82b45a8c8f3c27b1d6766fffc42dfb8de684492', { log: LegacyOracle.MemberRemoved, name: 'MemberRemoved'});
parserMap.set('0x027863d12a407097e086a48e36475bfc859d0b200b7e6f65b5fd3b218e46632e', { log: LegacyOracle.QuorumChanged, name: 'QuorumChanged'});
parserMap.set('0xcdcd275f4d96ed683d684f3610a92beacdebcf1ee4d37e2df526fb9001e1ea63', { log: LegacyOracle.ExpectedEpochIdUpdated, name: 'ExpectedEpochIdUpdated'});
parserMap.set('0xa15de8f88515e04da45ad2303c04e9f126945fd99e173d3d93ff6351e1f335ee', { log: LegacyOracle.BeaconSpecSet, name: 'BeaconSpecSet'});
parserMap.set('0x23285eb039d2d2881abbf7503a6d39ac5d3113701031b3e69abcb1d2cc24266f', { log: LegacyOracle.BeaconReported, name: 'BeaconReported'});
parserMap.set('0x95423529aa0b2867e02676b0bb4766cde576fb31ea77056f683bc236c7c15f9d', { log: LegacyOracle.Completed, name: 'Completed'});
parserMap.set('0xdafd48d1eba2a416b2aca45e9ead3ad18b84e868fa6d2e1a3048bfd37ed10a32', { log: LegacyOracle.PostTotalShares, name: 'PostTotalShares'});
parserMap.set('0xedbcb4ca306d81687f1437e9dccd289dd7c938599cd3bcff6e1ae9bdd1d6b334', { log: Lido.BeaconValidatorsUpdated, name: 'BeaconValidatorsUpdated'});
parserMap.set('0xe38dbc656b8029e533ec787bb92c50c2aea2fe488332519e1b0abdad046dafa5', { log: Lido.MevTxFeeReceived, name: 'MevTxFeeReceived'});
parserMap.set('0x9d9c909296d9c674451c0c24f02cb64981eb3b727f99865939192f880a755dcb', { log: Lido.TransferShares, name: 'TransferShares'});
parserMap.set('0x8b2a1e1ad5e0578c3dd82494156e985dade827a87c573b5c1c7716a32162ad64', { log: Lido.SharesBurnt, name: 'SharesBurnt'});
parserMap.set('0x7acc84e34091ae817647a4c49116f5cc07f319078ba80f8f5fde37ea7e25cbd6', { log: Lido.Stopped, name: 'Stopped'});
parserMap.set('0x62451d457bc659158be6e6247f56ec1df424a5c7597f71c20c2bc44e0965c8f9', { log: Lido.Resumed, name: 'Resumed'});
parserMap.set('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', { log: Lido.Transfer, name: 'Transfer'});
parserMap.set('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', { log: Lido.Approval, name: 'Approval'});
parserMap.set('0x26d1807b479eaba249c1214b82e4b65bbb0cc73ee8a17901324b1ef1b5904e49', { log: Lido.StakingPaused, name: 'StakingPaused'});
parserMap.set('0xedaeeae9aed70c4545d3ab0065713261c9cee8d6cf5c8b07f52f0a65fd91efda', { log: Lido.StakingResumed, name: 'StakingResumed'});
parserMap.set('0xce9fddf6179affa1ea7bf36d80a6bf0284e0f3b91f4b2fa6eea2af923e7fac2d', { log: Lido.StakingLimitSet, name: 'StakingLimitSet'});
parserMap.set('0x9b2a687c198898fcc32a33bbc610d478f177a73ab7352023e6cc1de5bf12a3df', { log: Lido.StakingLimitRemoved, name: 'StakingLimitRemoved'});
parserMap.set('0x7df55cbe17c0cf85c9c23753c046f686eeb4c6b2ce13182943d215e92afc565a', { log: Lido.ProtocolContactsSet, name: 'ProtocolContactsSet'});
parserMap.set('0xaab062e3faf62b6c9a0f8e62af66e0310e27127a8c871a67be7dd4d93de6da53', { log: Lido.FeeSet, name: 'FeeSet'});
parserMap.set('0x034529db1bba3830b8877e116871f19c5b96ef86c739f2a05668c860c8466898', { log: Lido.FeeDistributionSet, name: 'FeeDistributionSet'});
parserMap.set('0xd27f9b0c98bdee27044afa149eadcd2047d6399cb6613a45c5b87e6aca76e6b5', { log: Lido.ELRewardsReceived, name: 'ELRewardsReceived'});
parserMap.set('0x166eb213129ab51688433b859b5a206403ee174774a1430f8ffb83af316161f6', { log: Lido.ELRewardsWithdrawalLimitSet, name: 'ELRewardsWithdrawalLimitSet'});
parserMap.set('0x13eb80e900aa05a2696d50d5de33ef631c73493c4921da233b17335ff6b7b114', { log: Lido.WithdrawalCredentialsSet, name: 'WithdrawalCredentialsSet'});
parserMap.set('0x8e2d01c4cfaa88fa4d772d37e4d068deda4342bf4ef6dc4b0cf3e868be5ebb40', { log: Lido.ELRewardsVaultSet, name: 'ELRewardsVaultSet'});
parserMap.set('0x96a25c8ce0baabc1fdefd93e9ed25d8e092a3332f3aa9a41722b5697231d1d1a', { log: Lido.Submitted, name: 'Submitted'});
parserMap.set('0x76a397bea5768d4fca97ef47792796e35f98dc81b16c1de84e28a818e1f97108', { log: Lido.Unbuffered, name: 'Unbuffered'});
parserMap.set('0xcf8f72073b13b07fe51690fd7c43414d1a0ef6f21c9896ba1814a08be9bdab3a', { log: Lido.Withdrawal, name: 'Withdrawal'});
parserMap.set('0x92dd3cb149a1eebd51fd8c2a3653fd96f30c4ac01d4f850fc16d46abd6c3e92f', { log: Lido.ETHDistributed, name: 'ETHDistributed'});
parserMap.set('0xff08c3ef606d198e316ef5b822193c489965899eb4e3c248cea1a4626c3eda50', { log: Lido.TokenRebased, name: 'TokenRebased'});
parserMap.set('0x6e5086f7e1ab04bd826e77faae35b1bcfe31bd144623361a40ea4af51670b1c3', { log: Lido.WithdrawalsReceived, name: 'WithdrawalsReceived'});
parserMap.set('0x1252331d4f3ee8a9f0a3484c4c2fb059c70a047b5dc5482a3ee6415f742d9f2e', { log: Lido.CLValidatorsUpdated, name: 'CLValidatorsUpdated'});
parserMap.set('0x61f9416d3c29deb4e424342445a2b132738430becd9fa275e11297c90668b22e', { log: Lido.LidoLocatorSet, name: 'LidoLocatorSet'});
parserMap.set('0xd880e726dced8808d727f02dd0e6fdd3a945b24bfee77e13367bcbe61ddbaf47', { log: LidoDAO.NewAppProxy, name: 'NewAppProxy'});
parserMap.set('0x2ec1ae0a449b7ae354b9dacfb3ade6b6332ba26b7fcbb935835fa39dd7263b23', { log: LidoDAO.SetApp, name: 'SetApp'});
parserMap.set('0xc52ec0ad7872dae440d886040390c13677df7bf3cca136d8d81e5e5e7dd62ff1', { log: NodeOperatorsRegistry.NodeOperatorAdded, name: 'NodeOperatorAdded'});
parserMap.set('0xecdf08e8a6c4493efb460f6abc7d14532074fa339c3a6410623a1d3ee0fb2cac', { log: NodeOperatorsRegistry.NodeOperatorActiveSet, name: 'NodeOperatorActiveSet'});
parserMap.set('0xcb16868f4831cc58a28d413f658752a2958bd1f50e94ed6391716b936c48093b', { log: NodeOperatorsRegistry.NodeOperatorNameSet, name: 'NodeOperatorNameSet'});
parserMap.set('0x9a52205165d510fc1e428886d52108725dc01ed544da1702dc7bd3fdb3f243b2', { log: NodeOperatorsRegistry.NodeOperatorRewardAddressSet, name: 'NodeOperatorRewardAddressSet'});
parserMap.set('0x59d11713a8801e3ba782d59e757fbcef75ca2ecabce8ccd06a0827941230b9f2', { log: NodeOperatorsRegistry.NodeOperatorStakingLimitSet, name: 'NodeOperatorStakingLimitSet'});
parserMap.set('0xe6452c223b953d8ab5cb26c014095615322891268537911ba6fe1c939689703d', { log: NodeOperatorsRegistry.NodeOperatorTotalStoppedValidatorsReported, name: 'NodeOperatorTotalStoppedValidatorsReported'});
parserMap.set('0x9824694569ba758f8872bb150515caaf8f1e2cc27e6805679c4ac8c3b9b83d87', { log: NodeOperatorsRegistry.NodeOperatorTotalKeysTrimmed, name: 'NodeOperatorTotalKeysTrimmed'});
parserMap.set('0xc77a17d6b857abe6d6e6c37301621bc72c4dd52fa8830fb54dfa715c04911a89', { log: NodeOperatorsRegistry.SigningKeyAdded, name: 'SigningKeyAdded'});
parserMap.set('0xea4b75aaf57196f73d338cadf79ecd0a437902e2dd0d2c4c2cf3ea71b8ab27b9', { log: NodeOperatorsRegistry.SigningKeyRemoved, name: 'SigningKeyRemoved'});
parserMap.set('0xfb992daec9d46d64898e3a9336d02811349df6cbea8b95d4deb2fa6c7b454f0d', { log: NodeOperatorsRegistry.KeysOpIndexSet, name: 'KeysOpIndexSet'});
parserMap.set('0xe74bf895f0c3a2d6c74c40cbb362fdd9640035fc4226c72e3843809ad2a9d2b5', { log: StakingRouter.ExitedAndStuckValidatorsCountsUpdateFailed, name: 'ExitedAndStuckValidatorsCountsUpdateFailed'});
parserMap.set('0xf74208fedac7280fd11f8de0be14e00423dc5076da8e8ec8ca90e09257fff1b3', { log: StakingRouter.RewardsMintedReportFailed, name: 'RewardsMintedReportFailed'});
parserMap.set('0x43b5213f0e1666cd0b8692a73686164c94deb955a59c65e10dee8bb958e7ce3e', { log: StakingRouter.StakingModuleAdded, name: 'StakingModuleAdded'});
parserMap.set('0xdd2523ca96a639ba7e17420698937f71eddd8af012ccb36ff5c8fe96141acae9', { log: StakingRouter.StakingModuleExitedValidatorsIncompleteReporting, name: 'StakingModuleExitedValidatorsIncompleteReporting'});
parserMap.set('0x303c8ac43d1b1f9b898ddd2915a294efa01e9b07c322d7deeb7db332b66f0410', { log: StakingRouter.StakingModuleFeesSet, name: 'StakingModuleFeesSet'});
parserMap.set('0xfd6f15fb2b48a21a60fe3d44d3c3a0433ca01e121b5124a63ec45c30ad925a17', { log: StakingRouter.StakingModuleStatusSet, name: 'StakingModuleStatusSet'});
parserMap.set('0x065e5bd8e4145dd99cf69bad5871ad52d094aee07a67fcf2f418c89e49d5f20c', { log: StakingRouter.StakingModuleTargetShareSet, name: 'StakingModuleTargetShareSet'});
parserMap.set('0x9151b7f88aca05d432bb395647ef52b2ffc454e3c6afb69c95345af6b5a778c0', { log: StakingRouter.StakingRouterETHDeposited, name: 'StakingRouterETHDeposited'});
parserMap.set('0x82e72df77173eab89b00556d791a407a78f4605c5c2f0694967c8c429dd43c7c', { log: StakingRouter.WithdrawalCredentialsSet, name: 'WithdrawalCredentialsSet'});
parserMap.set('0x0d64b11929aa111ca874dd00b5b0cc2d82b741be924ec9e3691e67c71552f623', { log: StakingRouter.WithdrawalsCredentialsChangeFailed, name: 'WithdrawalsCredentialsChangeFailed'});
parserMap.set('0x4d72fe0577a3a3f7da968d7b892779dde102519c25527b29cf7054f245c791b9', { log: Voting.StartVote, name: 'StartVote'});
parserMap.set('0xb34ee265e3d4f5ec4e8b52d59b2a9be8fceca2f274ebc080d8fba797fea9391f', { log: Voting.CastVote, name: 'CastVote'});
parserMap.set('0xfa539989fcfb5d8fa8c97a1102d1777a34c3543f0725fb8ab66109619bb9de18', { log: Voting.CastObjection, name: 'CastObjection'});
parserMap.set('0xbf8e2b108bb7c980e08903a8a46527699d5e84905a082d56dacb4150725c8cab', { log: Voting.ExecuteVote, name: 'ExecuteVote'});
parserMap.set('0x903b617f7f36eb047a29b89d1bf7885fdae31d250c3320fccf11d045c11b396e', { log: Voting.ChangeSupportRequired, name: 'ChangeSupportRequired'});
parserMap.set('0x3172f2e9273c729c2a47cc8bf7e7f18506e3e3035126d562602bd2155bc78a50', { log: Voting.ChangeMinQuorum, name: 'ChangeMinQuorum'});
parserMap.set('0x776dcd10c15e7a1bd4fbb6c824d2a80fa8a40a3a6b401fddc678696b7fb06abe', { log: Voting.ChangeVoteTime, name: 'ChangeVoteTime'});
parserMap.set('0xf2eb32f215d9f6d0f4ace97038141d2574af9f8c3bb509239254ace3d9c27000', { log: Voting.ChangeObjectionPhaseTime, name: 'ChangeObjectionPhaseTime'});
parserMap.set('0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31', { log: WithdrawalQueue.ApprovalForAll, name: 'ApprovalForAll'});
parserMap.set('0xf9c7803e94e0d3c02900d8a90893a6d5e90dd04d32a4cfe825520f82bf9f32f6', { log: WithdrawalQueue.BaseURISet, name: 'BaseURISet'});
parserMap.set('0xd1f8a2998c0caf73e09434aa93d273a599060d789407c6f70ccd4c9c9f32c8f4', { log: WithdrawalQueue.BunkerModeDisabled, name: 'BunkerModeDisabled'});
parserMap.set('0x47f03b07e5b5377f871539bb2942f5ecb72733be9fc9d55a17b6d6a05d418345', { log: WithdrawalQueue.BunkerModeEnabled, name: 'BunkerModeEnabled'});
parserMap.set('0x20b34d2aaaf6acb4fbbc9c4846858bb824053ab11ff44a59dfba1e22ceb8a509', { log: WithdrawalQueue.InitializedV1, name: 'InitializedV1'});
parserMap.set('0x4ec04ac71c49eea0a94dc5967b493412a8cdb2934b367713019d3b110e9f0ba8', { log: WithdrawalQueue.NftDescriptorAddressSet, name: 'NftDescriptorAddressSet'});
parserMap.set('0x32fb7c9891bc4f963c7de9f1186d2a7755c7d6e9f4604dabe1d8bb3027c2f49e', { log: WithdrawalQueue.Paused, name: 'Paused'});
parserMap.set('0x6ad26c5e238e7d002799f9a5db07e81ef14e37386ae03496d7a7ef04713e145b', { log: WithdrawalQueue.WithdrawalClaimed, name: 'WithdrawalClaimed'});
parserMap.set('0xf0cb471f23fb74ea44b8252eb1881a2dca546288d9f6e90d1a0e82fe0ed342ab', { log: WithdrawalQueue.WithdrawalRequested, name: 'WithdrawalRequested'});
parserMap.set('0x197874c72af6a06fb0aa4fab45fd39c7cb61ac0992159872dc3295207da7e9eb', { log: WithdrawalQueue.WithdrawalsFinalized, name: 'WithdrawalsFinalized'});
parserMap.set('0x8d97cd404e2016c2c0a59a6495697a8bd352f4072c7fbd8e3ab4200402a86930', { log: WithdrawalQueue.WithdrawalBatchFinalized, name: 'WithdrawalBatchFinalized'});
