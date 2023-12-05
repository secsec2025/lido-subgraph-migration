# Sample Queries

## Latest 10 Lido Transfers
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    lidoTransfers(first: 10,
        orderBy: block, orderDirection: desc) {
        id
        transactionHash
        from
        to
        shares
        block
        sharesBeforeDecrease
        sharesAfterDecrease
        sharesBeforeIncrease
        sharesAfterIncrease
        totalPooledEther
        totalShares
    }
}
```

### Squid Query

```graphql
query MyQ {
    lidoTransfers(orderBy: block_DESC, limit: 10) {
        id
        transactionHash
        from
        to
        shares
        block
        sharesBeforeDecrease
        sharesAfterDecrease
        sharesBeforeIncrease
        sharesAfterIncrease
        totalPooledEther
        totalShares
    }
}
```

## Latest 10 Lido Submissions
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    lidoSubmissions(first: 10, orderBy: block,
        orderDirection: desc) {
        id
        sender
        amount
        shares
        sharesBefore
        sharesAfter
        totalPooledEtherBefore
        totalPooledEtherAfter
        totalSharesBefore
        totalSharesAfter
        balanceAfter
        block
        transactionHash
    }
}
```

### Squid Query

```graphql
query MyQ {
    lidoSubmissions(limit: 10,
        orderBy: block_DESC) {
        id
        sender
        amount
        shares
        sharesBefore
        sharesAfter
        totalPooledEtherBefore
        totalPooledEtherAfter
        totalSharesBefore
        totalSharesAfter
        balanceAfter
        block
        transactionHash
    }
}
```


## Check App Versions
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    appVersions {
        id
        major
        minor
        patch
        impl
        block
        transactionHash
    }
}
```

### Squid Query

```graphql
query MyQ {
    appVersions {
        id
        major
        minor
        patch
        impl
        block
        transactionHash
    }
}
```

## Latest 5 Beacon Reports
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    beaconReports(first: 5,
        orderBy: epochId, orderDirection: desc) {
        id
        epochId
        beaconBalance
        beaconValidators
        caller
    }
}
```

### Squid Query

```graphql
query MyQ {
    beaconReports(limit: 5, orderBy: epochId_DESC) {
        id
        epochId
        beaconBalance
        beaconValidators
        caller
    }
}
```

## Get Easy Track Config
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    easyTrackConfigs {
        id
        evmScriptExecutor
        motionDuration
        motionsCountLimit
        objectionsThreshold
        isPaused
    }
}
```

### Squid Query

```graphql
query MyQ {
    easyTrackConfigs {
        id
        evmScriptExecutor
        motionDuration
        motionsCountLimit
        objectionsThreshold
        isPaused
    }
}
```

## Get 5 EVM Script Factories (sorted ASC by address)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    evmscriptFactories(first: 5,
        orderBy: address, orderDirection: asc) {
        id
        address
        permissions
        isActive
    }
}
```

### Squid Query

```graphql
query MyQ {
    evmScriptFactories(limit: 5, orderBy: address_ASC) {
        id
        address
        permissions
        isActive
    }
}
```

## Get 5 Lido Holders (sorted DESC by address, hasBalance is true)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    holders(first: 5, orderBy: address,
        orderDirection: desc, where: {
            hasBalance: true
        }) {
        id
        address
        hasBalance
    }
}
```

### Squid Query

```graphql
query MyQ {
    holders(limit: 5, orderBy: address_DESC,
        where: {
            hasBalance_eq: true
        }) {
        id
        address
        hasBalance
    }
}
```

## Get 5 Lido Approvals (sorted DESC by value, value between 1,000,000 and 10,000,000)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    lidoApprovals(first: 5,
        orderBy: value, orderDirection: desc,
        where: {
            value_gt: 1000000,
            value_lt: 10000000
        }) {
        id
        owner
        spender
        value
    }
}
```

### Squid Query

```graphql
query MyQ {
    lidoApprovals(limit: 5, orderBy: value_DESC,
        where: {
            value_gt: 1000000,
            value_lt: 10000000
        }) {
        id
        owner
        spender
        value
    }
}
```

## Get Lido Config
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    lidoConfigs {
        id
        insuranceFund
        oracle
        treasury
        isStopped
        isStakingPaused
        maxStakeLimit
        stakeLimitIncreasePerBlock
        elRewardsVault
        elRewardsWithdrawalLimitPoints
        withdrawalCredentials
        wcSetBy
        lidoLocator
    }
}
```

### Squid Query

```graphql
query MyQ {
    lidoConfigs {
        id
        insuranceFund
        oracle
        treasury
        isStopped
        isStakingPaused
        maxStakeLimit
        stakeLimitIncreasePerBlock
        elRewardsVault
        elRewardsWithdrawalLimitPoints
        withdrawalCredentials
        wcSetBy
        lidoLocator
    }
}
```

## Latest 5 Enacted Motions
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    motions(first: 5,
        orderBy: block, orderDirection: desc,
        where: {
            status: "ENACTED"
        }) {
        id
        creator
        evmScriptFactory
        duration
        startDate
        snapshotBlock
        objectionsAmount
        objectionsAmountPct
        objectionsThreshold
        evmScriptHash
        evmScriptCalldata
        status
        enacted_at
        canceled_at
        rejected_at
        objections {
            id
            objector
            weight
            block
        }
        block
        blockTime
        transactionHash
        logIndex
    }
}
```

### Squid Query

```graphql
query MyQ {
    motions (limit: 5, orderBy: block_DESC,
        where: {
            status_eq: "ENACTED"
        }) {
        id
        creator
        evmScriptFactory
        duration
        startDate
        snapshotBlock
        objectionsAmount
        objectionsAmountPct
        objectionsThreshold
        evmScriptHash
        evmScriptCalldata
        status
        enactedAt
        canceledAt
        rejectedAt
        objections {
            id
            objector
            weight
            block
        }
        block
        blockTime
        transactionHash
        logIndex
    }
}
```

## Latest 10 Node Operators
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    nodeOperators(first: 10,
        orderBy: block, orderDirection: desc) {
        id
        name
        rewardAddress
        stakingLimit
        active
        totalStoppedValidators
        totalKeysTrimmed
        nonce
        block
        blockTime
        transactionHash
        logIndex
    }
}
```

### Squid Query

```graphql
query MyQ {
    nodeOperators(limit: 10, orderBy: block_DESC) {
        id
        name
        rewardAddress
        stakingLimit
        active
        totalStoppedValidators
        totalKeysTrimmed
        nonce
        block
        blockTime
        transactionHash
        logIndex
    }
}
```

## 5 Node Operator Key Indexes (sorted by index DESC)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    nodeOperatorKeysOpIndexes (first: 5, orderBy: index,
        orderDirection: desc) {
        id
        index
    }
}
```

### Squid Query

```graphql
query MyQ {
    nodeOperatorKeysOpIndices(limit: 5, orderBy: index_DESC) {
        id
        index
    }
}
```

## Get the latest Node Operator Signing Key (Where removed is false and logIndex is 441)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    nodeOperatorSigningKeys (first: 1, orderBy: block,
        orderDirection: desc, where: {
            removed: false,
            logIndex: 441
        }) {
        id
        operator {
            id
            name
            rewardAddress
        }
        pubkey
        removed
        block
        transactionHash
        logIndex
    }
}
```

### Squid Query

```graphql
query MyQ {
    nodeOperatorSigningKeys(limit: 1, orderBy: block_DESC,
        where: {
            removed_eq: false,
            logIndex_eq: 441
        }) {
        id
        operator {
            id
            name
            rewardAddress
        }
        pubkey
        removed
        block
        transactionHash
        logIndex
    }
}
```

## Get latest 10 Objections
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    objections(first: 10, orderBy: block,
        orderDirection: desc){
        id
        objector
        weight
        motion {
            id
            status
        }
        block
        blockTime
        transactionHash
        logIndex
    }
}
```

### Squid Query

```graphql
query MyQ {
    objections(limit: 10, orderBy: block_DESC) {
        id
        objector
        weight
        motion {
            id
            status
        }
        block
        blockTime
        transactionHash
        logIndex
    }
}
```

## Get latest 5 completed Oracles
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    oracleCompleteds (first: 5, orderBy: block,
        orderDirection: desc) {
        id
        epochId
        beaconBalance
        beaconValidators
        block
        transactionHash
        logIndex
    }
}
```

### Squid Query

```graphql
query MyQ {
    oracleCompleteds(limit: 5, orderBy: block_DESC) {
        id
        epochId
        beaconBalance
        beaconValidators
        block
        transactionHash
        logIndex
    }
}
```

## Get Oracle Config
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    oracleConfigs {
        id
        quorum
        contractVersion
        allowedBeaconBalanceAnnualRelativeIncrease
        allowedBeaconBalanceRelativeDecrease
        epochsPerFrame
        slotsPerEpoch
        secondsPerSlot
        genesisTime
        beaconReportReceiver
    }
}
```

### Squid Query

```graphql
query MyQ {
    oracleConfigs {
        id
        quorum
        contractVersion
        allowedBeaconBalanceAnnualRelativeIncrease
        allowedBeaconBalanceRelativeDecrease
        epochsPerFrame
        slotsPerEpoch
        secondsPerSlot
        genesisTime
        beaconReportReceiver
    }
}
```

## Get 5 Expected Epoch IDs (sorted by epochId DESC)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    oracleExpectedEpoches(first: 5,
        orderBy: epochId, orderDirection: desc) {
        id
        epochId
    }
}
```

### Squid Query

```graphql
query MyQ {
    oracleExpectedEpoches(limit: 5, orderBy: epochId_DESC) {
        id
        epochId
    }
}
```

## Get all Oracle Members (sorted by block)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    oracleMembers(first: 10, orderBy: block,
        orderDirection: desc) {
        id
        member
        removed
        block
        blockTime
        transactionHash
        logIndex
    }
}
```

### Squid Query

```graphql
query MyQ {
    oracleMembers(limit: 10, orderBy: block_DESC) {
        id
        member
        removed
        block
        blockTime
        transactionHash
        logIndex
    }
}
```

## Get 5 Oracle Reports where itemsProcessed is greater than 0 (sorted by id DESC)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    oracleReports(first: 5, orderBy: id,
        orderDirection: desc, where: {
            itemsProcessed_gt: 0
        }) {
        id
        hash
        itemsProcessed
        itemsCount
        totalReward {
            id
            shares2mint
        }
    }
}
```

### Squid Query

```graphql
query MyQ {
    oracleReports(limit: 5, orderBy: id_DESC,
        where: {
            itemsProcessed_gt: 0
        }) {
        id
        hash
        itemsProcessed
        itemsCount
        totalReward {
            id
            shares2mint
        }
    }
}
```

## Get 5 Oracle Reports where itemsProcessed is greater than 0 (sorted by id DESC)
💡 The subgraph has not subscribed to Role related events, but Role is present in the GraphQL schema. So, in the squid, I used Role events as well.

### Subgraph Query
```graphql
{
    roles {
        id
        role
        address
    }
}
```

### Squid Query

```graphql
query MyQ {
    roles {
        id
        role
        address
    }
}
```

## Get 5 Shares Burns where shareAmount is between 1000000000000000000000 and 10000000000000000000000 (sorted by shareAmount ASC)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    sharesBurns(first: 5, where: {
        sharesAmount_gt: "1000000000000000000000",
        sharesAmount_lt: "10000000000000000000000"
    }, orderBy: sharesAmount, orderDirection: asc) {
        id
        account
        postRebaseTokenAmount
        preRebaseTokenAmount
        sharesAmount
    }
}
```

### Squid Query

```graphql
query MyQ {
    sharesBurns(limit: 5, orderBy: sharesAmount_ASC,
        where: {
            sharesAmount_gt: "1000000000000000000000",
            sharesAmount_lt: "10000000000000000000000"
        }) {
        id
        account
        postRebaseTokenAmount
        preRebaseTokenAmount
        sharesAmount
    }
}
```

## Get latest 5 Total Rewards
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    totalRewards(first: 5, orderBy: block,
        orderDirection: desc) {
        id
        totalRewards
        totalRewardsWithFees
        mevFee
        feeBasis
        apr
        shares2mint
    }
}
```

### Squid Query

```graphql
query MyQ {
    totalRewards(limit: 5, orderBy: block_DESC) {
        id
        totalRewards
        totalRewardsWithFees
        mevFee
        feeBasis
        apr
        shares2mint
    }
}
```

## Get latest 5 executed Votings
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    votings(first: 5, orderBy: block,
        orderDirection: desc, where: {
            executed: true
        }) {
        id
        executed
        metadata
        block
    }
}
```

### Squid Query

```graphql
query MyQ {
    votings(limit: 5, orderBy: block_DESC,
        where: {
            executed_eq: true
        }) {
        id
        executed
        metadata
        block
    }
}
```

## Get Votes for VotingID = 100 (sorted by stake DESC)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    votes (where: {
        voting_: {
            id: "100"
        }
    }, orderBy: stake, orderDirection: desc) {
        id
        voting {
            id
        }
        voter
        supports
        stake
    }
}
```

### Squid Query

```graphql
query MyQ {
    votes (where: {
        voting: {
            id_eq: "100"
        }
    }, orderBy: stake_DESC) {
        id
        voting {
            id
        }
        voter
        supports
        stake
    }
}
```

## Get Voting Config
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    votingConfigs {
        id
        supportRequiredPct
        minAcceptQuorumPct
        voteTime
        objectionPhaseTime
    }
}
```

### Squid Query

```graphql
query MyQ {
    votingConfigs {
        id
        supportRequiredPct
        minAcceptQuorumPct
        voteTime
        objectionPhaseTime
    }
}
```

## Get Voting Objections (sorted by stake DESC)
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    votingObjections(first: 20, orderBy:stake,
        orderDirection: desc) {
        id
        voting {
            id
        }
        voter
        stake
    }
}
```

### Squid Query

```graphql
query MyQ {
    votingObjections(limit: 20, orderBy: stake_DESC) {
        id
        voting {
            id
        }
        voter
        stake
    }
}
```

## Get latest 5 Claimed Withdrawals
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    withdrawalClaimeds(first: 5, orderBy: block,
        orderDirection: desc) {
        id
        requestId
        owner
        receiver
        amountOfETH
        block
        transactionHash
        logIndex
    }
}
```

### Squid Query

```graphql
query MyQ {
    withdrawalClaimeds(limit: 5, orderBy: block_DESC) {
        id
        requestId
        owner
        receiver
        amountOfETH
        block
        transactionHash
        logIndex
    }
}
```

## Get Withdrawal Queue Config
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    withdrawalQueueConfigs {
        id
        isBunkerMode
        bunkerModeSince
        contractVersion
        isPaused
        pauseDuration
    }
}
```

### Squid Query

```graphql
query MyQ {
    withdrawalQueueConfigs {
        id
        isBunkerMode
        bunkerModeSince
        contractVersion
        isPaused
        pauseDuration
    }
}
```

## Get latest Withdrawal Requests
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    withdrawalRequesteds(first: 5, orderBy: block,
        orderDirection: desc) {
        id
        requestId
        requestor
        owner
        amountOfStETH
        amountOfShares
        block
        logIndex
    }
}
```

### Squid Query

```graphql
query MyQ {
    withdrawalRequesteds(limit: 5, orderBy: block_DESC) {
        id
        requestId
        requestor
        owner
        amountOfStETH
        amountOfShares
        block
        logIndex
    }
}
```

## Get latest Finalized Withdrawals
✅ Squid data matches with subgraph.

### Subgraph Query
```graphql
{
    withdrawalsFinalizeds(first: 5, orderBy: block,
        orderDirection: desc) {
        id
        from
        to
        sharesToBurn
        amountOfETHLocked
        block
        logIndex
    }
}
```

### Squid Query

```graphql
query MyQ {
    withdrawalsFinalizeds(limit: 5, orderBy: block_DESC) {
        id
        from
        to
        sharesToBurn
        amountOfETHLocked
        block
        logIndex
    }
}
```
