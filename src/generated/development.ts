import { OilfieldName } from "../data/gameData";

export const development: Record<
  OilfieldName,
  {
    oil: number;
    gas: number;
    emissions: number;
  }
> = {
  "Aasta Hansteen": { oil: 0.9, gas: 0.8, emissions: 0.97 },
  Alvheim: { oil: 0.9, gas: 0.9, emissions: 0.97 },
  Balder: { oil: 0.95, gas: 0.9, emissions: 0.97 },
  Brage: { oil: 0.7, gas: 0.7, emissions: 0.97 },
  Draugen: { oil: 0.95, gas: 0.9, emissions: 0.97 },
  "Edvard Grieg": { oil: 0.9, gas: 0.9, emissions: 0.97 },
  Ekofisk: { oil: 0.95, gas: 0.9, emissions: 0.97 },
  Eldfisk: { oil: 0.9, gas: 0.95, emissions: 0.97 },
  Gjøa: { oil: 0.8, gas: 0.8, emissions: 0.99 },
  Goliat: { oil: 0.9, gas: 0.9, emissions: 0.97 },
  Grane: { oil: 0.95, gas: 0.9, emissions: 0.99 },
  Gullfaks: { oil: 0.9, gas: 0.9, emissions: 0.97 },
  Heidrun: { oil: 0.95, gas: 0.95, emissions: 0.99 },
  "Johan Castberg": { oil: 0.87, gas: 0.9, emissions: 1 },
  "Johan Sverdrup": { oil: 0.8, gas: 0.9, emissions: 0.97 },
  Kristin: { oil: 0.9, gas: 0.9, emissions: 0.97 },
  Kvitebjørn: { oil: 0.85, gas: 0.85, emissions: 0.97 },
  "Martin Linge": { oil: 0.85, gas: 0.85, emissions: 0.97 },
  Njord: { oil: 0.95, gas: 0.95, emissions: 0.97 },
  Norne: { oil: 0.75, gas: 0.75, emissions: 0.97 },
  "Ormen Lange": { oil: 0.9, gas: 0.9, emissions: 0.97 },
  Oseberg: { oil: 0.95, gas: 0.8, emissions: 0.99 },
  Skarv: { oil: 0.75, gas: 0.75, emissions: 0.97 },
  Sleipner: { oil: 0.85, gas: 0.85, emissions: 0.97 },
  Snorre: { oil: 0.93, gas: 0.9, emissions: 0.99 },
  Snøhvit: { oil: 0.9, gas: 1, emissions: 1 },
  Statfjord: { oil: 0.95, gas: 0.9, emissions: 0.99 },
  Troll: { oil: 0.85, gas: 0.95, emissions: 0.97 },
  Ula: { oil: 0.75, gas: 0.9, emissions: 0.97 },
  Valhall: { oil: 0.9, gas: 0.9, emissions: 0.99 },
  Visund: { oil: 0.8, gas: 0.8, emissions: 0.97 },
  Yggdrasil: { oil: 0.85, gas: 0.85, emissions: 0.97 },
  Yme: { oil: 0.75, gas: 0.9, emissions: 0.97 },
  Åsgard: { oil: 0.85, gas: 0.85, emissions: 0.98 },
} as const;
