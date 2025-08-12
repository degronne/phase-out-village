export type OilFieldDataset = Record<
  string,
  Record<
    string,
    {
      productionOil?: number;
      productionGas?: number;
      emission?: number;
      emissionIntensity?: number;
    }
  >
>;
