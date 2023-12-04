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
