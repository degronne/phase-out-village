import React, { useContext } from "react";
import { FaRecycle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApplicationContext } from "../../applicationContext";
import { MdEdit } from "react-icons/md";

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
      {/* <a href="https://mdg.no/politikk/utfasing">
        <img
          src={
            "https://d1nizz91i54auc.cloudfront.net/_service/505811/display/img_version/8880781/t/1750686348/img_name/68683_505811_ba2eeb201a.png.webp"
          }
          alt={"MDG - det ER mulig"}
        />
      </a> */}

      {/* <div style={{ display: "flex", flex: 0, flexDirection: "column", placeSelf: "center", width: "auto", }}>
            <div
              style={{ placeSelf: "center", fontWeight: "bold" }}
            >
              {Object.keys(phaseOut).length}
            </div>
            <div>
              oljefelter avviklet
            </div>
          </div> */}

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

          {gameEnded || (
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
          )}

          {gameEnded || (
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
          )}

        </div>
      )}

    </footer>
  );
}
