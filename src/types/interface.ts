export interface Projection {
  oilFieldName: string;
  year: number;
  productionOil: number | null;
  productionGas: number | null;
  emission: number | null;
  emissionIntensity: number | null;
}

export interface EmissionIntensity {
  fieldName: string;
  year: number;
  totalProduction: number;
  emissionIntensity: number;
}
