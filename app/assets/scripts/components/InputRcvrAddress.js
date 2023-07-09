import React, { useEffect, useContext, useState } from "react"
import { IconContext } from "react-icons"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import * as bitcoin from "../../../../bitcoinjs-lib"

function InputRcvrAddress() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  // let p2pkhCheck = bitcoin.address.fromBase58Check("mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW")
  let p2pkhCheck = bitcoin.address.fromBase58Check("18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX")
  let p2wpkhCheck = bitcoin.address.fromBech32("bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq")

  const [validInputtedAddress, setValidInputtedAddress] = useState("")
  const [hasError, setHasError] = useState(false)
  const [validationErrorMessage, setValidationErrorMessage] = useState("")

  function addressValidator(value) {
    if (!value.trim()) {
      setHasError(false)
      setValidInputtedAddress("")
    } else {
      // MAINNET VALIDATION
      if (!appState.isTestnet) {
        // legacy validation
        if (value.startsWith("1")) {
          if (value.length == 34) {
            try {
              let result = bitcoin.address.fromBase58Check("18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX")
              result && setValidInputtedAddress(value)
            } catch (error) {
              setHasError(true)
              setValidationErrorMessage("Invalid base58 checksum. Check address or input different address.")
              console.error(error)
            }
          } else {
            setHasError(true)
            setValidationErrorMessage("Invalid length of Legacy P2PKH address.")
          }
        }
      }

      // TESTNET VALIDATION
      if (appState.isTestnet) {
        null
      }
    }
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 2: Input Rcvr Address</div>

          <div className="tx-builder__blueprint">
            <div className="input-container">
              <input onChange={e => addressValidator(e.target.value)} className={"input-white " + (hasError ? "input--focus-red" : "") + (validInputtedAddress ? "input--focus-green" : "")} type="text" required />
              <span className="input-placeholder">Input Rcvr Add</span>
            </div>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer">
            <button onClick={() => null} className="button-purple">
              Next
            </button>
          </div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default InputRcvrAddress
