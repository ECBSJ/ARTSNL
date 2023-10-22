import React, { useContext, useEffect, useState } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

// WalletConnect Process Components
import WC_Scanner from "./WC_Scanner"

// REACT NPM TOOLS
import { MdMenu, MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { BsHddNetworkFill, BsHddNetwork, BsReception4 } from "react-icons/bs"
import { Tooltip } from "react-tooltip"
import { CSSTransition } from "react-transition-group"
import { useNavigate } from "react-router-dom"

function WalletConnect_Main() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [txStatus, setTxStatus] = useState(0)

  function navigateToWalletHome() {
    navigate("/WalletMain")
  }

  return (
    <>
      <CSSTransition in={txStatus === 0} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <WC_Scanner setTxStatus={setTxStatus} />
      </CSSTransition>

      {/* the below jsx is used as the header, footer, and backbone foundational layout for the above components */}
      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div style={{ cursor: "default" }} className="title-font title-font--large">
            <div className="title__subtitle">WalletConnect Status: No open pairings</div>
            <div style={{ display: "inline-block" }} className="purple-font">
              Connect to
            </div>{" "}
            web3
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
          <TbRefresh id="Tooltip" data-tooltip-content={"Refresh"} onClick={null} className="icon" />
          {appState.isTestnet ? <BsHddNetwork id="Tooltip" data-tooltip-content={"On Testnet"} className={"icon"} /> : <BsHddNetworkFill id="Tooltip" data-tooltip-content={"On Mainnet"} className={"icon"} />}
          <div onClick={() => navigateToWalletHome()} id="Tooltip" data-tooltip-content={"Home"} className="icon">
            ARTSNL
          </div>
          <BsReception4 id="Tooltip" data-tooltip-content={appState.bitcoin.activeProvider && appState.ethereum.activeProvider ? "Network Status: Connected" : "Network Status: Disconnected"} className="icon" />
          <MdLibraryBooks className="icon" />
        </div>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
    </>
  )
}

export default WalletConnect_Main

{
  /* <div style={{ justifyContent: "flex-end" }} className="tx-builder__overlay">
  <div className="wc-dashboard"></div>
  <div className="wc-inputs"></div>
  <div className="wc-logo"></div>
</div> */
}
