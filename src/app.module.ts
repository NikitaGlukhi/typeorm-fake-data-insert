import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './enitites/company.entity';
import { CriteriaEntity } from './enitites/criteria.entity';
import { CompanyToCriteriaEntity } from './enitites/company.to.criteria.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: '@user',
      password: '@password',
      database: '@db_name',
      entities: [
        CompanyEntity,
        CriteriaEntity,
        CompanyToCriteriaEntity
      ],
      synchronize: true,
      dropSchema: true,
      logging: false
    }),
    TypeOrmModule.forFeature([
      CompanyEntity,
      CriteriaEntity,
      CompanyToCriteriaEntity
    ])
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})

export class AppModule {}
