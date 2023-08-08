import React, { useEffect, useState, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { Tooltip } from "react-tooltip"
import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { MdCheckCircle, MdError, MdContentPasteGo, MdQrCodeScanner } from "react-icons/md"

function EthTxSetGasFee({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "15px" }}>
          <div className="tx-builder__overlay__outer">Step 1: Set Gas & Fee</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>ETH TX Data Structure Form</p>
            <div className="tx-builder__blueprint-dashboard">
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.gasLimit</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="The EIP-155 chainId corresponds to what EVM network your wallet is currently listening on" className="icon" />
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input className="eth-txBuilder-input" type="number" />
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.maxFeePerGas</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="ARTSNL currently only supports EIP-1559 type 2 tx formats." className="icon" />
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input className="eth-txBuilder-input" type="number" />
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.maxPriorityFeePerGas</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="Input a valid Ethereum address" className="icon" />
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input className="eth-txBuilder-input" type="text" />
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.nonce</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="The data field allows you to store arbitrary text on the blockchain. Input an arbitrary length text or a valid hexadecimal string prefixed with 0x." className="icon" />
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input className="eth-txBuilder-input" type="text" />
                </div>
              </div>
            </div>
            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>Current Balance:</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Estimated Available:</p>
          </div>

          <div className="tx-builder__overlay__outer"></div>
        </IconContext.Provider>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word", zIndex: "101" }} variant="info" />
    </>
  )
}

export default EthTxSetGasFee
