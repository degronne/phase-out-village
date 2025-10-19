import React from "react";
import { DatasetForSingleField } from "../../data/types";

/**
 * Renders a table showing production for a single field over the years.
 *
 * @param field - Name of the oil/gas field.
 * @param dataseries - Object mapping years to production data for the field.
 */
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
