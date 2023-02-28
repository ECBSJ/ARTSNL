import React, { useEffect, useState, useContext } from "react"
import * as bitcoin from "../../../../bitcoinjs-lib"

import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

import CreateEntropyPage from "./CreateEntropyPage"
import CreateBitsPage from "./CreateBitsPage"

function Bitcoin() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [onCreateEntropyPage, setOnCreateEntropyPage] = useState(false)
  const [onCreateBitsPage, setOnCreateBitsPage] = useState(false)

  return (
    <>
      {onCreateEntropyPage ? (
        <CreateEntropyPage setOnCreateEntropyPage={setOnCreateEntropyPage} />
      ) : onCreateBitsPage ? (
        <CreateBitsPage setOnCreateBitsPage={setOnCreateBitsPage} />
      ) : (
        <>
          <button onClick={() => setOnCreateEntropyPage(true)}>Lazy Entropy</button>
          <button onClick={() => setOnCreateBitsPage(true)}>DIY 256 bits</button>
        </>
      )}
    </>
  )
}

export default Bitcoin
