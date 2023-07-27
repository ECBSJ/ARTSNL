import React, { useEffect, useContext, useState } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { IconContext } from "react-icons"
import { VscChecklist } from "react-icons/vsc"
import { MdCopyAll } from "react-icons/md"
import { CopyToClipboard } from "react-copy-to-clipboard"

function BtcTxReview({ setTxStatus }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [active, setActive] = useState(1)

  function handleCopyPopup_modal() {
    document.querySelector(".icon-copy-modal").classList.toggle("icon")
    document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-modal").classList.toggle("icon")
      document.querySelector(".icon-copy-modal").classList.toggle("icon-copy--active")
    }, 1000)
  }

  let outputs_Array = [
    {
      validInputtedAddress: "meajofieji83jjeojiaoeijfoejajjf",
      validInputtedAddress_Decoded: {},
      sendAmount: 2837274,
      scriptPubKey: "",
    },
    {
      validInputtedAddress: "meajofieji83jjeojiaoeijfoejajjf",
      validInputtedAddress_Decoded: {},
      sendAmount: 2837274,
      scriptPubKey: "",
    },
    {
      validInputtedAddress: "meajofieji83jjeojiaoeijfoejajjf",
      validInputtedAddress_Decoded: {},
      sendAmount: 2837274,
      scriptPubKey: "",
    },
    {
      validInputtedAddress: "meajofieji83jjeojiaoeijfoejajjf",
      validInputtedAddress_Decoded: {},
      sendAmount: 2837274,
      scriptPubKey: "",
    },
    {
      validInputtedAddress: "meajofieji83jjeojiaoeijfoejajjf",
      validInputtedAddress_Decoded: {},
      sendAmount: 2837274,
      scriptPubKey: "",
    },
    {
      validInputtedAddress: "meajofieji83jjeojiaoeijfoejajjf",
      validInputtedAddress_Decoded: {},
      sendAmount: 2837274,
      scriptPubKey: "",
    },
  ]

  let fakeHex = "0100000000010148be2c5ccdfd90e62355e3048b8442778a027d257f1722043e492cdbd74176030000000000feffffff01ffba7200000000001976a91401a6be5e6ee6c31c6d4310de1a6cfc65419adc2588ac02473044022034614838bde62a99b51cd5025f402aa5f1e4decf7c72e903fd70360634b9f5b302200badcc3dfe61bc284350c3a50dcf000b9f1127bcd4437034401cb6c40ecf3d680121027ffc62f665766dff365d8121dc6573d74e8f5e30f0b0f96f36cd2f9c7fe769bc00000000"
  let fakeJSON = {
    version: 2,
    locktime: 0,
    ins: [
      { hash: { type: "Buffer", data: [154, 107, 241, 246, 72, 91, 160, 200, 94, 240, 159, 214, 97, 167, 49, 210, 18, 46, 44, 91, 246, 80, 126, 252, 11, 201, 197, 44, 18, 190, 150, 162] }, index: 0, script: { type: "Buffer", data: [71, 48, 68, 2, 32, 67, 53, 218, 240, 12, 58, 161, 42, 217, 138, 118, 77, 192, 64, 81, 17, 11, 106, 161, 121, 192, 175, 80, 141, 75, 243, 3, 182, 175, 29, 32, 228, 2, 32, 95, 167, 121, 139, 118, 109, 171, 196, 240, 0, 138, 113, 214, 134, 189, 135, 142, 16, 83, 32, 247, 241, 79, 50, 11, 32, 70, 58, 29, 55, 200, 131, 1, 65, 4, 246, 32, 157, 170, 149, 67, 50, 126, 181, 183, 178, 172, 11, 99, 8, 154, 246, 154, 186, 213, 177, 79, 75, 108, 254, 197, 193, 130, 121, 132, 143, 162, 20, 147, 61, 236, 212, 156, 28, 161, 239, 224, 58, 248, 244, 75, 85, 132, 177, 175, 142, 174, 106, 49, 169, 89, 33, 187, 160, 126, 91, 247, 143, 144] }, sequence: 4294967295, witness: [] },
      { hash: { type: "Buffer", data: [239, 93, 12, 0, 47, 224, 100, 6, 28, 28, 142, 156, 139, 252, 61, 14, 14, 132, 248, 141, 2, 10, 217, 101, 255, 146, 16, 11, 66, 229, 83, 145] }, index: 0, script: { type: "Buffer", data: [72, 48, 69, 2, 33, 0, 236, 66, 209, 53, 50, 15, 7, 157, 142, 117, 63, 215, 167, 173, 86, 126, 196, 117, 219, 63, 214, 31, 134, 0, 156, 15, 43, 53, 101, 191, 230, 224, 2, 32, 8, 44, 214, 61, 203, 94, 105, 227, 40, 210, 126, 13, 41, 246, 78, 210, 75, 1, 249, 218, 50, 145, 239, 127, 83, 239, 178, 149, 168, 247, 37, 36, 1, 65, 4, 246, 32, 157, 170, 149, 67, 50, 126, 181, 183, 178, 172, 11, 99, 8, 154, 246, 154, 186, 213, 177, 79, 75, 108, 254, 197, 193, 130, 121, 132, 143, 162, 20, 147, 61, 236, 212, 156, 28, 161, 239, 224, 58, 248, 244, 75, 85, 132, 177, 175, 142, 174, 106, 49, 169, 89, 33, 187, 160, 126, 91, 247, 143, 144] }, sequence: 4294967295, witness: [] },
    ],
    outs: [{ script: { type: "Buffer", data: [118, 169, 20, 181, 133, 21, 166, 149, 39, 200, 6, 253, 64, 77, 61, 74, 164, 144, 213, 102, 146, 49, 11, 136, 172] }, value: 19000 }],
  }

  function handleBroadcast() {
    setTxStatus(7)
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "50px" }}>
          <div className="tx-builder__overlay__outer">Step 6: Review TX</div>

          <div className="tx-builder__blueprint">
            <div className="tx-builder__blueprint__review-overlay">
              <span>
                <VscChecklist />
              </span>
              <div className="tx-builder__blueprint__review-overlay__column-gap">
                <button onClick={() => setActive(1)} className={active == 1 ? "button--active" : ""}>
                  VIEW
                </button>
                <button onClick={() => setActive(2)} className={active == 2 ? "button--active" : ""}>
                  HEX
                </button>
                <button onClick={() => setActive(3)} className={active == 3 ? "button--active" : ""}>
                  JSON
                </button>
              </div>
              <div className="tx-builder__blueprint__review-overlay__content">
                {active == 1 ? (
                  <>
                    <ul style={{ cursor: "default" }} className="tx-builder__blueprint__review-overlay__content-no-ul-format">
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">UTXOs</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">2</span>
                      </li>
                      <li style={{ marginBottom: "7px" }} className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Total Value</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">2372647</span>
                      </li>
                      {outputs_Array.map((outputObject, index) => {
                        return (
                          <>
                            <li className="tx-builder__blueprint__review-overlay__content-row">
                              <span style={{ marginLeft: "30px", color: "#8afaff" }} className="tx-builder__blueprint__review-overlay__content-row-label">
                                Rcvr
                              </span>
                              <span style={{ color: "#a9a9a9" }} className="tx-builder__blueprint__review-overlay__content-row-value">
                                {outputObject.validInputtedAddress}
                              </span>
                            </li>

                            <li className="tx-builder__blueprint__review-overlay__content-row">
                              <span style={{ marginLeft: "45px", color: "#20b2aa" }} className="tx-builder__blueprint__review-overlay__content-row-label">
                                Send Amount
                              </span>
                              <span className="tx-builder__blueprint__review-overlay__content-row-value">{outputObject.sendAmount}</span>
                            </li>
                          </>
                        )
                      })}
                      <li style={{ marginTop: "7px" }} className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Fee</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">23647</span>
                      </li>
                      <li className="tx-builder__blueprint__review-overlay__content-row">
                        <span className="tx-builder__blueprint__review-overlay__content-row-label">Network</span>
                        <span className="tx-builder__blueprint__review-overlay__content-row-value">chain</span>
                      </li>
                    </ul>
                  </>
                ) : (
                  ""
                )}
                {active == 2 ? (
                  <>
                    <span style={{ marginBottom: "8px", color: "#898989" }}>
                      <IconContext.Provider value={{ size: "1.3rem" }}>
                        <CopyToClipboard text={fakeHex} onCopy={() => handleCopyPopup_modal()}>
                          <MdCopyAll style={{ transform: "translateY(5px)" }} className="icon icon-copy icon-copy-modal" />
                        </CopyToClipboard>
                      </IconContext.Provider>
                      Copy TX Hex
                    </span>
                    {fakeHex}
                  </>
                ) : (
                  ""
                )}
                {active == 3 ? (
                  <>
                    <span style={{ marginBottom: "8px", color: "#898989" }}>
                      <IconContext.Provider value={{ size: "1.3rem" }}>
                        <CopyToClipboard text={JSON.stringify(fakeJSON)} onCopy={() => handleCopyPopup_modal()}>
                          <MdCopyAll style={{ transform: "translateY(5px)" }} className="icon icon-copy icon-copy-modal" />
                        </CopyToClipboard>
                      </IconContext.Provider>
                      Copy JSON Raw TX
                    </span>
                    {JSON.stringify(fakeJSON)}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="tx-builder__overlay__outer">
            <button onClick={() => handleBroadcast()} className="button-purple button-purple--pulsing">
              Broadcast TX
            </button>
          </div>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default BtcTxReview
