import React, { useEffect, useContext, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"
import * as bitcoin from "../../../../bitcoinjs-lib"
import { ethers } from "ethers"
import { Tooltip } from "react-tooltip"
import QRCode from "react-qr-code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { IconContext } from "react-icons"
import { FaBitcoin, FaEthereum } from "react-icons/fa"
import { BsHddNetworkFill, BsHddNetwork, BsReception1, BsReception4 } from "react-icons/bs"
import { MdArrowBack, MdNavigateNext, MdMenu, MdLibraryBooks, MdCopyAll, MdOutlineArrowCircleRight } from "react-icons/md"
import { TbRefresh, TbWalletOff } from "react-icons/tb"
import { CSSTransition } from "react-transition-group"

// IMPORT REACT COMPONENTS
import WalletMain_AssetDisplay from "./WalletMain_AssetDisplay"
import Snapshot__Bitcoin from "./Snapshot__Bitcoin"
import Snapshot__Ethereum from "./Snapshot__Ethereum"

function WalletMain() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  // let recentBlock = appState.bitcoin.activeProvider?.bitcoin.blocks.getBlocksTipHeight()
  // appState.ethereum.activeProvider?.getBlockNumber().then(console.log).catch(console.log)

  const [isAssetDisplayOpen, setIsAssetDisplayOpen] = useState(true)
  const [isBitcoinWalletOpen, setIsBitcoinWalletOpen] = useState(false)
  const [isEthereumWalletOpen, setIsEthereumWalletOpen] = useState(false)

  function handleCopyPopup() {
    document.querySelector(".icon-copy").classList.toggle("icon")
    document.querySelector(".icon-copy").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy").classList.toggle("icon")
      document.querySelector(".icon-copy").classList.toggle("icon-copy--active")
    }, 1000)
  }

  // Snapshot_Bitcoin component props
  const [hasErrors, setHasErrors] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const [addressData_Object, setAddressData_Object] = useState({
    funded_txo_count: null,
    funded_txo_sum: null,
    spent_txo_count: null,
    spent_txo_sum: null,
    tx_count: null
  })

  const [addressDataMempool_Object, setAddressDataMempool_Object] = useState({
    funded_txo_count: null,
    funded_txo_sum: null,
    spent_txo_count: null,
    spent_txo_sum: null,
    tx_count: null
  })

  async function getBitcoinAddressData() {
    setHasErrors(false)
    setIsFetching(true)

    let address

    if (appState.isTestnet == true) {
      address = appState.bitcoin.testnetAddress
    } else {
      address = appState.bitcoin.address
    }

    try {
      let result = await appState.bitcoin.activeProvider?.bitcoin.addresses.getAddress({ address })

      if (result) {
        console.log(result)
        setAddressData_Object(addressData_Object => ({
          ...result.chain_stats
        }))
        setAddressDataMempool_Object(addressDataMempool_Object => ({
          ...result.mempool_stats
        }))
        setIsFetching(false)
      } else {
        console.error("Bitcoin address data failed to fetch from API. Reason unknown. Please try again.")
        setIsFetching(false)
        setHasErrors(true)
      }
    } catch (error) {
      console.error(error)
      setIsFetching(false)
      setHasErrors(true)
    }
  }

  const [txsDataHasErrors, setTxsDataHasErrors] = useState(false)
  const [isFetchingTxsData, setIsFetchingTxsData] = useState(false)
  const [txsData_Array, setTxsData_Array] = useState([])
  const [lastConfirmedTxDate, setLastConfirmedTxDate] = useState("n/a")

  async function getBitcoinAddressTxsData() {
    setIsFetchingTxsData(true)
    setTxsDataHasErrors(false)

    let address

    if (appState.isTestnet == true) {
      address = appState.bitcoin.testnetAddress
    } else {
      address = appState.bitcoin.address
    }

    try {
      let result = await appState.bitcoin.activeProvider?.bitcoin.addresses.getAddressTxsChain({ address })

      if (result) {
        console.log(result)
        setTxsData_Array(result)

        if (!result.length == 0) {
          let lastDate = new Date(result[0].status.block_time * 1000).toLocaleDateString()
          setLastConfirmedTxDate(lastDate)
        } else {
          setLastConfirmedTxDate("n/a")
        }

        setIsFetchingTxsData(false)
      } else {
        console.error("Bitcoin address tx history failed to fetch from API. Reason unknown. Please try again.")
        setIsFetchingTxsData(false)
        setTxsDataHasErrors(true)
      }
    } catch (error) {
      console.error(error)
      setIsFetchingTxsData(false)
      setTxsDataHasErrors(true)
    }
  }

  // Snapshot_Ethereum component props
  const [hasErrors_Eth, setHasErrors_Eth] = useState(false)
  const [isFetching_Eth, setIsFetching_Eth] = useState(false)

  const [ethAddressBalance, setEthAddressBalance] = useState()
  const [ethAddressTxCount, setEthAddressTxCount] = useState()

  async function getEthereumAddressData() {
    setHasErrors_Eth(false)
    setIsFetching_Eth(true)

    try {
      let balanceResult = await appState.ethereum.activeProvider?.getBalance(appState.ethereum.address)
      let txCountResult = await appState.ethereum.activeProvider?.getTransactionCount(appState.ethereum.address)

      if (balanceResult && txCountResult) {
        console.log(txCountResult)
        console.log("Balance (wei) of " + appState.ethereum.address + ": " + balanceResult)
        setEthAddressBalance(balanceResult)
        setEthAddressTxCount(txCountResult)
        setIsFetching_Eth(false)
      } else {
        console.error("Ethereum address data failed to fetch from API. Reason unknown. Please try again.")
        setIsFetching_Eth(false)
        setHasErrors_Eth(true)
      }
    } catch (error) {
      console.error(error)
      setIsFetching_Eth(false)
      setHasErrors_Eth(true)
    }
  }

  async function handleRefresh() {
    if (isAssetDisplayOpen) {
      null
    }

    if (isBitcoinWalletOpen) {
      getBitcoinAddressData()
      getBitcoinAddressTxsData()
    }

    if (isEthereumWalletOpen) {
      getEthereumAddressData()
    }
  }

  return (
    <>
      <div className="wallet-main__overlay">
        <CSSTransition in={isAssetDisplayOpen} timeout={300} classNames="wallet-main__overlay" unmountOnExit>
          <WalletMain_AssetDisplay isAssetDisplayOpen={isAssetDisplayOpen} setIsAssetDisplayOpen={setIsAssetDisplayOpen} isBitcoinWalletOpen={isBitcoinWalletOpen} setIsBitcoinWalletOpen={setIsBitcoinWalletOpen} isEthereumWalletOpen={isEthereumWalletOpen} setIsEthereumWalletOpen={setIsEthereumWalletOpen} />
        </CSSTransition>

        <CSSTransition in={isBitcoinWalletOpen} timeout={300} classNames="snapshot__overlay" unmountOnExit>
          <Snapshot__Bitcoin hasErrors={hasErrors} setHasErrors={setHasErrors} isFetching={isFetching} setIsFetching={setIsFetching} addressData_Object={addressData_Object} setAddressData_Object={setAddressData_Object} addressDataMempool_Object={addressDataMempool_Object} setAddressDataMempool_Object={setAddressDataMempool_Object} getBitcoinAddressData={getBitcoinAddressData} txsDataHasErrors={txsDataHasErrors} setTxsDataHasErrors={setTxsDataHasErrors} isFetchingTxsData={isFetchingTxsData} setIsFetchingTxsData={setIsFetchingTxsData} txsData_Array={txsData_Array} setTxsData_Array={setTxsData_Array} lastConfirmedTxDate={lastConfirmedTxDate} setLastConfirmedTxDate={setLastConfirmedTxDate} getBitcoinAddressTxsData={getBitcoinAddressTxsData} />
        </CSSTransition>

        <CSSTransition in={isEthereumWalletOpen} timeout={300} classNames="snapshot__overlay" unmountOnExit>
          <Snapshot__Ethereum hasErrors_Eth={hasErrors_Eth} setHasErrors_Eth={setHasErrors_Eth} isFetching_Eth={isFetching_Eth} setIsFetching_Eth={setIsFetching_Eth} ethAddressBalance={ethAddressBalance} setEthAddressBalance={setEthAddressBalance} ethAddressTxCount={ethAddressTxCount} setEthAddressTxCount={setEthAddressTxCount} getEthereumAddressData={getEthereumAddressData} />
        </CSSTransition>
      </div>

      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          {isEthereumWalletOpen ? (
            <>
              <div className="title-font title-font--medium display-flex">
                <div className="title__subtitle">
                  Your <span style={{ color: "lightBlue" }}>{appState.isTestnet ? "Ethereum Goerli" : "Ethereum"}</span> journey starts here.
                </div>
                <MdArrowBack
                  onClick={() => {
                    setIsEthereumWalletOpen(!isEthereumWalletOpen)
                    setIsAssetDisplayOpen(!isAssetDisplayOpen)
                  }}
                  className="icon"
                />
                Your <span style={{ display: "contents", color: "blue" }}>{appState.isTestnet ? "gETH" : "ETH"}</span> Wallet
              </div>
            </>
          ) : isBitcoinWalletOpen ? (
            <>
              <div className="title-font title-font--medium display-flex">
                <div className="title__subtitle">
                  Your <span style={{ color: "orange" }}>{appState.isTestnet ? "Bitcoin Testnet" : "Bitcoin"}</span> journey starts here.
                </div>
                <MdArrowBack
                  onClick={() => {
                    setIsBitcoinWalletOpen(!isBitcoinWalletOpen)
                    setIsAssetDisplayOpen(!isAssetDisplayOpen)
                  }}
                  className="icon"
                />
                Your <div style={{ display: "contents", color: "orange" }}>{appState.isTestnet ? "tBTC" : "BTC"}</div> Wallet
              </div>
            </>
          ) : (
            <>
              <div className="title-font title-font--large">
                <div className="title__subtitle">
                  Your <span style={{ color: "white" }}>crypto</span> journey starts here.
                </div>
                <div style={{ display: "inline-block" }} className="purple-font">
                  🏠Your
                </div>{" "}
                Wallets
              </div>
            </>
          )}

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
          <TbRefresh onClick={() => handleRefresh()} id="Tooltip" data-tooltip-content={"Refresh"} className="icon" />
          {appState.isTestnet ? <BsHddNetwork id="Tooltip" data-tooltip-content={"Switch to mainnet"} onClick={() => appDispatch({ type: "toggleNetwork" })} className={"icon " + (isBitcoinWalletOpen || isEthereumWalletOpen ? "visibility-hidden" : "")} /> : <BsHddNetworkFill id="Tooltip" data-tooltip-content={"Switch to testnet"} onClick={() => appDispatch({ type: "toggleNetwork" })} className={"icon " + (isBitcoinWalletOpen || isEthereumWalletOpen ? "visibility-hidden" : "")} />}
          <div className="icon">ARTSNL</div>
          <BsReception4 id="Tooltip" data-tooltip-content={appState.bitcoin.activeProvider && appState.ethereum.activeProvider ? "Network Status: Connected" : "Network Status: Disconnected"} className="icon" />
          <MdLibraryBooks className="icon" />
        </div>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
    </>
  )
}

export default WalletMain
