import { ParameterValue } from './parameter.interface';

export interface IParameterService {
  loadParameters(): Promise<void> | void;

  get(
    key: string,
  ): Promise<ParameterValue[] | undefined> | ParameterValue[] | undefined;

  getByKeyAndValue(
    key: string,
    value: string,
  ): Promise<ParameterValue | undefined>;

  getOne(
    key: string,
  ): Promise<ParameterValue | undefined> | ParameterValue | undefined;

  getOrThrow(key: string): Promise<ParameterValue[]> | ParameterValue[];
}
