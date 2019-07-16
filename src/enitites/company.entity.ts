import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CompanyToCriteriaEntity } from './company.to.criteria.entity';

@Entity('company')
export class CompanyEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(type => CompanyToCriteriaEntity, (company) => company.company)
  companyToCriteria: CompanyToCriteriaEntity

}

