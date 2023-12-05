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


