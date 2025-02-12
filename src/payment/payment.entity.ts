import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: string;

  @Column({ default: 1.0 })
  amount: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}

