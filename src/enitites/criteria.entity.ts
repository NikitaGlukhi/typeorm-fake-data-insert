import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyToCriteriaEntity } from './company.to.criteria.entity';

@Entity('criteria')
export class CriteriaEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  state: string;

  @OneToMany(type => CompanyToCriteriaEntity, (criteria) => criteria.criteria)
  companyToCriteria: CompanyToCriteriaEntity
}
