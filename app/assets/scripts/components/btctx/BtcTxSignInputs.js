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

  let utxoData_Array = [
    { txid: "a296be122cc5c90bfc7e50f65b2c2e12d231a761d69ff05ec8a05b48f6f16b9a", vout: 0, status: { confirmed: true, block_height: 2434362, block_hash: "000000000000000588988168cfb4f924fcd912f6a7c9d909fbd978067be31f01", block_time: 1684590437 }, value: 5800 },
    { txid: "be7610fcaad261bf04241854c3cc41625283833fb5f09f56648c3769741eaf02", vout: 1, status: { confirmed: true, block_height: 2443296, block_hash: "0000000000000005a06960c65d7b9eeec50e358be78b64737ea920f90a3975ce", block_time: 1690082989 }, value: 8158 },
    { txid: "9153e5420b1092ff65d90a028df8840e0e3dfc8b9c8e1c1c0664e02f000c5def", vout: 0, status: { confirmed: true, block_height: 2434520, block_hash: "000000000000000f4632a88a45d61cd4e777040fc0203108661e7ebedcddc4bb", block_time: 1684648693 }, value: 13700 },
  ]

  let selectedUtxo = [0, 1, 2]
  let someArray = [69, 412, 888]

  const [translateXMultiplier, setTranslateXMultipler] = useState(0)
  let translateXConstant = -419
  let translateXAmount = translateXConstant * translateXMultiplier
  let translateXStyle = {
    translate: translateXAmount.toString() + "px",
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
                  <button key={index} onClick={(e) => handleSelect(e, index)} className={"put-capsule " + (translateXMultiplier === index ? "put-capsule--selected" : "")}>
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

                  return <UtxoDisplayCard key={index} index={index} txid={utxo.txid} vout={utxo.vout} confirmed={utxo.status.confirmed} block_height={utxo.status.block_height} block_hash={utxo.status.block_hash} block_time={utxo.status.block_time} value={utxo.value} selectedArray={someArray} isSigning={true} handleSigning={handleSigning} isSigned_Array={isSigned_Array} />
                })}
              </div>
            </div>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer"></div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default BtcTxSignInputs
