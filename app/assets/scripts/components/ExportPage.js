import React, { useEffect, useContext } from "react"
import { MdArrowBack } from "react-icons/md"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import * as uint8arraytools from "uint8array-tools"
import { CopyToClipboard } from "react-copy-to-clipboard"

function ExportPage({ isExportOpen, setIsExportOpen }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let keyPairObject = {
    priv: "5e6cca2c25d67950acee3324d41ebef7d886b6762eaadb92210a3604a6188110",
    pub: "0465034a033e228fc298f4be365cdc4555b9ef4a7a53ae9f72a88383a4712095c2cad1d12366842198e6fd4a884bd5f899c3c41f0c105aed2e470b7d0993aa2a27"
  }

  function handleCopyEvent() {
    document.getElementById("copy-element").innerText = "COPIED!"

    setTimeout(() => {
      document.getElementById("copy-element").innerText = "COPY"
    }, 1500)
  }

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
              Private Key &#40;hex&#41;: <div className="code-font gray-font">5e6cca2c25d67950acee3324d41ebef7d886b6762eaadb92210a3604a6188110</div>
            </div>
            <br />
            <div>
              Public Key &#40;uncompressed&#41;: <div className="code-font gray-font">0465034a033e228fc298f4be365cdc4555b9ef4a7a53ae9f72a88383a4712095c2cad1d12366842198e6fd4a884bd5f899c3c41f0c105aed2e470b7d0993aa2a27</div>
            </div>
            <br />
          </div>
          <div className="menu__dashboard-row">
            <CopyToClipboard text={JSON.stringify(keyPairObject)} onCopy={handleCopyEvent}>
              <div id="copy-element" className="menu__dashboard-row-box">
                COPY
              </div>
            </CopyToClipboard>
            <div className="menu__dashboard-row-box">RESET</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExportPage
