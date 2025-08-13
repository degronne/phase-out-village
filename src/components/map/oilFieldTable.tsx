import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import {
  calculateEmissions,
  calculateGasProduction,
  calculateOilProduction,
  slugify,
  TimeSerieValue,
} from "../../data/data";
import * as XLSX from "xlsx";
import { data } from "../../generated/data";
import { Year } from "../../data/types";
import { oilFieldToExcel } from "../dataView/exportToExcel";

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

export function OilFieldTable({ field }: { field: string }) {
  const { phaseOut } = useContext(ApplicationContext);
  const oil = calculateOilProduction(data[field], phaseOut[field]);
  const gas = calculateGasProduction(data[field], phaseOut[field]);
  const emissions = calculateEmissions(data[field], phaseOut[field]);
  const years = [
    ...new Set([...gas.map(([y]) => y), ...emissions.map(([y]) => y)]),
  ].sort();

  function handleExportClick() {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(oilFieldToExcel(field, phaseOut)),
      field,
    );
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
            <th>År</th>
            <th>Olje</th>
            <th>Gass</th>
            <th>Utslipp</th>
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
