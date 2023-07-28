import React, { useEffect, useContext, useState } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { MdCopyAll, MdOpenInNew } from "react-icons/md"
import { BsFillSendExclamationFill, BsSend } from "react-icons/bs"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { IconContext } from "react-icons"
import { Tooltip } from "react-tooltip"

import LazyLoadFallback from "../LazyLoadFallback"

function BtcTxReceipt() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  function handleCopyPopup_modal() {
    document.querySelector(".icon-copy-modal").classList.toggle("icon")
    document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-modal").classList.toggle("icon")
      document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")
    }, 1000)
  }

  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(true)
  const [errorReason, setErrorReason] = useState("")
  const [txHash, setTxHash] = useState("")
  const [txHex2Copy, setTxHex2Copy] = useState("")

  let timestamp = new Date().toLocaleString()
  let URL = appState.isTestnet ? "https://mempool.space/testnet/tx/" : "https://mempool.space/tx/"
  let broadcastURL = appState.isTestnet ? "https://mempool.space/testnet/tx/push" : "https://mempool.space/tx/push"

  async function broadcastTX() {
    let txHex = appState.bitcoin.txBuilder.psbt.extractTransaction().toHex()
    setTxHex2Copy(txHex)

    try {
      setIsLoading(true)
      setHasError(false)
      let result = await appState.bitcoin.activeProvider?.bitcoin.transactions.postTx({ txHex })
      result && setTxHash(result)
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      setHasError(true)
      setErrorReason()
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   broadcastTX()
  // }, [])

  return (
    <>
      <div style={{ cursor: "default" }} className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">TX Broadcast Receipt</div>

          <div className="tx-builder__blueprint">
            {isLoading ? (
              <>
                <LazyLoadFallback />
              </>
            ) : hasError ? (
              <>
                <div className="tx-builder__blueprint__review-overlay">
                  <span style={{ fontSize: "4rem" }}>
                    <BsFillSendExclamationFill style={{ color: "red", width: "80px", height: "80px" }} />
                  </span>
                  <h3 style={{ marginBottom: "0", color: "red" }}>TX Broadcast Failed!</h3>
                  <div style={{ overflowWrap: "anywhere", fontSize: ".62rem", textAlign: "justify" }} className="tx-builder__blueprint__review-overlay__column-gap">
                    <IconContext.Provider value={{ size: "2.5rem" }}>
                      <BsSend id="Tooltip" data-tooltip-content={"Rebroadcast TX Hex"} onClick={() => broadcastTX()} style={{ width: "100px" }} className="icon" />
                      Rebroadcast or broadcast TX Hex using mempool.space web app.
                      <CopyToClipboard text={txHex2Copy}>
                        <a href={broadcastURL} target="_blank">
                          <MdOpenInNew id="Tooltip" data-tooltip-content={"By clicking on this icon, your TX Hex will auto copy into your clipboard for you to paste directly into mempool.space web app pop-up."} className="icon" />
                        </a>
                      </CopyToClipboard>
                    </IconContext.Provider>
                  </div>
                  <div className="tx-builder__blueprint__review-overlay__content">
                    <ul className="tx-builder__blueprint__review-overlay__content-no-ul-format">
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Status</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">TX Broadcast failed.</span>
                      </li>
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Reason</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">{errorReason ? errorReason : "Unknown"}</span>
                      </li>
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Tip</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">Inspect internet connection or console.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="tx-builder__blueprint__review-overlay">
                <span style={{ fontSize: "4rem" }}>📡</span>
                <h3 style={{ marginBottom: "0" }}>TX Broadcasted!</h3>
                <div style={{ overflowWrap: "anywhere", fontSize: ".62rem", textAlign: "justify" }} className="tx-builder__blueprint__review-overlay__column-gap">
                  <IconContext.Provider value={{ size: "2.5rem" }}>
                    <CopyToClipboard text={txHash} onCopy={() => handleCopyPopup_modal()}>
                      <MdCopyAll style={{ width: "100px" }} className="icon icon-copy icon-copy-modal" />
                    </CopyToClipboard>
                    {txHash}
                    <a href={URL + txHash} target="_blank">
                      <MdOpenInNew className="icon" />
                    </a>
                  </IconContext.Provider>
                </div>
                <div className="tx-builder__blueprint__review-overlay__content">
                  <ul className="tx-builder__blueprint__review-overlay__content-no-ul-format">
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">UTXOs</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.bitcoin.txBuilder.selectedArray.length}</span>
                    </li>
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">Total Value</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.bitcoin.txBuilder.totalUtxoValueSelected}</span>
                    </li>
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">Fee</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.bitcoin.txBuilder.feeAmount}</span>
                    </li>
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">Network</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.isTestnet ? "Testnet" : "Mainnet"}</span>
                    </li>
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">Timestamp</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{timestamp}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="tx-builder__overlay__outer">
            <button className="button-purple">Return To Wallet</button>
          </div>
        </IconContext.Provider>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
    </>
  )
}

export default BtcTxReceipt
