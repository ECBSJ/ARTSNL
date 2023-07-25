import React, { useEffect, useState } from "react"
import { MdIndeterminateCheckBox, MdCheckBox } from "react-icons/md"

function UtxoDisplayCard({ index, txid, vout, confirmed, block_height, block_hash, block_time, value, pushIndexToSelectedArray, selectedArray, isSigning, handleSigning, isSigned_Array }) {
  // green checkmark icon will appear on bottom right of card when isSelected is true
  const [isSelected, setIsSelected] = useState(false)

  function handleSelect(e, index) {
    if (isSigning) {
      // for signing utxo
      document.getElementById("sign-button-grab" + index).innerText = "Signing..."
      handleSigning(e, index)
    } else {
      // for selecting utxo as inputs
      // called from <BitcoinTxBuilder />
      pushIndexToSelectedArray(index)
      setIsSelected(!isSelected)
    }
  }

  // to sustain isSelected boolean when user switches back from <ConfirmSelectedUtxo /> to <UtxoCarousel />
  useEffect(() => {
    if (selectedArray.includes(index)) {
      setIsSelected(!isSelected)
    }
  }, [])

  return (
    <>
      <div onClick={(e) => handleSelect(e, index)} className={"utxo__display-card " + (isSelected ? "utxo__display-card--selected" : "") + (isSigning ? "utxo__display-card--smaller" : "")}>
        {isSigned_Array.includes(index) ? (
          <>
            <div className="utxo__display-card--signed-cover">
              <span style={{ fontSize: "1.3rem" }} className="font--russo-one">
                UTXO Verified & Signed!
              </span>
              <br />
              <span>
                ScriptSig: <br /> {"ScriptSig here."}
              </span>
            </div>
          </>
        ) : (
          <>
            {isSigning ? (
              <button id={"sign-button-grab" + index} className="utxo__display-card--smaller__button">
                Sign UTXO
              </button>
            ) : (
              ""
            )}
            <span>&#123;</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>txid&#58; &#34;{txid.slice(0, 12) + "..." + txid.slice(-12)}&#34;,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>vout&#58; {vout},</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>status&#58; &#123;</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>confirmed&#58; {confirmed ? "true" : "false"},</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>block_height&#58; {block_height},</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>block_hash&#58; &#34;{block_hash.slice(0, 21) + "..." + block_hash.slice(-10)}&#34;,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>block_time&#58; {block_time}</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>&#125;,</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>value&#58; {value}</span>
            <br />
            <span>&#125;</span>
            {isSigning ? "" : <>{isSelected ? <MdCheckBox style={{ position: "absolute", bottom: "0", right: "0", color: "lightGreen" }} className="icon icon--position-absolute" /> : <MdIndeterminateCheckBox style={{ position: "absolute", bottom: "0", right: "0", color: "white" }} className="icon icon--position-absolute" />}</>}
          </>
        )}
      </div>
    </>
  )
}

export default UtxoDisplayCard
