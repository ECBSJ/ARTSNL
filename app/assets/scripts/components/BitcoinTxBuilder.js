import React, { useContext, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

// MAIN BITCOINJS LIBRARY
import * as bitcoin from "../../../../bitcoinjs-lib"

// REACT NPM TOOLS
import { MdMenu, MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { BsHddNetworkFill, BsHddNetwork, BsReception4 } from "react-icons/bs"
import { Tooltip } from "react-tooltip"
import { CSSTransition } from "react-transition-group"
import { useNavigate } from "react-router-dom"

// BITCOIN TX COMPONENTS
import BtcTxSelectUtxo from "./btctx/BtcTxSelectUtxo"
import BtcTxInputRcvrAddress from "./btctx/BtcTxInputRcvrAddress"
import BtcTxDeconstructRcvrAddress from "./btctx/BtcTxDeconstructRcvrAddress"
import BtcTxScriptPubKey from "./btctx/BtcTxScriptPubKey"
import BtcTxSignInputs from "./btctx/BtcTxSignInputs"

function BitcoinTxBuilder() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [txStatus, setTxStatus] = useState(1)
  // TX STATUS CODES
  // 1. Select UTXOs (<BtcTxSelectUtxo />) / function navigateToRcvrAddress navigates to txStatus 2
  // 2. Specify Rcvr Address (<BtcTxInputRcvrAddress />) / function handleDeconstructRcvrAddress navigates to txStatus 3
  // 3. Deconstruct address & specify send amount (<BtcTxDeconstructRcvrAddress />) / function navigateToScriptPubKey navigates to txStatus 4
  // 4. Build scriptpubkey (<BtcTxScriptPubKey />) / function navigateToSignInputs navigates to txStatus 5
  // 5. Sign inputs (<BtcTxSignInputs />)

  // TESTING WALLETS
  const testnetPrivKey = "938zbGqYYvZvFaHNXMNDpQZ4hEQE89ugGEjrv9QCKWCL6H2c4ps"
  const testnetAdd = "mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW"

  const testnetPrivKey_2 = "93MPV1RsWMvfLCpGZcnPG1U8EA3QDqdNxkCVJwmeTGrjEHFZ5v6"
  const testnetAdd_2 = "mx4k2ersuW9k3uc4ybNEEB1TsQ1qJkMZ4w"

  let utxoData_Array = [
    { txid: "9153e5420b1092ff65d90a028df8840e0e3dfc8b9c8e1c1c0664e02f000c5def", vout: 0, status: { confirmed: true, block_height: 2434520, block_hash: "000000000000000f4632a88a45d61cd4e777040fc0203108661e7ebedcddc4bb", block_time: 1684648693 }, value: 13700 },
    { txid: "a296be122cc5c90bfc7e50f65b2c2e12d231a761d69ff05ec8a05b48f6f16b9a", vout: 0, status: { confirmed: true, block_height: 2434362, block_hash: "000000000000000588988168cfb4f924fcd912f6a7c9d909fbd978067be31f01", block_time: 1684590437 }, value: 5800 },
    { txid: "d8cd4aa054d0a20777df2e106370b2de7ef2a43e97f9b6a59bf975a58307ca61", vout: 0, status: { confirmed: true, block_height: 2434365, block_hash: "00000000000000246093cb4135d16e262433d4dd8ce6bd0214029214c24380f3", block_time: 1684592176 }, value: 11564 }
  ]

  const [utxoData_hasError, setUtxoData_hasError] = useState(false)

  // called in this component's useEffect below and in function refreshTxBuilder
  async function getUtxoData() {
    let address = "mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW"

    // let address

    // if (appState.isTestnet == true) {
    //   address = appState.bitcoin.testnetAddress
    // } else {
    //   address = appState.bitcoin.address
    // }

    try {
      // let result = await appState.bitcoin.activeProvider?.bitcoin.addresses.getAddressTxsUtxo({ address })
      appDispatch({ type: "setUtxoData_Array", value: result })
      console.log(result)
    } catch (err) {
      setUtxoData_hasError(true)
      console.error(err)
    }
  }

  const [selectedArray, setSelectedArray] = useState([])

  // passed as prop to <BtcTxSelectUtxo /> when user selects utxo
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

  // called in function pushIndexToSelectedArray
  function calculateTotalUtxoValueSelected() {
    let totalValue = 0

    selectedArray.forEach(selectedUtxoIndex => {
      totalValue += utxoData_Array[selectedUtxoIndex].value
    })

    setTotalUtxoValueSelected(totalValue)
  }

  // called in function navigateToRcvrAddress to get selected utxo's full tx hex
  function getSelectedUtxoTxHex() {
    let selectedUtxoTxHex_Array = selectedArray.map(async (utxoIndex, index) => {
      let txid = utxoData_Array[utxoIndex].txid
      let txHex

      try {
        let result = await appState.bitcoin.activeProvider?.bitcoin.transactions.getTxHex({ txid })
        if (result) {
          txHex = result
        }
      } catch (error) {
        console.error(error)
      }

      return txHex
    })

    return Promise.all(selectedUtxoTxHex_Array)
  }

  // navigates to txStatus 2 and sets global state variables for selectedUtxoTxHex_Array, selectedUtxo_Array, totalUtxoValueSelected
  async function navigateToRcvrAddress() {
    await getSelectedUtxoTxHex().then(res => {
      // setSelectedUtxoTxHex_Array
      appDispatch({ type: "setSelectedUtxoTxHex_Array", value: res })
    })
    appDispatch({ type: "setSelectedUtxo_Array", value: selectedArray })
    appDispatch({ type: "setTotalUtxoValueSelected", value: totalUtxoValueSelected })

    // Go to specify receiver page
    setTxStatus(2)
  }

  // useEffect(() => {
  //   getUtxoData()
  // }, [])

  function refreshTxBuilder() {
    setUtxoData_hasError(false)
    setTotalUtxoValueSelected(0)
    setSelectedArray([])
    appDispatch({ type: "setUtxoData_Array", value: [] })
    setTxStatus(1)
    getUtxoData()
  }

  return (
    <>
      <CSSTransition in={txStatus === 1} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <BtcTxSelectUtxo utxoData_Array={utxoData_Array} pushIndexToSelectedArray={pushIndexToSelectedArray} selectedArray={selectedArray} totalUtxoValueSelected={totalUtxoValueSelected} navigateToRcvrAddress={navigateToRcvrAddress} utxoData_hasError={utxoData_hasError} />
      </CSSTransition>

      <CSSTransition in={txStatus === 2} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <BtcTxInputRcvrAddress setTxStatus={setTxStatus} />
      </CSSTransition>

      <CSSTransition in={txStatus === 3} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <BtcTxDeconstructRcvrAddress setTxStatus={setTxStatus} />
      </CSSTransition>

      <CSSTransition in={txStatus === 4} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <BtcTxScriptPubKey setTxStatus={setTxStatus} />
      </CSSTransition>

      <CSSTransition in={txStatus === 5} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <BtcTxSignInputs setTxStatus={setTxStatus} />
      </CSSTransition>

      {/* the below jsx is used as the header, footer, and backbone foundational layout for the above components */}
      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div style={{ cursor: "default" }} className="title-font title-font--large">
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
          <TbRefresh id="Tooltip" data-tooltip-content={"Refresh TX Builder"} onClick={() => refreshTxBuilder()} className="icon" />
          {appState.isTestnet ? <BsHddNetwork id="Tooltip" data-tooltip-content={"On Testnet"} className={"icon"} /> : <BsHddNetworkFill id="Tooltip" data-tooltip-content={"On Mainnet"} className={"icon"} />}
          <div onClick={() => navigate("/WalletMain")} id="Tooltip" data-tooltip-content={"Home"} className="icon">
            ARTSNL
          </div>
          <BsReception4 id="Tooltip" data-tooltip-content={appState.bitcoin.activeProvider && appState.ethereum.activeProvider ? "Network Status: Connected" : "Network Status: Disconnected"} className="icon" />
          <MdLibraryBooks className="icon" />
        </div>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
    </>
  )
}

export default BitcoinTxBuilder

{
  /* <div className="tx-builder__overlay">
<IconContext.Provider value={{ size: "30px" }}>
  <div className="tx-builder__overlay__outer">Step 4: Build ScriptPubKey</div>

  <div className="tx-builder__blueprint">
    <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>UTXOs Selected: {appState.bitcoin.txBuilder.selectedArray.length}</p>
    <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>Total UTXO Value Selected: {appState.bitcoin.txBuilder.totalUtxoValueSelected}</p>
  </div>

  <div className="tx-builder__overlay__outer"></div>
</IconContext.Provider>
</div> */
}
