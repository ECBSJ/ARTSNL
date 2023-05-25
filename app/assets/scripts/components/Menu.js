import React, { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import ExportPage from "./ExportPage"
import ImportPage from "./ImportPage"

function Menu() {
  const [modeBoolean, setModeBoolean] = useState(true)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  function toggleLightDarkMode() {
    setModeBoolean(!modeBoolean)
    document.getElementById("lightDarkMode").classList.toggle("menu__dashboard-row-box--dark")
    document.getElementById("lightDarkMode").classList.toggle("menu__dashboard-row-box--light")
  }

  return (
    <>
      <div className="menu__cover">
        <MdClose className="icon icon__menu-close" />
        <div className="menu__label">ARTSNL MENU</div>
        <div className="menu__dashboard">
          <div className="menu__dashboard-row">
            <div className="menu__dashboard-row-box">ABOUT</div>
            <div id="lightDarkMode" onClick={toggleLightDarkMode} className="menu__dashboard-row-box vision-mode__cover menu__dashboard-row-box--dark">
              {modeBoolean ? "DARK" : "LIGHT"}
            </div>
          </div>
          <div className="menu__dashboard-row">
            <div className="menu__dashboard-row-box">CURRENCY</div>
            <div onClick={() => setIsExportOpen(!isExportOpen)} className="menu__dashboard-row-box">
              EXPORT
            </div>
          </div>
          <div className="menu__dashboard-row">
            <div onClick={() => setIsImportOpen(!isImportOpen)} className="menu__dashboard-row-box">
              IMPORT
            </div>
            <div className="menu__dashboard-row-box">SOURCE</div>
          </div>
        </div>
      </div>

      {isExportOpen ? <ExportPage isExportOpen={isExportOpen} setIsExportOpen={setIsExportOpen} /> : ""}
      {isImportOpen ? <ImportPage isImportOpen={isImportOpen} setIsImportOpen={setIsImportOpen} /> : ""}
    </>
  )
}

export default Menu
