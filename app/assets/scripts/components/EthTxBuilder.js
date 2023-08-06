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

function EthTxBuilder() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [txStatus, setTxStatus] = useState(0)

  async function testEthers() {
    if (appState.ethereum.activeProvider) {
      let myWallet = new Wallet(process.env.TESTNET_PAIR1_PRIVKEY_HEX, appState.ethereum.activeProvider)

      // type is bigint wei
      let currentBalance = await appState.ethereum.activeProvider.getBalance(myWallet.address)

      let currentBlock = await appState.ethereum.activeProvider.getBlockNumber()
      console.log(currentBlock)

      // feeResult in bigint wei
      let feeResult = await appState.ethereum.activeProvider.getFeeData()
      console.log(feeResult)
      let staticGasLimit = 21000n
      let totalFee = staticGasLimit * feeResult.maxFeePerGas
      let fullAvailableToSend = currentBalance - totalFee

      let stringData = ""
      let stringDataBufferHex = "0x" + Buffer.from(stringData).toString("hex")

      // let tx = new Transaction()
      // tx.chainId = 5
      // tx.data = stringDataBufferHex
      // tx.from = "0x9189561aed3229361a1aca088323a3ab0750c5d6"
      // tx.gasLimit = staticGasLimit
      // tx.maxFeePerGas = feeResult.maxFeePerGas
      // tx.maxPriorityFeePerGas = feeResult.maxPriorityFeePerGas
      // tx.nonce = 7
      // tx.to = "0x2b776aa3C2389D6a3B7b11cd99Fdb94190bAF75b"
      // tx.type = 2
      // tx.value = fullAvailableToSend
      // let txPreImageHash = ethers.keccak256(tx.unsignedSerialized)
      // let signedResult = myWallet.signingKey.sign(txPreImageHash)
      // tx.signature = signedResult
      // console.log(tx)

      // gasLimit (type is bigint) estimation requires the chainId, data, to, type
      // let estimation = await myWallet.estimateGas(tx)

      // let txBroadcast = await myWallet.sendTransaction(tx)
      // console.log(txBroadcast)
    }
  }

  function refreshTxBuilder() {
    null
  }

  function navigateToWalletHome() {
    navigate("/WalletMain")
  }

  useEffect(() => {
    // init Wallet class
    // init Transaction class
    // fetch address balance
  }, [])

  return (
    <>
      <CSSTransition in={txStatus === 0} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <EthTxStructureType setTxStatus={setTxStatus} />
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
