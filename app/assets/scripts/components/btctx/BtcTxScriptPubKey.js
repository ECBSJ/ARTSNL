import React, { useEffect, useContext, useState, useRef } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { IconContext } from "react-icons"
import { CSSTransition } from "react-transition-group"
import ModalDropDown from "../ModalDropDown"
import * as bitcoin from "../../../../../bitcoinjs-lib"
import * as uint8arraytools from "uint8array-tools"

function BtcTxScriptPubKey({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let rawHash160 = "87d26e56b26e58354cabc60edc09c4c878d85c83"

  const [opCodesArray_scriptPubKey_incorrect, setOpCodesArray_scriptPubKey_incorrect] = useState([
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
  ])

  const defaultIncorrectStack = [
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

  function handleOnDragStart(e, opCodeObject) {
    e.dataTransfer.setData("opCodeObject", JSON.stringify(opCodeObject))
  }

  function handleOnDragEnd(e) {
    null
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

    let indexToSplice = opCodesArray_scriptPubKey_incorrect.findIndex(el => {
      return JSON.stringify(el) == opCodeObject
    })
    opCodesArray_scriptPubKey_incorrect.splice(indexToSplice, 1)

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

  // type string
  const [scriptPubKey, setScriptPubKey] = useState()

  function handleConcatenate() {
    let network = appState.bitcoin.bitcoinJsNetwork
    // let address = appState.bitcoin.txBuilder.validInputtedAddress
    let address = "mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW"
    let result = bitcoin.address.toOutputScript(address, network)
    setScriptPubKey(uint8arraytools.toHex(result))

    setIsModalDropDownOpen(!isModalDropDownOpen)
  }

  function navigateToSignInputs() {
    setIsModalDropDownOpen(!isModalDropDownOpen)

    setTimeout(() => setTxStatus(5), 700)
  }

  return (
    <>
      <CSSTransition in={isModalDropDownOpen} timeout={400} classNames="modal__cover" unmountOnExit>
        <div ref={modalDropDownRef} className="modal__cover"></div>
      </CSSTransition>

      <CSSTransition in={isModalDropDownOpen} timeout={600} classNames="modal__drop-down" unmountOnExit>
        <ModalDropDown setIsModalDropDownOpen={setIsModalDropDownOpen} isModalDropDownOpen={isModalDropDownOpen} emoji={"🧱"} title={"ScriptPubKey Initialized"} subtitle={"The 25 byte sized locking script, scriptpubkey,"} subtitle_2={"is now initialized for the receiver's address."} hasData={true} data={scriptPubKey} showFullData={false} ending_content={"Click on 'NEXT' icon"} ending_content_2={"below to proceed."} hideDoubleArrow={true} displayNextArrow={true} functionToRunOnNext={navigateToSignInputs} />
      </CSSTransition>

      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 4: Build ScriptPubKey</div>

          <div className="tx-builder__blueprint">
            <p style={{ position: "absolute", top: "-5px", left: "28px", right: "28px", fontSize: "0.6em", color: "gray" }}>Drag & drop script opcodes to form ScriptPubKey. Decoded receiver address, hash160, should be included in the middle of the stack.</p>

            <div style={{ width: "100%", height: "80%", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
              <div style={{ position: "relative", flex: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                <span style={{ position: "absolute", top: "2", left: "55", fontSize: ".5em", color: "#d1bbff", cursor: "default" }}>Script OpCodes</span>
                {opCodesArray_scriptPubKey_incorrect.map((opCodeObject, index) => (
                  <div className="drag" key={index} draggable onDragStart={e => handleOnDragStart(e, opCodeObject)} onDragEnd={e => handleOnDragEnd(e)}>
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

            <span style={{ position: "absolute", width: "120px", right: "46px", bottom: "121px", color: "white", fontFamily: "monospace", fontSize: "2rem", cursor: "default", textAlign: "center" }}>Drop OpCodes Here</span>

            <p
              onClick={() => {
                setOpCodesArray_scriptPubKey_incorrect(defaultIncorrectStack)
                setOpCodesStacked([])
                setIsStackCorrect(false)
              }}
              style={{ position: "absolute", bottom: "-4px", right: "28px", fontSize: "0.7em", cursor: "pointer", color: "orange" }}
            >
              Reset stack
            </p>

            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
          </div>

          <div className="tx-builder__overlay__outer">
            {isStackCorrect ? (
              <button onClick={() => handleConcatenate()} className="button-purple">
                Concatenate
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

export default BtcTxScriptPubKey
