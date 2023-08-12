import React, { useEffect, useContext, useState } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { Tooltip } from "react-tooltip"
import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { MdCheckCircle, MdError, MdContentPasteGo, MdQrCodeScanner } from "react-icons/md"
import { isAddress, formatEther, parseEther } from "ethers"

function EthTxSendAmount({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  // both totalFee & maxAmnt in bigint wei
  const [totalFee, setTotalFee] = useState(0n)
  const [maxAmnt, setMaxAmnt] = useState()

  function handleMaxAmnt(e) {
    document.querySelector(".data-type-selector-container--box").classList.toggle("box-selected")

    // diff value in bigint wei
    let diff = appState.ethereum.currentBalance - totalFee
    setMaxAmnt(diff)

    inputSendAmntValidation(formatEther(diff))

    setTimeout(() => {
      document.querySelector(".data-type-selector-container--box").classList.toggle("box-selected")
    }, 1000)
  }

  useEffect(() => {
    let product = appState.ethereum.txBuilder.txDataStruct.gasLimit * appState.ethereum.txBuilder.txDataStruct.maxFeePerGas
    setTotalFee(product)
  }, [])

  const [inputSendAmntError, setInputSendAmntError] = useState(false)
  const [inputtedValidSendAmnt, setInputtedValidSendAmnt] = useState(null)

  function inputSendAmntValidation(value) {
    // value value should be in ether

    let maxLimit = formatEther(appState.ethereum.currentBalance - totalFee)
    let minLimit = formatEther(0)

    if (!value.trim()) {
      setInputSendAmntError(false)
      setInputtedValidSendAmnt(null)
    } else {
      if (value > minLimit && value <= maxLimit) {
        // value within range is valid
        setInputSendAmntError(false)
        setInputtedValidSendAmnt(value)
      } else {
        setInputSendAmntError(true)
        setInputtedValidSendAmnt(null)
      }
    }
  }

  function handleNext() {
    appDispatch({ type: "setValue", value: parseEther(inputtedValidSendAmnt) })
    setTxStatus(3)
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "15px" }}>
          <div className="tx-builder__overlay__outer">Step 3: Input Send Amount</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>ETH TX Data Structure Form</p>
            <div className="tx-builder__blueprint-dashboard">
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.value</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="Input the amount of ether you want to send" className="icon" />
                  <div className="data-type-selector-container display-flex">
                    <span style={{ color: "white" }} onClick={e => handleMaxAmnt(e)} className={"data-type-selector-container--box"}>
                      MAX AMNT
                    </span>
                  </div>

                  {inputSendAmntError ? (
                    <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "red", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                      Value out of valid range
                      <MdError className="icon--error" />
                    </span>
                  ) : (
                    ""
                  )}

                  {!inputSendAmntError && inputtedValidSendAmnt ? (
                    <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "greenyellow", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                      Send amount in range
                      <MdCheckCircle className="icon--checked" />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input autoFocus onChange={e => inputSendAmntValidation(e.target.value)} className="eth-txBuilder-input" value={maxAmnt ? formatEther(maxAmnt) : undefined} onFocus={() => setMaxAmnt()} type="number" />
                </div>
              </div>
              <div style={{ visibility: "hidden" }} className="tx-builder__blueprint-dashboard__input-field"></div>
              <div style={{ visibility: "hidden" }} className="tx-builder__blueprint-dashboard__input-field"></div>
              <div style={{ visibility: "hidden" }} className="tx-builder__blueprint-dashboard__input-field"></div>
            </div>
            <p style={{ position: "absolute", bottom: "24px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Current Balance:</span> {formatEther(appState.ethereum.currentBalance)}
            </p>
            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Total Est. Fees:</span> {formatEther(totalFee)}
            </p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Available To Send:</span> {inputtedValidSendAmnt === null ? formatEther(appState.ethereum.currentBalance - totalFee) : formatEther(appState.ethereum.currentBalance - (totalFee + parseEther(inputtedValidSendAmnt)))}
            </p>
          </div>

          <div className="tx-builder__overlay__outer">
            {!inputSendAmntError && inputtedValidSendAmnt ? (
              <button onClick={() => handleNext()} className="button-purple">
                Prepare Signing
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

export default EthTxSendAmount
