import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';

import { TypeOrmParameterEntity } from './entities';
import './interfaces';
import { IParameterService, ParameterValue } from './interfaces';
import { Parameter } from './parameter';
import { ParameterUtils } from './parameter.utils';

@Injectable()
export class ParameterService implements IParameterService {
  private parameters: Map<string, Parameter>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.parameters = new Map();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async loadParameters(): Promise<void> {
    const entities = await this.dataSource
      .createQueryBuilder(TypeOrmParameterEntity, 'param')
      .getMany();

    const newParameters: Map<string, Parameter> = new Map();

    for (const entity of entities) {
      let parameter: Parameter;
      if (newParameters.has(entity.key)) {
        parameter = newParameters.get(entity.key)!;
        parameter.addValue({
          value: entity.value,
          sequence: entity.sequence,
          desc: entity.desc,
        });
      } else {
        parameter = new Parameter(entity.key, [
          { value: entity.value, sequence: entity.sequence, desc: entity.desc },
        ]);
      }
      newParameters.set(entity.key, parameter);
    }

    this.parameters = newParameters;
  }

  async get(key: string): Promise<ParameterValue[] | undefined> {
    const parameter = this.parameters.get(key);
    return parameter ? parameter.values : undefined;
  }

  async getByKeyAndValue(
    key: string,
    value: string,
  ): Promise<ParameterValue | undefined> {
    const parameters = this.parameters.get(key);
    return parameters?.values.find((val) => val.value === value);
  }

  async getOne(key: string): Promise<ParameterValue | undefined> {
    const parameter = this.parameters.get(key);
    return parameter?.values.length
      ? ParameterUtils.getEffectiveParameterValue(parameter.values)
      : undefined;
  }

  async getOrThrow(key: string): Promise<ParameterValue[]> {
    const parameter = this.parameters.get(key);
    if (!parameter) throw new Error(`unable to find parameter with key ${key}`);
    return parameter.values;
  }
}
