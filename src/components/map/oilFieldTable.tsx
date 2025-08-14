import React from "react";
import { slugify } from "../../data/slugify";
import * as XLSX from "xlsx";
import { oilFieldToExcel } from "../dataView/exportToExcel";
import { gameData } from "../../data/gameData";

export function OilFieldTable({ field }: { field: string }) {
  function handleExportClick() {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(oilFieldToExcel(field)),
      field,
    );
    XLSX.writeFile(workbook, `oil-field-data-${slugify(field)}.xlsx`);
  }

  return (
    <div>
      <div>
        <button onClick={handleExportClick}>Last ned som Excel</button>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th>År</th>
            <th>Olje</th>
            <th>Gass</th>
            <th>Utslipp</th>
            <th>Utslippsintensitet</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gameData.data[field]).map(([year, fieldValues]) => (
            <tr key={year}>
              <th>{year}</th>
              {(
                [
                  "productionOil",
                  "productionGas",
                  "emission",
                  "emissionIntensity",
                ] as const
              )
                .map((dataField) => ({
                  dataField,
                  data: fieldValues[dataField] || undefined,
                }))
                .map(({ dataField, data }) => (
                  <td
                    key={dataField}
                    className={data?.estimate ? "estimate" : undefined}
                  >
                    {data?.value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
