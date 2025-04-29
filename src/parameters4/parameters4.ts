import { IParameterS4, ParameterS4Value } from './interfaces';

export class ParameterS4 implements IParameterS4 {
  public readonly key: string;

  private _values: ParameterS4Value[];

  constructor(key: string, values?: ParameterS4Value[]) {
    this.key = key;
    this._values = values || [];
  }

  addValue(value: ParameterS4Value) {
    this._values.push(value);
  }

  get values() {
    return this._values;
  }
}
