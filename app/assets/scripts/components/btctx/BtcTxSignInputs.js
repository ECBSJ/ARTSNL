import React, { useEffect, useContext, useState } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { IconContext } from "react-icons"
import { BsFileEarmarkLock2Fill } from "react-icons/bs"
import { TbSignatureOff } from "react-icons/tb"
import { FaSignature } from "react-icons/fa"

import UtxoDisplayCard from "./UtxoDisplayCard"

function BtcTxSignInputs({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let utxoData_Array = appState.bitcoin.txBuilder.utxoData_Array
  let selectedUtxo = appState.bitcoin.txBuilder.selectedArray

  const [translateXMultiplier, setTranslateXMultipler] = useState(0)
  let translateXConstant = -419
  let translateXAmount = translateXConstant * translateXMultiplier
  let translateXStyle = {
    translate: translateXAmount.toString() + "px"
  }

  function handleSelect(e, index) {
    setTranslateXMultipler(index)
  }

  const [isSigned_Array, setIsSigned_Array] = useState([])

  // called in <UtxoDisplayCard />
  function handleSigning(e, index) {
    if (isSigned_Array.includes(index)) {
      // if already signed, do nothing
      null
    } else {
      // if not signed, then sign
      setTimeout(() => {
        setIsSigned_Array([...isSigned_Array, index])
      }, 1000)
    }
  }

  useEffect(() => {
    appDispatch({ type: "constructPsbtInputOutput" })
  }, [])

  function navigateToReviewTx() {
    appDispatch({ type: "finalizePsbt" })
    setTxStatus(6)
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 5: Sign Inputs</div>

          <div className="tx-builder__blueprint">
            <span style={{ position: "absolute", top: "4px", right: "7px", fontSize: "0.5em" }}>UTXOs pending signature: {selectedUtxo.length - isSigned_Array.length}</span>
            <div className="tx-builder__blueprint-signing-section__container-top">
              {selectedUtxo.map((selectedUtxo, index) => {
                return (
                  <button key={index} onClick={e => handleSelect(e, index)} className={"put-capsule " + (translateXMultiplier === index ? "put-capsule--selected" : "")}>
                    <BsFileEarmarkLock2Fill style={{ marginRight: "6px" }} />
                    <div style={{ textAlign: "left", fontSize: "0.9em" }}>
                      <span>UTXO: ...{utxoData_Array[selectedUtxo].txid.slice(-4)}</span>
                      <br />
                      <span>Value: {utxoData_Array[selectedUtxo].value}</span>
                      <br />
                      <span>Index: &#91;{index}&#93;</span>
                    </div>
                    {isSigned_Array.includes(index) ? <FaSignature style={{ color: "greenyellow" }} /> : <TbSignatureOff style={{ color: "red" }} />}
                  </button>
                )
              })}
            </div>
            <div className="tx-builder__blueprint-signing-section__container-bottom">
              <div style={translateXStyle} className="tx-builder__blueprint-carousel-container tx-builder__blueprint-carousel-container--smaller">
                {selectedUtxo.map((selectedIndex, index) => {
                  let utxo = utxoData_Array[selectedIndex]

                  return <UtxoDisplayCard key={index} index={index} txid={utxo.txid} vout={utxo.vout} confirmed={utxo.status.confirmed} block_height={utxo.status.block_height} block_hash={utxo.status.block_hash} block_time={utxo.status.block_time} value={utxo.value} isSigning={true} handleSigning={handleSigning} isSigned_Array={isSigned_Array} />
                })}
              </div>
            </div>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer">
            {selectedUtxo.length === isSigned_Array.length ? (
              <button onClick={() => navigateToReviewTx()} className="button-purple">
                Review & Broadcast
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

export default BtcTxSignInputs
