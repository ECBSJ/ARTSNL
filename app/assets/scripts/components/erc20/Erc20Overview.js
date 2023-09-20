import React, { useEffect, useState, useContext } from "react"
import QRCode from "react-qr-code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdError, MdCheckCircle, MdLibraryBooks, MdMenu, MdContentPasteGo, MdSearch, MdVerified, MdAddCircle } from "react-icons/md"
import { BsHddNetworkFill, BsHddNetwork, BsReception1, BsReception4 } from "react-icons/bs"
import { TbWalletOff, TbRefresh } from "react-icons/tb"
import { VscBracketError } from "react-icons/vsc"
import { isAddress, Contract, formatEther } from "ethers"
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
      .then((res) => {
        document.getElementById("contract-address-input").value = res
        handleInputContractAddress(res)
      })
      .catch(console.error)
  }

  const [inputContractAddressError, setInputContractAddressError] = useState("")
  const [isContractAddressValid, setIsContractAddressValid] = useState(false)
  const [validContractAddress, setValidContractAddress] = useState("")

  function handleInputContractAddress(value) {
    if (!value.trim()) {
      setInputContractAddressError("")
      setIsContractAddressValid(false)
      setValidContractAddress("")
    } else {
      if (value.startsWith("0x")) {
        if (value.length == 42) {
          try {
            if (isAddress(value)) {
              // valid ethereum address
              setInputContractAddressError("")
              setIsContractAddressValid(true)
              setValidContractAddress(value)
            } else {
              setInputContractAddressError("Invalid address. Try another.")
              setValidContractAddress("")
            }
          } catch (err) {
            console.error(err)
            setInputContractAddressError("Invalid address. Try another.")
            setValidContractAddress("")
          }
        } else {
          setIsContractAddressValid(false)
          setInputContractAddressError("Invalid contract address length")
          setValidContractAddress("")
        }
      } else {
        setIsContractAddressValid(false)
        setInputContractAddressError("Invalid contract address")
        setValidContractAddress("")
      }
    }
  }

  const [tokenSearchError, setTokenSearchError] = useState(false)
  const [isSearchingToken, setIsSearchingToken] = useState(false)
  const [hasTokenSearchResult, setHasTokenSearchResult] = useState(false)

  async function handleTokenSearch() {
    try {
      setTokenSearchError(false)
      setIsSearchingToken(true)
      setHasTokenSearchResult(false)

      // fetch ABI
      let response = await fetch(`https://api${appState.isTestnet ? "-goerli" : ""}.etherscan.io/api?module=contract&action=getabi&address=${validContractAddress}&apikey=${process.env.ETHERSCAN_API_KEY_TOKEN}`)
      let data = await response.json()

      // init Contract Instance
      let contractInstance = new Contract(validContractAddress, JSON.parse(data.result), appState.ethereum.txBuilder.wallet)

      // fetch token info
      contractInstance && getTokenInfo(contractInstance)
    } catch (err) {
      console.error(err)
      setTokenSearchError(true)
      setIsSearchingToken(false)
    }
  }

  const [tokenInfo, setTokenInfo] = useState({
    symbol: "",
    name: "",
    balanceOf: "",
  })

  async function getTokenInfo(contractInstance) {
    try {
      let symbol = await contractInstance.symbol()
      let name = await contractInstance.name()
      // typeof balanceOf: bigint
      let balanceOf = await contractInstance.balanceOf(appState.ethereum.address)

      if (symbol && name && balanceOf) {
        setTokenInfo({
          symbol: symbol,
          name: name,
          balanceOf: formatEther(balanceOf),
        })

        setIsSearchingToken(false)
        setTokenSearchError(false)
        setHasTokenSearchResult(true)
      }
    } catch (err) {
      console.error(err)
      setIsSearchingToken(false)
      setTokenSearchError(true)
    }
  }

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

  useEffect(() => {
    appDispatch({ type: "initWalletClass" })
  }, [])

  useEffect(() => {
    if (isContractAddressValid) {
      handleTokenSearch()
    }
  }, [isContractAddressValid])

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
                {isContractAddressValid && validContractAddress ? <MdSearch onClick={() => handleTokenSearch()} style={{ zIndex: "1", right: "60px", transform: "scaleX(-1)" }} className="icon icon--position-absolute" /> : ""}
                <input onChange={(e) => handleInputContractAddress(e.target.value)} id="contract-address-input" className="input-purple" type="text" />
                <div className="input-validation">Input Contract Address</div>
                {inputContractAddressError ? (
                  <div className="input-validation input-validation--error">
                    <MdError style={{ width: "12px", height: "12px" }} className="icon--error" />
                    &nbsp;{inputContractAddressError}
                  </div>
                ) : (
                  ""
                )}
                {isContractAddressValid && validContractAddress ? (
                  <div className="input-validation input-validation--success">
                    <MdCheckCircle style={{ width: "14px", height: "14px" }} className="icon--checked" /> {"Accepted contract address format."}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div style={{ width: "100%", height: "120px", translate: "0px 30px", padding: "17px 23px 0px 36px" }} id="token-search-results-container">
                {isSearchingToken ? (
                  <LazyLoadFallback />
                ) : tokenSearchError ? (
                  <>
                    <div style={{ fontSize: ".6rem", color: "red" }}>
                      <MdError style={{ width: "12px", height: "12px", marginRight: "3px" }} className="icon--error" />
                      Error searching for contract address. Confirm you are inputting the correct contract address.
                    </div>
                  </>
                ) : hasTokenSearchResult ? (
                  <>
                    <div style={{ fontSize: ".4rem", color: "lightgray" }}>SEARCH RESULTS</div>
                    <div style={{ fontSize: "1.1rem", color: "white" }} className="font--russo-one">
                      {tokenInfo.name}
                    </div>
                    <div style={{ fontSize: "1.8rem", color: "#DB00FF" }} className="font--russo-one display-flex display-flex--space-between">
                      <span>
                        ${tokenInfo.symbol} <MdVerified style={{ color: "lightgreen", width: "23px", height: "23px" }} />
                      </span>
                      <button style={{ height: "30px", width: "140px", borderRadius: "7px", fontSize: ".7rem", backgroundColor: "#DB00FF", border: "none" }} className="display-flex">
                        <MdAddCircle style={{ width: "20px", height: "20px", color: "white", marginRight: "3px" }} /> Add ERC20
                      </button>
                    </div>
                    <div style={{ fontSize: ".6rem", color: "lightgray" }}>
                      Tokens Owned: <span style={{ color: "white" }}>{tokenInfo.balanceOf}</span>
                    </div>
                  </>
                ) : (
                  ""
                )}
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
