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

  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin

  const address = "19G4UV3YDkTYj4G3XSYeUkzp4Ew6voQFiR"

  // let recentBlock = appState.bitcoin.activeProvider?.bitcoin.blocks.getBlocksTipHeight()

  // appState.ethereum.activeProvider?.getBlockNumber().then(console.log).catch(console.log)

  const [openFunctionView, setOpenFunctionView] = useState(0)
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

  let hasFunds = false

  return (
    <>
      <div className="wallet-main__overlay">
        <CSSTransition in={isAssetDisplayOpen} timeout={300} classNames="wallet-main__overlay" unmountOnExit>
          <WalletMain_AssetDisplay isAssetDisplayOpen={isAssetDisplayOpen} setIsAssetDisplayOpen={setIsAssetDisplayOpen} isBitcoinWalletOpen={isBitcoinWalletOpen} setIsBitcoinWalletOpen={setIsBitcoinWalletOpen} isEthereumWalletOpen={isEthereumWalletOpen} setIsEthereumWalletOpen={setIsEthereumWalletOpen} />
        </CSSTransition>

        <CSSTransition in={isBitcoinWalletOpen} timeout={300} classNames="snapshot__overlay" unmountOnExit>
          <Snapshot__Bitcoin isAssetDisplayOpen={isAssetDisplayOpen} setIsAssetDisplayOpen={setIsAssetDisplayOpen} isBitcoinWalletOpen={isBitcoinWalletOpen} setIsBitcoinWalletOpen={setIsBitcoinWalletOpen} />
        </CSSTransition>

        <CSSTransition in={isEthereumWalletOpen} timeout={300} classNames="snapshot__overlay" unmountOnExit>
          <Snapshot__Ethereum isAssetDisplayOpen={isAssetDisplayOpen} setIsAssetDisplayOpen={setIsAssetDisplayOpen} isEthereumWalletOpen={isEthereumWalletOpen} setIsEthereumWalletOpen={setIsEthereumWalletOpen} />
        </CSSTransition>
      </div>

      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          {isEthereumWalletOpen ? (
            <>
              <div className="title-font title-font--medium display-flex">
                <div className="title__subtitle">Your Ethereum journey starts here.</div>
                <MdArrowBack
                  onClick={() => {
                    setIsEthereumWalletOpen(!isEthereumWalletOpen)
                    setIsAssetDisplayOpen(!isAssetDisplayOpen)
                  }}
                  className="icon"
                />
                Your{" "}
                <div style={{ display: "inline-block" }} className="blue-font">
                  ETH
                </div>{" "}
                Wallet
              </div>
            </>
          ) : isBitcoinWalletOpen ? (
            <>
              <div className="title-font title-font--medium display-flex">
                <div className="title__subtitle">Your Bitcoin journey starts here.</div>
                <MdArrowBack
                  onClick={() => {
                    setIsBitcoinWalletOpen(!isBitcoinWalletOpen)
                    setIsAssetDisplayOpen(!isAssetDisplayOpen)
                  }}
                  className="icon"
                />
                Your{" "}
                <div style={{ display: "inline-block" }} className="orange-font">
                  BTC
                </div>{" "}
                Wallet
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
          <TbRefresh id="Tooltip" data-tooltip-content={"Refresh"} className="icon" />
          {appState.isTestnet ? <BsHddNetwork id="Tooltip" data-tooltip-content={"Switch to mainnet"} onClick={() => appDispatch({ type: "toggleNetwork" })} className="icon" /> : <BsHddNetworkFill id="Tooltip" data-tooltip-content={"Switch to testnet"} onClick={() => appDispatch({ type: "toggleNetwork" })} className="icon" />}
          <div className="icon">ARTSNL</div>
          <BsReception4 id="Tooltip" data-tooltip-content={"Network Status: Connected"} className="icon" />
          <MdLibraryBooks className="icon" />
        </div>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
    </>
  )
}

export default WalletMain
