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

