import React, { useEffect } from "react"
import { IconContext } from "react-icons"
import { MdQrCodeScanner, MdContentPasteGo, MdPhonelinkRing } from "react-icons/md"

function WC_Scanner() {
  function onSubmit(e) {
    e.preventDefault()
    console.log("submitted!")
  }

  return (
    <>
      <div style={{ justifyContent: "flex-end" }} className="tx-builder__overlay">
        <div className="wc-dashboard display-flex display-flex--column">
          <IconContext.Provider value={{ size: "120px" }}>
            <MdQrCodeScanner className="icon" />
          </IconContext.Provider>
          <span className="font--russo-one">Scan QR Code</span>
        </div>

        <div style={{ position: "relative" }} className="wc-inputs">
          <IconContext.Provider value={{ size: "40px" }}>
            <MdContentPasteGo style={{ zIndex: "1", top: "6", right: "50", transform: "scaleX(-1)" }} className="icon position-absolute" />
          </IconContext.Provider>

          <IconContext.Provider value={{ size: "40px" }}>
            <MdPhonelinkRing style={{ zIndex: "1", top: "6", right: "7" }} className="icon position-absolute" />
          </IconContext.Provider>
          <form onSubmit={(e) => onSubmit(e)}>
            <input style={{ borderRadius: "10px", height: "100%" }} placeholder="Input URI" type="text" />
          </form>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }} className="wc-logo">
          <img style={{ width: "70px" }} src="https://walletconnect.com/_next/static/media/brand_logo_blue.60e0f59b.svg" alt="wc-logo" />
        </div>
      </div>
    </>
  )
}

export default WC_Scanner
