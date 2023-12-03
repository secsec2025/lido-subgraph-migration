import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class WithdrawalRequested {
    constructor(props?: Partial<WithdrawalRequested>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    requestId!: bigint

    @Column_("text", {nullable: false})
    requestor!: string

    @Column_("text", {nullable: false})
    owner!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amountOfStETH!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amountOfShares!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    block!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockTime!: bigint

    @Column_("text", {nullable: false})
    transactionHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    logIndex!: bigint
}
