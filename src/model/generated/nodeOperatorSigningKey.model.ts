import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {NodeOperator} from "./nodeOperator.model"

@Entity_()
export class NodeOperatorSigningKey {
    constructor(props?: Partial<NodeOperatorSigningKey>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    operatorId!: bigint

    @Column_("text", {nullable: false})
    pubkey!: string

    @Column_("bool", {nullable: false})
    removed!: boolean

    @Index_()
    @ManyToOne_(() => NodeOperator, {nullable: true})
    operator!: NodeOperator

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    block!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockTime!: bigint

    @Column_("text", {nullable: false})
    transactionHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    logIndex!: bigint
}
