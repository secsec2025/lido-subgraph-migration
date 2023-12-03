import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class EVMScriptFactory {
    constructor(props?: Partial<EVMScriptFactory>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    address!: string

    @Column_("text", {nullable: false})
    permissions!: string

    @Column_("bool", {nullable: false})
    isActive!: boolean
}
