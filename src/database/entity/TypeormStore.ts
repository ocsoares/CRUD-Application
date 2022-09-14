import  {  ISession  }  from  "connect-typeorm" ; 
import  {  Column ,  DeleteDateColumn ,  Entity ,  Index ,  PrimaryColumn  } from  "typeorm" ;

@Entity()
export class Session implements ISession {
    @Index()
    @Column("bigint")
    public expiredAt = Date.now(); // Pelo o que eu entendi, isso aqui é o Tempo que VAI EXPIRADO, passado no ttl do store !! <<

    @PrimaryColumn("varchar", { length: 255 })
    public id = "";

    @Column("text")
    public json = "";

    @DeleteDateColumn()
    public destroyedAt?: Date;
}