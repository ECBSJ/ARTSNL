import React, { useEffect, useState, useContext } from "react"
import { MdClose } from "react-icons/md"
import ExportPage from "./ExportPage"
import ImportPage from "./ImportPage"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Menu() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

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
        <MdClose onClick={() => appDispatch({ type: "toggleMenu" })} className="icon icon__menu-close" />
        <div className="menu__label">
          <img style={{ width: "20px", marginRight: "6px" }} src="https://i.imgur.com/5fv5p7q.png" alt="artsnl-logo" />
          ARTSNL MENU
        </div>
        <div className="menu__dashboard">
          <div className="menu__dashboard-row">
            <div className="menu__dashboard-row-box">ABOUT</div>
            <div id="lightDarkMode" onClick={toggleLightDarkMode} data-label="MODE" className="menu__dashboard-row-box vision-mode__cover menu__dashboard-row-box--dark">
              {modeBoolean ? "DARK" : "LIGHT"}
            </div>
          </div>
          <div className="menu__dashboard-row">
            <div className="menu__dashboard-row-box">CURRENCY</div>
            <div
              onClick={() => {
                if (appState.keys.bufferPrivKey) {
                  setIsExportOpen(!isExportOpen)
                } else {
                  null
                }
              }}
              className="menu__dashboard-row-box"
            >
              EXPORT
            </div>
          </div>
          <div className="menu__dashboard-row">
            <div onClick={() => setIsImportOpen(!isImportOpen)} className="menu__dashboard-row-box">
              IMPORT
            </div>
            <a className="menu__dashboard-row-box" href="https://github.com/ECBSJ/ARTSNL" target="_blank">
              SOURCE
            </a>
          </div>
        </div>
      </div>

      <CSSTransition in={isExportOpen} timeout={300} classNames="menu__cover" unmountOnExit>
        <ExportPage isExportOpen={isExportOpen} setIsExportOpen={setIsExportOpen} />
      </CSSTransition>

      <CSSTransition in={isImportOpen} timeout={300} classNames="menu__cover" unmountOnExit>
        <ImportPage isImportOpen={isImportOpen} setIsImportOpen={setIsImportOpen} />
      </CSSTransition>
    </>
  )
}

export default Menu
