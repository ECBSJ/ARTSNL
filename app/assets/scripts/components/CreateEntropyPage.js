import React, { useState, useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import * as crypto from "crypto"
import { MdMenu, MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"

function CreateEntropyPage({ entropy, setEntropy, setOnCreateEntropyPage, setOnDisplayMultipleRaw }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [accepted, setAccepted] = useState(false)

  async function handleRandomBytes() {
    const randomBytes = crypto.randomBytes(32)
    setEntropy(randomBytes)
  }

  async function handleAccept() {
    document.getElementById("accept-button").classList.toggle("button-purple")
    document.getElementById("accept-button").disabled = true
    setAccepted(!accepted)
  }

  function handleNext() {
    setOnCreateEntropyPage(false)
    setOnDisplayMultipleRaw(true)
  }

  return (
    <>
      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div className="title-font title-font--large">
            <div className="title__subtitle">Create your private & public key pair.</div>
            <div style={{ display: "inline-block" }} className="purple-font">
              🧙Key
            </div>{" "}
            Creation
          </div>
          <MdMenu onClick={() => appDispatch({ type: "toggleMenu" })} className="icon" />
        </div>
        <div className="interface__block-cell">
          <div className="interface__block-cell__description-block">
            <div className="interface__block-cell--thin">Step 1: Random 32 Bytes</div>
            <div className="interface__block-cell--thick">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil nisi et hic impedit perspiciatis minima voluptas vel quam pariatur distinctio officia id, itaque ratione nemo eveniet recusandae a excepturi natus?</div>
          </div>
        </div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell">
          {accepted ? (
            ""
          ) : (
            <button onClick={handleRandomBytes} className="button-purple">
              Generate Random
            </button>
          )}
        </div>
        <div className="interface__block-cell interface__block-cell--thick interface__block-cell--display-block interface__block-cell--thick--font-large input-white">{entropy.toString("hex")}</div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell">
          {entropy ? (
            <button id="accept-button" onClick={handleAccept} className="button-purple">
              Accept
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="interface__block-cell">
          {accepted ? (
            <button onClick={handleNext} className="button-purple button-purple--pulsing">
              Next: Private Key 🗝️
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="interface__block-cell interface__block-cell__footer">
          <TbRefresh
            onClick={() => {
              setOnCreateEntropyPage(false)
              setEntropy("")
            }}
            className="icon"
          />
          <div className="icon">ARTSNL</div>
          <MdLibraryBooks className="icon" />
        </div>
      </div>
    </>
  )
}

export default CreateEntropyPage
