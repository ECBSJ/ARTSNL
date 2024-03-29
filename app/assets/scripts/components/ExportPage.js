import React, { useEffect, useContext, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import * as uint8arraytools from "uint8array-tools"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { useNavigate } from "react-router-dom"

function ExportPage({ isExportOpen, setIsExportOpen }) {
  const navigate = useNavigate()

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [keyPairObject, setKeyPairObject] = useState({
    priv: "n/a",
    pub: "n/a"
  })

  function handleCopyEvent() {
    document.getElementById("copy-element").innerText = "COPIED!"

    setTimeout(() => {
      document.getElementById("copy-element").innerText = "COPY"
    }, 1500)
  }

  useEffect(() => {
    if (appState.keys.bufferPrivKey) {
      let retrievedKeyPairObject = {
        priv: uint8arraytools.toHex(appState.keys.bufferPrivKey),
        pub: uint8arraytools.toHex(appState.keys.bufferPubKey)
      }

      setKeyPairObject(keyPairObject => ({
        ...retrievedKeyPairObject
      }))
    }
  }, [])

  return (
    <>
      <div className="menu__cover menu__cover--no-opacity">
        <div className="menu__label">
          <MdArrowBack onClick={() => setIsExportOpen(!isExportOpen)} className="icon" />
          <div>EXPORT</div>
          <div className="menu__label__sub-label">Your private & public key pair are displayed below. Back them up in a secure location or import them into another wallet.</div>
        </div>
        <div className="menu__dashboard">
          <div className="menu__dashboard-row--thick">
            <div>
              Private Key &#40;hex&#41;: <div className="code-font gray-font">{keyPairObject.priv}</div>
            </div>
            <br />
            <div>
              Public Key &#40;uncompressed&#41;: <div className="code-font gray-font">{keyPairObject.pub}</div>
            </div>
            <br />
          </div>
          <div className="menu__dashboard-row">
            <CopyToClipboard text={JSON.stringify(keyPairObject)} onCopy={handleCopyEvent}>
              <div id="copy-element" className="menu__dashboard-row-box">
                COPY
              </div>
            </CopyToClipboard>
            <div
              onClick={() => {
                appDispatch({ type: "resetWallet" })
                console.log("ARTSNL wallet has been reset.")
                setIsExportOpen(!isExportOpen)
                appDispatch({ type: "toggleMenu" })
                navigate("/")
              }}
              className="menu__dashboard-row-box"
            >
              RESET
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExportPage
