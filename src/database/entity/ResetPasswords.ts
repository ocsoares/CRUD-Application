import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('resetpasswords')
export class ResetPasswords{

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text', nullable: false})
    email: string

    @Column({type: 'text', nullable: false})
    old_password: string

    @Column({type: 'text', nullable: false})
    last_date_reset: string

    @Column({type: 'numeric', nullable: true})
    minute_to_reset_again: number

}