import React, { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdCopyAll, MdOutlineArrowCircleRight } from "react-icons/md"
import { TbWalletOff } from "react-icons/tb"

function Snapshot__Ethereum({ isAssetDisplayOpen, setIsAssetDisplayOpen, isEthereumWalletOpen, setIsEthereumWalletOpen }) {
  const [openFunctionView, setOpenFunctionView] = useState(0)

  let static_eth_address = "0x9189561aed3229361a1aca088323a3ab0750c5d6"

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
      <div className="snapshot__overlay">
        <div className="snapshot__function-wrapper">
          <div onClick={() => setOpenFunctionView(0)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 0 ? "snapshot__function-titlebar--blue--active" : "")}>
            SNAPSHOT
          </div>
          <div className={"snapshot__function-content " + (openFunctionView == 0 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
            <div className="snapshot__function-content__row">
              <div style={{ fontSize: ".8rem", color: "gray" }}>Balance</div>
              <div>null</div>
            </div>
            <div className="snapshot__function-content__row">
              <div style={{ fontSize: ".8rem", color: "gray" }}># TXs sent</div>
              <div>null</div>
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
          </div>
        </div>
        <div className="snapshot__function-wrapper">
          <div onClick={() => setOpenFunctionView(1)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 1 ? "snapshot__function-titlebar--blue--active" : "")}>
            RECEIVE
          </div>
          <div className={"snapshot__function-content " + (openFunctionView == 1 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
            <div>Deposit ETH Here</div>
            <div style={{ fontSize: ".5rem", color: "gray", width: "80%", textAlign: "justify" }}>Fund your ethereum wallet by depositing funds to the QR code below. Or copy & paste the address string shown below the QR code.</div>
            <div style={{ padding: "15px 0 15px 0" }}>
              <QRCode bgColor="#4f9bff" fgColor="#131a2a" style={{ height: "150px", width: "150px" }} value={static_eth_address} />
            </div>
            <div style={{ fontSize: ".54rem", paddingBottom: "3px" }} className="display-flex">
              <CopyToClipboard text={static_eth_address} onCopy={() => handleCopyPopup()}>
                <MdCopyAll style={{ width: "20px", height: "20px" }} className="icon icon-copy" />
              </CopyToClipboard>
              {static_eth_address}
            </div>
            <div style={{ fontSize: ".5rem", color: "red", width: "80%", textAlign: "justify" }}>This ETH address is an EVM compatible address. Always confirm the receiving address before broadcasting transaction. Sending ETH to the wrong address will result in loss of funds.</div>
          </div>
        </div>
        <div className="snapshot__function-wrapper">
          <div onClick={() => setOpenFunctionView(2)} className={"snapshot__function-titlebar snapshot__function-titlebar--blue " + (openFunctionView == 2 ? "snapshot__function-titlebar--blue--active" : "")}>
            SEND
          </div>
          <div className={"snapshot__function-content " + (openFunctionView == 2 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
            {hasFunds ? (
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
                  You do not have <br /> any ETH to send.
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
