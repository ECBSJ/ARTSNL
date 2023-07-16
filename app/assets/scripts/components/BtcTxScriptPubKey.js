import React, { useEffect, useContext, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { IconContext } from "react-icons"

function BtcTxScriptPubKey() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let rawHash160 = "87d26e56b26e58354cabc60edc09c4c878d85c83"

  const opCodesArray_scriptPubKey_incorrect = [
    {
      opCodeName: "OP_EQUALVERIFY",
      opCodeValue: "0x88"
    },
    {
      opCodeName: "rawHash160",
      opCodeValue: rawHash160
    },
    {
      opCodeName: "OP_CHECKSIG",
      opCodeValue: "0xac"
    },
    {
      opCodeName: "OP_DUP",
      opCodeValue: "0x76"
    },
    {
      opCodeName: "OP_HASH160",
      opCodeValue: "0xa9"
    }
  ]

  const opCodesArray_scriptPubKey_correct = [
    {
      opCodeName: "OP_CHECKSIG",
      opCodeValue: "0xac"
    },
    {
      opCodeName: "OP_EQUALVERIFY",
      opCodeValue: "0x88"
    },
    {
      opCodeName: "rawHash160",
      opCodeValue: rawHash160
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
  const [isStackCorrect, setIsStackCorrect] = useState(false)

  function handleOnDrag(e, opCodeObject) {
    e.dataTransfer.setData("opCodeObject", JSON.stringify(opCodeObject))
  }

  function handleOnDragEnd(e) {
    e.target.style.display = "none"
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDragEnter(e) {
    if (e.target.id == "drop-target") {
      e.target.style.backgroundColor = "#6a6a88d9"
    }
  }

  function handleDragLeave(e) {
    if (e.target.id == "drop-target") {
      e.target.style.backgroundColor = "#2a2a3ad9"
    }
  }

  function handleOnDrop(e) {
    if (e.target.id == "drop-target") {
      e.target.style.backgroundColor = "#2a2a3ad9"
    }
    let opCodeObject = e.dataTransfer.getData("opCodeObject")
    setOpCodesStacked([...opCodesStacked, JSON.parse(opCodeObject)])
  }

  useEffect(() => {
    if (opCodesStacked.length === 5) {
      if (JSON.stringify(opCodesStacked) == JSON.stringify(opCodesArray_scriptPubKey_correct)) {
        // correct stack
        document.querySelectorAll(".drop").forEach(el => el.classList.toggle("drop--correct"))
        setIsStackCorrect(true)
      } else {
        // incorrect stack
        document.querySelectorAll(".drop").forEach(el => el.classList.toggle("drop--incorrect"))
      }
    }

    if (opCodesStacked.length > 5) {
      let collection = document.getElementsByClassName("drop")

      for (let i = 0; i < collection.length; i++) {
        collection[i].style.backgroundColor = "red"
      }

      setIsStackCorrect(false)
    }
  }, [opCodesStacked])

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 4: Build ScriptPubKey</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-5px", left: "28px", right: "28px", fontSize: "0.6em", color: "gray" }}>Drag & drop script opcodes to form ScriptPubKey. Decoded receiver address, hash160, should be included in the middle of the stack.</p>

            <div style={{ width: "100%", height: "80%", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
              <div style={{ position: "relative", flex: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                <span style={{ position: "absolute", top: "2", left: "55", fontSize: ".5em", color: "#d1bbff", cursor: "default" }}>Script OpCodes</span>
                {opCodesArray_scriptPubKey_incorrect.map((opCodeObject, index) => (
                  <div className="drag" key={index} draggable onDragStart={e => handleOnDrag(e, opCodeObject)} onDragEnd={e => handleOnDragEnd(e)}>
                    {opCodeObject.opCodeName}
                  </div>
                ))}
              </div>
              <div id="drop-target" style={{ zIndex: "102", position: "relative", flex: 1, width: "100%", height: "286px", overflowY: "scroll", display: "flex", flexDirection: "column-reverse", justifyContent: "flex-start", alignItems: "center", marginLeft: "7px", backgroundColor: "#2a2a3ad9", borderRadius: "6px" }} onDrop={e => handleOnDrop(e)} onDragOver={e => handleDragOver(e)} onDragEnter={e => handleDragEnter(e)} onDragLeave={e => handleDragLeave(e)}>
                <span style={{ position: "absolute", top: "2", left: "55", fontSize: ".5em", color: "#d1bbff", cursor: "default" }}>Script Stack</span>

                {opCodesStacked.map((opCodeObject, index) => (
                  <div className="drop" key={index}>
                    {opCodeObject.opCodeName == "rawHash160" ? <>{"{ " + opCodeObject.opCodeValue.slice(0, 5) + "..." + opCodeObject.opCodeValue.slice(-5) + " }"}</> : opCodeObject.opCodeValue}
                  </div>
                ))}
              </div>
            </div>

            <span style={{ position: "absolute", width: "120px", right: "46px", bottom: "121px", color: "white", fontFamily: "fantasy", fontSize: "2rem", cursor: "default", textAlign: "center" }}>Drop OpCodes Here</span>

            <p
              onClick={() => {
                document.querySelectorAll(".drag").forEach(el => (el.style.display = "flex"))
                setOpCodesStacked([])
                setIsStackCorrect(false)
              }}
              style={{ position: "absolute", bottom: "-4px", right: "28px", fontSize: "0.7em", cursor: "pointer", color: "orange" }}
            >
              Refresh stack
            </p>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer">{isStackCorrect ? <button className="button-purple">Concatenate</button> : ""}</div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default BtcTxScriptPubKey
