import React, { useEffect, useContext, useState, useRef, Suspense } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import * as uint8arraytools from "uint8array-tools"

import { IconContext } from "react-icons"
import { MdCheckCircle, MdError } from "react-icons/md"
import { Tooltip } from "react-tooltip"
import { CSSTransition } from "react-transition-group"

import ModalDropDown from "../ModalDropDown"
import FeeDataDisplay from "./FeeDataDisplay"
import ErrorBoundary from "../ErrorBoundary"
import FeeDataDisplayLoading from "./FeeDataDisplayLoading"
import FeeDataDisplayError from "./FeeDataDisplayError"

function BtcTxDeconstructRcvrAddress({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let rcvrAddress = appState.bitcoin.txBuilder.outputs_Array[appState.bitcoin.txBuilder.outputs_Array.length - 1].validInputtedAddress
  let hash160 = uint8arraytools.toHex(appState.bitcoin.txBuilder.outputs_Array[appState.bitcoin.txBuilder.outputs_Array.length - 1].validInputtedAddress_Decoded.hash)

  const [showHash160, setShowHash160] = useState(false)
  // function to deconstruct/decode rcvr address to reveal pub key hash
  async function handleHash160() {
    document.querySelector("#setLoading").classList.add("text--loading")
    document.querySelector("#hash160").innerText = "Decoding..."
    document.querySelector("#hash160").classList.remove("button-orange")
    document.querySelector("#hash160").classList.add("orange-capsule")
    document.querySelector("#hash160").classList.add("orange-capsule--visible")
    document.querySelector("#hash160").classList.add("orange-capsule__progress-1")

    setTimeout(() => {
      document.querySelector("#hash160").classList.remove("orange-capsule__progress-1")

      document.querySelector("#hash160").innerText = "Removing prefix..."
      document.querySelector("#hash160").classList.add("orange-capsule__progress-2")
    }, 1000)

    setTimeout(() => {
      document.querySelector("#hash160").classList.remove("orange-capsule__progress-2")

      document.querySelector("#hash160").innerText = "Removing checksum..."
      document.querySelector("#hash160").classList.add("orange-capsule__progress-3")
    }, 2000)

    setTimeout(() => {
      document.querySelector("#hash160").classList.remove("orange-capsule__progress-3")

      document.querySelector("#hash160").innerText = "Completed Deconstruction!"
      document.querySelector("#hash160").classList.add("orange-capsule__progress-4")
      document.querySelector("#hash160").disabled = true
      document.querySelectorAll(".appear-grab").forEach(el => {
        el.classList.toggle("interface__block-cell--appear-2")
      })
      setShowHash160(true)
    }, 3000)

    setTimeout(() => {
      document.querySelector("#hash160").classList.remove("orange-capsule__progress-4")
      document.querySelector("#hash160").classList.add("orange-capsule__progress-done")
      document.querySelectorAll(".appear-grab").forEach(el => {
        el.classList.toggle("interface__block-cell--appear")
      })
    }, 4000)
  }

  const [availableAmount, setAvailableAmount] = useState(0)

  // inputted amount state handling
  const [hasError, setHasError] = useState(false)
  const [validationErrorMessage, setValidationErrorMessage] = useState("")
  const [withinRange, setWithinRange] = useState(false)
  const [withinRangeAmount, setWithinRangeAmount] = useState(0)
  // defaults to halfHourFee on component mount
  const [minAmountTxFeePerVbyteRate, setMinAmountTxFeePerVbyteRate] = useState(1) // sat/vBytes
  const [recommendFees, setRecommendedFees] = useState({
    fastestFee: 1,
    halfHourFee: 1,
    hourFee: 1,
    economyFee: 1,
    minimumFee: 1
  })
  const [currentTxSize_vBytes, setCurrentTxSize_vBytes] = useState(0)

  // resets input field if fee rate updates
  useEffect(() => {
    setHasError(false)
    setValidationErrorMessage("")
    setWithinRange(false)
    setWithinRangeAmount(0)

    if (document.getElementById("input-grab")) {
      document.getElementById("input-grab").value = ""
    }
  }, [minAmountTxFeePerVbyteRate])

  // inputted amount validation
  function handleInputtedAmount(value) {
    let value_Number = Number(value)

    if (!value.trim()) {
      setHasError(false)
      setValidationErrorMessage("")
      setWithinRange(false)
      setWithinRangeAmount(0)
    } else {
      if (isNaN(value_Number)) {
        setHasError(true)
        setValidationErrorMessage("Only positive whole integers accepted.")
        setWithinRange(false)
        setWithinRangeAmount(0)
      }

      if (Number.isInteger(value_Number) > 0) {
        // check within range of min & max to send
        if (value_Number > appState.bitcoin.txBuilder.minAmountToSend && value_Number <= availableAmount - minAmountTxFeePerVbyteRate * currentTxSize_vBytes) {
          setWithinRange(true)
          setWithinRangeAmount(value_Number)
          setHasError(false)
        } else {
          setHasError(true)
          setValidationErrorMessage("Amount outside of acceptable range.")
          setWithinRange(false)
          setWithinRangeAmount(0)
        }
      } else {
        setHasError(true)
        setValidationErrorMessage("Only positive whole integers accepted.")
        setWithinRange(false)
        setWithinRangeAmount(0)
      }
    }
  }

  // initial fee estimation call for estimated half hour fee
  async function getFeeEstimation() {
    try {
      let result = await appState.bitcoin.activeProvider?.bitcoin.fees.getFeesRecommended()
      result && setMinAmountTxFeePerVbyteRate(result.halfHourFee)
      setRecommendedFees(result)
    } catch (err) {
      console.error(err)
    }
  }

  // calculates current estimated tx size in vbytes based on current inputs & outputs
  function calculateCurrentTxSize_vBytes() {
    let overheadSize_vBytes = appState.bitcoin.txBuilder.TXSIZE_VBYTES_CONSTANTS.OVERHEAD
    let inputsSize_vBytes = appState.bitcoin.txBuilder.TXSIZE_VBYTES_CONSTANTS.INPUT * appState.bitcoin.txBuilder.selectedArray.length
    let outputsSize_vBytes = appState.bitcoin.txBuilder.TXSIZE_VBYTES_CONSTANTS.OUTPUT * appState.bitcoin.txBuilder.outputs_Array.length

    let totalSize_vBytes = overheadSize_vBytes + inputsSize_vBytes + outputsSize_vBytes
    setCurrentTxSize_vBytes(totalSize_vBytes)
  }

  // determines how much available in UTXO amount if output is more than 1 / will initialize availableAmount state
  function initAvailableAmount() {
    if (appState.bitcoin.txBuilder.outputs_Array.length > 1) {
      setAvailableAmount(appState.bitcoin.txBuilder.estimatedRemainingAmount)
    } else {
      setAvailableAmount(appState.bitcoin.txBuilder.totalUtxoValueSelected)
    }
  }

  useEffect(() => {
    calculateCurrentTxSize_vBytes()
    getFeeEstimation()
    initAvailableAmount()
  }, [])

  const [isModalDropDownOpen, setIsModalDropDownOpen] = useState(false)
  const modalDropDownRef = useRef()

  useEffect(() => {
    let handler = e => {
      if (isModalDropDownOpen) {
        if (modalDropDownRef.current.contains(e.target)) {
          setIsModalDropDownOpen(!isModalDropDownOpen)
        }
      }
    }

    document.addEventListener("mousedown", handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  })

  // to display when modal drop down appears to let user check send amount details
  const [sendAmountCheckObject, setSendAmountCheckObject] = useState({
    available: 0,
    send: 0,
    fees: 0,
    remaining: 0
  })

  function handleNext() {
    setSendAmountCheckObject({
      available: availableAmount,
      send: withinRangeAmount,
      fees: currentTxSize_vBytes * minAmountTxFeePerVbyteRate,
      remaining: availableAmount - (minAmountTxFeePerVbyteRate * currentTxSize_vBytes + withinRangeAmount)
    })

    setIsModalDropDownOpen(!isModalDropDownOpen)
  }

  // navigates to txStatus 4 and sets appState for send, fee, and change amounts / called in ModalOverlaySendAmountCheck
  function navigateToScriptPubKey() {
    setIsModalDropDownOpen(!isModalDropDownOpen)

    let object = {
      indexToModify: appState.bitcoin.txBuilder.outputs_Array.length - 1,
      sendAmountValue: withinRangeAmount
    }

    appDispatch({ type: "setSendAmount", value: object })
    appDispatch({ type: "setFeeAmount", value: currentTxSize_vBytes * minAmountTxFeePerVbyteRate })

    // need to improve handling of remaining/change amount
    appDispatch({ type: "setEstimatedRemainingAmount", value: availableAmount - (minAmountTxFeePerVbyteRate * currentTxSize_vBytes + withinRangeAmount) })

    // navigate to build scriptpubkey page
    setTimeout(() => setTxStatus(4), 700)
  }

  return (
    <>
      <CSSTransition in={isModalDropDownOpen} timeout={400} classNames="modal__cover" unmountOnExit>
        <div ref={modalDropDownRef} className="modal__cover"></div>
      </CSSTransition>

      <CSSTransition in={isModalDropDownOpen} timeout={600} classNames="modal__drop-down" unmountOnExit>
        <ModalDropDown setIsModalDropDownOpen={setIsModalDropDownOpen} isModalDropDownOpen={isModalDropDownOpen} emoji={"📋"} title={"Confirm Send Amount"} subtitle={"Please confirm the send amount"} subtitle_2={"details you inputted."} hasData={false} data={""} showFullData={false} ending_content={"Click on 'YES'"} ending_content_2={"if you have confirmed."} hideDoubleArrow={true} checkSendAmount={true} sendAmountCheckObject={sendAmountCheckObject} navigateToScriptPubKey={navigateToScriptPubKey} />
      </CSSTransition>

      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 3: Deconstruct Rcvr Address</div>

          <div className="tx-builder__blueprint">
            <div style={{ width: "100%", height: "100%", justifyContent: "flex-start", padding: "35px 20px" }} className="display-flex display-flex--column appear-grab">
              {showHash160 ? (
                <>
                  <div data-tooltip-id="hash160" data-tooltip-content={hash160}>
                    {"{ " + hash160.slice(0, 10) + "..." + hash160.slice(-10) + " }"}
                  </div>
                  <Tooltip id="hash160" style={{ fontSize: "0.6rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />

                  <div style={{ position: "absolute", top: "17px", left: "23px", fontSize: "0.5rem", color: "gray" }}>Rcvr Address Deconstructed &#40;hash160&#41;:</div>
                </>
              ) : (
                <>
                  <div data-tooltip-id="rcvrAddress" data-tooltip-content={rcvrAddress} id="setLoading" data-text={"{" + rcvrAddress.slice(0, 10) + "..." + rcvrAddress.slice(-10) + "}"}>
                    {"{" + rcvrAddress.slice(0, 10) + "..." + rcvrAddress.slice(-10) + "}"}
                  </div>
                  <Tooltip id="rcvrAddress" style={{ fontSize: "0.6rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />

                  <div style={{ position: "absolute", top: "17px", left: "23px", fontSize: "0.5rem", color: "gray" }}>Rcvr Address:</div>
                </>
              )}

              <button onClick={handleHash160} id="hash160" style={{ width: "90%", height: "55px", marginTop: "20px" }} className="button-orange button--smaller-font">
                Deconstruct
              </button>
              {showHash160 ? (
                <>
                  <p style={{ fontSize: ".7em", borderTop: "1px solid gray", paddingTop: "10px", color: "gray" }}>Input amount &#40;sats&#41; you want to send &#40;lock&#41; to the public key hash above. Any remaining amount &#40;ex. fees&#41; will be sent back to your wallet.</p>
                  <div className="input-container">
                    <input onChange={e => handleInputtedAmount(e.target.value)} id="input-grab" className={"input-white " + (hasError ? "input--focus-red" : "") + (!hasError && withinRange ? "input--focus-green" : "")} type="text" required />
                    <span className="input-placeholder">Send Amount</span>
                    <div style={{ cursor: "default", bottom: "-17" }} className="input-validation">
                      <span style={{ color: "gray" }}>Fee Rate</span> &#40;{minAmountTxFeePerVbyteRate} sat/vB&#41; <span style={{ color: "purple" }}>|</span> <span style={{ color: "gray" }}>TX Fees &#40;sats&#41;:</span> {!hasError && withinRange ? minAmountTxFeePerVbyteRate * currentTxSize_vBytes : 0} <span style={{ color: "purple" }}>|</span> <br /> <span style={{ color: "gray" }}>Remaining &#40;sats&#41;:</span> {!hasError && withinRange ? availableAmount - (minAmountTxFeePerVbyteRate * currentTxSize_vBytes + withinRangeAmount) : ""}
                    </div>
                    {hasError ? (
                      <div style={{ cursor: "default", bottom: "-35" }} className="input-validation input-validation--error">
                        <MdError style={{ width: "12px", height: "12px" }} className="icon--error" />
                        &nbsp;{validationErrorMessage}
                      </div>
                    ) : (
                      ""
                    )}
                    {!hasError && withinRange ? (
                      <div style={{ cursor: "default", bottom: "-35" }} className="input-validation input-validation--success">
                        <MdCheckCircle style={{ width: "14px", height: "14px" }} className="icon--checked" /> {"Amount within acceptable range."}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
            </div>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em", cursor: "default" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em", cursor: "default" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>

            {showHash160 ? (
              <ErrorBoundary fallback={<FeeDataDisplayError />}>
                <Suspense fallback={<FeeDataDisplayLoading />}>
                  <FeeDataDisplay setMinAmountTxFeePerVbyteRate={setMinAmountTxFeePerVbyteRate} />
                </Suspense>
              </ErrorBoundary>
            ) : (
              ""
            )}
          </div>

          <div className="tx-builder__overlay__outer">
            {!hasError && withinRange ? (
              <>
                <button onClick={() => handleNext()} className="button-purple">
                  Next
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default BtcTxDeconstructRcvrAddress
