import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('resetpasswords')
export class ResetPasswords{

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text', nullable: false})
    email: string

    @Column({type: 'text', nullable: false})
    oldPassword: string

    @Column({type: 'text', nullable: false})
    lastDateReset: string

    @Column({type: 'numeric', nullable: true})
    minuteToResetAgain: number

}