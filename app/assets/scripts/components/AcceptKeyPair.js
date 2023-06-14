import React, { useState, useRef, useEffect, useContext } from "react"
import { MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { CSSTransition } from "react-transition-group"
import ModalDropDown from "./ModalDropDown"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function AcceptKeyPair({ setBits, setEntropy, setOnDisplayMultipleRaw, uncompressedBufferPub, privKeyBuf, uint8arraytools, handleAccept, navigate }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [buttonDisabled, setButtonDisabled] = useState(true)

  const [isModalDropDownOpen, setIsModalDropDownOpen] = useState(false)
  const modalDropDownRef = useRef()

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
      setIsModalDropDownOpen(!isModalDropDownOpen)
      document.querySelector(".capsule").innerText = "Key Pair Locked & Confirmed!"

      document.querySelector(".capsule").classList.remove("capsule__progress-3")
      document.querySelector(".capsule").classList.add("capsule__progress-4")
      document.querySelector(".capsule").disabled = true

      setButtonDisabled(false)
    }, 3000)
  }

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

  return (
    <>
      <CSSTransition in={isModalDropDownOpen} timeout={400} classNames="modal__cover" unmountOnExit>
        <div ref={modalDropDownRef} className="modal__cover"></div>
      </CSSTransition>

      <CSSTransition in={isModalDropDownOpen} timeout={600} classNames="modal__drop-down" unmountOnExit>
        <ModalDropDown setIsModalDropDownOpen={setIsModalDropDownOpen} isModalDropDownOpen={isModalDropDownOpen} emoji={"🔐"} title={"Congratulations!"} subtitle={"You just created your own private and public key pair. Your private key is the secret key that allows you to spend your crypto (Don't share this with anyone!). Your public key allows you to derive public addresses. Save these in a safe place."} subtitle_2={""} hasData={false} data={""} showFullData={false} ending_content={"Click on 'Next: Address' below to proceed creating your public addresses."} ending_content_2={""} />
      </CSSTransition>

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
          <TbRefresh
            onClick={() => {
              setOnDisplayMultipleRaw(false)
              setBits("")
              setEntropy("")
              appDispatch({ type: "setBufferPrivKey", value: null })
              appDispatch({ type: "setBufferPubKey", value: null })
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

export default AcceptKeyPair
