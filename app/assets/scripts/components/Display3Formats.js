import React, { useEffect, useState } from "react"
import { MdMenu, MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"

function Display3Formats({ binary, decimal, hex, handlePublicKeyGen }) {
  const [active, setActive] = useState(2)

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
        <div className="interface__block-cell interface__block-cell--thick input-white">
          <div>{active == 1 ? binary : ""}</div>
          <div>{active == 2 ? hex : ""}</div>
          <div>{active == 3 ? decimal : ""}</div>
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
          <TbRefresh className="icon" />
          <div className="icon">ARTSNL</div>
          <MdLibraryBooks className="icon" />
        </div>
      </div>
    </>
  )
}

export default Display3Formats
