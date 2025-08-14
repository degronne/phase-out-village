import React from "react";
import { DatasetForSingleField } from "../../data/types";

export function ProductionTable({
  field,
  dataseries,
}: {
  field: string;
  dataseries: DatasetForSingleField;
}) {
  return (
    <>
      <p>Produksjon for {field}</p>
      <table>
        <thead>
          <tr>
            <th>År</th>
            <th>Produksjon</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(dataseries).map(([year, value]) => (
            <tr>
              <td>{year}</td>
              <td className={value.productionOil?.estimate ? "projected" : ""}>
                {value.productionOil?.value.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
