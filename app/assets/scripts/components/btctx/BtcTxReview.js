import React, { useEffect, useContext, useState } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { IconContext } from "react-icons"
import { VscChecklist } from "react-icons/vsc"
import { MdCopyAll } from "react-icons/md"
import { CopyToClipboard } from "react-copy-to-clipboard"

function BtcTxReview({ setTxStatus }) {
  const appState = useContext(StateContext)

  const [active, setActive] = useState(1)

  function handleCopyPopup_modal() {
    document.querySelector(".icon-copy-modal").classList.toggle("icon")
    document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-modal").classList.toggle("icon")
      document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")
    }, 1000)
  }

  const [rawJSON, setRawJSON] = useState("")
  const [txHex, setTxHex] = useState("")

  useEffect(() => {
    setRawJSON(JSON.stringify(appState.bitcoin.txBuilder.psbt.extractTransaction()))
    setTxHex(appState.bitcoin.txBuilder.psbt.extractTransaction().toHex())
    console.log(appState.bitcoin.txBuilder.psbt)
    console.log(appState.bitcoin.txBuilder.psbt.extractTransaction())
  }, [])

  function handleBroadcast() {
    setTxStatus(7)
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "50px" }}>
          <div className="tx-builder__overlay__outer">Step 6: Review TX</div>

          <div className="tx-builder__blueprint">
            <div className="tx-builder__blueprint__review-overlay">
              <span>
                <VscChecklist />
              </span>
              <div className="tx-builder__blueprint__review-overlay__column-gap">
                <button onClick={() => setActive(1)} className={active == 1 ? "button--active" : ""}>
                  VIEW
                </button>
                <button onClick={() => setActive(2)} className={active == 2 ? "button--active" : ""}>
                  HEX
                </button>
                <button onClick={() => setActive(3)} className={active == 3 ? "button--active" : ""}>
                  JSON
                </button>
              </div>
              <div className="tx-builder__blueprint__review-overlay__content">
                {active == 1 ? (
                  <>
                    <ul style={{ cursor: "default" }} className="tx-builder__blueprint__review-overlay__content-no-ul-format">
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">UTXOs</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.bitcoin.txBuilder.selectedArray.length}</span>
                      </li>
                      <li style={{ marginBottom: "7px" }} className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Total Value</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.bitcoin.txBuilder.totalUtxoValueSelected}</span>
                      </li>
                      {appState.bitcoin.txBuilder.outputs_Array.map((outputObject, index) => {
                        return (
                          <>
                            <li className="tx-builder__blueprint__review-overlay__content-row">
                              <span style={{ marginLeft: "30px", color: "#8afaff" }} className="tx-builder__blueprint__review-overlay__content-row-label">
                                Rcvr
                              </span>
                              <span style={{ color: "#a9a9a9", fontSize: ".8em" }} className="tx-builder__blueprint__review-overlay__content-row-value">
                                {outputObject.validInputtedAddress.slice(0, 7) + "..." + outputObject.validInputtedAddress.slice(-7)}
                              </span>
                            </li>

                            <li className="tx-builder__blueprint__review-overlay__content-row">
                              <span style={{ marginLeft: "45px", color: "#20b2aa" }} className="tx-builder__blueprint__review-overlay__content-row-label">
                                Send Amount
                              </span>
                              <span className="tx-builder__blueprint__review-overlay__content-row-value">{outputObject.sendAmount}</span>
                            </li>
                          </>
                        )
                      })}
                      <li style={{ marginTop: "7px" }} className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Fee</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.bitcoin.txBuilder.feeAmount}</span>
                      </li>
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Network</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.isTestnet ? "Testnet" : "Mainnet"}</span>
                      </li>
                    </ul>
                  </>
                ) : (
                  ""
                )}
                {active == 2 ? (
                  <>
                    <span style={{ marginBottom: "8px", color: "#898989" }}>
                      <IconContext.Provider value={{ size: "1.3rem" }}>
                        <CopyToClipboard text={txHex} onCopy={() => handleCopyPopup_modal()}>
                          <MdCopyAll style={{ transform: "translateY(5px)" }} className="icon icon-copy icon-copy-modal" />
                        </CopyToClipboard>
                      </IconContext.Provider>
                      Copy TX Hex
                    </span>
                    {txHex}
                  </>
                ) : (
                  ""
                )}
                {active == 3 ? (
                  <>
                    <span style={{ marginBottom: "8px", color: "#898989" }}>
                      <IconContext.Provider value={{ size: "1.3rem" }}>
                        <CopyToClipboard text={rawJSON} onCopy={() => handleCopyPopup_modal()}>
                          <MdCopyAll style={{ transform: "translateY(5px)" }} className="icon icon-copy icon-copy-modal" />
                        </CopyToClipboard>
                      </IconContext.Provider>
                      Copy JSON Raw TX
                    </span>
                    {rawJSON}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="tx-builder__overlay__outer">
            <button onClick={() => handleBroadcast()} className="button-purple button-purple--pulsing">
              Broadcast TX
            </button>
          </div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default BtcTxReview
