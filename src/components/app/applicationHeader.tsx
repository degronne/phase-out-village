import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { ProductionSummaryCard } from "../production/productionSummaryCard";
import { FaPlay, FaInfoCircle, FaRedo, FaRecycle, FaMap } from "react-icons/fa";
import { MdInfo } from "react-icons/md";

/**
 * ActionCard component renders a card with actions depending on the current game year.
 * Shows different buttons depending on whether the game has ended (year 2040) or not.
 *
 * Uses ApplicationContext to access current year and restart function.
 * Uses React Router's `useNavigate` and `useLocation` to navigate between routes.
 */
function ActionCard() {
  const { year, restart } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const gameEnded = year === "2040";

  // // If the game has ended, show summary and restart buttons
  if (gameEnded)
    return (
      <div>
        År: 2040
        <div>
          <button
            onClick={() => navigate("/summary", { state: { from: location } })}
          >
            Vis oppsummering
          </button>
        </div>
        <div>
          <button onClick={restart}>Start på nytt</button>
        </div>
      </div>
    );

  // Otherwise, show current period, buttons to select phase-out fields, tutorial, and restart
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: "0.5rem", paddingTop: "0.25rem" }}>

      <div style={{ marginBottom: "0.25rem" }}>
        Periode: {year}-{parseInt(year) + 3}
      </div>

      <div
        style={{ display: "flex", flex: 1, gap: "0.5rem", margin: 0 }}
      >

        <button
          onClick={() => navigate("/map", { state: { from: location } })}
          title={`Kart`}
          style={{ display: "flex", flex: 0, flexDirection: "column", gap: "0.25rem", aspectRatio: "1 / 1", padding: "0.75rem", width: "64px", height: "64px" }}
        >
          <FaMap style={{ placeSelf: "center",  width: "100%", height: "100%", }} />
          {/* <div>Instrukser</div> */}
        </button>

        {gameEnded || (
          <button
            disabled={gameEnded}
            onClick={() => navigate("/phaseout", { state: { from: location } })}
            title={`Velg felter for avvikling`}
            style={{ display: "flex", flex: 0, flexDirection: "column", gap: "0.25rem", aspectRatio: "1 / 1", padding: "0.75rem", width: "64px", height: "64px" }}
          >
            <FaRecycle style={{ placeSelf: "center", width: "100%", height: "100%", }} />
            {/* <div>Avvikle felt</div> */}
          </button>
        )}

        <button
          onClick={() => navigate("/tutorial", { state: { from: location } })}
          title={`Hvordan spiller jeg?`}
          style={{ display: "flex", flex: 0, flexDirection: "column", gap: "0.25rem", aspectRatio: "1 / 1", padding: "0.75rem", width: "64px", height: "64px" }}
        >
          <MdInfo style={{ placeSelf: "center",  width: "100%", height: "100%", }} />
          {/* <div>Instrukser</div> */}
        </button>

        <button
          onClick={restart}
          title={`Start på nytt`}
          style={{ display: "flex", flex: 0, flexDirection: "column", gap: "0.25rem", aspectRatio: "1 / 1", padding: "0.75rem", width: "64px", height: "64px" }}
        >
          <FaRedo style={{ placeSelf: "center", width: "100%", height: "100%", }} />
          {/* <div>Start på nytt</div> */}
        </button>


      </div>

    </div>
  );
}

/**
 * ApplicationHeader component renders the top section of the app.
 * Includes:
 * - ActionCard with available actions
 * - Summary of fields phased out (from phaseOut schedule)
 * - EmissionSummaryCard and ProductionSummaryCard
 *
 * Uses ApplicationContext to get `phaseOut` data.
 */
export function ApplicationHeader() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <header>
      <ActionCard />
      <div style={{ padding: "0.5rem", paddingTop: "0.25rem" }}>
        <strong>
          <Link to={"/plan"}>Din plan:</Link>
        </strong>
        <div>
          {Object.keys(phaseOut).length} <Link to="/map">oljefelter</Link>{" "}
          avviklet
        </div>
      </div>
      <EmissionSummaryCard />
      <ProductionSummaryCard />
    </header>
  );
}
