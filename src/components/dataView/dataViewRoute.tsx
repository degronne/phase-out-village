import React from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { slugify } from "../../data/slugify";
import { OilFieldTable } from "../map/oilFieldTable";
import { DataFieldTable } from "./dataFieldTable";
import * as XLSX from "xlsx";
import { dataFieldToExcel, oilFieldToExcel } from "./exportToExcel";
import { gameData } from "../../data/gameData";

function OilProductionTable() {
  return (
    <>
      <h2>Oversikt over oljeproduksjon</h2>
      <DataFieldTable dataField={"productionOil"} />
    </>
  );
}

function GasProductionTable() {
  return (
    <>
      <h2>Oversikt over gassproduksjon</h2>
      <DataFieldTable dataField={"productionGas"} />
    </>
  );
}

function EmissionTable() {
  return (
    <>
      <h2>Utslipp</h2>
      <DataFieldTable dataField={"emission"} />
    </>
  );
}

function FieldTableWrapper() {
  const { oilFieldSlug } = useParams();
  const field = gameData.allFields.find((s) => slugify(s) === oilFieldSlug);
  if (!field) return <h2>Fant ikke {oilFieldSlug}</h2>;

  return (
    <>
      <h2>{field}</h2>
      <p>
        <Link to={"/data"}>Tilbake</Link>
      </p>
      <OilFieldTable field={field} />
    </>
  );
}

function FieldOverview() {
  function handleClickAllDataFieldsToExcel() {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(dataFieldToExcel("productionOil")),
      "Oljeproduksjon",
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(dataFieldToExcel("productionGas")),
      "Gassproduksjon",
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(dataFieldToExcel("emission")),
      "Utslipp",
    );
    XLSX.writeFile(workbook, `phaseout-all-fields.xlsx`);
  }

  function handleClickAllOilFieldsToExcel() {
    const workbook = XLSX.utils.book_new();
    for (const oilField of Object.keys(gameData.data)) {
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(oilFieldToExcel(oilField)),
        oilField,
      );
    }
    XLSX.writeFile(workbook, `oil-field-data.xlsx`);
  }

  return (
    <>
      <h2>Dataoversikt</h2>
      <button onClick={handleClickAllDataFieldsToExcel}>
        Eksporter alle til Excel
      </button>
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
      <button onClick={handleClickAllOilFieldsToExcel}>
        Eksporter alle til Excel
      </button>
      <ul>
        {Object.keys(gameData.data).map((oilField) => (
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
