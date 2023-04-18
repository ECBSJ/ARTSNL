import React, { useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"
import { MdMenu, MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"

function CreateBitsPage({ bits, setBits, setOnCreateBitsPage, setOnDisplayMultipleRaw }) {
  const [hasErrors, setHasErrors] = useState()

  function checkErrors() {
    if (bits.length == 256) {
      setHasErrors(false)
    }
  }

  function handleAccept() {
    checkErrors()

    if (!hasErrors) {
      setOnCreateBitsPage(false)
      setOnDisplayMultipleRaw(true)
    }
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
            <div className="interface__block-cell--thin">Step 1: Title</div>
            <div className="interface__block-cell--thick">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil nisi et hic impedit perspiciatis minima voluptas vel quam pariatur distinctio officia id, itaque ratione nemo eveniet recusandae a excepturi natus?</div>
          </div>
        </div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell">
          <input className="input-purple" onChange={(e) => setBits(e.target.value)} type="text" required />
          <span>Input 256 bits</span>
          <div className="input-validation">bit count: {bits.length}</div>
        </div>
        <div className="interface__block-cell interface__block-cell--thick"></div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell">
          <button className="button-purple" onClick={handleAccept}>
            Next: Private Key 🗝️
          </button>
        </div>
        <div className="interface__block-cell interface__block-cell__footer">
          <TbRefresh
            className="icon"
            onClick={() => {
              setBits("")
              setOnCreateBitsPage(false)
            }}
          />
          <div className="icon">ARTSNL</div>
          <MdLibraryBooks className="icon" />
        </div>
      </div>
    </>
  )
}

export default CreateBitsPage
