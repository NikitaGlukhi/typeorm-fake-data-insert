import { IProcessor } from 'typeorm-fixtures-cli/dist';
import { CompanyEntity } from '../../src/enitites/company.entity';
import * as faker from 'faker';

export default class CompanyProcessor implements IProcessor<CompanyEntity> {

  postProcess(name: string, object: {[ key: string ]: any }): void | Promise<void> {
    object.name = faker.fake('{{company.companyName}}');
  }

}
