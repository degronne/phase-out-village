import React, { useContext } from "react";
import { FaRecycle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApplicationContext } from "../../applicationContext";
import { MdDelete, MdEdit } from "react-icons/md";
import { gameData } from "../../data/gameData";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { RxReset } from "react-icons/rx";
import { MainButton } from "../ui/mainButton";

export function ApplicationFooter() {

  const { year, phaseOut, proceed, setPhaseOut, phaseOutDraft, setPhaseOutDraft } = useContext(ApplicationContext);
  const draft = phaseOutDraft;
  const navigate = useNavigate();
  const location = useLocation();
  const isSmall = useIsSmallScreen();
  const gameEnded = year === "2040";

  function runPhaseOut() {
    setPhaseOut((phaseOut) => ({ ...phaseOut, ...draft }));
    setPhaseOutDraft({}); // Clear the draft after submit
    proceed();
  }

  function clearSelection() {
    setPhaseOutDraft({});
  }

  return (
    <footer>

      {gameEnded ? <div style={{ height: "64px" }}></div> : (
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "0.5rem", }}>

          <div style={{ display: "flex", flex: 1, alignSelf: "start", gap: "0.5rem", }}>

            <div
              style={{ display: "flex", flex: 1, flexDirection: "column", maxHeight: "64px", overflowY: "auto", borderRadius: "0.5rem", }}
            >
              <div style={{ padding: "0.0rem", }}>
                Valgte oljefelt ({Object.keys(phaseOutDraft).length}):
              </div>
              <div
                style={{ padding: "0.0rem", color: "white", }}
              >
                {Object.keys(phaseOutDraft).join(", ")}
              </div>
            </div>

          </div>

          <div style={{ height: "100%", width: "0.125rem", backgroundColor: "grey", opacity: "0.25", marginLeft: "0.5rem", marginRight: "0.5rem" }}></div>

          <MainButton
            icon={<MdEdit />}
            label={"Velg felter for avvikling"}
            title="Velg felter for avvikling"
            disabled={gameEnded}
            to={`/phaseout`}
          />

          <MainButton
            icon={<RxReset />}
            label={"Tøm valg"}
            title="Tilbakestill valgte oljefelt"
            disabled={gameEnded || (Object.keys(phaseOutDraft).length < 1)}
            onClick={() => clearSelection()}
          />

          <MainButton
            icon={<FaRecycle />}
            label={"Avvikle!"}
            disabled={gameEnded}
            count={Object.keys(phaseOutDraft).length > 0 ? Object.keys(phaseOutDraft).length : undefined}
            onClick={() => runPhaseOut()}
          />

          {/* <MainButton
            icon={<FaRecycle />}
            label={"Avvikle!"}
            disabled={gameEnded}
            onClick={() => runPhaseOut()}
          /> */}

        </div>
      )}

    </footer>
  );
}
