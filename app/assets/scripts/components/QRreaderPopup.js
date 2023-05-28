import React from "react"
import { useZxing } from "react-zxing"
import { MdClose } from "react-icons/md"

function QRreaderPopup({ setInputImportKey, setScannedValue, openQRreader, setOpenQRreader }) {
  const { ref } = useZxing({
    onResult(result) {
      setInputImportKey(result.getText())
      setScannedValue(result.getText())
      setOpenQRreader(!openQRreader)
    }
  })

  return (
    <>
      <div className="menu__cover menu__cover--higher-z-index">
        <MdClose onClick={() => setOpenQRreader(!openQRreader)} className="icon icon__menu-close" />

        <div className="dots-loading">
          <div></div>
        </div>

        <video ref={ref} className="qr-code__video-reader" />
      </div>
    </>
  )
}

export default QRreaderPopup
