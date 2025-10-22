import React, { useContext } from "react";
import { FaRecycle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApplicationContext } from "../../applicationContext";
import { MdDelete, MdEdit } from "react-icons/md";
import { gameData } from "../../data/gameData";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";

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

  function clearSelection(){
    setPhaseOutDraft({});
  }

  return (
    <footer>

      {gameEnded ? <div style={{ height: "64px" }}></div> : (
        <div style={{ display: "flex", flex: 1, gap: "0.5rem", }}>

          <div style={{ display: "flex", flex: 1, gap: "0.5rem", }}>

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

          <button
            disabled={gameEnded}
            onClick={() => navigate("/phaseout", { state: { from: location } })}
            title={`Velg felter for avvikling`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: isSmall ? "0.5rem" : "0.75rem", height: isSmall ? "48px" : "64px" }}
          >
            <MdEdit style={{ placeSelf: "center", width: "32px", height: "32px", }} />
            <div style={{ display: isSmall ? "none" : "block", fontSize: isSmall ? "1.25em" : "1.5em" }}>
              { isSmall ? `Velg felt` : `Velg oljefelt å stenge`}
            </div>
          </button>

          <button
            disabled={gameEnded}
            onClick={() => clearSelection()}
            title={`Tilbakestill valgte oljefelt`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: isSmall ? "0.5rem" : "0.75rem", height: isSmall ? "48px" : "64px" }}
          >
            <MdDelete style={{ placeSelf: "center", width: "32px", height: "32px", }} />
            <div style={{ display: isSmall ? "none" : "block", fontSize: isSmall ? "1.25em" : "1.5em" }}>
              Tøm valg
            </div>
          </button>

          <button
            disabled={gameEnded}
            onClick={() => runPhaseOut()}
            title={`Kjør avvikling!`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: isSmall ? "0.5rem" : "0.75rem", height: isSmall ? "48px" : "64px" }}
          >
            <FaRecycle style={{ placeSelf: "center", width: "32px", height: "32px", }} />
            <div style={{ fontSize: isSmall ? "1.25em" : "1.5em" }}>
              Avvikle!
            </div>
          </button>

        </div>
      )}

    </footer>
  );
}
