import React, { useEffect, useState, useContext } from "react"
import { MdOutlineArrowCircleLeft, MdOutlineArrowCircleRight } from "react-icons/md"
import UtxoDisplayCard from "./UtxoDisplayCard"
import LazyLoadFallback from "../LazyLoadFallback"
import { VscBracketError } from "react-icons/vsc"

function UtxoCarousel({ utxoData_Array, pushIndexToSelectedArray, translateXMultiplier, setTranslateXMultipler, selectedArray, utxoData_hasError }) {
  let translateXConstant = -398

  let translateXAmount = translateXConstant * translateXMultiplier

  let translateXStyle = {
    translate: translateXAmount.toString() + "px"
  }

  function handleShowNext() {
    if (translateXMultiplier < utxoData_Array.length - 1) {
      setTranslateXMultipler(prev => prev + 1)
    }
  }

  function handleShowPrev() {
    if (translateXMultiplier > 0) {
      setTranslateXMultipler(prev => prev - 1)
    }
  }

  return (
    <>
      <div className="tx-builder__blueprint-carousel">
        <MdOutlineArrowCircleLeft onClick={() => handleShowPrev()} style={{ top: "10", left: "10", zIndex: "1" }} className={"icon icon--position-absolute " + (utxoData_Array.length == 1 || translateXMultiplier == 0 ? "visibility-hidden" : "")} />
        <MdOutlineArrowCircleRight onClick={() => handleShowNext()} style={{ top: "10", right: "10", zIndex: "1" }} className={"icon icon--position-absolute " + (utxoData_hasError || utxoData_Array.length == 1 || translateXMultiplier == utxoData_Array.length - 1 ? "visibility-hidden" : "")} />
        <div style={translateXStyle} className="tx-builder__blueprint-carousel-container">
          {utxoData_hasError ? (
            <>
              <VscBracketError className="icon--error" />
              <div>Error retrieving UTXO data. Please refresh.</div>
            </>
          ) : (
            <>
              {utxoData_Array.length === 0 ? (
                <>
                  <LazyLoadFallback />
                </>
              ) : (
                <>
                  {utxoData_Array.map((utxo, index) => {
                    return <UtxoDisplayCard key={index} index={index} txid={utxo.txid} vout={utxo.vout} confirmed={utxo.status.confirmed} block_height={utxo.status.block_height} block_hash={utxo.status.block_hash} block_time={utxo.status.block_time} value={utxo.value} pushIndexToSelectedArray={pushIndexToSelectedArray} selectedArray={selectedArray} />
                  })}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default UtxoCarousel
