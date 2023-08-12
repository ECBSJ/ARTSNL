import React, { useEffect, useState, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { Tooltip } from "react-tooltip"
import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { MdCheckCircle } from "react-icons/md"

import { formatEther } from "ethers"

import LazyLoadFallback from "../LazyLoadFallback"

function EthTxSignature({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [isSigning, setIsSigning] = useState(true)

  useEffect(() => {
    console.log(appState.ethereum.txBuilder.txDataStruct.signature)

    setTimeout(() => {
      setIsSigning(prev => false)
    }, 2000)
  }, [])

  function handleNext() {
    setTxStatus(5)
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "15px" }}>
          <div className="tx-builder__overlay__outer">Step 5: Finalize Signature</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>ETH TX Signature Object</p>
            <div style={{ overflowY: "auto", justifyContent: "flex-start" }} className="tx-builder__blueprint-dashboard">
              {isSigning ? (
                <LazyLoadFallback />
              ) : (
                <>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.signature.compactSerialized</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="The EIP-2098 compact representation." className="icon" />
                      <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "greenyellow", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                        TX Signed
                        <MdCheckCircle className="icon--checked" />
                      </span>
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input className="eth-txBuilder-input" value={appState.ethereum.txBuilder.txDataStruct.signature?.compactSerialized} readOnly type="text" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.signature.legacyChainId</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="The chain ID for EIP-155 legacy transactions. For non-legacy transactions, this value is null." className="icon" />
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input className="eth-txBuilder-input" value={appState.ethereum.txBuilder.txDataStruct.signature?.legacyChainId ? appState.ethereum.txBuilder.txDataStruct.signature?.legacyChainId : "null"} readOnly type="text" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.signature.networkV</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="The EIP-155 v for legacy transactions. For non-legacy transactions, this value is null." className="icon" />
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input className="eth-txBuilder-input" value={appState.ethereum.txBuilder.txDataStruct.signature?.networkV ? appState.ethereum.txBuilder.txDataStruct.signature?.networkV : "null"} readOnly type="text" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.signature.r</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="This represents the x coordinate of a reference or challenge point, from which the y can be computed." className="icon" />
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input className="eth-txBuilder-input" value={appState.ethereum.txBuilder.txDataStruct.signature?.r} readOnly type="text" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.signature.s</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="The s value for a signature." className="icon" />
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input className="eth-txBuilder-input" value={appState.ethereum.txBuilder.txDataStruct.signature?.s} readOnly type="text" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.signature.serialized</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="The serialized representation." className="icon" />
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input className="eth-txBuilder-input" value={appState.ethereum.txBuilder.txDataStruct.signature?.serialized} readOnly type="text" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.signature.v</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="Since a given x value for r has two possible values for its corresponding y, the v indicates which of the two y values to use." className="icon" />
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input className="eth-txBuilder-input" value={appState.ethereum.txBuilder.txDataStruct.signature?.v} readOnly type="text" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.signature.yParity</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="The yParity for the signature." className="icon" />
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input className="eth-txBuilder-input" value={appState.ethereum.txBuilder.txDataStruct.signature?.yParity} readOnly type="text" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.signature.yParityAndS</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="The EIP-2098 compact representation of the yParity and s compacted into a single bytes32." className="icon" />
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input className="eth-txBuilder-input" value={appState.ethereum.txBuilder.txDataStruct.signature?.yParityAndS} readOnly type="text" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Total Est. Fees:</span> {appState.ethereum.txBuilder.txDataStruct?.gasLimit ? formatEther(appState.ethereum.txBuilder.txDataStruct?.gasLimit * appState.ethereum.txBuilder.txDataStruct?.maxFeePerGas) : ""}
            </p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Send Amount:</span> {appState.ethereum.txBuilder.txDataStruct?.value ? formatEther(appState.ethereum.txBuilder.txDataStruct?.value) : ""}
            </p>
          </div>

          <div className="tx-builder__overlay__outer">
            <button onClick={() => handleNext()} className="button-purple">
              Review Transaction
            </button>
          </div>
        </IconContext.Provider>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word", zIndex: "101" }} variant="info" />
    </>
  )
}

export default EthTxSignature
