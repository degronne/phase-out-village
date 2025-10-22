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
import { FcViewDetails } from "react-icons/fc";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";

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
  const isSmall = useIsSmallScreen();
  const gameEnded = year === "2040";

  // // If the game has ended, show summary and restart buttons
  if (gameEnded)
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "2em" }}>Året er nå 2040.</div>

          <button
            onClick={() => navigate("/summary", { state: { from: location } })}
            title={`Oppsummering`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", height: "64px" }}
          >
            <FcViewDetails style={{ placeSelf: "center", width: "32px", height: "32px", }} />
            <div style={{ fontSize: "1.5em" }}>
              Oppsummering
            </div>
          </button>

        </div>

      </div>
    );

  // Otherwise, show current period, buttons to select phase-out fields, tutorial, and restart
  return (
    <div style={{ height: "100%", display: "flex", flex: 1, flexDirection: "column", padding: "0.5rem" }}>

      <div
        style={{ display: "flex", alignItems: "center", flex: 1, gap: "0.5rem", margin: 0 }}
      >

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "1.0em",
          marginRight: "0rem",
          border: "1px solid #e0ffb26e",
          paddingTop: "0.25rem",
          paddingBottom: "0.25rem",
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
          borderRadius: "0.5rem"
        }}>
          {isSmall ? null : <div>Året er:</div>}
          <div style={{ fontSize: "1.25em" }}>{year}</div>
        </div>

        <div style={{ height: "75%", width: "0.125rem", backgroundColor: "grey", opacity: "0.25", marginLeft: "0.5rem", marginRight: "0.5rem" }}></div>

        <button
          onClick={() => navigate("/map", { state: { from: location } })}
          title={`Kart`}
          className={`main-button`}
        // style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: isSmall ? "0.5rem" : "0.75rem", height: isSmall ? "48px" : "64px" }}
        >
          <FaMap style={{ placeSelf: "center", width: "32px", height: "32px", }} />
          <div style={{ display: isSmall ? "none" : "block", fontSize: "1.5em" }}>
            Kart
          </div>
        </button>

        <button
          onClick={() => navigate("/plan", { state: { from: location } })}
          title={`Plan`}
          className={`main-button`}
        // style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: isSmall ? "0.5rem" : "0.75rem", height: isSmall ? "48px" : "64px" }}
        >
          <BiSolidBarChartAlt2 style={{ placeSelf: "center", width: "32px", height: "32px", }} />
          <div style={{ display: isSmall ? "none" : "block", fontSize: "1.5em" }}>
            Plan
          </div>
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
  const { year, restart, phaseOut, phaseOutDraft } = useContext(ApplicationContext);
  const location = useLocation();
  const gameEnded = year === "2040";
  const navigate = useNavigate();
  const isSmall = useIsSmallScreen();

  return (
    <header>
      <div style={{ width: "100%", display: "flex", flex: 1, flexDirection: "column", }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "0.75rem", paddingRight: "0.75rem", paddingTop: "0.20rem", paddingBottom: "0.20rem" }}>

          <div style={{ height: "100%", display: "flex", flexDirection: "row", alignItems: "center" }}>

            {isSmall ? null : (
              <a href="https://mdg.no/politikk/utfasing">
                <img
                  style={{ maxWidth: "196px" }}
                  src={
                    "https://d1nizz91i54auc.cloudfront.net/_service/505811/display/img_version/8880781/t/1750686348/img_name/68683_505811_ba2eeb201a.png.webp"
                  }
                  alt={"MDG - det ER mulig"}
                />
              </a>
            )}

            {isSmall ? null : (
              <div style={{ height: "50%", width: "1px", backgroundColor: "white", marginRight: "1.5rem" }}></div>
            )}

            <div>
              <a href="https://mdg.no/politikk/utfasing">
                Oljespillet
              </a>
            </div>

            {/* {isSmall ? 
            <div style={{ height: "75%", width: "0.125rem", backgroundColor: "grey", opacity: "0.25", marginLeft: "0.5rem", marginRight: "0.5rem" }}></div> : null
            } */}

          </div>

          <div>
            <ActionCard />
          </div>

          <div>

            <div style={{ height: "100%", display: "flex", flex: 1, justifyContent: "end", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ height: "75%", width: "0.125rem", backgroundColor: "grey", opacity: "0.25", marginLeft: "0.5rem", marginRight: "0.5rem" }}></div>

              {gameEnded || (
                <button
                  onClick={() => navigate("/tutorial", { state: { from: location } })}
                  title={`Hvordan spiller jeg?`}
                  className={`main-button`}
                // style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: isSmall ? "0.5rem" : "0.75rem", height: isSmall ? "48px" : "64px" }}
                >
                  <MdHelp style={{ placeSelf: "center", width: "32px", height: "32px", }} />
                  <div style={{ display: isSmall ? "none" : "block", fontSize: "1.5em" }}>
                    Hjelp
                  </div>
                </button>
              )}

              <button
                onClick={restart}
                title={`Start på nytt`}
                className={`main-button`}
              // style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: isSmall ? "0.5rem" : "0.75rem", height: isSmall ? "48px" : "64px" }}
              >
                <FaRedo style={{ placeSelf: "center", width: "24px", height: "24px", }} />
                <div style={{ display: isSmall ? "none" : "block", fontSize: "1.5em" }}>
                  Restart
                </div>
              </button>

            </div>
          </div>

        </div>

        <YearProgress />

      </div>

    </header>
  );
}
