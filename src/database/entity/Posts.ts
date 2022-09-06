import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('posts')
export class Posts{
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text', nullable: false})
    author: string

    @Column({type: 'text', nullable: false})
    title: string

    @Column({type: 'text', nullable: false})
    text: string

    @Column({type: 'text', nullable: false})
    published_in: string
}