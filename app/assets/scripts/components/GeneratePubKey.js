import React, { useState, useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"

function GeneratePubKey({ setBits, setEntropy, setOnDisplayMultipleRaw, setDisplayPubKey, showCompressed, compressedPubKey, pubKeyX, pubKeyY, handleShowCompressedPubKey, handleDisplayAccept }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [completedSequentialProgress, setCompletedSequentialProgress] = useState(false)

  function handleSequentialProgress() {
    document.querySelector("#capsule-grab").classList.toggle("capsule__progress-0")
    document.querySelector("#capsule-grab").innerText = "Preparing Private Key..."

    setTimeout(() => document.querySelector(".capsule__progress-1").classList.toggle("capsule--visible"), 2000)
    setTimeout(() => document.querySelector(".capsule__progress-2").classList.toggle("capsule--visible"), 3500)
    setTimeout(() => document.querySelector(".capsule__progress-3").classList.toggle("capsule--visible"), 4500)
    setTimeout(() => document.querySelector(".capsule__progress-4").classList.toggle("capsule--visible"), 5500)
    setTimeout(() => setCompletedSequentialProgress(true), 6500)
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
            <div className="interface__block-cell--thin">Step 2: Derive Public Key</div>
            <div className="interface__block-cell--thick">Through the cryptographic magic of elliptic curve, secp256k1, you can derive a public key from the private key. The public key is used to derive a public address, as well as in verification of transactions via the digital signature algorithm of ECDSA.</div>
          </div>
        </div>
      </div>

      {completedSequentialProgress ? (
        <>
          <div className="interface__block">
            <div className="interface__block-cell">Public Key Generated!</div>
            <div className="interface__block-cell interface__block-cell--display-block interface__block-cell--thick interface__block-cell--thick--font-large input-white">
              {showCompressed ? (
                compressedPubKey
              ) : (
                <>
                  <span style={{ color: "red" }}>&#40;</span>
                  {pubKeyX}
                  <span style={{ color: "red" }}>&#44;</span> {pubKeyY}
                  <span style={{ color: "red" }}>&#41;</span>
                </>
              )}
            </div>
          </div>
          <div className="interface__block">
            <div className="interface__block-cell">
              <button className="capsule" onClick={handleShowCompressedPubKey}>
                {showCompressed ? "Show Uncompressed" : "Show Compressed"}
              </button>
            </div>
            <div className="interface__block-cell">
              <button className="button-purple" onClick={handleDisplayAccept}>
                Next: Key Pair 🛠️
              </button>
            </div>
            <div className="interface__block-cell interface__block-cell__footer">
              <TbRefresh
                onClick={() => {
                  setOnDisplayMultipleRaw(false)
                  setBits("")
                  setEntropy("")
                }}
                className="icon"
              />
              <div className="icon">ARTSNL</div>
              <MdLibraryBooks className="icon" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="interface__block">
            <div className="interface__block-cell">
              <button id="capsule-grab" className="capsule" onClick={handleSequentialProgress}>
                Generate Public Key
              </button>
            </div>
            <div className="interface__block-cell">
              <button className="capsule capsule__progress-1">Instantiating secp256k1...</button>
            </div>
            <div className="interface__block-cell">
              <button className="capsule capsule__progress-2">Performing EC add & mult...</button>
            </div>
          </div>
          <div className="interface__block">
            <div className="interface__block-cell">
              <button className="capsule capsule__progress-3">Preparing point on curve...</button>
            </div>
            <div className="interface__block-cell">
              <button className="capsule capsule__progress-4">Formatting x and y values...</button>
            </div>
            <div className="interface__block-cell interface__block-cell__footer">
              <TbRefresh
                onClick={() => {
                  setOnDisplayMultipleRaw(false)
                  setBits("")
                  setEntropy("")
                }}
                className="icon"
              />
              <div className="icon">ARTSNL</div>
              <MdLibraryBooks className="icon" />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default GeneratePubKey
