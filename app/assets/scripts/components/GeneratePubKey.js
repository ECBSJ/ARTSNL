import React, { useState } from "react"
import { MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"

function GeneratePubKey({ showCompressed, compressedPubKey, pubKeyX, pubKeyY, handleShowCompressedPubKey, handleDisplayAccept }) {
  const [completedSequentialProgress, setCompletedSequentialProgress] = useState(false)

  function handleSequentialProgress() {
    document.querySelector(".capsule__progress-0").innerText = "Preparing Private Key..."

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
          <MdMenu className="icon" />
        </div>
        <div className="interface__block-cell">
          <div className="interface__block-cell__description-block">
            <div className="interface__block-cell--thin">Step x: Derive Public Key</div>
            <div className="interface__block-cell--thick">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil nisi et hic impedit perspiciatis minima voluptas vel quam pariatur distinctio officia id, itaque ratione nemo eveniet recusandae a excepturi natus?</div>
          </div>
        </div>
      </div>

      {completedSequentialProgress ? (
        <>
          <div className="interface__block">
            <div className="interface__block-cell">Public Key Generated!</div>
            <div className="interface__block-cell interface__block-cell--display-block interface__block-cell--thick interface__block-cell--thick--font-large input-white">{showCompressed ? compressedPubKey : "(" + pubKeyX + ", " + pubKeyY + ")"}</div>
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
              <TbRefresh className="icon" />
              <div className="icon">ARTSNL</div>
              <MdLibraryBooks className="icon" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="interface__block">
            <div className="interface__block-cell">
              <button className="capsule capsule__progress-0" onClick={handleSequentialProgress}>
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
              <TbRefresh className="icon" />
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
