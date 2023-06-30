import React, { useEffect, useContext, useState } from "react"
import { IconContext } from "react-icons"
import { MdOutlineArrowCircleLeft, MdOutlineArrowCircleRight, MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { BsHddNetworkFill, BsHddNetwork, BsReception1, BsReception4 } from "react-icons/bs"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import UtxoDisplayCard from "./UtxoDisplayCard"

function BitcoinTxBuilder() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const testnetPrivKey = "938zbGqYYvZvFaHNXMNDpQZ4hEQE89ugGEjrv9QCKWCL6H2c4ps"
  const testnetAdd = "mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW"

  const testnetPrivKey_2 = "93MPV1RsWMvfLCpGZcnPG1U8EA3QDqdNxkCVJwmeTGrjEHFZ5v6"
  const testnetAdd_2 = "mx4k2ersuW9k3uc4ybNEEB1TsQ1qJkMZ4w"

  let utxoData_Array = [
    { txid: "9153e5420b1092ff65d90a028df8840e0e3dfc8b9c8e1c1c0664e02f000c5def", vout: 0, status: { confirmed: true, block_height: 2434520, block_hash: "000000000000000f4632a88a45d61cd4e777040fc0203108661e7ebedcddc4bb", block_time: 1684648693 }, value: 13700 },
    { txid: "a296be122cc5c90bfc7e50f65b2c2e12d231a761d69ff05ec8a05b48f6f16b9a", vout: 0, status: { confirmed: true, block_height: 2434362, block_hash: "000000000000000588988168cfb4f924fcd912f6a7c9d909fbd978067be31f01", block_time: 1684590437 }, value: 5800 }
  ]

  async function getUtxoData() {
    // let result = appState.bitcoin.testnetProvider?.bitcoin.addresses.getAddressTxsUtxo({ address }).then(console.log)
    console.log(utxoData_Array)
  }

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }

  function handleShowNext() {
    null
  }

  useEffect(() => {
    getUtxoData()
  }, [])

  return (
    <>
      <div className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="tx-builder__overlay__outer">Step 1: Select UTXOs</div>
          <div className="tx-builder__blueprint">
            <div className="tx-builder__blueprint-carousel">
              <MdOutlineArrowCircleRight onClick={() => handleShowNext()} style={{ top: "10", right: "10" }} className={"icon icon--position-absolute " + (utxoData_Array.length == 1 ? "visibility-hidden" : "")} />
              <div className="tx-builder__blueprint-carousel-container">
                {utxoData_Array.map((utxo, index) => {
                  return <UtxoDisplayCard key={index} txid={utxo.txid} vout={utxo.vout} confirmed={utxo.status.confirmed} block_height={utxo.status.block_height} block_hash={utxo.status.block_hash} block_time={utxo.status.block_time} value={utxo.value} />
                })}
              </div>
              {/* <UtxoDisplayCard txid={utxoData_Array[0].txid} vout={utxoData_Array[0].vout} confirmed={utxoData_Array[0].status.confirmed} block_height={utxoData_Array[0].status.block_height} block_hash={utxoData_Array[0].status.block_hash} block_time={utxoData_Array[0].status.block_time} value={utxoData_Array[0].value} /> */}
            </div>
          </div>
          <div className="tx-builder__overlay__outer">
            <button className="button-purple"></button>
          </div>
        </IconContext.Provider>
      </div>

      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div className="title-font title-font--large">
            <div className="title__subtitle">Build your own transaction.</div>
            <div style={{ display: "inline-block" }} className="purple-font">
              🏗️ TX
            </div>{" "}
            Builder
          </div>
          <MdMenu className="icon" />
        </div>
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell interface__block-cell__footer">
          <TbRefresh className="icon" />
          <BsHddNetwork className="icon" />
          <div className="icon">ARTSNL</div>
          <BsReception4 className="icon" />
          <MdLibraryBooks className="icon" />
        </div>
      </div>
    </>
  )
}

export default BitcoinTxBuilder
