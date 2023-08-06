import React, { useEffect, useState, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { IconContext } from "react-icons"

function EthTxStructureType() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 1: Structure Type</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>TX Builder Dashboard</p>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>Current Balance:</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Estimated Available:</p>
          </div>

          <div className="tx-builder__overlay__outer"></div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default EthTxStructureType
