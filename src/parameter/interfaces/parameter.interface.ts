export type ParameterValue = {
  sequence: number;
  value: string;
  desc: string;
};

export interface IParameter {
  key: string;
  values: ParameterValue[];
}
