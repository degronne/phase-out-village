import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { slugify, yearsInRange } from "../../data/data";
import React from "react";
import { dataFieldToExcel } from "./exportToExcel";
import { gameData } from "../../data/gameData";

export function DataFieldTable({
  dataField,
}: {
  dataField: "productionOil" | "productionGas" | "emission";
}) {
  function handleExportClick() {
    const worksheet = XLSX.utils.json_to_sheet(dataFieldToExcel(dataField));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, dataField);
    XLSX.writeFile(workbook, `phaseout-${dataField}-all-fields.xlsx`);
  }

  return (
    <>
      <div>
        <Link to={"/data"}>Tilbake</Link>
      </div>
      <div>
        <button onClick={handleExportClick}>Last ned som Excel</button>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th className="rowHeader">År</th>
            {Object.keys(gameData.data).map((field) => (
              <th key={field}>
                <Link to={`/data/${slugify(field)}`}>{field}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {yearsInRange(2000, 2040).map((year) => (
            <tr key={year}>
              <th className="rowHeader">{year}</th>
              {Object.entries(gameData.data)
                .map(([field, values]) => ({
                  field,
                  data: values?.[year]?.[dataField] || undefined,
                }))
                .map(({ field, data }) => (
                  <td
                    key={field}
                    className={data?.estimate ? "estimate" : undefined}
                  >
                    {data?.value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
