import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OracleMember {
    constructor(props?: Partial<OracleMember>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    member!: string

    @Column_("bool", {nullable: false})
    removed!: boolean

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    block!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockTime!: bigint

    @Column_("text", {nullable: false})
    transactionHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    logIndex!: bigint
}
