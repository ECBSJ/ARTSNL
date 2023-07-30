import React, { useEffect, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { Tooltip } from "react-tooltip"
import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { MdInput, MdOutput } from "react-icons/md"
import { BsFillFileEarmarkPlusFill, BsFileEarmarkLock2Fill, BsFillFileEarmarkTextFill, BsFileEarmarkDiffFill } from "react-icons/bs"
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
                    <MdInput style={{ marginRight: "6px" }} /> Inputs &#91;{appState.bitcoin.txBuilder.selectedArray.length === 0 ? 0 : appState.bitcoin.txBuilder.selectedArray.length}&#93; <FaQuestionCircle id="Tooltip" data-tooltip-content={"Select any available UTXO as an input to your tx build."} style={{ width: "16px", height: "16px", marginLeft: "7px" }} className="icon" />
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
                          <button key={index} className="put-capsule">
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
                    <MdOutput style={{ marginRight: "6px" }} /> Outputs &#91;{appState.bitcoin.txBuilder.outputs_Array.length}&#93; <FaQuestionCircle id="Tooltip" data-tooltip-content={"Specify amount you want to send out to a receiver address as an output."} style={{ width: "16px", height: "16px", marginLeft: "7px" }} className="icon" />
                  </span>
                </div>
                <div className="tx-builder__blueprint-dashboard__puts-container-row2">
                  {appState.bitcoin.txBuilder.outputs_Array.length === 0 && appState.bitcoin.txBuilder.selectedArray.length === 0 ? (
                    ""
                  ) : appState.bitcoin.txBuilder.outputs_Array.length > 0 ? (
                    <>
                      {appState.bitcoin.txBuilder.outputs_Array.map((output, index) => {
                        return (
                          <button key={index} className="put-capsule">
                            <BsFillFileEarmarkTextFill style={{ marginRight: "6px" }} />
                            <div style={{ textAlign: "left", fontSize: "0.9em" }}>
                              <span>To: ...{output.validInputtedAddress.slice(-4)}</span>
                              <br />
                              <span>Value: {output.sendAmount}</span>
                              <br />
                              <span>Index: &#91;{index}&#93;</span>
                            </div>
                            <BiExpand />
                          </button>
                        )
                      })}
                    </>
                  ) : (
                    <>
                      <button onClick={() => setTxStatus(2)} className="put-capsule">
                        <BsFillFileEarmarkPlusFill style={{ marginRight: "6px" }} /> Add Output
                      </button>
                    </>
                  )}

                  {appState.bitcoin.txBuilder.estimatedRemainingAmount > 0 && (
                    <button onClick={() => setTxStatus(2)} className="put-capsule">
                      <BsFileEarmarkDiffFill style={{ marginRight: "6px" }} />
                      <div style={{ textAlign: "left", fontSize: "0.9em" }}>
                        <span>Remainder: {appState.bitcoin.txBuilder.estimatedRemainingAmount}</span>
                        <br />
                        <span>Default Return Address: Your Wallet</span>
                        <br />
                        <span>Or Click to add new Output</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer">
            {appState.bitcoin.txBuilder.outputs_Array.length > 0 ? (
              <>
                <button onClick={() => setTxStatus(5)} className="button-purple">
                  Sign Inputs
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </IconContext.Provider>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
    </>
  )
}

export default BtcTxDashboard
