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
import { MdNavigateNext, MdMenu, MdLibraryBooks, MdCopyAll, MdOutlineArrowCircleRight } from "react-icons/md"
import { TbRefresh, TbWalletOff } from "react-icons/tb"

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

  const static_btc_address = "19G4UV3YDkTYj4G3XSYeUkzp4Ew6voQFiR"

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
            <div className={"snapshot__function-content " + (openFunctionView == 1 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              <div>Deposit BTC Here</div>
              <div style={{ fontSize: ".5rem", color: "gray", width: "80%", textAlign: "justify" }}>Fund your bitcoin wallet by depositing funds to the QR code below. Or copy & paste the address string shown below the QR code.</div>
              <div style={{ padding: "15px 0 15px 0" }}>
                <QRCode bgColor="#FFA500" fgColor="#131a2a" style={{ height: "150px", width: "150px" }} value={static_btc_address} />
              </div>
              <div style={{ fontSize: ".6rem", paddingBottom: "3px" }} className="display-flex">
                <CopyToClipboard text={static_btc_address} onCopy={() => handleCopyPopup()}>
                  <MdCopyAll style={{ width: "20px", height: "20px" }} className="icon icon-copy" />
                </CopyToClipboard>
                {static_btc_address}
              </div>
              <div style={{ fontSize: ".5rem", color: "red", width: "80%", textAlign: "justify" }}>This BTC address is a P2PKH address. Always confirm the receiving address before broadcasting transaction. Sending BTC to the wrong address will result in loss of funds.</div>
            </div>
          </div>
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(2)} className={"snapshot__function-titlebar snapshot__function-titlebar--orange " + (openFunctionView == 2 ? "snapshot__function-titlebar--orange--active" : "")}>
              SEND
            </div>
            <div className={"snapshot__function-content " + (openFunctionView == 2 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              {hasFunds ? (
                <>
                  <div style={{ paddingBottom: "10px" }}>Start DIY TX</div>
                  <MdOutlineArrowCircleRight style={{ width: "80px", height: "80px" }} className="icon" />
                  <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                    <p>&#x2022;Before proceeding to the DIY transaction process, please have a valid P2PKH receiving address ready.</p>
                    <p>&#x2022;You still can leave BTC in this wallet as the browser&#39;s secure storage will store your credentials.</p>
                    <p>&#x2022;Highly advised to not leave large sums of value in this wallet. This wallet is still in beta production.</p>
                    <p>&#x2022;If you want, you can always backup or move your key pair by navigating to the Export option in the Menu.</p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ paddingBottom: "10px" }}>
                    You do not have <br /> any BTC to send.
                  </div>
                  <TbWalletOff style={{ width: "80px", height: "80px" }} className="icon" />
                  <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                    <p>&#x2022;Navigate to the Receive tab to fund your BTC wallet in order to construct a transaction.</p>
                    <p>&#x2022;If you don&#39;t want to fund this wallet with mainnet UTXOs, you can switch to the testnet to use tBTC.</p>
                  </div>
                </>
              )}
            </div>
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
