import React from "react"

function ModalOverlaySendAmountCheck({ setIsModalDropDownOpen, isModalDropDownOpen, sendAmountCheckObject, navigateToScriptPubKey }) {
  return (
    <>
      <div>Double check send amount.</div>
      <div style={{ fontSize: ".6em", fontWeight: "normal", textAlign: "left", fontFamily: "monospace" }} className="modal-overlay-container">
        <span style={{ color: "gray" }}>Available:</span> {sendAmountCheckObject.available}
        <br />
        <span style={{ color: "gray" }}>Send:</span> {sendAmountCheckObject.send}
        <br />
        <span style={{ color: "gray" }}>Fees:</span> {sendAmountCheckObject.fees}
        <br />
        <span style={{ color: "gray" }}>*Remaining:</span> {sendAmountCheckObject.remaining}
        <span style={{ position: "absolute", left: "0", bottom: "0", fontSize: ".5em", color: "darkgray" }}>*Any remaining amount will be automatically sent back to your wallet.</span>
      </div>
      <div style={{ width: "100%", fontSize: "0.4em", color: "darkGray", marginTop: "20px" }}>Is the send amount correct?</div>
      <div className="modal-overlay-buttons-container">
        <button onClick={() => navigateToScriptPubKey()} style={{ backgroundColor: "limegreen" }}>
          YES
        </button>
        <button onClick={() => setIsModalDropDownOpen(!isModalDropDownOpen)} style={{ backgroundColor: "red" }}>
          NO
        </button>
      </div>
    </>
  )
}

export default ModalOverlaySendAmountCheck
