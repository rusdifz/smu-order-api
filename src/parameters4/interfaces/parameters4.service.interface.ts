import { ParameterS4Value } from './parameters4.interface';

export interface IParameterS4Service {
  loadParameters(): Promise<void> | void;

  get(
    key: string,
  ): Promise<ParameterS4Value[] | undefined> | ParameterS4Value[] | undefined;

  getOne(
    key: string,
  ): Promise<ParameterS4Value | undefined> | ParameterS4Value | undefined;

  getOrThrow(key: string): Promise<ParameterS4Value[]> | ParameterS4Value[];
}
