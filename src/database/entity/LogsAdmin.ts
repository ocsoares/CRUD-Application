import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('logsadmin')
export class LogsAdmin{
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text', nullable: false})
    username: string

    @Column({type: 'text', nullable: false})
    comment: string

    @Column({type: 'text', nullable: false})
    email: string

    @Column({type: 'text', nullable: false})
    date: string
}