import React, { useEffect, useState, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { Tooltip } from "react-tooltip"
import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdCheckCircle, MdError, MdContentPasteGo, MdQrCodeScanner, MdCopyAll } from "react-icons/md"
import { isAddress, formatEther, parseEther, keccak256 } from "ethers"
import LazyLoadFallback from "../LazyLoadFallback"

function EthTxPreSig({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let unsignedSerialized = appState.ethereum.txBuilder.txDataStruct.unsignedSerialized

  const [preImageHashDigest, setPreImageHashDigest] = useState(null)
  const [displayDigest, setDisplayDigest] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const [hasScramblingError, setHasScramblingError] = useState(false)

  function handleCopyPopup_modal() {
    document.querySelector(".icon-copy-modal").classList.toggle("icon")
    document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-modal").classList.toggle("icon")
      document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")
    }, 1000)
  }

  function handleKeccak() {
    setHasScramblingError(false)
    document.querySelector(".data-type-selector-container--box").classList.toggle("box-selected")
    document.querySelector(".data-type-selector-container--box").innerHTML = "hashing..."
    setIsScrambling(true)

    try {
      let result = keccak256(unsignedSerialized)
      result && setPreImageHashDigest(result)
    } catch (err) {
      console.error(err)
      setIsScrambling(false)
      setHasScramblingError(true)
      document.querySelector(".data-type-selector-container--box").value = "ERROR"
    }

    setTimeout(() => {
      document.querySelector(".data-type-selector-container--box").classList.toggle("box-selected")
      document.querySelector(".data-type-selector-container--box").innerHTML = "HASHED!"
      setIsScrambling(false)
      setDisplayDigest(true)
    }, 2000)
  }

  function handleNext() {
    appDispatch({ type: "signEthTx" })
    setTxStatus(4)
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "15px" }}>
          <div className="tx-builder__overlay__outer">Step 4: Generate TX Digest</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>Pre-Signature Serialization</p>
            <div className="tx-builder__blueprint-dashboard">
              <div className="tx-builder__blueprint-dashboard__display-sig-overlay">
                {isScrambling ? (
                  <LazyLoadFallback />
                ) : hasScramblingError ? (
                  <>
                    <span>Unable to apply keccak256 to txDataStruct. Reset TX Builder.</span>
                  </>
                ) : displayDigest ? (
                  <span>{preImageHashDigest}</span>
                ) : (
                  <span>{unsignedSerialized}</span>
                )}
              </div>

              <div style={{ borderBottom: "none" }} className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.unsignedSerialized</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="The hash of the unsignedSerialized tx hex is the digest which needs to be signed to authorize this transaction." className="icon" />
                  <CopyToClipboard text={displayDigest ? preImageHashDigest : unsignedSerialized} onCopy={() => handleCopyPopup_modal()}>
                    <MdCopyAll id="Tooltip" data-tooltip-content={"Copy hex value shown below"} className="icon icon-copy icon-copy-modal" />
                  </CopyToClipboard>

                  <div id="Tooltip" data-tooltip-content="Click to generate the pre-image hash digest of the unsignedSerialized tx hex" className="data-type-selector-container display-flex">
                    <span style={{ color: "white" }} onClick={e => handleKeccak(e)} className={"data-type-selector-container--box"}>
                      KECCAK
                    </span>
                  </div>
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom"></div>
              </div>
              <div style={{ visibility: "hidden" }} className="tx-builder__blueprint-dashboard__input-field"></div>
              <div style={{ visibility: "hidden" }} className="tx-builder__blueprint-dashboard__input-field"></div>
              <div style={{ visibility: "hidden" }} className="tx-builder__blueprint-dashboard__input-field"></div>
            </div>
            <p style={{ position: "absolute", bottom: "24px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Current Balance:</span> {formatEther(appState.ethereum.currentBalance)}
            </p>
            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Total Est. Fees:</span> {appState.ethereum.txBuilder.txDataStruct?.gasLimit ? formatEther(appState.ethereum.txBuilder.txDataStruct?.gasLimit * appState.ethereum.txBuilder.txDataStruct?.maxFeePerGas) : ""}
            </p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Send Amount:</span> {appState.ethereum.txBuilder.txDataStruct?.value ? formatEther(appState.ethereum.txBuilder.txDataStruct?.value) : ""}
            </p>
          </div>

          <div className="tx-builder__overlay__outer">
            {displayDigest ? (
              <button onClick={() => handleNext()} className="button-purple">
                Sign Digest
              </button>
            ) : (
              ""
            )}
          </div>
        </IconContext.Provider>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word", zIndex: "101" }} variant="info" />
    </>
  )
}

export default EthTxPreSig
