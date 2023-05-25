import React, { useEffect } from "react"
import { MdArrowBack } from "react-icons/md"

function ExportPage({ isExportOpen, setIsExportOpen }) {
  return (
    <>
      <div className="menu__cover">
        <div className="menu__label">
          <MdArrowBack onClick={() => setIsExportOpen(!isExportOpen)} className="icon" />
          EXPORT
        </div>
        <div className="menu__dashboard">
          <div className="menu__dashboard-row--thick"></div>
          <div className="menu__dashboard-row">
            <div className="menu__dashboard-row-box">COPY</div>
            <div className="menu__dashboard-row-box">RESET</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExportPage
