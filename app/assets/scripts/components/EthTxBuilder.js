import React, { useEffect, useState, useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

import { decodeRlp, encodeRlp, ethers, formatEther, parseEther, Signature, Transaction, Wallet } from "ethers"

// REACT NPM TOOLS
import { MdMenu, MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { BsHddNetworkFill, BsHddNetwork, BsReception4 } from "react-icons/bs"
import { Tooltip } from "react-tooltip"
import { CSSTransition } from "react-transition-group"
import { useNavigate } from "react-router-dom"

// ETH TX BUILDER COMPONENTS
import EthTxStructureType from "./ethtx/EthTxStructureType"
import EthTxSetGasFee from "./ethtx/EthTxSetGasFee"
import EthTxSendAmount from "./ethtx/EthTxSendAmount"
import EthTxSignature from "./ethtx/EthTxSignature"

function EthTxBuilder() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [txStatus, setTxStatus] = useState(3)

  async function testEthers() {
    if (appState.ethereum.activeProvider) {
      let myWallet = new Wallet(process.env.TESTNET_PAIR1_PRIVKEY_HEX, appState.ethereum.activeProvider)
      let nonce = await myWallet.getNonce()

      // type is bigint wei
      // let currentBalance = await appState.ethereum.activeProvider.getBalance(myWallet.address)

      // feeResult in bigint wei
      let feeResult = await appState.ethereum.activeProvider.getFeeData()
      let staticGasLimit = 21000n
      // let totalFee = staticGasLimit * feeResult.maxFeePerGas
      // let fullAvailableToSend = currentBalance - totalFee

      let stringData = ""
      let stringDataBufferHex = "0x" + Buffer.from(stringData).toString("hex")

      let tx = new Transaction()
      tx.chainId = 5
      tx.data = stringDataBufferHex
      // tx.from = "0x9189561aed3229361a1aca088323a3ab0750c5d6"
      tx.gasLimit = staticGasLimit
      tx.maxFeePerGas = feeResult.maxFeePerGas
      tx.maxPriorityFeePerGas = feeResult.maxPriorityFeePerGas
      tx.nonce = nonce
      tx.to = "0x2b776aa3C2389D6a3B7b11cd99Fdb94190bAF75b"
      tx.type = 2
      tx.value = parseEther("0.06")
      let txPreImageHash = ethers.keccak256(tx.unsignedSerialized)
      // let signedResult = myWallet.signingKey.sign(txPreImageHash)
      // tx.signature = signedResult
      // console.log(tx)

      // gasLimit (type is bigint) estimation requires the chainId, data, to, type
      // let estimation = await myWallet.estimateGas(tx)

      // let txBroadcast = await myWallet.sendTransaction(tx)
      // console.log(txBroadcast)
    }
  }

  const [fetchBalanceHasError, setFetchBalanceHasError] = useState(false)

  async function fetchCurrentBalance() {
    try {
      setFetchBalanceHasError(false)
      let result = await appState.ethereum.activeProvider?.getBalance(appState.ethereum.address)
      appDispatch({ type: "setCurrentBalance", value: result })
    } catch (err) {
      console.error(err)
      setFetchBalanceHasError(true)
    }
  }

  function refreshTxBuilder() {
    null
  }

  function navigateToWalletHome() {
    navigate("/WalletMain")
  }

  useEffect(() => {
    if (appState.ethereum.activeProvider) {
      // init Wallet class
      appDispatch({ type: "initWalletClass" })
      // init Transaction class
      appDispatch({ type: "initTxDataStruct" })
      // fetch address balance
      fetchCurrentBalance()
    }
  }, [])

  return (
    <>
      <CSSTransition in={txStatus === 0} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <EthTxStructureType setTxStatus={setTxStatus} />
      </CSSTransition>

      <CSSTransition in={txStatus === 1} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <EthTxSetGasFee setTxStatus={setTxStatus} />
      </CSSTransition>

      <CSSTransition in={txStatus === 2} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <EthTxSendAmount setTxStatus={setTxStatus} />
      </CSSTransition>

      <CSSTransition in={txStatus === 3} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <EthTxSignature setTxStatus={setTxStatus} />
      </CSSTransition>

      {/* the below jsx is used as the header, footer, and backbone foundational layout for the above components */}
      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div style={{ cursor: "default" }} className="title-font title-font--large">
            <div className="title__subtitle">
              Build your own <span className="blue-font">{appState.isTestnet ? "Goerli ETH" : "ETH"}</span> transaction for {"x" + appState.ethereum.address.slice(-4)}.
            </div>
            <div style={{ display: "inline-block" }} className="blue-font">
              🏗️ ETH
            </div>{" "}
            TX Build
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
          <div onClick={() => navigateToWalletHome()} id="Tooltip" data-tooltip-content={"Home"} className="icon">
            ARTSNL
          </div>
          <BsReception4 id="Tooltip" data-tooltip-content={appState.ethereum.activeProvider ? "Network Status: Connected" : "Network Status: Disconnected"} className="icon" />
          <MdLibraryBooks className="icon" />
        </div>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
    </>
  )
}

export default EthTxBuilder
