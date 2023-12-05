# LIDO Subgraph Migration
A quest to migrate Lido subgraph to Subsquid

# Introduction

This is the squid implementation of the Lido subgraph. https://thegraph.com/explorer/subgraphs/HXfMc1jPHfFQoccWd7VMv66km75FoxVHDMvsJj5vG5vf?view=Overview&chain=mainnet

# What is Changed?

<ul>
<li>Batch Processing is used.</li>
<li>An <code>EntityCache</code> is used to store the entities in memory to improve performance.</li>
</ul>

# How to start?
<ul>
<li>Please make sure to add the necessary DB config to <code>.env</code> file.</li>
<li>Set <code>DATASOURCE_NAME</code> as <code>mainnet</code> or the relevant chain name (Ex - goerli) in <code>.env</code> file.</li>
</ul>


```bash
git clone https://github.com/secsec2025/lido-subgraph-migration.git
cd lido-subgraph-migration
npm ci
sqd up
sqd process &
sqd serve
```

# GraphQL Schema Changes

<ul>
<li>The core structure stays same with the Subgraph.</li>
<li><code>Byte</code> fields have been changed to <code>String</code>.</li>
</ul>


# Squid Stats

<ul>
<li>Time to fully sync - Less than 1.5 hours</li>
<li>You can download the fully synced Postgres database (up to 18720600 block)
<a href="">here</a>.</li>
</ul>


# What's Next to Do?

<ul>
<li>Add more sample queries. <code>queries.md</code></li>
</ul>

