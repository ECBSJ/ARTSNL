import React, { useEffect, useState } from "react"

function Menu() {
  const [modeBoolean, setModeBoolean] = useState(true)
  const [modeText, setModeText] = useState("DARK")

  function toggleLightDarkMode() {
    setModeBoolean(!modeBoolean)
    document.getElementById("lightDarkMode").classList.toggle("menu__dashboard-row-box--dark")
    document.getElementById("lightDarkMode").classList.toggle("menu__dashboard-row-box--light")
  }

  return (
    <>
      <div className="menu__cover">
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
            <div className="menu__dashboard-row-box">EXPORT</div>
          </div>
          <div className="menu__dashboard-row">
            <div className="menu__dashboard-row-box">IMPORT</div>
            <div className="menu__dashboard-row-box">SOURCE</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Menu
