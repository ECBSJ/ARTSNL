import React, { useState, useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { Link } from "react-router-dom"
import * as crypto from "crypto"

function CreateEntropyPage({ entropy, setEntropy, setOnCreateEntropyPage, setOnDisplayMultipleRaw }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  async function handleCreateEntropy() {
    const randomBytes = crypto.randomBytes(32)
    setEntropy(randomBytes)
  }

  async function handleAccept() {
    setOnCreateEntropyPage(false)
    setOnDisplayMultipleRaw(true)
  }

  return (
    <>
      {entropy ? <div>{entropy.toString("hex")}</div> : ""}
      <button onClick={handleCreateEntropy}>Generate Entropy</button>
      {entropy ? <button onClick={handleAccept}>Accept Entropy</button> : ""}

      <button
        onClick={() => {
          setOnCreateEntropyPage(false)
          setEntropy("")
        }}
      >
        Back to Creation Selection
      </button>
    </>
  )
}

export default CreateEntropyPage
