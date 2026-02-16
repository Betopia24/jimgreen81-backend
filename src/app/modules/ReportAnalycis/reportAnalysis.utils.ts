export type ParameterValue = {
  value: number;
  unit: string;
  detection_limit?: number | null;
};

export type ParametersObject = {
  [key: string]: ParameterValue;
};

export type Parameter = {
  name: string;
  value: number;
  unit: string;
  detection_limit?: number | null;
};

export function reportParameterObjectToArray(obj: ParametersObject): Parameter[] {
  return Object.entries(obj).map(([key, val]) => ({
    name: key,
    value: val.value,
    unit: val.unit,
    detection_limit: val.detection_limit ?? null,
  }));
}

export function reportParameterArrayToObject(arr: Parameter[]): ParametersObject {
  return arr.reduce<ParametersObject>((acc, param) => {
    acc[param.name] = {
      value: param.value,
      unit: param.unit,
      detection_limit: param.detection_limit ?? null,
    };
    return acc;
  }, {});
}
