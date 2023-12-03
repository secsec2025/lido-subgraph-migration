import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Role {
    constructor(props?: Partial<Role>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    role!: string

    @Column_("text", {nullable: false})
    address!: string

    @Column_("text", {nullable: false})
    creator!: string

    @Column_("bool", {nullable: false})
    isActive!: boolean
}
