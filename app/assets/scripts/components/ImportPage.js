import React, { useState } from "react"
import { MdArrowBack } from "react-icons/md"

function ImportPage({ isImportOpen, setIsImportOpen }) {
  const [importKeyFormat, setImportKeyFormat] = useState(1)

  function toggleFormat() {
    if (importKeyFormat == 3) {
      setImportKeyFormat(1)
    } else {
      setImportKeyFormat(prev => prev + 1)
    }

    document.getElementById("toggle-format").classList.toggle("menu__dashboard-row-box--dark")
    document.getElementById("toggle-format").classList.toggle("menu__dashboard-row-box--light")
  }

  return (
    <>
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

            <div className="menu__dashboard-row-box">INFO</div>
          </div>
          <div className="menu__dashboard-row">
            <input className="input--position-off code-font gray-font" type="text" />
          </div>
          <div className="menu__dashboard-row">
            <div className="menu__dashboard-row-box">IMPORT</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ImportPage
