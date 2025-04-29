import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';

import { CONNECTIONNAME_DB_S4 } from '@wings-online/app.constants';
import { TypeOrmParameterS4Entity } from './entities';
import './interfaces';
import { IParameterS4Service, ParameterS4Value } from './interfaces';
import { ParameterS4 } from './parameters4';
import { ParameterS4Utils } from './parameters4.utils';

@Injectable()
export class ParameterS4Service implements IParameterS4Service {
  private parameters: Map<string, ParameterS4>;

  constructor(@InjectDataSource(CONNECTIONNAME_DB_S4) private readonly dataSource: DataSource) {
    this.parameters = new Map();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async loadParameters(): Promise<void> {
    const entities = await this.dataSource
      .createQueryBuilder(TypeOrmParameterS4Entity, 'param')
      .getMany();

    const newParameters: Map<string, ParameterS4> = new Map();

    for (const entity of entities) {
      let parameter: ParameterS4;
      if (newParameters.has(entity.key)) {
        parameter = newParameters.get(entity.key)!;
        parameter.addValue({ value: entity.value, sequence: entity.sequence });
      } else {
        parameter = new ParameterS4(entity.key, [
          { value: entity.value, sequence: entity.sequence },
        ]);
      }
      newParameters.set(entity.key, parameter);
    }

    this.parameters = newParameters;
  }

  async get(key: string): Promise<ParameterS4Value[] | undefined> {
    const parameter = this.parameters.get(key);
    return parameter ? parameter.values : undefined;
  }

  async getOne(key: string): Promise<ParameterS4Value | undefined> {
    const parameter = this.parameters.get(key);
    return parameter?.values.length
      ? ParameterS4Utils.getEffectiveParameterS4Value(parameter.values)
      : undefined;
  }

  async getOrThrow(key: string): Promise<ParameterS4Value[]> {
    const parameter = this.parameters.get(key);
    if (!parameter) throw new Error(`unable to find parameter with key ${key}`);
    return parameter.values;
  }
}
