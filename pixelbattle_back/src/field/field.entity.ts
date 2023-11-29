import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('fields')
@Unique(['row', 'col'])
export class Field {
    @PrimaryGeneratedColumn()
    fieldId: number;

    @Column()
    row: number;

    @Column()
    col: number;

    @Column()
    color: string;

    @Column({
        name: 'createdDate',
        type: 'timestamp'
    })
    createdDate: Date;
};
