import React, { useEffect, useState, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { Tooltip } from "react-tooltip"
import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdCheckCircle, MdError, MdContentPasteGo, MdQrCodeScanner, MdCopyAll } from "react-icons/md"
import { isAddress, formatEther, parseEther } from "ethers"

function EthTxSignature({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [displayDigest, setDisplayDigest] = useState(false)

  function handleCopyPopup_modal() {
    document.querySelector(".icon-copy-modal").classList.toggle("icon")
    document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-modal").classList.toggle("icon")
      document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")
    }, 1000)
  }

  let unsignedSerialized = "0x02ef0580843b9aca00850b96cc813c825208942b776aa3c2389d6a3b7b11cd99fdb94190baf75b87d529ae9e86000080c0"
  let preImageHashDigest = "0x84a61258a767d251238ca8f8d370da1cdce1038ee012d712f3bb7ae3309360ff"

  function handleKeccak() {
    null
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "15px" }}>
          <div className="tx-builder__overlay__outer">Step 4: Sign TX</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>ETH TX Signature</p>
            <div className="tx-builder__blueprint-dashboard">
              <div className="tx-builder__blueprint-dashboard__display-sig-overlay">{unsignedSerialized}</div>

              <div style={{ borderBottom: "none" }} className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.unsignedSerialized</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="The hash of this is the digest which needs to be signed to authorize this transaction." className="icon" />
                  <CopyToClipboard text={displayDigest ? unsignedSerialized : preImageHashDigest} onCopy={() => handleCopyPopup_modal()}>
                    <MdCopyAll id="Tooltip" data-tooltip-content={"Copy hex value shown below"} className="icon icon-copy icon-copy-modal" />
                  </CopyToClipboard>

                  <div id="Tooltip" data-tooltip-content="Click to generate the pre-image hash digest of this tx" className="data-type-selector-container display-flex">
                    <span style={{ color: "white" }} onClick={(e) => handleKeccak(e)} className={"data-type-selector-container--box"}>
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
            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>{/* <span style={{ color: "gray" }}>Total Est. Fees:</span> {formatEther(appState.ethereum.txBuilder.txDataStruct?.gasLimit * appState.ethereum.txBuilder.txDataStruct?.maxFeePerGas)} */}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>{/* <span style={{ color: "gray" }}>Send Amount:</span> {formatEther(appState.ethereum.txBuilder.txDataStruct?.value)} */}</p>
          </div>

          <div className="tx-builder__overlay__outer"></div>
        </IconContext.Provider>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word", zIndex: "101" }} variant="info" />
    </>
  )
}

export default EthTxSignature
