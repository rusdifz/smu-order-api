export type ParameterS4Value = {
  sequence: number;
  value: string;
};

export interface IParameterS4 {
  key: string;
  values: ParameterS4Value[];
}
