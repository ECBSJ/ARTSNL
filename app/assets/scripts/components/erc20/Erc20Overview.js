import React, { useEffect, useState, useContext } from "react"
import QRCode from "react-qr-code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdCopyAll, MdOutlineArrowCircleRight, MdLibraryBooks, MdMenu } from "react-icons/md"
import { BsHddNetworkFill, BsHddNetwork, BsReception1, BsReception4 } from "react-icons/bs"
import { TbWalletOff, TbRefresh } from "react-icons/tb"
import { VscBracketError } from "react-icons/vsc"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import LazyLoadFallback from "../LazyLoadFallback"
import { Tooltip } from "react-tooltip"

function Erc20Overview() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const navigate = useNavigate()

  const [isFetching_Erc20, setIsFetching_Erc20] = useState(false)
  const [hasErrors_Erc20, setHasErrors_Erc20] = useState(false)
  const [openFunctionView, setOpenFunctionView] = useState(0)

  function handleCopyPopup() {
    document.querySelector(".icon-copy").classList.toggle("icon")
    document.querySelector(".icon-copy").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy").classList.toggle("icon")
      document.querySelector(".icon-copy").classList.toggle("icon-copy--active")
    }, 1000)
  }

  return (
    <>
      <div className="wallet-main__overlay">
        <div className="snapshot__overlay">
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(0)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 0 ? "snapshot__function-titlebar--blue--active" : "")}>
              Your ERC20s
            </div>
            <div style={{ justifyContent: "flex-start" }} className={"snapshot__function-content " + (openFunctionView == 0 ? "snapshot__function-content--display overflow--scroll" : "snapshot__function-content--hide")}>
              {isFetching_Erc20 ? (
                <LazyLoadFallback />
              ) : hasErrors_Erc20 ? (
                <>
                  <VscBracketError className="icon icon--error" />
                  <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                    <p>&#x2022;Unable to retrieve ERC20 tokens information from API.</p>
                    <p>&#x2022;Please check your internet connection and then click on the bottom left refresh icon.</p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ minHeight: "55.5px" }} className="snapshot__function-content__row">
                    <div style={{ fontSize: ".8rem", color: "gray" }}>HOUR</div>
                    <div></div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(1)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 1 ? "snapshot__function-titlebar--blue--active" : "")}>
              IMPORT
            </div>
            <div className={"snapshot__function-content " + (openFunctionView == 1 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              <div>Deposit {appState.isTestnet ? "gETH" : "ETH"} Here</div>
              <div style={{ fontSize: ".5rem", color: "gray", width: "80%", textAlign: "justify" }}>Fund your ethereum wallet by depositing funds to the QR code below. Or copy & paste the address string shown below the QR code.</div>
              <div style={{ padding: "15px 0 15px 0" }}>
                <QRCode bgColor="#4f9bff" fgColor="#131a2a" style={{ height: "150px", width: "150px" }} value={appState.ethereum.address} />
              </div>
              <div style={{ fontSize: ".54rem", paddingBottom: "3px" }} className="display-flex">
                <CopyToClipboard text={appState.ethereum.address} onCopy={() => handleCopyPopup()}>
                  <MdCopyAll style={{ width: "20px", height: "20px" }} className="icon icon-copy" />
                </CopyToClipboard>
                {appState.ethereum.address}
              </div>
              <div style={{ fontSize: ".5rem", color: "red", width: "80%", textAlign: "justify" }}>This ETH address is an EVM compatible address. Always confirm the receiving address before broadcasting transaction. Sending ETH to the wrong address will result in loss of funds.</div>
            </div>
          </div>
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(2)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 2 ? "snapshot__function-titlebar--blue--active" : "")}>
              REMOVE
            </div>
            <div className={"snapshot__function-content " + (openFunctionView == 2 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              <div style={{ paddingBottom: "10px" }}>
                You do not have <br /> any {appState.isTestnet ? "gETH" : "ETH"} to send.
              </div>
              <TbWalletOff onClick={() => setOpenFunctionView(1)} style={{ width: "80px", height: "80px" }} className="icon" />
              <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                <p>&#x2022;Navigate to the Receive tab to fund your ETH wallet in order to construct a transaction.</p>
                <p>&#x2022;If you don&#39;t want to fund this wallet with mainnet ETH, you can switch to the testnet to use Goerli ETH.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div className="title-font title-font--large">
            <div className="title__subtitle">
              Your <span style={{ color: "white" }}>TOKENIZED</span> journey starts here.
            </div>
            <div style={{ display: "inline-block" }} className="purple-font">
              🏠ERC20
            </div>{" "}
            Portfolio
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
          <TbRefresh id="Tooltip" data-tooltip-content={"Refresh"} className="icon" />
          {appState.isTestnet ? <BsHddNetwork id="Tooltip" data-tooltip-content={"Switch to mainnet"} onClick={() => appDispatch({ type: "toggleNetwork" })} className={"icon"} /> : <BsHddNetworkFill id="Tooltip" data-tooltip-content={"Switch to testnet"} onClick={() => appDispatch({ type: "toggleNetwork" })} className={"icon"} />}
          <div className="icon">ARTSNL</div>
          <BsReception4 id="Tooltip" data-tooltip-content={appState.bitcoin.activeProvider && appState.ethereum.activeProvider ? "Network Status: Connected" : "Network Status: Disconnected"} className="icon" />
          <MdLibraryBooks className="icon" />
        </div>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
    </>
  )
}

export default Erc20Overview
