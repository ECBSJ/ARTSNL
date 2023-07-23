import React, { useContext, useEffect, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import * as uint8arraytools from "uint8array-tools"

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
import BtcTxDashboard from "./btctx/BtcTxDashboard"
import BtcTxSelectUtxo from "./btctx/BtcTxSelectUtxo"
import BtcTxInputRcvrAddress from "./btctx/BtcTxInputRcvrAddress"
import BtcTxDeconstructRcvrAddress from "./btctx/BtcTxDeconstructRcvrAddress"
import BtcTxScriptPubKey from "./btctx/BtcTxScriptPubKey"
import BtcTxSignInputs from "./btctx/BtcTxSignInputs"

function BtcTxBuilder() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [txStatus, setTxStatus] = useState(0)
  // TX STATUS CODES
  // 0. TX Builder Dashboard / Overview display of inputs & outputs selected
  // 1. Select UTXOs (<BtcTxSelectUtxo />) / function navigateToRcvrAddress navigates back to dashboard to add output
  // 2. Specify Rcvr Address (<BtcTxInputRcvrAddress />) / function navigateToDeconstructRcvrAddress navigates to txStatus 3
  // 3. Deconstruct address & specify send amount (<BtcTxDeconstructRcvrAddress />) / function navigateToScriptPubKey navigates to txStatus 4
  // 4. Build scriptpubkey (<BtcTxScriptPubKey />) / function navigateToSignInputs navigates back to dashboard
  // 5. Sign inputs (<BtcTxSignInputs />)

  // TESTING WALLETS
  const testnetPrivKey = "938zbGqYYvZvFaHNXMNDpQZ4hEQE89ugGEjrv9QCKWCL6H2c4ps"
  const testnetAdd = "mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW"

  const testnetPrivKey_2 = "93MPV1RsWMvfLCpGZcnPG1U8EA3QDqdNxkCVJwmeTGrjEHFZ5v6"
  const testnetAdd_2 = "mx4k2ersuW9k3uc4ybNEEB1TsQ1qJkMZ4w"

  const testnetAdd_3 = "ms2qxPw1Q2nTkm4eMHqe6mM7JAFqAwDhpB"

  let utxoData_Array = [
    { txid: "a296be122cc5c90bfc7e50f65b2c2e12d231a761d69ff05ec8a05b48f6f16b9a", vout: 0, status: { confirmed: true, block_height: 2434362, block_hash: "000000000000000588988168cfb4f924fcd912f6a7c9d909fbd978067be31f01", block_time: 1684590437 }, value: 5800 },
    { txid: "be7610fcaad261bf04241854c3cc41625283833fb5f09f56648c3769741eaf02", vout: 1, status: { confirmed: true, block_height: 2443296, block_hash: "0000000000000005a06960c65d7b9eeec50e358be78b64737ea920f90a3975ce", block_time: 1690082989 }, value: 8158 },
    { txid: "9153e5420b1092ff65d90a028df8840e0e3dfc8b9c8e1c1c0664e02f000c5def", vout: 0, status: { confirmed: true, block_height: 2434520, block_hash: "000000000000000f4632a88a45d61cd4e777040fc0203108661e7ebedcddc4bb", block_time: 1684648693 }, value: 13700 }
  ]

  let selectedUtxoTxHex_Array = ["02000000000101fc17bccc0117b0d0f1955d6ac84d1bf47399f77d6a8944f73c3ab0bb8c035a320100000000feffffff02a8160000000000001976a914727c2e0ba76f7cea7b41ab920eec10117a35370388acf2d71300000000001976a914845b731431f519d2856ccc481087621eda16cc8a88ac0247304402206d0d4095dd5b45a84b01eadafce1ba87d6ebb2b51c43ace4982867a84991b83c02206bab4d2ae888deb8282149de576beadbced24b53e1285699f051dcfd0736d0f10121037955b1e146d3f87f4ebb897e6fbdd34ce2abe63641aea18aaa774c6a40d63b6639252500", "02000000000101fbb8b8a9dedd556941520f9324aab56776d830f4f49a5f13c7766c32f06a431a0000000000feffffff023ff21600000000001976a9148c3d34589112063d48f2b0562c7eca044e236e2688acde1f0000000000001976a914727c2e0ba76f7cea7b41ab920eec10117a35370388ac0247304402207e11ba443b9009d374ef8c04e72d985efb33084160aa08b3ccf1eddb206a4fff022017ab8281404f0152b646bdc476457170a587e0b50b34d23956ce784fab405ac2012103cd8db50d0a5b1c9adb1e1dff7a0a283ba650c6f0a15a9de4daf600ace658ffc31f482500", "02000000000101e46381154e9fcc1dec31a5edb6afd23063508c83b647c80b01433709440482740000000000feffffff0284350000000000001976a914727c2e0ba76f7cea7b41ab920eec10117a35370388acfb1b1500000000001976a914428d17adc0c17119b9f5c5689b61cd094b00c7e088ac0247304402201ffb958b864bcf2ac92b6f6485c6bc0cf9e9a9d223ee913fdb88eaa9945a670402203c80ae2cb29696cdbb4ac25d8ffb92f7811636197900bb5633591870587c5b65012103f2ebb8d108f78594dd2829f9e283e1977f226165d985278a6aa8ecc91302e3c1d7252500"]

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

  // selectedArray state will get pushed up to appState when navigating to txStatus 2
  const [selectedArray, setSelectedArray] = useState([])
  // passed as prop initially to <BtcTxSelectUtxo /> and called down in <UtxoDisplayCard /> when user selects utxo
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

  // navigates backs to dashboard and sets global state variables for selectedUtxoTxHex_Array, selectedUtxo_Array, totalUtxoValueSelected / called in <BtcTxSelectUtxo />
  async function navigateToRcvrAddress() {
    // await getSelectedUtxoTxHex().then(res => {
    //   // setSelectedUtxoTxHex_Array
    //   appDispatch({ type: "setSelectedUtxoTxHex_Array", value: res })
    // })
    appDispatch({ type: "setSelectedUtxoTxHex_Array", value: selectedUtxoTxHex_Array })
    appDispatch({ type: "setSelectedUtxo_Array", value: selectedArray })
    appDispatch({ type: "setTotalUtxoValueSelected", value: totalUtxoValueSelected })

    // navigates back to dashboard where user then needs to select add output
    setTxStatus(0)
  }

  function refreshTxBuilder() {
    setUtxoData_hasError(false)
    setTotalUtxoValueSelected(0)
    setSelectedArray([])
    appDispatch({ type: "setUtxoData_Array", value: [] })
    setTxStatus(1)
    getUtxoData()
  }

  useEffect(() => {
    // getUtxoData()
    appDispatch({ type: "setUtxoData_Array", value: utxoData_Array })
  }, [])

  return (
    <>
      <CSSTransition in={txStatus === 0} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <BtcTxDashboard setTxStatus={setTxStatus} />
      </CSSTransition>

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

export default BtcTxBuilder

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
