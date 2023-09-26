import React, { useContext, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { MdCopyAll, MdOpenInNew } from "react-icons/md"
import { BsFillSendExclamationFill, BsSend } from "react-icons/bs"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { IconContext } from "react-icons"
import { Tooltip } from "react-tooltip"

import LazyLoadFallback from "../LazyLoadFallback"
import { formatEther } from "ethers"

function SendTokenReceipt({ sendingTokenProgress }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const navigate = useNavigate()

  function handleCopyPopup_modal() {
    document.querySelector(".icon-copy-modal").classList.toggle("icon")
    document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-modal").classList.toggle("icon")
      document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")
    }, 1000)
  }

  const [timestamp, setTimestamp] = useState()

  useMemo(() => {
    setTimestamp(new Date().toLocaleString())
  }, [])

  let lookupTxURL = appState.isTestnet ? "https://goerli.etherscan.io/tx/" : "https://etherscan.io/tx/"

  function handleReturnToWalletHome() {
    navigate("/WalletMain")
  }

  return (
    <>
      <div style={{ cursor: "default", zIndex: "103", backgroundColor: "#101115" }} className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">TX Broadcast Receipt</div>

          <div className="tx-builder__blueprint">
            {sendingTokenProgress == "loading" ? (
              <>
                <LazyLoadFallback />
              </>
            ) : sendingTokenProgress == "error" ? (
              <>
                <div className="tx-builder__blueprint__review-overlay">
                  <span style={{ fontSize: "4rem" }}>
                    <BsFillSendExclamationFill style={{ color: "red", width: "80px", height: "80px" }} />
                  </span>
                  <h3 style={{ marginBottom: "0", color: "red" }}>TX Broadcast Failed!</h3>
                  <div style={{ overflowWrap: "anywhere", fontSize: ".62rem", textAlign: "justify", color: "lightblue" }} className="tx-builder__blueprint__review-overlay__column-gap">
                    <IconContext.Provider value={{ size: "2.5rem" }}>
                      <BsSend id="Tooltip" data-tooltip-content={"Rebroadcast TX Hex"} onClick={() => broadcastTX()} style={{ width: "100px" }} className="icon" />
                      Rebroadcast or broadcast TX Hex using etherscan web app.
                      <a href={null} target="_blank">
                        <MdOpenInNew id="Tooltip" data-tooltip-content={"Try sending token by interacting with the smart contract on etherscan instead."} className="icon" />
                      </a>
                    </IconContext.Provider>
                  </div>
                  <div className="tx-builder__blueprint__review-overlay__content">
                    <ul className="tx-builder__blueprint__review-overlay__content-no-ul-format">
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Status</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">TX Broadcast failed.</span>
                      </li>
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Tip</span>
                        <span style={{ fontSize: ".6rem" }} className="tx-builder__blueprint__review-overlay__content-row-value">
                          Inspect internet connection or console.
                        </span>
                      </li>
                      <li style={{ alignItems: "flex-start" }} className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Reason</span>
                        <span style={{ width: "230px", height: "auto", textAlign: "right" }} className="tx-builder__blueprint__review-overlay__content-row-value">
                          {"Unknown"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="tx-builder__blueprint__review-overlay">
                <span style={{ fontSize: "4rem" }}>📡</span>
                <h3 style={{ marginBottom: "0", color: "greenyellow" }}>TX Broadcasted!</h3>
                <div style={{ overflowWrap: "anywhere", fontSize: ".62rem", textAlign: "justify" }} className="tx-builder__blueprint__review-overlay__column-gap">
                  <IconContext.Provider value={{ size: "2.5rem" }}>
                    <CopyToClipboard text={null} onCopy={() => handleCopyPopup_modal()}>
                      <MdCopyAll id="Tooltip" data-tooltip-content={"Copy TX id"} style={{ width: "100px" }} className="icon icon-copy icon-copy-modal" />
                    </CopyToClipboard>
                    {"tx hash is here"}
                    <a href={null} target="_blank">
                      <MdOpenInNew id="Tooltip" data-tooltip-content={"View in explorer"} className="icon" />
                    </a>
                  </IconContext.Provider>
                </div>
                <div className="tx-builder__blueprint__review-overlay__content">
                  <ul className="tx-builder__blueprint__review-overlay__content-no-ul-format">
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">To</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{"to address"}</span>
                    </li>
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">Total Value</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{"send amount"}</span>
                    </li>
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">Network</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{appState.isTestnet ? "Goerli Testnet" : "Mainnet"}</span>
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
            <button onClick={() => handleReturnToWalletHome()} className="button-purple">
              Return To Wallet
            </button>
          </div>
        </IconContext.Provider>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word", zIndex: "101" }} variant="info" />
    </>
  )
}

export default SendTokenReceipt
