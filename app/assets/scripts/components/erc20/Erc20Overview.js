import React, { useEffect, useState, useContext } from "react"
import QRCode from "react-qr-code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdError, MdCheckCircle, MdLibraryBooks, MdMenu, MdContentPasteGo, MdSearch, MdVerified, MdAddCircle, MdDelete, MdHome } from "react-icons/md"
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

  const [openFunctionView, setOpenFunctionView] = useState(0)

  function handleCopyPopup() {
    document.querySelector(".icon-copy").classList.toggle("icon")
    document.querySelector(".icon-copy").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy").classList.toggle("icon")
      document.querySelector(".icon-copy").classList.toggle("icon-copy--active")
    }, 1000)
  }

  const [isFetching_Erc20, setIsFetching_Erc20] = useState(true)
  const [hasErrors_Erc20, setHasErrors_Erc20] = useState(false)

  // getter to populate and return an expanded list from the browser's erc20_List. This new list will be used to interact & display within app.
  async function handleDisplayErc20Owned() {
    if (appState.ethereum.erc20_owned_Array) {
      try {
        setIsFetching_Erc20(true)
        setHasErrors_Erc20(false)

        let array = appState.ethereum.erc20_owned_Array?.map(async function (value, index) {
          try {
            // value object struct from appState:
            // {
            //   symbol: "",
            //   name: "",
            //   contractAddress: "",
            // }

            // fetch token ABI
            let response = await fetch(`https://api${appState.isTestnet ? "-goerli" : ""}.etherscan.io/api?module=contract&action=getabi&address=${value.contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY_TOKEN}`)
            let data = await response.json()

            // init contract instance
            let contractInstance = new Contract(value.contractAddress, JSON.parse(data?.result), appState.ethereum.txBuilder.wallet)

            // fetch token balance
            // typeof balanceOf: bigint
            let balanceOf = await contractInstance.balanceOf(appState.ethereum.address)

            return {
              symbol: value.symbol,
              name: value.name,
              contractAddress: value.contractAddress,
              contractInstance: null,
              balanceOf: formatEther(balanceOf)
            }
          } catch (err) {
            console.error(err)
            setIsFetching_Erc20(false)
            setHasErrors_Erc20(true)
          }
        })

        let completedArray = await Promise.all(array)

        appDispatch({ type: "setErc20DisplayOwnedArray", value: completedArray })

        setIsFetching_Erc20(false)
        setHasErrors_Erc20(false)
      } catch (err) {
        console.error(err)
        setIsFetching_Erc20(false)
        setHasErrors_Erc20(true)
      }
    } else {
      null
    }
  }

  function handlePaste() {
    navigator.clipboard
      .readText()
      .then(res => {
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
      setIsSearchingToken(false)
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
    address: ""
  })

  async function getTokenInfo(contractInstance) {
    try {
      let symbol = await contractInstance.symbol()
      let name = await contractInstance.name()
      // typeof balanceOf: bigint
      let balanceOf = await contractInstance.balanceOf(appState.ethereum.address)

      if (symbol && name && typeof balanceOf == "bigint") {
        setTokenInfo({
          symbol: symbol,
          name: name,
          balanceOf: balanceOf == 0n ? 0 : formatEther(balanceOf),
          address: validContractAddress
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

  function handleAddToken(e) {
    // add below object struct to appState
    let newDisplayTokenObject = {
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      contractAddress: tokenInfo.address,
      contractInstance: null,
      balanceOf: tokenInfo.balanceOf
    }
    appDispatch({ type: "setNewTokenToErc20DisplayOwnedArray", value: newDisplayTokenObject })

    // display added status on button
    e.currentTarget.innerText = "Added!"

    // add to local storage array
    let newStorageTokenObject = {
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      contractAddress: tokenInfo.address
    }
    appDispatch({ type: "setNewTokenToErc20OwnedArray", value: newStorageTokenObject })
  }

  const [inputTokenTickerError, setInputTokenTickerError] = useState(false)
  const [inputTokenTickerFound, setInputTokenTickerFound] = useState(false)
  // type: erc20 displayOwned object
  const [tokenObjectToRemove, setTokenObjectToRemove] = useState({
    symbol: "",
    name: "",
    contractAddress: "",
    contractInstance: "",
    balanceOf: ""
  })

  function handleSearchTokenToRemove(ticker) {
    if (!ticker.trim()) {
      setInputTokenTickerError(false)
      setInputTokenTickerFound(false)
    } else {
      if (appState.ethereum.erc20_displayOwned_Array) {
        let tokenObjectFound = appState.ethereum.erc20_displayOwned_Array?.filter(function (tokenObject) {
          // erc20 displayOwned array structure:
          // {
          //   symbol: "",
          //   name: "",
          //   contractAddress: "",
          //   contractInstance: contractInstance,
          //   balanceOf: "",
          // }

          return ticker.toUpperCase() == tokenObject.symbol
        })

        switch (tokenObjectFound?.length) {
          case 0:
            setInputTokenTickerError(true)
            setInputTokenTickerFound(false)
            break
          case 1:
            setInputTokenTickerError(false)
            setInputTokenTickerFound(true)
            setTokenObjectToRemove(tokenObjectFound[0])
            break
          default:
            // needs handling improvement in event of multiple matching tickers
            null
            break
        }
      } else {
        setInputTokenTickerError(true)
        setInputTokenTickerFound(false)
      }
    }
  }

  function handleRemoveToken(e) {
    // remove from local storage

    // erc20 owned array structure: list of objects to be stored in browser
    // {
    //   symbol: "",
    //   name: "",
    //   contractAddress: "",
    // }
    let newStorageArray = appState.ethereum.erc20_owned_Array.filter(function (object) {
      return object.symbol != tokenObjectToRemove.symbol
    })

    localStorage.setItem("erc20_List", JSON.stringify(newStorageArray))

    // calling this dispatch should trigger handleDisplayErc20Owned() function in useEffect
    appDispatch({ type: "setErc20OwnedArray", value: newStorageArray })

    // update button text to reflect removed
    e.currentTarget.innerText = "Removed!"
  }

  const [isTokenPageOpen, setIsTokenPageOpen] = useState(false)

  function handleOpenTokenPage(e, object, index) {
    setIsTokenPageOpen(true)
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
    // retrieve erc20 list from local storage
    let hasErc20 = localStorage.getItem("hasErc20")

    if (hasErc20 === "true") {
      let erc20_List = localStorage.getItem("erc20_List")
      let array = JSON.parse(erc20_List)

      // set to appState
      appDispatch({ type: "setErc20OwnedArray", value: array })
    } else {
      setIsFetching_Erc20(false)
      setHasErrors_Erc20(false)
    }
  }, [])

  useEffect(() => {
    // asserts if browser has erc20_List and Wallet is init
    if (appState.ethereum.erc20_owned_Array && appState.ethereum.txBuilder.wallet) {
      handleDisplayErc20Owned()
    }
  }, [appState.ethereum.erc20_owned_Array, appState.ethereum.txBuilder.wallet])

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
                  <VscBracketError style={{ marginTop: "50px" }} className="icon icon--error" />
                  <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                    <p>&#x2022;Unable to retrieve ERC20 tokens information from API.</p>
                    <p>&#x2022;Please check console for error reason or click on the bottom left refresh icon.</p>
                  </div>
                </>
              ) : (
                <>
                  {appState.ethereum.erc20_displayOwned_Array ? (
                    <>
                      {appState.ethereum.erc20_displayOwned_Array.map((object, index) => {
                        return (
                          <div key={index} onClick={e => handleOpenTokenPage(e, object, index)} style={{ minHeight: "55.5px", maxHeight: "55.5px", cursor: "pointer" }} className="snapshot__function-content__row hover--font-change">
                            <div style={{ fontSize: ".8rem", color: "gray" }}>{object.symbol}</div>
                            <div>{object.balanceOf}</div>
                          </div>
                        )
                      })}
                    </>
                  ) : (
                    <div style={{ minHeight: "55.5px", maxHeight: "55.5px" }} className="snapshot__function-content__row">
                      <div style={{ fontSize: ".8rem", color: "gray" }}>No ERC20 tokens owned.</div>
                      <div></div>
                    </div>
                  )}
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
                <input onChange={e => handleInputContractAddress(e.target.value)} id="contract-address-input" className="input-purple" type="text" />
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
                      <button onClick={e => handleAddToken(e)} style={{ height: "30px", width: "140px", borderRadius: "7px", fontSize: ".7rem", backgroundColor: "#DB00FF", border: "none" }} className="display-flex">
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
            <div style={{ justifyContent: "flex-start" }} className={"snapshot__function-content " + (openFunctionView == 2 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
              <div style={{ margin: "20px 0px 7px 0px" }}>Remove {appState.isTestnet ? "Goerli" : "Mainnet"} ERC20</div>
              <div style={{ fontSize: ".5rem", color: "gray", width: "80%", textAlign: "justify" }}>To remove an ERC20 token from your wallet, input it&#39;s ticker or contract address in the field below.</div>
              <div style={{ marginTop: "10px" }} className="input-container">
                <input onChange={e => handleSearchTokenToRemove(e.target.value)} id="Tooltip" data-tooltip-content={"Use uppercase characters to search for token ticker/symbol."} className="input-purple" type="text" />
                <div className="input-validation">Search Token Ticker/Symbol</div>
                {inputTokenTickerError ? (
                  <div className="input-validation input-validation--error">
                    <MdError style={{ width: "12px", height: "12px" }} className="icon--error" />
                    &nbsp;{"Unable to find this ERC20 in your wallet."}
                  </div>
                ) : (
                  ""
                )}
                {inputTokenTickerFound ? (
                  <div className="input-validation input-validation--success">
                    <MdCheckCircle style={{ width: "14px", height: "14px" }} className="icon--checked" /> {"You currently own this token."}
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div style={{ width: "100%", height: "120px", translate: "0px 30px", padding: "17px 23px 0px 36px" }} id="token-search-results-container">
                {inputTokenTickerFound ? (
                  <>
                    <div style={{ fontSize: ".4rem", color: "lightgray" }}>SEARCH RESULTS</div>
                    <div style={{ fontSize: "1.1rem", color: "white" }} className="font--russo-one">
                      {tokenObjectToRemove.name}
                    </div>
                    <div style={{ fontSize: "1.8rem", color: "#DB00FF" }} className="font--russo-one display-flex display-flex--space-between">
                      <span>
                        ${tokenObjectToRemove.symbol} <MdVerified style={{ color: "lightgreen", width: "23px", height: "23px" }} />
                      </span>
                      <button onClick={e => handleRemoveToken(e)} style={{ height: "30px", width: "140px", borderRadius: "7px", fontSize: ".7rem", backgroundColor: "#DB00FF", border: "none" }} className="display-flex">
                        <MdDelete style={{ width: "20px", height: "20px", color: "white", marginRight: "3px" }} /> Remove token
                      </button>
                    </div>
                    <div style={{ fontSize: ".6rem", color: "lightgray" }}>
                      Tokens Owned: <span style={{ color: "white" }}>{tokenObjectToRemove.balanceOf}</span>
                    </div>
                  </>
                ) : (
                  ""
                )}
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
          <TbRefresh onClick={() => handleDisplayErc20Owned()} id="Tooltip" data-tooltip-content={"Refresh"} className="icon" />
          <MdHome onClick={() => navigate("/WalletMain")} id="Tooltip" data-tooltip-content={"Return to home"} className="icon" />
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
