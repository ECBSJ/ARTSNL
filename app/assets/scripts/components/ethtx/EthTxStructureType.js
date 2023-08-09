import React, { useEffect, useState, useContext, useRef } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { Tooltip } from "react-tooltip"
import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { MdCheckCircle, MdError, MdContentPasteGo, MdQrCodeScanner } from "react-icons/md"
import { isAddress, formatEther } from "ethers"

import QRreaderPopup from "../QRreaderPopup"

function EthTxStructureType({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let chainIdInputRef = useRef()

  let chainId = appState.isTestnet ? 5 : 1
  const [chainIdInputError, setChainIdInputError] = useState("")

  function handleChainIdInput(value) {
    if (!value.trim()) {
      setChainIdInputError("")
    } else {
      if (value == chainId) {
        setChainIdInputError("")
      } else {
        setChainIdInputError("The Goerli chainId is 5")
      }
    }
  }

  let txType = 2
  const [typeInputError, setTypeInputError] = useState("")

  function handleTypeInput(value) {
    if (!value.trim()) {
      setTypeInputError("")
    } else {
      if (value == txType) {
        setTypeInputError("")
      } else {
        setTypeInputError("Currently only type 2 supported")
      }
    }
  }

  const [toInputError, setToInputError] = useState("")
  const [isToInputValid, setIsToInputValid] = useState(false)
  const [inputtedValidTo, setInputtedValidTo] = useState("")

  const [openQRreader, setOpenQRreader] = useState(false)
  const [scannedValue, setScannedValue] = useState()

  function handleToInput(value) {
    if (!value.trim()) {
      setToInputError("")
      setIsToInputValid(false)
      setInputtedValidTo("")
    } else {
      if (value.startsWith("0x")) {
        if (value.length == 42) {
          try {
            if (isAddress(value)) {
              // valid ethereum address
              setToInputError("")
              setIsToInputValid(true)
              setInputtedValidTo(value)
            } else {
              setToInputError("Invalid address. Try another.")
              setInputtedValidTo("")
            }
          } catch (err) {
            console.error(err)
            setToInputError("Invalid address. Try another.")
            setInputtedValidTo("")
          }
        } else {
          setIsToInputValid(false)
          setToInputError("Invalid address length")
          setInputtedValidTo("")
        }
      } else {
        setIsToInputValid(false)
        setToInputError("Invalid ethereum address")
        setInputtedValidTo("")
      }
    }
  }

  const [dataType, setDataType] = useState("text")
  const [inputtedValidData, setInputtedValidData] = useState("")
  const [dataInputError, setDataInputError] = useState("")
  const [isValidHex, setIsValidHex] = useState(false)

  useEffect(() => {
    setInputtedValidData("")
    setDataInputError("")
    setIsValidHex(false)
    document.getElementById("data-input-grab").value = ""
    document.getElementById("data-input-grab").focus()
  }, [dataType])

  function handleDataInput(value) {
    if (!value.trim()) {
      setDataInputError("")
      setInputtedValidData("")
      setIsValidHex(false)
    } else {
      if (dataType === "text") {
        try {
          let stringDataBufferHex = "0x" + Buffer.from(value).toString("hex")
          setInputtedValidData(stringDataBufferHex)
        } catch (err) {
          console.error(err)
          setDataInputError("Invalid text string")
        }
      }

      if (dataType === "hex") {
        if (value.startsWith("0x")) {
          // check hex validity
          let removed0x = value.slice(2)
          if (is_hexadecimal(removed0x)) {
            // valid hexadecimal data input
            setDataInputError("")
            setIsValidHex(true)
            setInputtedValidData(value)
          } else {
            setDataInputError("Invalid hex string")
            setIsValidHex(false)
          }
        } else {
          setIsValidHex(false)
          setDataInputError("Invalid hex string")
        }
      }
    }
  }

  function is_hexadecimal(value) {
    let regexp = /^[0-9a-fA-F]+$/

    if (regexp.test(value)) {
      return true
    } else {
      return false
    }
  }

  function handlePaste() {
    navigator.clipboard
      .readText()
      .then((res) => {
        document.getElementById("to-input-grab").value = res
        handleToInput(res)
      })
      .catch(console.error)
  }

  useEffect(() => {
    chainIdInputRef.current.focus()
  }, [])

  function handleNext() {
    // add properties to appState txDataStruct
    appDispatch({ type: "setChainId", value: chainId })
    appDispatch({ type: "setTxType", value: txType })
    appDispatch({ type: "setTxTo", value: inputtedValidTo })

    if (inputtedValidData) {
      appDispatch({ type: "setTxData", value: inputtedValidData })
    }

    // navigate to estimating gas & fee
    setTxStatus(1)
  }

  return (
    <>
      {openQRreader ? <QRreaderPopup setInputValue={handleToInput} setScannedValue={setScannedValue} openQRreader={openQRreader} setOpenQRreader={setOpenQRreader} /> : ""}

      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "15px" }}>
          <div className="tx-builder__overlay__outer">Step 1: Structure Type</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>ETH TX Data Structure Form</p>
            <div className="tx-builder__blueprint-dashboard">
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.chainId</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="The EIP-155 chainId corresponds to what EVM network your wallet is currently listening on" className="icon" />

                  {chainIdInputError ? (
                    <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "red", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                      {chainIdInputError}
                      <MdError className="icon--error" />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input ref={chainIdInputRef} onChange={(e) => handleChainIdInput(e.target.value)} className="eth-txBuilder-input" type="number" />
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.type</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="ARTSNL currently only supports EIP-1559 type 2 tx formats." className="icon" />

                  {typeInputError ? (
                    <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "red", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                      {typeInputError}
                      <MdError className="icon--error" />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input onChange={(e) => handleTypeInput(e.target.value)} className="eth-txBuilder-input" type="number" />
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.to</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="Input a valid Ethereum address" className="icon" />
                  <MdContentPasteGo id="Tooltip" data-tooltip-content="Paste ethereum address from clipboard" onClick={() => handlePaste()} className="icon" />
                  <MdQrCodeScanner onClick={() => setOpenQRreader(!openQRreader)} id="Tooltip" data-tooltip-content="Scan QR code of ethereum address" className="icon" />
                  {toInputError ? (
                    <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "red", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                      {toInputError}
                      <MdError className="icon--error" />
                    </span>
                  ) : (
                    ""
                  )}

                  {isToInputValid ? (
                    <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "greenyellow", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                      Valid ethereum address
                      <MdCheckCircle className="icon--checked" />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input id="to-input-grab" onChange={(e) => handleToInput(e.target.value)} className="eth-txBuilder-input" value={scannedValue ? scannedValue : undefined} onFocus={() => setScannedValue()} type="text" />
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.data</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="The data field allows you to store arbitrary text on the blockchain. Input an arbitrary length text or a valid hexadecimal string prefixed with 0x." className="icon" />
                  <div className="data-type-selector-container display-flex">
                    <span onClick={() => setDataType("text")} className={"data-type-selector-container--box " + (dataType === "text" ? "box-selected" : "")}>
                      TEXT
                    </span>
                    <span onClick={() => setDataType("hex")} className={"data-type-selector-container--box " + (dataType === "hex" ? "box-selected" : "")}>
                      HEX
                    </span>
                  </div>

                  {dataInputError ? (
                    <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "red", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                      {dataInputError}
                      <MdError className="icon--error" />
                    </span>
                  ) : (
                    ""
                  )}

                  {isValidHex ? (
                    <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "greenyellow", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                      Valid hexadecimal string
                      <MdCheckCircle className="icon--checked" />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input id="data-input-grab" onChange={(e) => handleDataInput(e.target.value)} className="eth-txBuilder-input" placeholder="optional" type="text" />
                </div>
              </div>
            </div>
            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Current Balance:</span> {formatEther(appState.ethereum.currentBalance)}
            </p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>
              <span style={{ color: "gray" }}>Estimated Available:</span> {formatEther(appState.ethereum.currentBalance)}
            </p>
          </div>

          <div className="tx-builder__overlay__outer">
            {chainId && txType && inputtedValidTo ? (
              <>
                <button onClick={() => handleNext()} className="button-purple">
                  Estimate Gas & Fee
                </button>
              </>
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

export default EthTxStructureType
