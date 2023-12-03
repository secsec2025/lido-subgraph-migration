import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

/**
 * Lido
 */
@Entity_()
export class LidoConfig {
    constructor(props?: Partial<LidoConfig>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    insuranceFund!: string | undefined | null

    @Column_("text", {nullable: true})
    oracle!: string | undefined | null

    @Column_("text", {nullable: true})
    treasury!: string | undefined | null

    @Column_("bool", {nullable: false})
    isStopped!: boolean

    @Column_("bool", {nullable: false})
    isStakingPaused!: boolean

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    maxStakeLimit!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    stakeLimitIncreasePerBlock!: bigint

    @Column_("text", {nullable: true})
    elRewardsVault!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    elRewardsWithdrawalLimitPoints!: bigint

    @Column_("text", {nullable: false})
    withdrawalCredentials!: string

    @Column_("text", {nullable: true})
    wcSetBy!: string | undefined | null

    @Column_("text", {nullable: true})
    lidoLocator!: string | undefined | null
}
