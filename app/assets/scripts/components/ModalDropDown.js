import React, { useEffect } from "react"
import { MdCopyAll } from "react-icons/md"
import { IconContext } from "react-icons"
import { CopyToClipboard } from "react-copy-to-clipboard"

function ModalDropDown({ static_address }) {
  function handleCopyPopup_3() {
    document.querySelector(".icon-copy-3").classList.toggle("icon")
    document.querySelector(".icon-copy-3").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-3").classList.toggle("icon")
      document.querySelector(".icon-copy-3").classList.toggle("icon-copy--active")
    }, 1000)
  }

  return (
    <>
      <div className="modal modal__drop-down">
        <div style={{ fontSize: "3rem" }}>💯</div>
        <br />
        Congratulations!
        <br />
        <br />
        You just created your
        <br />
        own BTC address.
        <br />
        <br />
        <div id="Tooltip" data-tooltip-content={static_address}>
          <IconContext.Provider value={{ size: "1.3rem" }}>
            <CopyToClipboard text={static_address} onCopy={() => handleCopyPopup_3()}>
              <MdCopyAll className="icon icon-copy icon-copy-3" />
            </CopyToClipboard>
          </IconContext.Provider>
          {"{ " + static_address.slice(0, 7) + "..." + static_address.slice(-7) + " }"}
        </div>
        <br />
        Click on "To Wallet Home"
        <br />
        below to proceed.
      </div>
    </>
  )
}

export default ModalDropDown
