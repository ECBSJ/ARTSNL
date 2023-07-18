import React, { useEffect } from "react"
import { MdCopyAll, MdKeyboardDoubleArrowUp, MdSkipNext } from "react-icons/md"
import { IconContext } from "react-icons"
import { CopyToClipboard } from "react-copy-to-clipboard"
import AddressCheckModal from "./AddressCheckModal"
import ModalOverlaySendAmountCheck from "./ModalOverlaySendAmountCheck"

function ModalDropDown({ setIsModalDropDownOpen, isModalDropDownOpen, emoji, title, subtitle, subtitle_2, hasData, data, showFullData, ending_content, ending_content_2, hideDoubleArrow, checkAddress, handleDeconstructRcvrAddress, checkSendAmount, sendAmountCheckObject, navigateToScriptPubKey, displayNextArrow, functionToRunOnNext }) {
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
        {checkAddress ? (
          <>
            <div className="modal__drop-down__overlay">
              <AddressCheckModal setIsModalDropDownOpen={setIsModalDropDownOpen} isModalDropDownOpen={isModalDropDownOpen} data={data} handleDeconstructRcvrAddress={handleDeconstructRcvrAddress} />
            </div>
          </>
        ) : (
          ""
        )}

        {checkSendAmount ? (
          <>
            <div className="modal__drop-down__overlay">
              <ModalOverlaySendAmountCheck setIsModalDropDownOpen={setIsModalDropDownOpen} isModalDropDownOpen={isModalDropDownOpen} sendAmountCheckObject={sendAmountCheckObject} navigateToScriptPubKey={navigateToScriptPubKey} />
            </div>
          </>
        ) : (
          ""
        )}

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
        {displayNextArrow ? <MdSkipNext onClick={() => functionToRunOnNext()} className={"icon icon--floating"} /> : ""}
        <MdKeyboardDoubleArrowUp onClick={() => setIsModalDropDownOpen(!isModalDropDownOpen)} className={"icon icon--floating " + (hideDoubleArrow ? "display-none" : "")} />
      </div>
    </>
  )
}

export default ModalDropDown
