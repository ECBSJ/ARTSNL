import React, { useState } from "react"
import { MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { CopyToClipboard } from "react-copy-to-clipboard"

function AcceptKeyPair({ uncompressedBufferPub, privKeyBuf, uint8arraytools, handleAccept, navigate }) {
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const keyPair = {
    privateKey_hex: uint8arraytools.toHex(privKeyBuf),
    publicKey_hex_Uncompressed: uint8arraytools.toHex(uncompressedBufferPub)
  }

  function handleCopyPopup() {
    document.querySelector(".icon-copy").classList.toggle("icon")
    document.querySelector(".icon-copy").classList.toggle("icon-copy--active")
    document.querySelector("#copiedElement").classList.toggle("copied-popup")

    setTimeout(() => {
      document.querySelector(".icon-copy").classList.toggle("icon")
      document.querySelector(".icon-copy").classList.toggle("icon-copy--active")
      document.querySelector("#copiedElement").classList.toggle("copied-popup")
    }, 1000)
  }

  function handleAcceptProgress() {
    document.querySelector(".capsule").innerText = "Preparing Key Pair..."
    document.querySelector(".capsule").classList.add("capsule__progress-1")
    document.querySelector(".capsule").classList.add("capsule--visible")

    setTimeout(() => {
      document.querySelector(".capsule").innerText = "Binding Public & Private Key..."

      document.querySelector(".capsule").classList.remove("capsule__progress-1")
      document.querySelector(".capsule").classList.add("capsule__progress-2")
    }, 1000)

    setTimeout(() => {
      document.querySelector(".capsule").innerText = "Formatting to JSON string..."

      document.querySelector(".capsule").classList.remove("capsule__progress-2")
      document.querySelector(".capsule").classList.add("capsule__progress-3")
    }, 2000)

    setTimeout(() => {
      handleAccept()
      document.querySelector(".capsule").innerText = "Key Pair Locked & Confirmed!"

      document.querySelector(".capsule").classList.remove("capsule__progress-3")
      document.querySelector(".capsule").classList.add("capsule__progress-4")
      document.querySelector(".capsule").disabled = true

      setButtonDisabled(false)
    }, 3000)
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
            <div className="interface__block-cell--thin">Step x: Confirm Key Pair</div>
            <div className="interface__block-cell--thick">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil nisi et hic impedit perspiciatis minima voluptas vel quam pariatur distinctio officia id, itaque ratione nemo eveniet recusandae a excepturi natus?</div>
          </div>
        </div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell">FOR YOUR EYES ONLY 👀</div>
        <div className="interface__block-cell interface__block-cell--display-block interface__block-cell--thick interface__block-cell--thick--font-large input-white">
          <div>Private Key: {uint8arraytools.toHex(privKeyBuf)}</div>
          <br />
          <div>Public Key: {uint8arraytools.toHex(uncompressedBufferPub)}</div>
          <br />
          <CopyToClipboard text={JSON.stringify(keyPair)} onCopy={handleCopyPopup}>
            <div id="copiedElement">
              <MdCopyAll className="icon icon-copy" />
            </div>
          </CopyToClipboard>
        </div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell">
          <button disabled={false} className="capsule" onClick={handleAcceptProgress}>
            Accept Key Pair
          </button>
        </div>
        <div className="interface__block-cell">
          <button disabled={buttonDisabled ? true : false} className={"button-purple " + (buttonDisabled ? "button--disabled" : "")} onClick={() => navigate("/AddressSelection")}>
            Next: Address 📫
          </button>
        </div>
        <div className="interface__block-cell interface__block-cell__footer">
          <TbRefresh className="icon" />
          <div className="icon">ARTSNL</div>
          <MdLibraryBooks className="icon" />
        </div>
      </div>
    </>
  )
}

export default AcceptKeyPair
