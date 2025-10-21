import React, { useContext } from "react";
import { FaRecycle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApplicationContext } from "../../applicationContext";
import { MdEdit } from "react-icons/md";
import { gameData } from "../../data/gameData";

export function ApplicationFooter() {

  const { year, phaseOut, proceed, setPhaseOut, phaseOutDraft, setPhaseOutDraft } = useContext(ApplicationContext);
  const draft = phaseOutDraft;
  const navigate = useNavigate();
  const location = useLocation();
  const gameEnded = year === "2040";

  function runPhaseOut() {
    setPhaseOut((phaseOut) => ({ ...phaseOut, ...draft }));
    setPhaseOutDraft({}); // Clear the draft after submit
    proceed();
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

          {/* <div style={{ display: "flex", flex: 0, flexDirection: "column", placeSelf: "center", width: "auto", marginRight: "0.5rem" }}>
            <div
              style={{ placeSelf: "center", fontWeight: "bold", }}
            >
              {Object.keys(phaseOut).length} / {gameData.allFields.length}
            </div>
            <div>
              oljefelter avviklet
            </div>
          </div> */}

          {/* <div style={{ height: "100%", width: "0.125rem", backgroundColor: "grey", opacity: "0.25", marginLeft: "0.5rem", marginRight: "0.5rem" }}></div> */}

          <button
            disabled={gameEnded}
            onClick={() => navigate("/phaseout", { state: { from: location } })}
            title={`Velg felter for avvikling`}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.75rem", height: "64px" }}
          >
            <MdEdit style={{ placeSelf: "center", width: "32px", height: "32px", }} />
            <div style={{ fontSize: "1.5em" }}>
              Velg oljefelt å stenge
            </div>
          </button>

          <button
            disabled={gameEnded}
            onClick={() => runPhaseOut()}
            title={`Kjør avvikling!`}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.75rem", height: "64px" }}
          >
            <FaRecycle style={{ placeSelf: "center", width: "32px", height: "32px", }} />
            <div style={{ fontSize: "1.5em" }}>
              Avvikle!
            </div>
          </button>

        </div>
      )}

    </footer>
  );
}
