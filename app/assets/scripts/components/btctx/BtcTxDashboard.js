import React, { useEffect, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { MdInput, MdOutput } from "react-icons/md"
import { BsFillFileEarmarkPlusFill, BsFileEarmarkLock2Fill } from "react-icons/bs"
import { BiExpand, BiCollapse } from "react-icons/bi"

function BtcTxDashboard({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  function navigateToSelectUtxo() {
    setTxStatus(1)
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">BTC TX Dashboard</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>TX Builder Overview</p>

            <div className="tx-builder__blueprint-dashboard">
              <div className="tx-builder__blueprint-dashboard__puts-container">
                <div className="tx-builder__blueprint-dashboard__puts-container-row1">
                  <span style={{ cursor: "default" }} className="display-flex">
                    <MdInput style={{ marginRight: "6px" }} /> Inputs &#91;{"0"}&#93; <FaQuestionCircle style={{ width: "16px", height: "16px", marginLeft: "7px" }} className="icon" />
                  </span>
                </div>
                <div className="tx-builder__blueprint-dashboard__puts-container-row2">
                  {appState.bitcoin.txBuilder.selectedArray.length === 0 ? (
                    <button onClick={() => navigateToSelectUtxo()} className="put-capsule">
                      <BsFillFileEarmarkPlusFill style={{ marginRight: "6px" }} /> Add Inputs
                    </button>
                  ) : (
                    <>
                      {appState.bitcoin.txBuilder.selectedArray.map((selectedUtxo, index) => {
                        return (
                          <button className="put-capsule">
                            <BsFileEarmarkLock2Fill style={{ marginRight: "6px" }} />
                            <div style={{ textAlign: "left", fontSize: "0.9em" }}>
                              <span>UTXO: ...{appState.bitcoin.txBuilder.utxoData_Array[selectedUtxo].txid.slice(-4)}</span>
                              <br />
                              <span>Value: {appState.bitcoin.txBuilder.utxoData_Array[selectedUtxo].value}</span>
                              <br />
                              <span>Index: &#91;{index}&#93;</span>
                            </div>
                            <BiExpand />
                          </button>
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
              <div style={{ marginTop: "1px" }} className="tx-builder__blueprint-dashboard__puts-container">
                <div className="tx-builder__blueprint-dashboard__puts-container-row1">
                  <span style={{ cursor: "default" }} className="display-flex">
                    <MdOutput style={{ marginRight: "6px" }} /> Outputs &#91;{"0"}&#93; <FaQuestionCircle style={{ width: "16px", height: "16px", marginLeft: "7px" }} className="icon" />
                  </span>
                </div>
                <div className="tx-builder__blueprint-dashboard__puts-container-row2"></div>
              </div>
            </div>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer"></div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default BtcTxDashboard
