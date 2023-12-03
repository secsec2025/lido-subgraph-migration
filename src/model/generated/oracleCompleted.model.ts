import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OracleCompleted {
    constructor(props?: Partial<OracleCompleted>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    epochId!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    beaconBalance!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    beaconValidators!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    block!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockTime!: bigint

    @Column_("text", {nullable: false})
    transactionHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    logIndex!: bigint
}
