import React from "react"
import { MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { useNavigate } from "react-router-dom"

function EntropySelection({ setOnCreateBitsPage, setOnCreateEntropyPage }) {
  const navigate = useNavigate()

  return (
    <>
      <div className="interface__block">
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell">
          <button className="button-purple" onClick={() => setOnCreateBitsPage(true)}>
            DIY 256 Bits
          </button>
        </div>
        <div className="interface__block-cell">OR</div>
        <div className="interface__block-cell">
          <button className="button-purple" onClick={() => setOnCreateEntropyPage(true)}>
            Random 32 Bytes
          </button>
        </div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell interface__block-cell__footer">
          <TbRefresh onClick={() => navigate("/")} className="icon" />
          <div className="icon">ARTSNL</div>
          <MdLibraryBooks className="icon" />
        </div>
      </div>
    </>
  )
}

export default EntropySelection
