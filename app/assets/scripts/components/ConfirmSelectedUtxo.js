import React, { useEffect } from "react"
import { MdArrowBack } from "react-icons/md"
import UtxoCapsule from "./UtxoCapsule"

function ConfirmSelectedUtxo({ utxoData_Array, pushIndexToSelectedArray, selectedArray, totalUtxoValueSelected, setDisplayCarousel }) {
  return (
    <>
      <div className="tx-builder__blueprint-carousel-confirm">
        <p style={{ position: "absolute", top: "-49px", left: "28px", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
          <MdArrowBack onClick={() => setDisplayCarousel(true)} className="icon" />
          Back to UTXO Carousel
        </p>
        <p style={{ position: "absolute", top: "3px", left: "114px", fontSize: ".6rem", color: "gray" }}>UTXOs pending signature: {selectedArray.length}</p>

        <div className="tx-builder__blueprint-carousel-confirm__container">
          {selectedArray.map((selectedUtxoIndex, index) => {
            return <UtxoCapsule key={index} selectedUtxoIndex={selectedUtxoIndex} utxoData_Array={utxoData_Array} />
          })}
        </div>
      </div>
    </>
  )
}

export default ConfirmSelectedUtxo
