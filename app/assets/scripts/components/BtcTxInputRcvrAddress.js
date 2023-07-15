import React, { useEffect, useContext, useState, useRef } from "react"
import { IconContext } from "react-icons"
import { MdCheckCircle, MdError } from "react-icons/md"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import * as bitcoin from "../../../../bitcoinjs-lib"
import ModalDropDown from "./ModalDropDown"
import { CSSTransition } from "react-transition-group"

function BtcTxInputRcvrAddress({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  // let p2pkhCheck = bitcoin.address.fromBase58Check("mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW")
  let p2pkhCheck = bitcoin.address.fromBase58Check("18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX")
  let p2wpkhCheck = bitcoin.address.fromBech32("bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq")

  const [characterCounter, setCharacterCounter] = useState("")
  const [validInputtedAddress, setValidInputtedAddress] = useState("")
  const [validInputtedAddress_Decoded, setValidInputtedAddress_Decoded] = useState(null)
  const [addressType, setAddressType] = useState("")
  const [hasError, setHasError] = useState(false)
  const [validationErrorMessage, setValidationErrorMessage] = useState("")

  function addressValidator(value) {
    setCharacterCounter(value)

    if (!value.trim()) {
      setHasError(false)
      setValidationErrorMessage("")
      setValidInputtedAddress("")
      setValidInputtedAddress_Decoded(null)
      setAddressType("")
    } else {
      // MAINNET VALIDATION
      if (!appState.isTestnet) {
        // legacy validation
        if (value.startsWith("1")) {
          if (value.length == 34) {
            try {
              let result = bitcoin.address.fromBase58Check(value)
              setHasError(false)
              result && setValidInputtedAddress(value)
              setValidInputtedAddress_Decoded(result)
              setAddressType("p2pkh")
              console.log(result)
            } catch (error) {
              setHasError(true)
              setValidationErrorMessage("Invalid checksum. Use different address.")
              console.error(error)
            }
          } else {
            setHasError(true)
            setValidationErrorMessage("Invalid length of Legacy P2PKH address.")
          }
        }

        // segwit & taproot validation
        if (value.startsWith("bc1")) {
          setHasError(true)
          setValidationErrorMessage("Segwit & Taproot currently unsupported.")
        }

        // script validation
        if (value.startsWith("3")) {
          setHasError(true)
          setValidationErrorMessage("Script currently unsupported.")
        }

        // invalid address catch all
        if (!value.startsWith("1") && !value.startsWith("bc1") && !value.startsWith("3")) {
          setHasError(true)
          setValidationErrorMessage("Invalid mainnet bitcoin address.")
        }
      }

      // TESTNET VALIDATION
      if (appState.isTestnet) {
        // legacy validation
        if (value.startsWith("m") || value.startsWith("n")) {
          if (value.length == 34) {
            try {
              let result = bitcoin.address.fromBase58Check(value)
              setHasError(false)
              result && setValidInputtedAddress(value)
              setValidInputtedAddress_Decoded(result)
              setAddressType("p2pkh")
              console.log(result)
            } catch (error) {
              setHasError(true)
              setValidationErrorMessage("Invalid checksum. Use different address.")
              console.error(error)
            }
          } else {
            setHasError(true)
            setValidationErrorMessage("Invalid length of Legacy P2PKH address.")
          }
        }

        // segwit & taproot validation
        if (value.startsWith("tb1")) {
          setHasError(true)
          setValidationErrorMessage("Segwit & Taproot currently unsupported.")
        }

        // script validation
        if (value.startsWith("2")) {
          setHasError(true)
          setValidationErrorMessage("Script currently unsupported.")
        }

        // invalid address catch all
        if (!value.startsWith("m") && !value.startsWith("n") && !value.startsWith("tb1") && !value.startsWith("2")) {
          setHasError(true)
          setValidationErrorMessage("Invalid testnet bitcoin address.")
        }
      }
    }
  }

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

  function handleDeconstructRcvrAddress() {
    setIsModalDropDownOpen(!isModalDropDownOpen)
    appDispatch({ type: "setValidInputtedAddress", value: validInputtedAddress })
    appDispatch({ type: "setValidInputtedAddress_Decoded", value: validInputtedAddress_Decoded })

    // Go to deconstruct rcvr address page
    setTimeout(() => setTxStatus(3), 700)
  }

  return (
    <>
      <CSSTransition in={isModalDropDownOpen} timeout={400} classNames="modal__cover" unmountOnExit>
        <div ref={modalDropDownRef} className="modal__cover"></div>
      </CSSTransition>

      <CSSTransition in={isModalDropDownOpen} timeout={600} classNames="modal__drop-down" unmountOnExit>
        <ModalDropDown setIsModalDropDownOpen={setIsModalDropDownOpen} isModalDropDownOpen={isModalDropDownOpen} emoji={"🔍"} title={"Confirm Address"} subtitle={"Please confirm the receipient"} subtitle_2={"address you inputted."} hasData={false} data={validInputtedAddress} showFullData={false} ending_content={"Click on 'YES'"} ending_content_2={"if you have confirmed."} hideDoubleArrow={true} checkAddress={true} handleDeconstructRcvrAddress={handleDeconstructRcvrAddress} />
      </CSSTransition>

      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 2: Input Rcvr Address</div>

          <div className="tx-builder__blueprint">
            <div className="input-container">
              <input onChange={e => addressValidator(e.target.value)} className={"input-white " + (hasError ? "input--focus-red" : "") + (validInputtedAddress ? "input--focus-green" : "")} type="text" required />
              <span className="input-placeholder">Input Rcvr Add</span>
              <div className="input-validation">character count: {characterCounter.length}</div>
              {hasError ? (
                <div className="input-validation input-validation--error">
                  <MdError style={{ width: "12px", height: "12px" }} className="icon--error" />
                  &nbsp;{validationErrorMessage}
                </div>
              ) : (
                ""
              )}
              {!hasError && addressType ? (
                <div className="input-validation input-validation--success">
                  <MdCheckCircle style={{ width: "14px", height: "14px" }} className="icon--checked" /> {"Accepted " + addressType + " format."}
                </div>
              ) : (
                ""
              )}
            </div>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer">
            {!hasError && validInputtedAddress ? (
              <button onClick={() => setIsModalDropDownOpen(!isModalDropDownOpen)} className="button-purple">
                Confirm Address
              </button>
            ) : (
              ""
            )}
          </div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default BtcTxInputRcvrAddress
