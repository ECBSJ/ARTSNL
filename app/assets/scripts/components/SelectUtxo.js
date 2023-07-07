import React, { useEffect, useState } from "react"
import { IconContext } from "react-icons"
import { CSSTransition } from "react-transition-group"
import UtxoCarousel from "./UtxoCarousel"
import ConfirmSelectedUtxo from "./ConfirmSelectedUtxo"

function SelectUtxo({ utxoData_Array, pushIndexToSelectedArray, selectedArray, totalUtxoValueSelected, handleRcvrAddress }) {
  const [displayCarousel, setDisplayCarousel] = useState(true)
  const [translateXMultiplier, setTranslateXMultipler] = useState(0)

  const [promise, setPromise] = useState()

  function suspensify(promise) {
    let status = "pending"
    let result

    let suspender = promise.then(
      (res) => {
        status = "success"
        result = res
      },
      (error) => {
        status = "error"
        result = error
      }
    )

    return {
      read() {
        if (status === "pending") {
          console.log("threw suspender")
          throw suspender
        } else if (status === "error") {
          console.log("threw error")
          throw result
        } else if (status === "success") {
          console.log("threw success")
          return result
        }
      },
    }
  }

  async function grabData() {
    let result = await fetch("https://mempool.space/api/block/000000000000000015dc777b3ff2611091336355d3f0ee9766a2cf3be8e4b1ce/txids")

    return result.json()
  }

  const onClick = () => {
    setPromise(suspensify(grabData()))
  }

  if (promise) {
    let readPromise = promise.read()
  }

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 1: Select UTXOs</div>
          <div className="tx-builder__blueprint">
            {!displayCarousel ? (
              ""
            ) : (
              <p style={{ position: "absolute", top: "-8px", left: "28px" }}>
                UTXO Carousel: &#91;{utxoData_Array.length === 0 ? "0" : translateXMultiplier + 1} of {utxoData_Array.length}&#93;
              </p>
            )}
            <CSSTransition in={displayCarousel} timeout={300} classNames="tx-builder__blueprint-carousel" unmountOnExit>
              <UtxoCarousel utxoData_Array={utxoData_Array} pushIndexToSelectedArray={pushIndexToSelectedArray} translateXMultiplier={translateXMultiplier} setTranslateXMultipler={setTranslateXMultipler} selectedArray={selectedArray} />
            </CSSTransition>

            <CSSTransition in={!displayCarousel} timeout={300} classNames="tx-builder__blueprint-carousel-confirm" unmountOnExit>
              <ConfirmSelectedUtxo utxoData_Array={utxoData_Array} pushIndexToSelectedArray={pushIndexToSelectedArray} selectedArray={selectedArray} totalUtxoValueSelected={totalUtxoValueSelected} setDisplayCarousel={setDisplayCarousel} />
            </CSSTransition>
            <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {selectedArray.length}</p>
            <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {totalUtxoValueSelected}</p>
          </div>
          {displayCarousel ? (
            <div className="tx-builder__overlay__outer">
              {!selectedArray.length == 0 ? (
                <button onClick={() => setDisplayCarousel(!displayCarousel)} className="button-purple">
                  Confirm Selections
                </button>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="tx-builder__overlay__outer">
              <button onClick={() => onClick()} className="button-purple">
                Rcvr Address
              </button>
            </div>
          )}
        </IconContext.Provider>
      </div>
    </>
  )
}

export default SelectUtxo
