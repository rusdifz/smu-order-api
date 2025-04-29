import { ParameterS4Value } from './interfaces';

export class ParameterS4Utils {
  public static getEffectiveParameterS4Value(
    values: ParameterS4Value[],
  ): ParameterS4Value | undefined {
    if (!values.length) {
      return;
    }

    const sorted = values.sort((a, b) => a.sequence - b.sequence);
    return sorted[0];
  }

  public static isParameterEffectiveByValue(
    values: ParameterS4Value[],
    valueToCheck: string,
  ): boolean {
    let isEffective = false;

    for (const parameterS4Value of values) {
      if (parameterS4Value.value === valueToCheck) {
        isEffective = true;
      }
      if (isEffective) break;
    }

    return isEffective;
  }

  public static getParameterByValuePrefix(
    values: ParameterS4Value[],
    prefix: string,
  ): ParameterS4Value | undefined {
    return values.find((x) =>
      x.value.toLowerCase().startsWith(prefix.toLowerCase()),
    );
  }
}
