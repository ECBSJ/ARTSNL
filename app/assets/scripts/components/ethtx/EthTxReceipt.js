import React, { useEffect, useContext, useState } from "react"
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

function EthTxReceipt({ setTxStatus }) {
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

  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(true)
  const [errorReason, setErrorReason] = useState("")
  const [txResponse, setTxResponse] = useState({})
  const [txHash, setTxHash] = useState("")
  const [txHex2Copy, setTxHex2Copy] = useState("")

  const [timestamp, setTimestamp] = useState()

  let lookupTxURL = appState.isTestnet ? "https://goerli.etherscan.io/tx/" : "https://etherscan.io/tx/"
  let manualBroadcastURL = appState.isTestnet ? "https://goerli.etherscan.io/pushTx?hex=" : "https://etherscan.io/pushTx?hex="

  async function broadcastTX() {
    // init txHex
    let txHex = appState.ethereum.txBuilder.txDataStruct?.serialized
    setTxHex2Copy(txHex)

    // reset state
    setIsLoading(true)
    setHasError(false)
    setErrorReason("")

    try {
      let txResponse = await appState.ethereum.txBuilder.wallet.sendTransaction(appState.ethereum.txBuilder.txDataStruct)
      setTxResponse(txResponse)
      setTxHash(txResponse?.hash)
      setTimestamp(new Date().toLocaleString())
      console.log(txResponse)
      setIsLoading(false)
      setHasError(false)
      setErrorReason("")
    } catch (err) {
      console.error(err)
      setIsLoading(false)
      setHasError(true)
      setErrorReason("Broadcast error unknown.")
    }
  }

  async function fallbackBroadcastTx() {
    let txHex = appState.ethereum.txBuilder.txDataStruct?.serialized

    let fetchURL

    if (appState.isTestnet) {
      fetchURL = ""
    } else {
      fetchURL = "https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=" + txHex + "&apikey=" + process.env.ETHERSCAN_API_KEY_TOKEN
    }
  }

  useEffect(() => {
    broadcastTX()
  }, [])

  function handleReturnToWalletHome() {
    appDispatch({ type: "resetEthTxBuilder" })
    navigate("/WalletMain")
  }

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
                  <div style={{ overflowWrap: "anywhere", fontSize: ".62rem", textAlign: "justify", color: "lightblue" }} className="tx-builder__blueprint__review-overlay__column-gap">
                    <IconContext.Provider value={{ size: "2.5rem" }}>
                      <BsSend id="Tooltip" data-tooltip-content={"Rebroadcast TX Hex"} onClick={() => broadcastTX()} style={{ width: "100px" }} className="icon" />
                      Rebroadcast or broadcast TX Hex using etherscan web app.
                      <CopyToClipboard text={txHex2Copy}>
                        <a href={manualBroadcastURL + txHex2Copy} target="_blank">
                          <MdOpenInNew id="Tooltip" data-tooltip-content={"By clicking on this icon, your TX Hex will auto copy into your clipboard for you to paste directly into etherscan web app pop-up."} className="icon" />
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
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Tip</span>
                        <span style={{ fontSize: ".6rem" }} className="tx-builder__blueprint__review-overlay__content-row-value">
                          Inspect internet connection or console.
                        </span>
                      </li>
                      <li style={{ alignItems: "flex-start" }} className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Reason</span>
                        <span style={{ width: "230px", height: "auto", textAlign: "right" }} className="tx-builder__blueprint__review-overlay__content-row-value">
                          {errorReason ? errorReason : "Unknown"}
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
                    <CopyToClipboard text={txHash} onCopy={() => handleCopyPopup_modal()}>
                      <MdCopyAll id="Tooltip" data-tooltip-content={"Copy TX id"} style={{ width: "100px" }} className="icon icon-copy icon-copy-modal" />
                    </CopyToClipboard>
                    {txHash}
                    <a href={lookupTxURL + txHash} target="_blank">
                      <MdOpenInNew id="Tooltip" data-tooltip-content={"View in explorer"} className="icon" />
                    </a>
                  </IconContext.Provider>
                </div>
                <div className="tx-builder__blueprint__review-overlay__content">
                  <ul className="tx-builder__blueprint__review-overlay__content-no-ul-format">
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">To</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{txResponse?.to.slice(0, 7) + "..." + txResponse?.to.slice(-7)}</span>
                    </li>
                    <li className="tx-builder__blueprint__review-overlay__content-row">
                      <span className="tx-builder__blueprint__review-overlay__content-row-label">Total Value</span>
                      <span className="tx-builder__blueprint__review-overlay__content-row-value">{formatEther(txResponse?.value)}</span>
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
            {isLoading ? (
              ""
            ) : (
              <button onClick={() => handleReturnToWalletHome()} className="button-purple">
                Return To Wallet
              </button>
            )}
          </div>
        </IconContext.Provider>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word", zIndex: "101" }} variant="info" />
    </>
  )
}

export default EthTxReceipt
