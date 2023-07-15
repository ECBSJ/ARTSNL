import React from "react"

function ModalOverlaySendAmountCheck({ setIsModalDropDownOpen, isModalDropDownOpen, sendAmountCheckObject, navigateToScriptPubKey }) {
  return (
    <>
      <div style={{ cursor: "default" }}>Double check send amount.</div>
      <div style={{ fontSize: ".6em", fontWeight: "normal", textAlign: "left", fontFamily: "monospace", cursor: "default" }} className="modal-overlay-container">
        <span style={{ color: "gray" }}>Available:</span> {sendAmountCheckObject.available}
        <br />
        <span style={{ color: "gray" }}>Send:</span> {sendAmountCheckObject.send}
        <br />
        <span style={{ color: "gray" }}>Fees:</span> {sendAmountCheckObject.fees}
        <br />
        <span style={{ color: "gray" }}>*Remaining:</span> {sendAmountCheckObject.remaining}
        <span style={{ position: "absolute", left: "0", bottom: "0", fontSize: ".5em", color: "darkgray", cursor: "default" }}>*Any remaining amount will be automatically sent back to your wallet.</span>
      </div>
      <div style={{ width: "100%", fontSize: "0.4em", color: "#888888", marginTop: "20px", cursor: "default" }}>Is the send amount correct?</div>
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
