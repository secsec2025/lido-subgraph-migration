import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {TotalReward} from "./totalReward.model"

@Entity_()
export class NodeOperatorsShares {
    constructor(props?: Partial<NodeOperatorsShares>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => TotalReward, {nullable: true})
    totalReward!: TotalReward

    @Column_({nullable: true})
    totalRewardId!: string | undefined | null;

    @Column_("text", {nullable: false})
    address!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    shares!: bigint
}
