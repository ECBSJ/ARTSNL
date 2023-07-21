import React, { useState, useContext } from "react"
import { MdArrowBack, MdQrCodeScanner } from "react-icons/md"
import QRreaderPopup from "./QRreaderPopup"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

function ImportPage({ isImportOpen, setIsImportOpen }) {
  const navigate = useNavigate()

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [importKeyFormat, setImportKeyFormat] = useState(1)

  const [inputImportKey, setInputImportKey] = useState()

  const [openQRreader, setOpenQRreader] = useState(false)
  const [scannedValue, setScannedValue] = useState()

  function toggleFormat() {
    if (importKeyFormat == 3) {
      setImportKeyFormat(1)
    } else {
      setImportKeyFormat(prev => prev + 1)
    }

    document.getElementById("toggle-format").classList.toggle("menu__dashboard-row-box--dark")
    document.getElementById("toggle-format").classList.toggle("menu__dashboard-row-box--light")
  }

  function handleImport() {
    if (importKeyFormat == 3) {
      null
    }

    if (importKeyFormat == 2) {
      null
    }

    if (importKeyFormat == 1) {
      // Verify hex string is 32 bytes Buffer
      let inputtedKey = Buffer.from(inputImportKey, "hex")
      if (inputtedKey.byteLength == 32) {
        // Import Key
        appDispatch({ type: "resetWallet" })
        // Call appDispatch to import key to generate keypair & addresses
        appDispatch({ type: "importExternalKey", value: inputtedKey })
        // Store in local browser storage
        appDispatch({ type: "setLocalStorage" })
        appDispatch({ type: "setHasBrowserStorage" })
        console.log("ARTSNL wallet has been reset. Imported external private key successful.")
        setIsImportOpen(!isImportOpen)
        appDispatch({ type: "toggleMenu" })
        navigate("/")
      } else {
        // throw error
        null
      }
    }
  }

  return (
    <>
      {openQRreader ? <QRreaderPopup setInputValue={setInputImportKey} setScannedValue={setScannedValue} openQRreader={openQRreader} setOpenQRreader={setOpenQRreader} /> : ""}

      <div className="menu__cover menu__cover--no-opacity">
        <div className="menu__label">
          <MdArrowBack onClick={() => setIsImportOpen(!isImportOpen)} className="icon" />
          IMPORT
          <div className="menu__label__sub-label">Import a single private key in either hex, WIF, or BIP38 format. Imported key will replace any existing key in this wallet.</div>
        </div>
        <div className="menu__dashboard">
          <div className="menu__dashboard-row">
            <div id="toggle-format" onClick={toggleFormat} data-label="FORMAT" className="menu__dashboard-row-box vision-mode__cover menu__dashboard-row-box--dark">
              {importKeyFormat == 3 ? "BIP38" : importKeyFormat == 2 ? "WIF" : "HEX"}
            </div>

            <a className="menu__dashboard-row-box" href={importKeyFormat == 3 ? "https://medium.com/@BalletCrypto/bip38-7763e2158dea" : importKeyFormat == 2 ? "https://learnmeabitcoin.com/technical/wif" : "https://learnmeabitcoin.com/technical/private-key"} target="_blank">
              EXAMPLE
            </a>
          </div>
          <div className={"menu__dashboard-row " + (importKeyFormat == 3 ? "menu__dashboard-row--flex-column" : "")}>
            {importKeyFormat == 3 ? (
              <>
                <MdQrCodeScanner onClick={() => setOpenQRreader(!openQRreader)} className="icon icon--position-absolute icon--higher-z-index" style={{ right: "10px", top: "6px" }} />
                <input className="input--position-off code-font gray-font" value={scannedValue ? scannedValue : undefined} type="text" placeholder="encrypted key" required />
                <input className="input--position-off code-font gray-font" type="text" placeholder="passphrase" required />
              </>
            ) : (
              <>
                <input onChange={e => setInputImportKey(e.target.value)} className="input--position-off code-font gray-font" value={scannedValue ? scannedValue : undefined} type="text" placeholder={importKeyFormat == 2 ? "WIF" : "HEX"} required />
                <MdQrCodeScanner onClick={() => setOpenQRreader(!openQRreader)} className="icon icon--position-absolute" style={{ right: "10px" }} />
              </>
            )}
          </div>
          <div className="menu__dashboard-row">
            <div onClick={() => handleImport()} className="menu__dashboard-row-box">
              IMPORT
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ImportPage
