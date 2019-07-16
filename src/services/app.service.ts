import { Injectable } from '@nestjs/common';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as path from 'path';
import * as Papa from 'papaparse';
import * as fs from 'fs';
import * as writeYamlFile from 'write-yaml-file';

import { CompanyEntity } from '../enitites/company.entity';
import { CriteriaEntity } from '../enitites/criteria.entity';
import { CompanyToCriteriaEntity } from '../enitites/company.to.criteria.entity';

@Injectable()
export class AppService {

  constructor(
    private readonly connection: Connection,
    @InjectRepository(CompanyEntity) private readonly company: Repository<CompanyEntity>,
    @InjectRepository(CriteriaEntity) private readonly criteria: Repository<CriteriaEntity>,
    @InjectRepository(CompanyToCriteriaEntity) private readonly companyToCriteria: Repository<CompanyToCriteriaEntity>
    ) {}

  private async loadFixtures(fixturePath: string) {
      let entities = [];

      const loader = new Loader();
      loader.load(path.resolve(fixturePath));

      const resolver = new Resolver();
      const fixtures = resolver.resolve(loader.fixtureConfigs);
      const builder = new Builder(this.connection, new Parser());

      for (let fixture of fixturesIterator(fixtures)) {
        const entity = await builder.build(fixture);
        entities.push(entity);
      }
    return await entities;
  }

  private readCsvFile(filePath: string) {
    const content = fs.readFileSync(
      path.join(__dirname, filePath),
      { encoding: 'utf-8' }
      );

    const result =  Papa.parse(content, {
      delimiter: ',',
      header: true,
      skipEmptyLines: true });
    return result.data;
  }

  public root() {
    this.loadFixtures( './fixtures/company.yml')
      .then(async companies => {
        let criteriaItems = {};
        for (let [index, item] of companies.entries()) {

          const criteriaObj = { [`criteria${index + 1}`]: {
            id: index + 1,
            name: `criteria${index + 1}`,
            state: 'custom'  }
          };

          await this.insetCustomCriteriaDataToDb(item, criteriaObj[`criteria${index+1}`]);
          Object.assign(criteriaItems, criteriaObj);
        }

        const yamlData = {
          entity: 'CriteriaEntity',
          processor: './processors/criteria.processor.ts',
          items: criteriaItems
        };
        writeYamlFile.sync('./fixtures/criteria.yml', yamlData);

        await this.readCsvData(companies);
      });
  }

  private readCsvData(companies: Object[]) {
    let customCriteriaLength = companies.length;
    const criteriaData = this.readCsvFile('../mockup-data/criteria.csv');
    let items = {};

    for (let item of criteriaData) {
      item.id = +0;
      customCriteriaLength += 1;
      item.id = customCriteriaLength;
      item.name = `criteria${customCriteriaLength}`;
      const obj = { [`criteria${item.id}`]: item };
      Object.assign(items, obj);
    }

    this.loadFixtures('./fixtures/criteria.yml')
      .then(async criteriaData => {
        const newCriteriaItems = {};
        for (let criteria of criteriaData) {

          const obj = { [`criteria${criteria.id}`]: {
            id: criteria.id,
            name: criteria.name,
            state: criteria.state
          }};
          Object.assign(newCriteriaItems, obj);
        }

        Object.assign(newCriteriaItems, items);

        const yamlData = {
          entity: 'CriteriaEntity',
          processor: './processors/criteria.processor.ts',
          items: newCriteriaItems };

        writeYamlFile.sync('./fixtures/criteria.yml', yamlData);
        await this.insertDefaultAndAdditionalCriteria();
        setTimeout(() => {
          this.addCriteriaToCompany(companies);
        }, 150);
    });
  }

  private addCriteriaToCompany(companiesData: Object[]) {
    this.loadFixtures('./fixtures/criteria.yml')
      .then(async criteria => {
        for (let company of companiesData) {
          for (let singleCriteria of criteria) {
            const setCriteriaCondition = Math.random() >= 0.589;

            if (singleCriteria.state === 'custom') {
              continue;
            }

            if (singleCriteria.state === 'default') {
              await this.insertDefaultAndAdditionalDataToDb(company, singleCriteria)
            } else if (singleCriteria.state === 'additional' && setCriteriaCondition) {
              await this.insertDefaultAndAdditionalDataToDb(company, singleCriteria)
            }
          }
        }
      });
  }

  private async insetCustomCriteriaDataToDb
  (company: Object, criteria: Object) {
    const companyToCriteria = {
      value: Math.random() >= 0.588,
      criteria: criteria,
      company: company
    };
    await this.company.save(company);
    await this.criteria.save(criteria);
    await this.companyToCriteria.save(companyToCriteria);
    console.log('Data inserted');
  }

  private insertDefaultAndAdditionalCriteria() {
    this.loadFixtures('./fixtures/criteria.yml')
      .then(async criteriaData => {
        for (let criteria of criteriaData) {
          if (criteria.state === 'custom') {
            continue;
          }
          await this.criteria.save(criteria);
        }
      })
  }

  private async insertDefaultAndAdditionalDataToDb
  (company: Object, criteria: Object) {
    const companyToCriteria = {
      value: Math.random() >= 0.588,
      criteria: criteria,
      company: company
    };
    await this.companyToCriteria.save(companyToCriteria);
    console.log('Data inserted');
  }

}
