import React, { useEffect, useState, useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

// IMPORTING 3RD PARTY TOOLS
import * as bitcoin from "../../../../bitcoinjs-lib"

// IMPORTING COMPONENTS
import CreateEntropyPage from "./CreateEntropyPage"
import CreateBitsPage from "./CreateBitsPage"
import DisplayMultipleRaw from "./DisplayMultipleRaw"

function Bitcoin() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  // bits type is string
  const [bits, setBits] = useState("")
  // entropy type is a Uint8Array
  const [entropy, setEntropy] = useState("")

  const [onCreateEntropyPage, setOnCreateEntropyPage] = useState(false)
  const [onCreateBitsPage, setOnCreateBitsPage] = useState(false)
  const [onDisplayMultipleRaw, setOnDisplayMultipleRaw] = useState(false)

  return (
    <>
      {onCreateEntropyPage ? (
        <CreateEntropyPage entropy={entropy} setEntropy={setEntropy} setOnCreateEntropyPage={setOnCreateEntropyPage} setOnDisplayMultipleRaw={setOnDisplayMultipleRaw} />
      ) : onCreateBitsPage ? (
        <CreateBitsPage bits={bits} setBits={setBits} setOnCreateBitsPage={setOnCreateBitsPage} setOnDisplayMultipleRaw={setOnDisplayMultipleRaw} />
      ) : !onDisplayMultipleRaw ? (
        <>
          <button onClick={() => setOnCreateEntropyPage(true)}>Random 32 Bytes</button>
          <button onClick={() => setOnCreateBitsPage(true)}>DIY 256 bits</button>
        </>
      ) : (
        ""
      )}

      {onDisplayMultipleRaw ? <DisplayMultipleRaw bits={bits} entropy={entropy} /> : ""}
    </>
  )
}

export default Bitcoin
