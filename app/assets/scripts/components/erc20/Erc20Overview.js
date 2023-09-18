import React, { useEffect, useState, useContext } from "react"
import QRCode from "react-qr-code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdCopyAll, MdOutlineArrowCircleRight, MdLibraryBooks, MdMenu, MdContentPasteGo } from "react-icons/md"
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

  function handlePaste() {
    navigator.clipboard
      .readText()
      .then(res => {
        document.getElementById("contract-address-input").value = res
      })
      .catch(console.error)
  }

  // async function handleClick(e) {
  //   try {
  //     let response = await fetch(`https://api-goerli.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${accountAddress}&tag=latest&apikey=${etherscanApiKey}`)
  //     let response = await fetch(`https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractAddress_Testnet}&apikey=${etherscanApiKey}`)
  //     let data = await response.json()
  //     setAbi(JSON.parse(data.result))

  //     let result = new Contract(contractAddress_Testnet, JSON.parse(data.result), wallet)

  //     console.log(result)
  //     setContract(result)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  // async function handleWrite(e) {
  //   try {
  //     // METHOD 1
  //     // let txResponse = await contract.transfer.send(otherAccountAddress, parseEther("1"))
  //     // let txReceipt = await txResponse.wait()
  //     // console.log(txReceipt)

  //     // METHOD 2
  //     let txResponse = await contract.transfer.populateTransaction(otherAccountAddress, parseEther("1"))
  //     let staticGasLimit = await contract.transfer.estimateGas(otherAccountAddress, parseEther("1"))
  //     let nonce = await wallet.getNonce()
  //     let feeResult = await provider.getFeeData()

  //     let tx = new Transaction()
  //     tx.chainId = 5
  //     tx.data = txResponse.data
  //     tx.gasLimit = staticGasLimit
  //     tx.maxFeePerGas = feeResult.maxFeePerGas
  //     tx.maxPriorityFeePerGas = feeResult.maxPriorityFeePerGas
  //     tx.nonce = nonce
  //     tx.to = txResponse.to
  //     tx.type = 2
  //     tx.value = 0n

  //     let txPreImageHash = keccak256(tx.unsignedSerialized)
  //     let signedResult = wallet.signingKey.sign(txPreImageHash)
  //     tx.signature = signedResult

  //     let txBroadcast = await wallet.sendTransaction(tx)
  //     console.log(txBroadcast)

  //     // RETRIEVING TOKEN INFO
  //     // let result = await contract.symbol()
  //     // let result = await contract.name()
  //     // let result1 = await contract.balanceOf(accountAddress)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

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
                  <div style={{ minHeight: "55.5px", maxHeight: "55.5px" }} className="snapshot__function-content__row">
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
            <div style={{ justifyContent: "flex-start" }} className={"snapshot__function-content " + (openFunctionView == 1 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              <div style={{ margin: "20px 0px 7px 0px" }}>Import {appState.isTestnet ? "Goerli" : "Mainnet"} ERC20</div>
              <div style={{ fontSize: ".5rem", color: "gray", width: "80%", textAlign: "justify" }}>To import an ERC20 token that you already own, input the contract address pertaining to the ERC20 token in the field below. Contract address must be from a verified smart contract on Etherscan.</div>
              <div style={{ marginTop: "10px" }} className="input-container">
                <MdContentPasteGo onClick={() => handlePaste()} style={{ zIndex: "1", right: "15px", transform: "scaleX(-1)" }} className="icon icon--position-absolute" />
                <input id="contract-address-input" className="input-purple" type="text" />
              </div>
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
              🧭ERC20
            </div>{" "}
            Wallet
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
