import { IProcessor } from 'typeorm-fixtures-cli/dist';
import { CriteriaEntity } from '../../src/enitites/criteria.entity';

export default class CriteriaProcessor implements IProcessor<CriteriaEntity> {
  postProcess(name: string, object: { [key: string]: any }): void | Promise<void> {}
}
