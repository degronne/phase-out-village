import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  calculateEmissions,
  calculateGasProduction,
  calculateOilProduction,
  OilfieldName,
  oilfieldNames,
  slugify,
  Slugify,
  TimeSerieValue,
  Year,
} from "../../data";
import { ApplicationContext } from "../../applicationContext";
import { OilProductionForFieldChart } from "../production/oilProductionForFieldChart";
import { EmissionsForFieldChart } from "../emissions/emissionsForFieldChart";
import { GasProductionForFieldChart } from "../production/gasProductionForFieldChart";
import * as XLSX from "xlsx";

function TableCell({
  timeseries,
  year,
}: {
  timeseries: TimeSerieValue[];
  year: Year;
}) {
  const row = timeseries.find(([y]) => y === year);
  if (!row) return <td></td>;
  return <td style={{ fontStyle: row[2] && "italic" }}>{row[1]}</td>;
}

function OilFieldTable({ field }: { field: string }) {
  const { data, phaseOut } = useContext(ApplicationContext);
  const oil = calculateOilProduction(data[field], phaseOut[field]);
  const gas = calculateGasProduction(data[field], phaseOut[field]);
  const emissions = calculateEmissions(data[field], phaseOut[field]);
  const years = [
    ...new Set([...gas.map(([y]) => y), ...emissions.map(([y]) => y)]),
  ].toSorted();

  function handleExportClick() {
    const rows = years.map((year) => ({
      year,
      productionOil: oil.find(([y]) => y === year)?.at(1) ?? null,
      productionGas: gas.find(([y]) => y === year)?.at(1) ?? null,
      emission: emissions.find(([y]) => y === year)?.at(1) ?? null,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, field);

    XLSX.writeFile(workbook, `oil-field-data-${slugify(field)}.xlsx`);
  }

  return (
    <div>
      <h3>Verdier</h3>
      <div>
        <button onClick={handleExportClick}>Last ned som Excel</button>
      </div>
      <table>
        <thead>
          <tr>
            <td>År</td>
            <td>Olje</td>
            <td>Gass</td>
            <td>Utslipp</td>
          </tr>
        </thead>
        <tbody>
          {years.map((y) => (
            <tr key={y}>
              <td>{y}</td>
              <TableCell timeseries={oil} year={y} />
              <TableCell timeseries={gas} year={y} />
              <TableCell timeseries={emissions} year={y} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OilfieldDetails({ slug }: { slug: Slugify<OilfieldName> }) {
  const name = oilfieldNames[slug];
  if (!name) return null;
  return (
    <div>
      <h3>Detaljer for oljefelt: {name}</h3>
      <Link to={".."}>Vis alle</Link>
      <OilProductionForFieldChart field={name} />
      <GasProductionForFieldChart field={name} />
      <EmissionsForFieldChart field={name} />
      <OilFieldTable field={name} />
    </div>
  );
}
