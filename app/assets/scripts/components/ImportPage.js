import React, { useEffect } from "react"
import { MdArrowBack } from "react-icons/md"

function ImportPage({ isImportOpen, setIsImportOpen }) {
  return (
    <>
      <div className="menu__cover">
        <div className="menu__label">
          <MdArrowBack onClick={() => setIsImportOpen(!isImportOpen)} className="icon" />
          IMPORT
        </div>
        <div className="menu__dashboard">
          <div className="menu__dashboard-row">
            <div className="menu__dashboard-row-box">FORMAT</div>
            <div className="menu__dashboard-row-box">INFO</div>
          </div>
          <div className="menu__dashboard-row"></div>
          <div className="menu__dashboard-row">
            <div className="menu__dashboard-row-box">IMPORT</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ImportPage
