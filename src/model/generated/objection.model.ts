import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import * as marshal from "./marshal"
import {Motion} from "./motion.model"

@Entity_()
export class Objection {
    constructor(props?: Partial<Objection>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    motionId!: bigint

    @Column_("text", {nullable: false})
    objector!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    weight!: bigint

    @Index_()
    @ManyToOne_(() => Motion, {nullable: true})
    @JoinColumn_({ name: 'mid' })
    motion!: Motion

    @Column_({nullable: true})
    mid!: string | undefined | null;

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    block!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockTime!: bigint

    @Column_("text", {nullable: false})
    transactionHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    logIndex!: bigint
}
