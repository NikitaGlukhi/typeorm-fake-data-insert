import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyEntity } from './company.entity';
import { CriteriaEntity } from './criteria.entity';

@Entity('companyToCriteria')
export class CompanyToCriteriaEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'boolean' })
  value: boolean;

  @ManyToOne(type => CriteriaEntity, (criteria) => criteria.companyToCriteria)
  @JoinColumn()
  criteria: CriteriaEntity;

  @ManyToOne(type => CompanyEntity, (company) => company.companyToCriteria)
  @JoinColumn()
  company: CompanyEntity;
}
