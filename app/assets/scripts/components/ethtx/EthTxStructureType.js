import React, { useEffect, useState, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { MdCheckCircle, MdError, MdContentPasteGo, MdQrCodeScanner } from "react-icons/md"
import { isAddress, ethers } from "ethers"

function EthTxStructureType() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

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

  function handleToInput(value) {
    if (!value.trim()) {
      setToInputError("")
      setIsToInputValid(false)
    } else {
      if (value.startsWith("0x")) {
        if (value.length == 42) {
          try {
            if (isAddress(value)) {
              // valid ethereum address
              setToInputError("")
              setIsToInputValid(true)
            } else {
              setToInputError("Invalid address. Try another.")
            }
          } catch (err) {
            console.error(err)
            setToInputError("Invalid address. Try another.")
          }
        } else {
          setIsToInputValid(false)
          setToInputError("Invalid address length")
        }
      } else {
        setIsToInputValid(false)
        setToInputError("Invalid ethereum address")
      }
    }
  }

  useEffect(() => {
    null
  }, [])

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "15px" }}>
          <div className="tx-builder__overlay__outer">Step 1: Structure Type</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>ETH TX Data Structure Form</p>
            <div className="tx-builder__blueprint-dashboard">
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.chainId</span>
                  <FaQuestionCircle className="icon" />

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
                  <input onChange={e => handleChainIdInput(e.target.value)} className="eth-txBuilder-input" type="number" />
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.type</span>
                  <FaQuestionCircle className="icon" />

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
                  <input onChange={e => handleTypeInput(e.target.value)} className="eth-txBuilder-input" type="number" />
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.to</span>
                  <FaQuestionCircle className="icon" />

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
                  <input onChange={e => handleToInput(e.target.value)} className="eth-txBuilder-input" type="text" />
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.data</span>
                  <FaQuestionCircle className="icon" />
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
    </>
  )
}

export default EthTxStructureType
