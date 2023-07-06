import React, { useEffect, useContext, useState } from "react"
import * as bitcoin from "../../../../bitcoinjs-lib"
import { IconContext } from "react-icons"
import { MdOutlineArrowCircleLeft, MdOutlineArrowCircleRight, MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { BsHddNetworkFill, BsHddNetwork, BsReception1, BsReception4 } from "react-icons/bs"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { CSSTransition } from "react-transition-group"
import UtxoDisplayCard from "./UtxoDisplayCard"
import SelectUtxo from "./SelectUtxo"
import InputRcvrAddress from "./InputRcvrAddress"

function BitcoinTxBuilder() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [txStatus, setTxStatus] = useState(1)
  // txStatus codes:
  // 1. Select UTXOs
  // 2. Specify Rcvr Address

  const testnetPrivKey = "938zbGqYYvZvFaHNXMNDpQZ4hEQE89ugGEjrv9QCKWCL6H2c4ps"
  const testnetAdd = "mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW"

  const testnetPrivKey_2 = "93MPV1RsWMvfLCpGZcnPG1U8EA3QDqdNxkCVJwmeTGrjEHFZ5v6"
  const testnetAdd_2 = "mx4k2ersuW9k3uc4ybNEEB1TsQ1qJkMZ4w"

  const [utxoData_Array, setUtxoData_Array] = useState([])

  // let utxoData_Array = [
  //   { txid: "9153e5420b1092ff65d90a028df8840e0e3dfc8b9c8e1c1c0664e02f000c5def", vout: 0, status: { confirmed: true, block_height: 2434520, block_hash: "000000000000000f4632a88a45d61cd4e777040fc0203108661e7ebedcddc4bb", block_time: 1684648693 }, value: 13700 },
  //   { txid: "a296be122cc5c90bfc7e50f65b2c2e12d231a761d69ff05ec8a05b48f6f16b9a", vout: 0, status: { confirmed: true, block_height: 2434362, block_hash: "000000000000000588988168cfb4f924fcd912f6a7c9d909fbd978067be31f01", block_time: 1684590437 }, value: 5800 },
  //   { txid: "d8cd4aa054d0a20777df2e106370b2de7ef2a43e97f9b6a59bf975a58307ca61", vout: 0, status: { confirmed: true, block_height: 2434365, block_hash: "00000000000000246093cb4135d16e262433d4dd8ce6bd0214029214c24380f3", block_time: 1684592176 }, value: 11564 }
  // ]

  async function getUtxoData() {
    let address = "mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW"

    try {
      let result = await appState.bitcoin.testnetProvider?.bitcoin.addresses.getAddressTxsUtxo({ address })
      setUtxoData_Array(result)
      console.log(result)
    } catch (err) {
      console.error(err)
    }
  }

  const [selectedArray, setSelectedArray] = useState([])

  function pushIndexToSelectedArray(index) {
    if (selectedArray.includes(index)) {
      // remove utxo from array
      let startingIndex = selectedArray.indexOf(index)
      selectedArray.splice(startingIndex, 1)
      calculateTotalUtxoValueSelected()
    } else {
      // push utxo to array
      selectedArray.push(index)
      calculateTotalUtxoValueSelected()
    }
  }

  const [totalUtxoValueSelected, setTotalUtxoValueSelected] = useState(0)

  function calculateTotalUtxoValueSelected() {
    let totalValue = 0

    selectedArray.forEach(selectedUtxoIndex => {
      totalValue += utxoData_Array[selectedUtxoIndex].value
    })

    setTotalUtxoValueSelected(totalValue)
  }

  useEffect(() => {
    getUtxoData()
  }, [])

  function handleRcvrAddress() {
    appDispatch({ type: "setUtxoData_Array", value: utxoData_Array })
    appDispatch({ type: "setSelectedUtxo_Array", value: selectedArray })
    appDispatch({ type: "setTotalUtxoValueSelected", value: totalUtxoValueSelected })

    // Go to specify receiver page
    setTxStatus(2)
  }

  const Mainnet = bitcoin.networks.bitcoin
  let Testnet = bitcoin.networks.testnet

  let p2pkhCheck = bitcoin.address.fromBase58Check("mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW")

  return (
    <>
      <CSSTransition in={txStatus === 1} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <SelectUtxo utxoData_Array={utxoData_Array} pushIndexToSelectedArray={pushIndexToSelectedArray} selectedArray={selectedArray} totalUtxoValueSelected={totalUtxoValueSelected} handleRcvrAddress={handleRcvrAddress} />
      </CSSTransition>

      <CSSTransition in={txStatus === 2} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <InputRcvrAddress />
      </CSSTransition>

      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div className="title-font title-font--large">
            <div className="title__subtitle">Build your own transaction.</div>
            <div style={{ display: "inline-block" }} className="purple-font">
              🏗️ TX
            </div>{" "}
            Builder
          </div>
          <MdMenu onClick={() => appDispatch({ type: "toggleMenu" })} className="icon" />
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
