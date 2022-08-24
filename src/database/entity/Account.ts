import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('accounts')
export class Account{
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text', nullable: false})
    username: string

    @Column({type: 'text', nullable: false})
    email: string

    @Column({type: 'text', nullable: false})
    password: string

    @Column({type: 'text', nullable: false})
    type: 'user' | 'admin' 
}