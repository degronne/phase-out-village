import React, { useContext, useState } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { ProductionSummaryCard } from "../production/productionSummaryCard";
import { FaPlay, FaInfoCircle, FaRedo, FaRecycle, FaMap } from "react-icons/fa";
import { MdBarChart, MdHelp, MdInfo, MdOutlineBarChart } from "react-icons/md";
import logo from "./MDG_Logo_2025.png"
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { ProgressBar, YearProgress } from "../ui/progressionBar";

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
    <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: "0.5rem" }}>

      {/* <div style={{ marginBottom: "0.25rem" }}>
        Periode: {year}-{parseInt(year) + 3}
      </div> */}

      <div
        style={{ display: "flex", flex: 1, gap: "0.5rem", margin: 0 }}
      >

        <button
          onClick={() => navigate("/map", { state: { from: location } })}
          title={`Kart`}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", height: "64px" }}
        >
          <FaMap style={{ placeSelf: "center", width: "28px", height: "28px", }} />
          <div style={{ fontSize: "1.5em" }}>
            Kart
          </div>
        </button>

        <button
          onClick={() => navigate("/plan", { state: { from: location } })}
          title={`Plan`}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", height: "64px" }}
        >
          <BiSolidBarChartAlt2 style={{ placeSelf: "center", width: "32px", height: "32px", }} />
          <div style={{ fontSize: "1.5em" }}>
            Plan
          </div>
        </button>

        {/* <button
          onClick={() => navigate("/tutorial", { state: { from: location } })}
          title={`Hvordan spiller jeg?`}
          style={{ display: "flex", flex: 0, flexDirection: "column", gap: "0.25rem", aspectRatio: "1 / 1", padding: "0.75rem", width: "64px", height: "64px" }}
        >
          <MdInfo style={{ placeSelf: "center", width: "100%", height: "100%", }} />
        </button>

        <button
          onClick={restart}
          title={`Start på nytt`}
          style={{ display: "flex", flex: 0, flexDirection: "column", gap: "0.25rem", aspectRatio: "1 / 1", padding: "0.75rem", width: "64px", height: "64px" }}
        >
          <FaRedo style={{ placeSelf: "center", width: "100%", height: "100%", }} />
        </button> */}


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
  const { year, restart, phaseOut, phaseOutDraft } = useContext(ApplicationContext);
  const location = useLocation();
  const gameEnded = year === "2040";
  const navigate = useNavigate();

  return (
    <header>
      <div style={{ display: "flex", flexDirection: "column" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "0.75rem", paddingRight: "0.75rem", paddingTop: "0.20rem", paddingBottom: "0.20rem" }}>

          <div style={{ height: "100%", display: "flex", flexDirection: "row", alignItems: "center" }}>
            <a href="https://mdg.no/politikk/utfasing">
              <img
                style={{ maxWidth: "196px" }}
                src={
                  "https://d1nizz91i54auc.cloudfront.net/_service/505811/display/img_version/8880781/t/1750686348/img_name/68683_505811_ba2eeb201a.png.webp"
                }
                alt={"MDG - det ER mulig"}
              />
            </a>
            {/* <a href="https://mdg.no/politikk/utfasing">
            <img
              style={{ maxWidth: "64px" }}
              src={logo}
              alt={"MDG - det ER mulig"}
            />
          </a> */}
            <div style={{ height: "50%", width: "1px", backgroundColor: "white", marginRight: "1.5rem" }}></div>
            <div>Oljespillet</div>
          </div>

          <div>
            <ActionCard />
          </div>

          <div>

            <div style={{ height: "100%", display: "flex", flex: 1, justifyContent: "end", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ height: "75%", width: "0.125rem", backgroundColor: "grey", opacity: "0.25", marginLeft: "0.5rem", marginRight: "0.5rem" }}></div>

              <button
                onClick={() => navigate("/tutorial", { state: { from: location } })}
                title={`Hvordan spiller jeg?`}
                style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.75rem", height: "64px" }}
              >
                <MdHelp style={{ placeSelf: "center", width: "32px", height: "32px", }} />
                <div style={{ fontSize: "1.5em" }}>
                  Hjelp
                </div>
              </button>

              <button
                onClick={restart}
                title={`Start på nytt`}
                style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.75rem", height: "64px" }}
              >
                <FaRedo style={{ placeSelf: "center", width: "24px", height: "24px", }} />
                <div style={{ fontSize: "1.5em" }}>
                  Restart
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* <div className="progress-container">
          <div className="progress-bar" id="progress-bar"></div>
        </div> */}
        <YearProgress />

      </div>

      {/* <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: "0.5rem", paddingTop: "0.25rem" }}>
        <Link
          to={"/plan"}
          style={{ marginBottom: "0.25rem" }}
        >
          <strong>Din plan:</strong>
        </Link>

        <div
          style={{ display: "flex", flex: 1, gap: "0.5rem", }}
        >

          <div
            style={{ display: "flex", flex: 1, gap: "0.5rem", }}
          >

            {gameEnded || (
              <button
                disabled={gameEnded}
                onClick={() => navigate("/phaseout", { state: { from: location } })}
                title={`Velg felter for avvikling`}
                style={{ display: "flex", flex: 0, flexDirection: "column", gap: "0.25rem", aspectRatio: "1 / 1", padding: "0.75rem", width: "64px", height: "64px" }}
              >
                <FaRecycle style={{ placeSelf: "center", width: "100%", height: "100%", }} />
              </button>
            )}

            <div
              style={{ display: "flex", flex: 1, flexDirection: "column", maxHeight: "64px", overflowY: "auto", borderRadius: "0.5rem", }}
            >
              <div
                style={{ padding: "0.25rem", }}
              >
                Valgte oljefelt ({Object.keys(phaseOutDraft).length}):
              </div>
              <div
                style={{ padding: "0.25rem", color: "white", }}
              >
                {Object.keys(phaseOutDraft).join(", ")}
              </div>
            </div>

          </div>

          <div style={{ height: "100%", width: "0.125rem", backgroundColor: "grey", opacity: "0.25", marginLeft: "0.5rem", marginRight: "0.5rem" }}></div>

          <div
            style={{ display: "flex", flex: 0, flexDirection: "column", placeSelf: "center", width: "auto", }}
          >
            <div
              style={{ placeSelf: "center", fontWeight: "bold" }}
            >
              {Object.keys(phaseOut).length}
            </div>
            <div>
              oljefelter avviklet
            </div>
          </div>

        </div>

      </div> */}

      {/* <EmissionSummaryCard />
      <ProductionSummaryCard /> */}

      {/* <div style={{ display: "flex", flex: 1, justifyContent: "end" }}>
        <button
          onClick={() => navigate("/tutorial", { state: { from: location } })}
          title={`Hvordan spiller jeg?`}
          style={{ display: "flex", flex: 0, flexDirection: "column", gap: "0.25rem", aspectRatio: "1 / 1", padding: "0.75rem", width: "64px", height: "64px" }}
        >
          <MdInfo style={{ placeSelf: "center", width: "100%", height: "100%", }} />
        </button>

        <button
          onClick={restart}
          title={`Start på nytt`}
          style={{ display: "flex", flex: 0, flexDirection: "column", gap: "0.25rem", aspectRatio: "1 / 1", padding: "0.75rem", width: "64px", height: "64px" }}
        >
          <FaRedo style={{ placeSelf: "center", width: "100%", height: "100%", }} />
        </button>
      </div> */}

    </header>
  );
}
