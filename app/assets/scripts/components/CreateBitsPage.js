import React, { useEffect, useContext, useState } from "react"
import { MdMenu, MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function CreateBitsPage({ bits, setBits, setOnCreateBitsPage, setOnDisplayMultipleRaw }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [hasErrors, setHasErrors] = useState()
  const [errorMessage, setErrorMessage] = useState("")

  let regEx_binary = /^[0-1]+$/

  function validateBits(inputtedBits) {
    if (!inputtedBits.trim()) {
      setHasErrors(false)
      setBits("")
    } else {
      if (!regEx_binary.test(inputtedBits)) {
        setHasErrors(true)
        setErrorMessage("Only binary numbers are allowed.")
      } else {
        setHasErrors(false)
        setBits(inputtedBits)
      }
    }
  }

  function validateBitsDelay() {
    if (bits.length == 256) {
      setHasErrors(false)
    } else {
      setHasErrors(true)
      setErrorMessage("Entropy of bits needs to be exactly 256 in length.")
    }
  }

  useEffect(() => {
    if (bits.length > 0 && !hasErrors) {
      const delay = setTimeout(() => validateBitsDelay(), 1000)
      return () => clearTimeout(delay)
    }
  }, [bits])

  function handleAccept() {
    if (bits.length == 256 && regEx_binary.test(bits)) {
      setHasErrors(false)
    }

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
          <MdMenu onClick={() => appDispatch({ type: "toggleMenu" })} className="icon" />
        </div>
        <div className="interface__block-cell">
          <div className="interface__block-cell__description-block">
            <div className="interface__block-cell--thin">Step 1: DIY 256 bits</div>
            <div className="interface__block-cell--thick">Every private key is 32 bytes in size. It might not seem large on face value but the number of possible 32 byte-sized keys is astronomically large, which makes your key secure. 1 byte is 8 bits. 32 bytes is 256 bits &#40;binary numbers&#41;.</div>
          </div>
        </div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell">
          <input className="input-purple" onChange={e => validateBits(e.target.value)} type="text" required />
          <span className="input-placeholder">Input 256 bits</span>
          <div className="input-validation">bit count: {bits.length}</div>
          {hasErrors ? <div className="input-validation input-validation--error">{errorMessage}</div> : ""}
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
