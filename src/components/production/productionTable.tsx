import { YearlyDataset } from "../../data/data";
import React from "react";

export function ProductionTable({
  field,
  dataseries,
}: {
  field: string;
  dataseries: YearlyDataset;
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
              <td className={value.estimate ? "projected" : ""}>
                {value.value.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
