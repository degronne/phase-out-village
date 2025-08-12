import React, { useContext } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import {
  calculateEmissions,
  calculateGasProduction,
  calculateOilProduction,
  slugify,
} from "../../data/data";
import { data } from "../../generated/data";
import { fullData } from "../../data/projections";
import * as XLSX from "xlsx";
import { gameData } from "../../data/gameData";
import { ApplicationContext } from "../../applicationContext";
import { OilFieldDataset } from "../../types/types";
import { OilfieldName } from "../../data/types";

function DataTable({
  dataField,
}: {
  dataField: "productionOil" | "productionGas" | "emission";
}) {
  function handleExportClick() {
    const rows = gameData.gameYears.map((year) => ({
      year,
      ...Object.fromEntries(
        Object.keys(gameData.data).map((field) => [
          field,
          gameData.data[field]?.[year]?.[dataField]?.value || undefined,
        ]),
      ),
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, dataField);
    XLSX.writeFile(workbook, `phaseout-${dataField}-all-fields.xlsx`);
  }

  return (
    <>
      <div>
        <Link to={"/new"}>Tilbake</Link>
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
                <Link to={`/new/${slugify(field)}`}>{field}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gameData.gameYears.map((year) => (
            <tr key={year}>
              <th className="rowHeader">{year}</th>
              {Object.keys(fullData)
                .map((field) => ({
                  field,
                  data: gameData.data[field]?.[year]?.[dataField] || undefined,
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

export function OilFieldTable({ field }: { field: OilfieldName }) {
  const dataset = gameData.data[field];
  if (!dataset) return <h2>Not found</h2>;
  function handleExportClick() {
    const rows = gameData.gameYears.map((year) => ({
      year,
      Olje: dataset[year]?.productionOil || undefined,
      Gass: dataset[year]?.productionGas || undefined,
      Utslipp: dataset[year]?.emission || undefined,
      Utslippsintensitet: dataset[year]?.emissionIntensity || undefined,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, field);
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
          </tr>
        </thead>
        <tbody>
          {gameData.gameYears.map((year) => (
            <tr key={year}>
              <th>{year}</th>
              {(["productionOil", "productionGas", "emission"] as const)
                .map((dataField) => ({
                  dataField,
                  data: dataset[year]?.[dataField] || undefined,
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

function OilProductionTable() {
  return (
    <>
      <h2>Oversikt over oljeproduksjon</h2>
      <DataTable dataField={"productionOil"} />
    </>
  );
}

function GasProductionTable() {
  return (
    <>
      <h2>Oversikt over gassproduksjon</h2>
      <DataTable dataField={"productionGas"} />
    </>
  );
}

function EmissionTable() {
  return (
    <>
      <h2>Utslipp</h2>
      <DataTable dataField={"emission"} />
    </>
  );
}

function FieldTableWrapper() {
  const { oilFieldSlug } = useParams();
  const name = Object.keys(gameData.data).find(
    (s) => slugify(s) === oilFieldSlug,
  );
  if (!name) return <h2>Fant ikke {oilFieldSlug}</h2>;

  return (
    <>
      <h2>{name}</h2>
      <p>
        <Link to={"/new"}>Tilbake</Link>
      </p>
      <OilFieldTable field={name} />
    </>
  );
}

function FieldOverview() {
  return (
    <>
      <h2>Dataoversikt</h2>
      <ul>
        <li>
          <Link to={"/new/oil"}>Produksjonsoversikt (olje)</Link>
        </li>
        <li>
          <Link to={"/new/gas"}>Produksjonsoversikt (gass)</Link>
        </li>
        <li>
          <Link to={"/new/emission"}>Utslippsoversikt</Link>
        </li>
      </ul>
      <h2>Oil fields</h2>
      <ul>
        {Object.keys(data).map((oilField) => (
          <li key={slugify(oilField)}>
            <Link to={`/new/${slugify(oilField)}`}>{oilField}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function NewDataViewRoute() {
  return (
    <div className={"data"}>
      <Routes>
        <Route path={"/"} element={<FieldOverview />} />
        <Route path={"/oil"} element={<OilProductionTable />} />
        <Route path={"/gas"} element={<GasProductionTable />} />
        <Route path={"/emission"} element={<EmissionTable />} />
        <Route path={"/:oilFieldSlug"} element={<FieldTableWrapper />} />
      </Routes>
    </div>
  );
}
