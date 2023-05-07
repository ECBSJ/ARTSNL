import React, { useEffect } from "react"
import { MdCopyAll, MdKeyboardDoubleArrowUp } from "react-icons/md"
import { IconContext } from "react-icons"
import { CopyToClipboard } from "react-copy-to-clipboard"

function ModalDropDown({ setIsModalDropDownOpen, isModalDropDownOpen, emoji, title, subtitle, subtitle_2, hasData, data, showFullData, ending_content, ending_content_2 }) {
  function handleCopyPopup_modal() {
    document.querySelector(".icon-copy-modal").classList.toggle("icon")
    document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-modal").classList.toggle("icon")
      document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")
    }, 1000)
  }

  return (
    <>
      <div className="modal__drop-down">
        <div style={{ fontSize: "3rem" }}>{emoji}</div>
        <br />
        <div className="modal__drop-down--title">{title}</div>
        <br />
        <br />
        {subtitle}
        <br />
        {subtitle_2}
        <br />
        {hasData ? (
          <>
            <br />
            <div>
              <IconContext.Provider value={{ size: "1.3rem" }}>
                <CopyToClipboard text={data} onCopy={() => handleCopyPopup_modal()}>
                  <MdCopyAll style={{ transform: "translateY(5px)" }} className="icon icon-copy icon-copy-modal" />
                </CopyToClipboard>
              </IconContext.Provider>
              {showFullData ? data : "{ " + data.slice(0, 7) + "..." + data.slice(-7) + " }"}
            </div>
          </>
        ) : (
          ""
        )}
        <br />
        {ending_content}
        <br />
        {ending_content_2}
        <br />
        <br />
        <MdKeyboardDoubleArrowUp onClick={() => setIsModalDropDownOpen(!isModalDropDownOpen)} className="icon icon--floating" />
      </div>
    </>
  )
}

export default ModalDropDown
