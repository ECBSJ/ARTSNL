import React, { useEffect, useState, useContext } from "react"
import * as bitcoin from "../../../../bitcoinjs-lib"
import DisplayMultipleRaw from "./DisplayMultipleRaw"

import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

import CreateEntropyPage from "./CreateEntropyPage"
import CreateBitsPage from "./CreateBitsPage"

function Bitcoin() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [bits, setBits] = useState("")
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
