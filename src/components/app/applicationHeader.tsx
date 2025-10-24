import React, { useContext, useState } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { ProductionSummaryCard } from "../production/productionSummaryCard";
import { FaPlay, FaInfoCircle, FaRedo, FaRecycle, FaMap } from "react-icons/fa";
import { MdBarChart, MdHelp, MdInfo, MdOutlineBarChart } from "react-icons/md";
import logo from "./MDG_Logo_2025.png"
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { MainProgressBar, YearProgress } from "../ui/mainProgressionBar";
import { FcViewDetails } from "react-icons/fc";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { MainButton } from "../ui/mainButton";

/**
 * ActionCard component renders a card with actions depending on the current game year.
 * Shows different buttons depending on whether the game has ended (year 2040) or not.
 *
 * Uses ApplicationContext to access current year and restart function.
 * Uses React Router's `useNavigate` and `useLocation` to navigate between routes.
 */
function ActionCard() {
  const { year, endYear, restart, getCurrentRound, getTotalRounds } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isSmall = useIsSmallScreen();
  const gameEnded = year === endYear.toString();

  // // If the game has ended, show summary and restart buttons
  if (gameEnded)
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* <div style={{ fontSize: "2em" }}>Året er nå 2040.</div> */}
          <div className={`info-card`}>
            <div>
              <div style={{ fontSize: isSmall ? "1em" : "1.25em", paddingLeft: isSmall ? "0.5rem" : "0.75rem", paddingRight: isSmall ? "0.5rem" : "0.75rem" }}>
                {isSmall ? year : parseInt(year) == endYear ? year : `${year} - ${parseInt(year) + (parseInt(year) === 2025 ? 3 : 4)}`}
              </div>
            </div>
          </div>

          <MainButton
            icon={<FcViewDetails />}
            label={"Oppsummering"}
            // title="Kart"
            to="/summary"
          />

        </div>

      </div>
    );

  // Otherwise, show current period, buttons to select phase-out fields, tutorial, and restart
  return (
    <div style={{ height: "100%", display: "flex", flex: 1, flexDirection: "column", padding: "0.5rem" }}>

      <div
        style={{ display: "flex", alignItems: "center", flex: 1, gap: "0.5rem", margin: 0 }}
      >

        <div className={`info-card`}>
          <div>
            <div style={{ fontSize: isSmall ? "1em" : "1.25em", paddingLeft: isSmall ? "0.5rem" : "0.75rem", paddingRight: isSmall ? "0.5rem" : "0.75rem" }}>
              {isSmall ? year : `${year} - ${parseInt(year) + (parseInt(year) === 2025 ? 3 : 4)}`}
            </div>
          </div>
        </div>

        <div className={`info-card`} style={{ display: isSmall ? "none" : "flex" }}>
          <div style={{ fontSize: isSmall ? "1em" : "1.25em", paddingLeft: isSmall ? "0.5rem" : "0.75rem", paddingRight: isSmall ? "0.5rem" : "0.75rem" }}>Runde:</div>
          <div style={{ fontSize: isSmall ? "1em" : "1.25em", paddingLeft: "0rem", paddingRight: isSmall ? "0.5rem" : "0.75rem" }}>{getCurrentRound()} / {getTotalRounds()}</div>
        </div>

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

          {isSmall ? null : (
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

              <div style={{ height: "50%", width: "1px", backgroundColor: "white", marginRight: "1.5rem" }}></div>
              <div>
                <a href="https://mdg.no/politikk/utfasing">
                  Oljespillet
                </a>
              </div>


            </div>
          )}

          <div>
            <ActionCard />
          </div>

          <div>

            <div style={{ height: "100%", display: "flex", flex: 1, justifyContent: "end", alignItems: "center", gap: "0.5rem" }}>

              <MainButton
                icon={<FaMap />}
                label={"Kart"}
                // title="Kart"
                to="/map"
              />

              <MainButton
                icon={<BiSolidBarChartAlt2 />}
                label={"Plan"}
                to="/plan"
              />

              {gameEnded || (
                <MainButton
                  icon={<MdHelp />}
                  label={"Hjelp"}
                  title="Hjelp"
                  to="/tutorial"
                />
              )}

              <div style={{ height: "75%", width: "0.125rem", backgroundColor: "grey", opacity: "0.25", marginLeft: "0.5rem", marginRight: "0.5rem" }}></div>

              <MainButton
                icon={<FaRedo />}
                label={"Restart"}
                title="Start på nytt"
                onClick={restart}
              />

            </div>
          </div>

        </div>

        <YearProgress />

      </div>

    </header>
  );
}
