import React from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { oilfieldNames, slugify, Slugify, yearsInRange } from "../../data/data";
import { OilfieldName } from "../../data/types";
import { data } from "../../generated/data";
import { OilFieldTable } from "../map/oilFieldTable";
import { fullData } from "../../data/projections";
import * as XLSX from "xlsx";

function DataTable({
  dataField,
}: {
  dataField: "productionOil" | "productionGas" | "emission";
}) {
  function handleExportClick() {
    const rows = yearsInRange(2000, 2040).map((year) => ({
      year,
      ...Object.fromEntries(
        Object.keys(fullData).map((field) => [
          field,
          fullData[field][year]?.[dataField] || undefined,
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
        <Link to={"/data"}>Tilbake</Link>
      </div>
      <div>
        <button onClick={handleExportClick}>Last ned som Excel</button>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th className="rowHeader">År</th>
            {Object.keys(fullData).map((field) => (
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
              {Object.keys(fullData).map((field) => (
                <td key={field}>
                  {fullData[field][year]?.[dataField] || undefined}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
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
  const name = oilfieldNames[oilFieldSlug as Slugify<OilfieldName>];
  if (!name) return <h2>Fant ikke {oilFieldSlug}</h2>;

  return (
    <>
      <h2>{name}</h2>
      <p>
        <Link to={"/data"}>Tilbake</Link>
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
          <Link to={"/data/oil"}>Produksjonsoversikt (olje)</Link>
        </li>
        <li>
          <Link to={"/data/gas"}>Produksjonsoversikt (gass)</Link>
        </li>
        <li>
          <Link to={"/data/emission"}>Utslippsoversikt</Link>
        </li>
      </ul>
      <h2>Oil fields</h2>
      <ul>
        {Object.keys(data).map((oilField) => (
          <li key={slugify(oilField)}>
            <Link to={`/data/${slugify(oilField)}`}>{oilField}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function DataViewRoute() {
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
