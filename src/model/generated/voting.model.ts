import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Vote} from "./vote.model"
import {VotingObjection} from "./votingObjection.model"

@Entity_()
export class Voting {
    constructor(props?: Partial<Voting>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    index!: number

    @Column_("text", {nullable: false})
    creator!: string

    @Column_("text", {nullable: false})
    metadata!: string

    @Column_("bool", {nullable: false})
    executed!: boolean

    @OneToMany_(() => Vote, e => e.voting)
    votes!: Vote[]

    @OneToMany_(() => VotingObjection, e => e.voting)
    objections!: VotingObjection[]

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    block!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockTime!: bigint

    @Column_("text", {nullable: false})
    transactionHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    logIndex!: bigint
}
