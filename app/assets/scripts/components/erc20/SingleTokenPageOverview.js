import React, { useEffect, useState, useContext } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import QRCode from "react-qr-code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdCopyAll, MdOutlineArrowCircleRight, MdOpenInNew } from "react-icons/md"
import { TbWalletOff } from "react-icons/tb"
import { CSSTransition } from "react-transition-group"
import SendTokenPage from "./SendTokenPage"

function SingleTokenPageOverview({ tokenObjectToOpen }) {
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

  const [isSendTokenPageOpen, setIsSendTokenPageOpen] = useState(false)

  function navigateSendTokenPage() {
    setIsSendTokenPageOpen(true)
  }

  return (
    <>
      <CSSTransition in={isSendTokenPageOpen} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <SendTokenPage tokenObjectToOpen={tokenObjectToOpen} setIsSendTokenPageOpen={setIsSendTokenPageOpen} isSendTokenPageOpen={isSendTokenPageOpen} />
      </CSSTransition>

      <div style={{ position: "absolute", backgroundColor: "#101115" }} className="wallet-main__overlay wallet-main__overlay__single-token-page">
        <div className="snapshot__overlay">
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(0)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 0 ? "snapshot__function-titlebar--blue--active" : "")}>
              ${tokenObjectToOpen?.symbol} SNAPSHOT
            </div>
            <div className={"snapshot__function-content " + (openFunctionView == 0 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              <div style={{ flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start" }} className="snapshot__function-content__row">
                <div style={{ fontSize: "1.2rem", color: "mediumpurple" }} className="font--russo-one">
                  {tokenObjectToOpen?.name}
                </div>
                <a href={appState.isTestnet ? `https://goerli.etherscan.io/address/${tokenObjectToOpen?.contractAddress}` : `https://etherscan.io/address/${tokenObjectToOpen?.contractAddress}`} style={{ fontSize: ".7rem", marginTop: "3px" }} className="display-flex" target="_blank">
                  <MdOpenInNew style={{ width: "15px", height: "15px", marginRight: "3px" }} /> View Smart Contract
                </a>
              </div>
              <div className="snapshot__function-content__row">
                <div style={{ fontSize: ".8rem", color: "gray" }}>Balance</div>
                <div>{tokenObjectToOpen.balanceOf}</div>
              </div>
              <div className="snapshot__function-content__row"></div>
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
            </div>
          </div>
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(1)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 1 ? "snapshot__function-titlebar--blue--active" : "")}>
              RECEIVE ${tokenObjectToOpen?.symbol}
            </div>
            <div className={"snapshot__function-content " + (openFunctionView == 1 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              <div>Deposit {appState.isTestnet ? `Goerli $${tokenObjectToOpen?.symbol}` : `Mainnet $${tokenObjectToOpen?.symbol}`} Here</div>
              <div style={{ fontSize: ".5rem", color: "gray", width: "80%", textAlign: "justify" }}>Fund your ${tokenObjectToOpen?.symbol} wallet by depositing funds to the QR code below. Or copy & paste the address string shown below the QR code.</div>
              <div style={{ padding: "15px 0 15px 0" }}>
                <QRCode bgColor="#4f9bff" fgColor="#131a2a" style={{ height: "150px", width: "150px" }} value={appState.ethereum.address} />
              </div>
              <div style={{ fontSize: ".54rem", paddingBottom: "3px" }} className="display-flex">
                <CopyToClipboard text={appState.ethereum.address} onCopy={() => handleCopyPopup()}>
                  <MdCopyAll style={{ width: "20px", height: "20px" }} className="icon icon-copy" />
                </CopyToClipboard>
                {appState.ethereum.address}
              </div>
              <div style={{ fontSize: ".5rem", color: "red", width: "80%", textAlign: "justify" }}>
                This ${tokenObjectToOpen?.symbol} address is an EVM compatible address. Always confirm the receiving address before broadcasting transaction. Sending ${tokenObjectToOpen?.symbol} to the wrong address will result in loss of funds.
              </div>
            </div>
          </div>
          <div className="snapshot__function-wrapper">
            <div onClick={() => setOpenFunctionView(2)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 2 ? "snapshot__function-titlebar--blue--active" : "")}>
              SEND ${tokenObjectToOpen?.symbol}
            </div>
            <div className={"snapshot__function-content " + (openFunctionView == 2 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              {appState.ethereum.currentBalance > 0 && tokenObjectToOpen.balanceOf > 0 ? (
                <>
                  <div style={{ paddingBottom: "10px" }}>Start ${tokenObjectToOpen?.symbol} TX</div>
                  <MdOutlineArrowCircleRight onClick={() => navigateSendTokenPage()} style={{ width: "80px", height: "80px" }} className="icon" />
                  <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                    <p>&#x2022;Before proceeding to the transaction process, please have a valid EVM compatible receiving address ready.</p>
                    <p>&#x2022;You still can leave ${tokenObjectToOpen?.symbol} in this wallet as the browser&#39;s secure storage will store your key pair encrypted.</p>
                    <p>&#x2022;Highly advised to not leave large sums of value in this wallet. This wallet is still in beta production.</p>
                    <p>&#x2022;If you want, you can always backup or move your key pair by navigating to the Export option in the Menu.</p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ paddingBottom: "10px" }}>Unable to construct ${tokenObjectToOpen?.symbol} TX</div>
                  <TbWalletOff onClick={() => setOpenFunctionView(1)} style={{ width: "80px", height: "80px" }} className="icon" />
                  <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                    <p>
                      &#x2022;Either you do not have any {appState.isTestnet ? "gETH" : "ETH"} to pay gas fees or you don't have any ${tokenObjectToOpen?.symbol} tokens to send.
                    </p>
                    <p>
                      &#x2022;Navigate to the Receive tab to fund your wallet with {appState.isTestnet ? "gETH" : "ETH"} and/or ${tokenObjectToOpen?.symbol} in order to construct a transaction.
                    </p>
                    <p>&#x2022;Having {appState.isTestnet ? "gETH" : "ETH"} is necessary in order to pay for gas fees.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SingleTokenPageOverview
