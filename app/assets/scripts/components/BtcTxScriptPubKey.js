import React, { useEffect, useContext, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { IconContext } from "react-icons"

function BtcTxScriptPubKey() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let rawhash160 = "87d26e56b26e58354cabc60edc09c4c878d85c83"

  const opCodesArray_scriptPubKey = [
    {
      opCodeName: "OP_EQUALVERIFY",
      opCodeValue: "0x88"
    },
    {
      opCodeName: "rawHash160",
      opCodeValue: rawhash160
    },
    {
      opCodeName: "OP_CHECKSIG",
      opCodeValue: "0xac"
    },
    {
      opCodeName: "OP_HASH160",
      opCodeValue: "0xa9"
    },
    {
      opCodeName: "OP_DUP",
      opCodeValue: "0x76"
    }
  ]

  const [opCodesStacked, setOpCodesStacked] = useState([])

  function handleOnDrag(e, opCodeObject) {
    e.dataTransfer.setData("opCodeObject", JSON.stringify(opCodeObject))
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleOnDrop(e) {
    let opCodeObject = e.dataTransfer.getData("opCodeObject")
    setOpCodesStacked([...opCodesStacked, JSON.parse(opCodeObject)])
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 4: Build ScriptPubKey</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-5px", left: "28px", right: "28px", fontSize: "0.6em", color: "gray" }}>Drag & drop script opcodes to form ScriptPubKey. Decoded receiver address, hash160, should be included in the middle of the stack.</p>

            <div style={{ width: "100%", height: "80%", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
              <div style={{ position: "relative", flex: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                <span style={{ position: "absolute", top: "0", left: "55", fontSize: ".5em", color: "#d1bbff" }}>Script OpCodes</span>
                {opCodesArray_scriptPubKey.map((opCodeObject, index) => (
                  <div className="drag" key={index} draggable onDragStart={e => handleOnDrag(e, opCodeObject)}>
                    {opCodeObject.opCodeName}
                  </div>
                ))}
              </div>
              <div style={{ position: "relative", flex: 1, width: "100%", height: "286px", overflowY: "scroll", display: "flex", flexDirection: "column-reverse", justifyContent: "flex-start", alignItems: "center", marginLeft: "7px" }} onDrop={e => handleOnDrop(e)} onDragOver={e => handleDragOver(e)}>
                {opCodesStacked.map((opCodeObject, index) => (
                  <div className="drop" key={index}>
                    {opCodeObject.opCodeValue}
                  </div>
                ))}
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

export default BtcTxScriptPubKey
