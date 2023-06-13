import React, { useEffect, useState, useContext } from "react"
import { MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { CopyToClipboard } from "react-copy-to-clipboard"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Display3Formats({ setBits, setEntropy, binary, decimal, hex, handlePublicKeyGen, setOnDisplayMultipleRaw }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [active, setActive] = useState(2)

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
            <div className="interface__block-cell--thin">Step x: Your Private Key</div>
            <div className="interface__block-cell--thick">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil nisi et hic impedit perspiciatis minima voluptas vel quam pariatur distinctio officia id, itaque ratione nemo eveniet recusandae a excepturi natus?</div>
          </div>
        </div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--column-gap">
          <button onClick={() => setActive(1)} className={active == 1 ? "button--active" : ""}>
            BIN
          </button>
          <button onClick={() => setActive(2)} className={active == 2 ? "button--active" : ""}>
            HEX
          </button>
          <button onClick={() => setActive(3)} className={active == 3 ? "button--active" : ""}>
            DEC
          </button>
        </div>
        <div className="interface__block-cell interface__block-cell--display-block interface__block-cell--thick interface__block-cell--thick--font-large input-white">
          <div>{active == 1 ? binary : ""}</div>
          <div>{active == 2 ? hex : ""}</div>
          <div>{active == 3 ? decimal : ""}</div>
          <br />
          <CopyToClipboard text={active == 1 ? binary : active == 2 ? hex : decimal} onCopy={handleCopyPopup}>
            <div id="copiedElement">
              <MdCopyAll className="icon icon-copy" />
            </div>
          </CopyToClipboard>
        </div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell">
          <button onClick={() => handlePublicKeyGen()} className="button-purple">
            Next: Public Key 🔑
          </button>
        </div>
        <div className="interface__block-cell interface__block-cell__footer">
          <TbRefresh
            onClick={() => {
              setBits("")
              setEntropy("")
              setOnDisplayMultipleRaw(false)
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

export default Display3Formats
