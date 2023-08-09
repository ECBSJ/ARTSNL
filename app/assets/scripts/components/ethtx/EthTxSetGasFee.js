import React, { useEffect, useState, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { Tooltip } from "react-tooltip"
import { IconContext } from "react-icons"
import { FaQuestionCircle } from "react-icons/fa"
import { MdCheckCircle, MdError, MdContentPasteGo, MdQrCodeScanner, MdManageSearch } from "react-icons/md"

import LazyLoadFallback from "../LazyLoadFallback"

import { formatEther, formatUnits } from "ethers"

function EthTxSetGasFee({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [fetchGasFeeError, setFetchGasFeeError] = useState(false)
  const [gasLimit, setGasLimit] = useState()
  const [maxFeePerGas, setMaxFeePerGas] = useState()
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState()

  async function fetchGasLimit() {
    try {
      let result = await appState.ethereum.txBuilder.wallet?.estimateGas(appState.ethereum.txBuilder.txDataStruct)
      result && appDispatch({ type: "setGasLimit", value: result })
      setGasLimit(result)
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchFeeData() {
    // feeResult in bigint wei
    try {
      let result = await appState.ethereum.activeProvider.getFeeData()
      appDispatch({ type: "setMaxFeePerGas", value: result?.maxFeePerGas })
      appDispatch({ type: "setMaxPriorityFeePerGas", value: result?.maxPriorityFeePerGas })
      setMaxFeePerGas(result?.maxFeePerGas)
      setMaxPriorityFeePerGas(result?.maxPriorityFeePerGas)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchGasLimit()
    fetchFeeData()
    fetchNonce()
  }, [])

  const [nonce, setNonce] = useState(null)
  const [staticNonce, setStaticNonce] = useState(null)
  const [nonceError, setNonceError] = useState(false)
  const [nonceErrorMessage, setNonceErrorMessage] = useState("")
  const [inputtedValidNonce, setInputtedValidNonce] = useState(null)

  async function fetchNonce() {
    try {
      let result = await appState.ethereum.txBuilder.wallet?.getNonce()
      setNonce(result)
      setStaticNonce(result)
      // set valid nonce
      setInputtedValidNonce(result)
      setNonceErrorMessage("")
    } catch (err) {
      console.error(err)
      setNonceError(true)
      setNonceErrorMessage("Error fetching nonce data. Try again.")
    }
  }

  function handleInputNonceValidation(value) {
    if (!value.trim()) {
      setInputtedValidNonce(null)
      setNonceErrorMessage("")
    } else {
      if (value >= staticNonce) {
        // set valid nonce
        setInputtedValidNonce(parseInt(value))
        setNonceErrorMessage("")
      } else {
        setInputtedValidNonce(null)
        setNonceErrorMessage("Nonce needs to be larger than previous nonce.")
      }
    }
  }

  function handleNext() {
    appDispatch({ type: "setNonce", value: inputtedValidNonce })
    setTxStatus(2)
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "15px" }}>
          <div className="tx-builder__overlay__outer">Step 2: Set Gas & Fee</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>ETH TX Data Structure Form</p>
            <div className="tx-builder__blueprint-dashboard">
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.gasLimit</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="The gas limit refers to the maximum amount of gas you are willing to consume on a transaction." className="icon" />
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input className="eth-txBuilder-input" value={gasLimit ? Number(gasLimit) : ""} readOnly type="number" />
                  <span style={{ position: "absolute", right: "4px", bottom: "4px", cursor: "default", color: "#8746a6" }}>gas units</span>
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.maxFeePerGas</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="Users can specify a maximum limit they are willing to pay for their transaction to be executed." className="icon" />
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input className="eth-txBuilder-input" value={maxFeePerGas ? formatUnits(maxFeePerGas, "gwei") : ""} readOnly type="number" />
                  <span style={{ position: "absolute", right: "4px", bottom: "4px", cursor: "default", color: "#8746a6" }}>gwei</span>
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.maxPriorityFeePerGas</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="The priority fee (tip) incentivizes validators to include a transaction in the block." className="icon" />
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input className="eth-txBuilder-input" value={maxPriorityFeePerGas ? formatUnits(maxPriorityFeePerGas, "gwei") : ""} readOnly type="number" />
                  <span style={{ position: "absolute", right: "4px", bottom: "4px", cursor: "default", color: "#8746a6" }}>gwei</span>
                </div>
              </div>
              <div className="tx-builder__blueprint-dashboard__input-field">
                <div className="tx-builder__blueprint-dashboard__input-field-top">
                  <span>tx.nonce</span>
                  <FaQuestionCircle id="Tooltip" data-tooltip-content="A sequentially incrementing counter which indicates the transaction number from the account." className="icon" />
                  <MdManageSearch onClick={() => fetchNonce()} id="Tooltip" data-tooltip-content="Get current nonce available for your account" className="icon" />

                  {nonceErrorMessage ? (
                    <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "red", columnGap: "3px", fontSize: ".6em" }} className="position-absolute display-flex">
                      {nonceErrorMessage}
                      <MdError className="icon--error" />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                  <input autoFocus onChange={e => handleInputNonceValidation(e.target.value)} className="eth-txBuilder-input" value={Number.isInteger(nonce) ? nonce : undefined} onFocus={() => setNonce(null)} type="number" />
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
            {inputtedValidNonce || inputtedValidNonce === 0 ? (
              <>
                <button onClick={() => handleNext()} className="button-purple">
                  Input Send Amount
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

export default EthTxSetGasFee
