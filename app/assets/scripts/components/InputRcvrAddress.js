import React, { useEffect, useContext } from "react"
import { IconContext } from "react-icons"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function InputRcvrAddress() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 2: Input Rcvr Address</div>

          <div className="tx-builder__blueprint">
            <div className="input-container">
              <input className="input-white" type="text" required />
              <span className="input-placeholder">Input Rcvr Add</span>
            </div>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer">
            <button onClick={() => null} className="button-purple">
              Next
            </button>
          </div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default InputRcvrAddress
