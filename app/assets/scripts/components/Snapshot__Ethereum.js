import React, { useEffect, useState, useContext } from "react"
import QRCode from "react-qr-code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdCopyAll, MdOutlineArrowCircleRight } from "react-icons/md"
import { TbWalletOff } from "react-icons/tb"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import LazyLoadFallback from "./LazyLoadFallback"
import { VscBracketError } from "react-icons/vsc"
import { ethers } from "ethers"

function Snapshot__Ethereum({ hasErrors_Eth, setHasErrors_Eth, isFetching_Eth, setIsFetching_Eth, ethAddressBalance, setEthAddressBalance, ethAddressTxCount, setEthAddressTxCount, getEthereumAddressData }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [openFunctionView, setOpenFunctionView] = useState(0)

  function handleCopyPopup() {
    document.querySelector(".icon-copy").classList.toggle("icon")
    document.querySelector(".icon-copy").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy").classList.toggle("icon")
      document.querySelector(".icon-copy").classList.toggle("icon-copy--active")
    }, 1000)
  }

  useEffect(() => {
    getEthereumAddressData()
  }, [])

  return (
    <>
      <div className="snapshot__overlay">
        <div className="snapshot__function-wrapper">
          <div onClick={() => setOpenFunctionView(0)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 0 ? "snapshot__function-titlebar--blue--active" : "")}>
            SNAPSHOT
          </div>
          <div className={"snapshot__function-content " + (openFunctionView == 0 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
            {isFetching_Eth ? (
              <LazyLoadFallback />
            ) : hasErrors_Eth ? (
              <>
                <VscBracketError className="icon icon--error" />
                <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                  <p>&#x2022;Unable to retrieve bitcoin address data from API.</p>
                  <p>&#x2022;Please check your internet connection and then click on the bottom left refresh icon.</p>
                </div>
              </>
            ) : (
              <>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}>Balance</div>
                  <div>{ethAddressBalance == "0n" || ethAddressBalance == null ? 0 : ethers.formatEther(ethAddressBalance).slice(0, 7)}</div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}># TXs sent</div>
                  <div>{ethAddressTxCount == null ? 0 : ethAddressTxCount}</div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}></div>
                  <div></div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}></div>
                  <div></div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}></div>
                  <div></div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}></div>
                  <div></div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="snapshot__function-wrapper">
          <div onClick={() => setOpenFunctionView(1)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 1 ? "snapshot__function-titlebar--blue--active" : "")}>
            RECEIVE
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
            SEND
          </div>
          <div className={"snapshot__function-content " + (openFunctionView == 2 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
            {ethAddressBalance > 0 ? (
              <>
                <div style={{ paddingBottom: "10px" }}>Start DIY TX</div>
                <MdOutlineArrowCircleRight style={{ width: "80px", height: "80px" }} className="icon" />
                <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                  <p>&#x2022;Before proceeding to the DIY transaction process, please have a valid EVM compatible receiving address ready.</p>
                  <p>&#x2022;You still can leave ETH in this wallet as the browser&#39;s secure storage will store your key pair encrypted.</p>
                  <p>&#x2022;Highly advised to not leave large sums of value in this wallet. This wallet is still in beta production.</p>
                  <p>&#x2022;If you want, you can always backup or move your key pair by navigating to the Export option in the Menu.</p>
                </div>
              </>
            ) : (
              <>
                <div style={{ paddingBottom: "10px" }}>
                  You do not have <br /> any {appState.isTestnet ? "gETH" : "ETH"} to send.
                </div>
                <TbWalletOff onClick={() => setOpenFunctionView(1)} style={{ width: "80px", height: "80px" }} className="icon" />
                <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                  <p>&#x2022;Navigate to the Receive tab to fund your ETH wallet in order to construct a transaction.</p>
                  <p>&#x2022;If you don&#39;t want to fund this wallet with mainnet ETH, you can switch to the testnet to use Goerli ETH.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Snapshot__Ethereum
