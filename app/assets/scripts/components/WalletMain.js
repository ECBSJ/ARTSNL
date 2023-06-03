import React, { useEffect, useContext, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"
import * as bitcoin from "../../../../bitcoinjs-lib"
import { ethers } from "ethers"
import { Tooltip } from "react-tooltip"

import { IconContext } from "react-icons"
import { FaBitcoin, FaEthereum } from "react-icons/fa"
import { BsHddNetworkFill, BsHddNetwork, BsReception1, BsReception4 } from "react-icons/bs"
import { MdNavigateNext, MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"

// IMPORT REACT COMPONENTS
import WalletMain_AssetDisplay from "./WalletMain_AssetDisplay"

function WalletMain() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin

  let recentBlock = appState.bitcoin.activeProvider?.bitcoin.blocks.getBlocksTipHeight()

  // appState.ethereum.activeProvider?.getBlockNumber().then(console.log).catch(console.log)

  const [bitcoinAddressData, setBitcoinAddressData] = useState({})
  const [isAddressDetailsPageOpen, setIsAddressDetailsPageOpen] = useState(false)

  async function getBitcoinAddressData(address) {
    setIsAddressDetailsPageOpen(true)

    const {
      bitcoin: { addresses }
    } = await mempoolJS({
      hostname: "mempool.space"
    })

    const addressResult = await addresses.getAddress({ address })

    if (addressResult) {
      setBitcoinAddressData({ ...addressResult })
      console.log(addressResult)
    }
  }

  const [openFunctionView, setOpenFunctionView] = useState(0)

  return (
    <>
      <div className="wallet-main__overlay">
        {/* <WalletMain_AssetDisplay /> */}
        <div className="snapshot__overlay">
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(0)} className={"snapshot__function-titlebar snapshot__function-titlebar--orange " + (openFunctionView == 0 ? "snapshot__function-titlebar--orange--active" : "")}>
              SNAPSHOT
            </div>
            <div className={"snapshot__function-content " + (openFunctionView == 0 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              <div className="snapshot__function-content__row">
                <div style={{ fontSize: ".8rem", color: "gray" }}>Transactions</div>
                <div>null</div>
              </div>
              <div className="snapshot__function-content__row">
                <div style={{ fontSize: ".8rem", color: "gray" }}># of UTXO</div>
                <div>null</div>
              </div>
              <div className="snapshot__function-content__row">
                <div style={{ fontSize: ".8rem", color: "gray" }}>Historical rcvd</div>
                <div>null</div>
              </div>
              <div className="snapshot__function-content__row">
                <div style={{ fontSize: ".8rem", color: "gray" }}>Historical sent</div>
                <div>null</div>
              </div>
              <div className="snapshot__function-content__row">
                <div style={{ fontSize: ".8rem", color: "gray" }}>Tx in mempool</div>
                <div>null</div>
              </div>
              <div className="snapshot__function-content__row">
                <div style={{ fontSize: ".8rem", color: "gray" }}>Last tx</div>
                <div>null</div>
              </div>
            </div>
          </div>
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(1)} className={"snapshot__function-titlebar snapshot__function-titlebar--orange " + (openFunctionView == 1 ? "snapshot__function-titlebar--orange--active" : "")}>
              RECEIVE
            </div>
            <div className={"snapshot__function-content " + (openFunctionView == 1 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id quidem commodi error libero voluptatem impedit at, facilis sequi praesentium maiores labore velit! Porro dolore corrupti exercitationem blanditiis! Neque, odio laudantium.</div>
          </div>
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(2)} className={"snapshot__function-titlebar snapshot__function-titlebar--orange " + (openFunctionView == 2 ? "snapshot__function-titlebar--orange--active" : "")}>
              SEND
            </div>
            <div className={"snapshot__function-content " + (openFunctionView == 2 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. In enim aliquid cupiditate magni a magnam, esse vitae soluta! Qui vero aspernatur eaque earum unde id odit dolorum quasi molestias beatae!</div>
          </div>
        </div>
      </div>

      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div className="title-font title-font--large">
            <div className="title__subtitle">Your crypto journey starts here.</div>
            <div style={{ display: "inline-block" }} className="purple-font">
              🏠Your
            </div>{" "}
            Wallets
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
