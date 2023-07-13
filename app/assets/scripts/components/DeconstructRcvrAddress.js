import React, { useEffect, useContext, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { IconContext } from "react-icons"
import { MdCheckCircle, MdError } from "react-icons/md"
import { Tooltip } from "react-tooltip"

function DeconstructRcvrAddress() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let rcvrAddress = "mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW"
  let hash160 = "87d26e56b26e58354cabc60edc09c4c878d85c83"

  const [showHash160, setShowHash160] = useState(false)

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
        el.classList.toggle("interface__block-cell--appear")
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

  const [hasError, setHasError] = useState(false)
  const [validationErrorMessage, setValidationErrorMessage] = useState("")
  const [withinRange, setWithinRange] = useState(false)
  const [withinRangeAmount, setWithinRangeAmount] = useState(0)

  let selectedUtxoAmount = 394872
  let minAmountToSend = 5000
  let avgTxSize_vBytes = 200
  const [minAmountTxFee, setMinAmountTxFee] = useState(1) // sat/vBytes

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
        if (value_Number > minAmountToSend && value_Number <= selectedUtxoAmount - minAmountTxFee * avgTxSize_vBytes) {
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

  async function getFeeEstimation() {
    try {
      let result = await appState.bitcoin.activeProvider?.bitcoin.fees.getFeesRecommended()
      result && setMinAmountTxFee(result.halfHourFee)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getFeeEstimation()
  }, [])

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 3: Deconstruct Rcvr Address</div>

          <div className="tx-builder__blueprint">
            <div style={{ width: "100%", height: "100%", justifyContent: "flex-start", padding: "35px 20px" }} className="display-flex display-flex--column appear-grab">
              {showHash160 ? (
                <>
                  <div data-tooltip-id="hash160" data-tooltip-content={hash160}>
                    {"{" + hash160.slice(0, 10) + "..." + hash160.slice(-10) + "}"}
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
                  <p style={{ fontSize: ".7em", borderTop: "1px solid gray", paddingTop: "10px", color: "gray" }}>Input amount &#40;satoshis&#41; you want to send &#40;lock&#41; to the public key hash above. Any remaining amount &#40;ex. fees&#41; will be sent back to your wallet.</p>
                  <div className="input-container">
                    <input onChange={e => handleInputtedAmount(e.target.value)} className={"input-white " + (hasError ? "input--focus-red" : "") + (!hasError && withinRange ? "input--focus-green" : "")} type="text" required />
                    <span className="input-placeholder">Send Amount</span>
                    <div className="input-validation">
                      Est. Fee &#40;{minAmountTxFee} sat/vB&#41; | TX Fees &#40;sats&#41;: {!hasError && withinRange ? minAmountTxFee * avgTxSize_vBytes : 0} | Remaining &#40;sats&#41;: {!hasError && withinRange ? selectedUtxoAmount - (minAmountTxFee * avgTxSize_vBytes + withinRangeAmount) : ""}
                    </div>
                    {hasError ? (
                      <div className="input-validation input-validation--error">
                        <MdError style={{ width: "12px", height: "12px" }} className="icon--error" />
                        &nbsp;{validationErrorMessage}
                      </div>
                    ) : (
                      ""
                    )}
                    {!hasError && withinRange ? (
                      <div className="input-validation input-validation--success">
                        <MdCheckCircle style={{ width: "14px", height: "14px" }} className="icon--checked" /> {"Proper amount within range."}
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

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer">
            {!hasError && withinRange ? (
              <>
                <button className="button-purple">Next</button>
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

export default DeconstructRcvrAddress
