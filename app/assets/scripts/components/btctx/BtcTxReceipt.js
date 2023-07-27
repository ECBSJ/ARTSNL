import React, { useEffect, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { MdCopyAll } from "react-icons/md"
import { CopyToClipboard } from "react-copy-to-clipboard"

import { IconContext } from "react-icons"

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

  let timestamp = new Date().toLocaleString()

  return (
    <>
      <div style={{ cursor: "default" }} className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">TX Broadcast Receipt</div>

          <div className="tx-builder__blueprint">
            <div className="tx-builder__blueprint__review-overlay">
              <span style={{ fontSize: "4rem" }}>📡</span>
              <h3>TX Broadcasted!</h3>
              <div style={{ overflowWrap: "anywhere", fontSize: ".62rem", textAlign: "justify" }} className="tx-builder__blueprint__review-overlay__column-gap">
                <IconContext.Provider value={{ size: "2.5rem" }}>
                  <CopyToClipboard text={null} onCopy={() => handleCopyPopup_modal()}>
                    <MdCopyAll style={{ transform: "translateY(5px)" }} className="icon icon-copy icon-copy-modal" />
                  </CopyToClipboard>
                </IconContext.Provider>
                a24fd73cd1da60778ecd5dabdf698eab9a4536df6c9703771f062d225dc4e7de
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
          </div>

          <div className="tx-builder__overlay__outer">
            <button className="button-purple">Return To Wallet</button>
          </div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default BtcTxReceipt
