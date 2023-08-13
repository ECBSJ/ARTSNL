import React, { useEffect, useContext, useState } from "react"
import StateContext from "../../StateContext"

import { IconContext } from "react-icons"
import { VscChecklist } from "react-icons/vsc"
import { MdCopyAll } from "react-icons/md"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { formatEther } from "ethers"

function EthTxReview({ setTxStatus }) {
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

  const [txHex, setTxHex] = useState("")
  const [rawJSON, setRawJSON] = useState("")

  useEffect(() => {
    setTxHex(appState.ethereum.txBuilder.txDataStruct?.serialized)
    setRawJSON(appState.ethereum.txBuilder.txDataStruct?.toJSON())
    console.log(appState.ethereum.txBuilder.txDataStruct?.serialized)
    console.log(appState.ethereum.txBuilder.txDataStruct?.toJSON())
  }, [])

  function handleBroadcast() {
    setTxStatus(6)
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
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Type</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.ethereum.txBuilder.txDataStruct?.type}</span>
                      </li>
                      <li style={{ marginBottom: "7px" }} className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Data</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.ethereum.txBuilder.txDataStruct?.data == "0x" ? "null" : appState.ethereum.txBuilder.txDataStruct?.data.slice(0, 7) + "..." + appState.ethereum.txBuilder.txDataStruct?.data.slice(-7)}</span>
                      </li>

                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span style={{ marginLeft: "30px", color: "#8afaff" }} className="tx-builder__blueprint__review-overlay__content-row-label">
                          Rcvr
                        </span>
                        <span style={{ color: "#a9a9a9", fontSize: ".8em" }} className="tx-builder__blueprint__review-overlay__content-row-value">
                          {appState.ethereum.txBuilder.txDataStruct?.to ? appState.ethereum.txBuilder.txDataStruct?.to.slice(0, 7) + "..." + appState.ethereum.txBuilder.txDataStruct?.to.slice(-7) : ""}
                        </span>
                      </li>

                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span style={{ marginLeft: "45px", color: "#20b2aa" }} className="tx-builder__blueprint__review-overlay__content-row-label">
                          Send Amount
                        </span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{formatEther(appState.ethereum.txBuilder.txDataStruct?.value ? appState.ethereum.txBuilder.txDataStruct?.value : 0n).slice(0, 10)}</span>
                      </li>

                      <li style={{ marginTop: "7px" }} className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Fee</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{formatEther(appState.ethereum.txBuilder.txDataStruct?.gasLimit ? appState.ethereum.txBuilder.txDataStruct?.gasLimit * appState.ethereum.txBuilder.txDataStruct?.maxFeePerGas : 0n)}</span>
                      </li>
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Network</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.isTestnet ? "Goerli [5]" : "Mainnet [1]"}</span>
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
                        <CopyToClipboard text={JSON.stringify(rawJSON)} onCopy={() => handleCopyPopup_modal()}>
                          <MdCopyAll style={{ transform: "translateY(5px)" }} className="icon icon-copy icon-copy-modal" />
                        </CopyToClipboard>
                      </IconContext.Provider>
                      Copy JSON Raw TX
                    </span>
                    {JSON.stringify(rawJSON)}
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

export default EthTxReview
