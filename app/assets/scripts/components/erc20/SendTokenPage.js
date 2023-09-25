import React, { useEffect, useState, useContext, useRef, useMemo } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

import { Tooltip } from "react-tooltip"
import { IconContext } from "react-icons"
import { FaQuestionCircle, FaGasPump } from "react-icons/fa"
import { MdCheckCircle, MdError, MdContentPasteGo, MdQrCodeScanner } from "react-icons/md"
import { isAddress, formatEther, Contract, parseEther } from "ethers"

import QRreaderPopup from "../QRreaderPopup"
import LazyLoadFallback from "../LazyLoadFallback"

function SendTokenPage({ tokenObjectToOpen, setIsSendTokenPageOpen, isSendTokenPageOpen }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [toInputError, setToInputError] = useState("")
  const [isToInputValid, setIsToInputValid] = useState(false)
  const [inputtedValidTo, setInputtedValidTo] = useState("")

  const [openQRreader, setOpenQRreader] = useState(false)
  const [scannedValue, setScannedValue] = useState()

  function handleToInput(value) {
    if (!value.trim()) {
      setToInputError("")
      setIsToInputValid(false)
      setInputtedValidTo("")
    } else {
      if (value.startsWith("0x")) {
        if (value.length == 42) {
          try {
            if (isAddress(value)) {
              // valid ethereum address
              setToInputError("")
              setIsToInputValid(true)
              setInputtedValidTo(value)
            } else {
              setToInputError("Invalid address. Try another.")
              setInputtedValidTo("")
            }
          } catch (err) {
            console.error(err)
            setToInputError("Invalid address. Try another.")
            setInputtedValidTo("")
          }
        } else {
          setIsToInputValid(false)
          setToInputError("Invalid address length")
          setInputtedValidTo("")
        }
      } else {
        setIsToInputValid(false)
        setToInputError("Invalid ethereum address")
        setInputtedValidTo("")
      }
    }
  }

  function handlePaste() {
    navigator.clipboard
      .readText()
      .then((res) => {
        document.getElementById("to-input-grab").value = res
        handleToInput(res)
      })
      .catch(console.error)
  }

  const [tokenContractInstance, setTokenContractInstance] = useState()
  const [loadingContractInstance, setLoadingContractInstance] = useState(true)
  const [contractInstanceError, setContractInstanceError] = useState(false)

  async function initContractInstance() {
    try {
      // fetch token ABI
      let response = await fetch(`https://api${appState.isTestnet ? "-goerli" : ""}.etherscan.io/api?module=contract&action=getabi&address=${tokenObjectToOpen.contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY_TOKEN}`)
      let data = await response.json()

      // init contract instance
      let contractInstance = new Contract(tokenObjectToOpen.contractAddress, JSON.parse(data?.result), appState.ethereum.txBuilder.wallet)
      contractInstance && setTokenContractInstance(contractInstance)
      console.log(contractInstance)

      setLoadingContractInstance(false)
      setContractInstanceError(false)
    } catch (err) {
      console.error(err)
      setLoadingContractInstance(false)
      setContractInstanceError(true)
    }
  }

  useMemo(() => {
    initContractInstance()
  }, [])

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

  // below types: bigint
  const [gasLimit, setGasLimit] = useState()
  const [maxFeePerGas, setMaxFeePerGas] = useState()
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState()
  const [totalFee, setTotalFee] = useState()
  const [fetchFeeDataProgress, setFetchFeeDataProgress] = useState("loading")

  async function fetchNetworkFeeData() {
    try {
      setFetchFeeDataProgress("loading")

      // all result types in bigint
      let staticGasLimit = await tokenContractInstance?.transfer.estimateGas("0x38f5c4ca0db4b79a87257e06657e371bbba5ff99", parseEther("1"))
      let feeResult = await appState.ethereum.activeProvider.getFeeData()

      if (staticGasLimit && feeResult) {
        console.log(feeResult)
        setGasLimit(staticGasLimit)
        setMaxFeePerGas(feeResult.maxFeePerGas)
        setMaxPriorityFeePerGas(feeResult.maxPriorityFeePerGas)

        setTotalFee(staticGasLimit * feeResult.maxFeePerGas)

        setFetchFeeDataProgress("success")
      }
    } catch (err) {
      console.error(err)
      setFetchFeeDataProgress("error")
    }
  }

  useEffect(() => {
    if (tokenContractInstance) {
      fetchNetworkFeeData()
    }
  }, [tokenContractInstance])

  // both totalFee & maxAmnt in bigint wei
  const [maxAmnt, setMaxAmnt] = useState()

  function handleMaxAmnt(e) {
    document.querySelector(".data-type-selector-container--box").classList.toggle("box-selected")

    // type tokenObjectToOpen.balanceOf: ether string
    setMaxAmnt(tokenObjectToOpen.balanceOf)

    inputSendAmntValidation(tokenObjectToOpen.balanceOf)

    setTimeout(() => {
      document.querySelector(".data-type-selector-container--box").classList.toggle("box-selected")
    }, 1000)
  }

  const [inputSendAmntError, setInputSendAmntError] = useState(false)
  const [inputtedValidSendAmnt, setInputtedValidSendAmnt] = useState(null)

  function inputSendAmntValidation(value) {
    // value value should be in ether format

    let maxLimit = tokenObjectToOpen.balanceOf
    let minLimit = formatEther(0)

    if (!value.trim()) {
      setInputSendAmntError(false)
      setInputtedValidSendAmnt(null)
    } else {
      if (value > minLimit && value <= maxLimit) {
        // value within range is valid
        setInputSendAmntError(false)
        setInputtedValidSendAmnt(value)
      } else {
        setInputSendAmntError(true)
        setInputtedValidSendAmnt(null)
      }
    }
  }

  const [preparedToSend, setPreparedToSend] = useState(false)

  useEffect(() => {
    if (isToInputValid && inputtedValidSendAmnt && appState.ethereum.currentBalance > totalFee) {
      setPreparedToSend(true)
    } else {
      setPreparedToSend(false)
    }
  }, [isToInputValid, inputtedValidSendAmnt, totalFee])

  return (
    <>
      {openQRreader ? <QRreaderPopup setInputValue={handleToInput} setScannedValue={setScannedValue} openQRreader={openQRreader} setOpenQRreader={setOpenQRreader} /> : ""}

      <div style={{ backgroundColor: "#101115", zIndex: "102" }} className="tx-builder__overlay">
        <IconContext.Provider value={{ size: "15px" }}>
          {loadingContractInstance ? (
            <LazyLoadFallback />
          ) : contractInstanceError ? (
            <>
              <div style={{ color: "red", width: "80%" }}>Error initializing ${tokenObjectToOpen.symbol} contract instance.</div>
            </>
          ) : (
            <>
              <div className="tx-builder__overlay__outer">Send ERC20 Token Form</div>
              <div className="tx-builder__blueprint">
                <p style={{ position: "absolute", top: "-8px", left: "28px", color: "#c600ff", fontSize: ".7rem", cursor: "default" }}>All fields required.</p>
                <div className="tx-builder__blueprint-dashboard">
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.to</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="Input a valid Ethereum address" className="icon" />
                      <MdContentPasteGo id="Tooltip" data-tooltip-content="Paste ethereum address from clipboard" onClick={() => handlePaste()} className="icon" />
                      <MdQrCodeScanner onClick={() => setOpenQRreader(!openQRreader)} id="Tooltip" data-tooltip-content="Scan QR code of ethereum address" className="icon" />
                      {toInputError ? (
                        <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "red", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                          {toInputError}
                          <MdError className="icon--error" />
                        </span>
                      ) : (
                        ""
                      )}

                      {isToInputValid ? (
                        <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "greenyellow", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                          Valid ethereum address
                          <MdCheckCircle className="icon--checked" />
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input autoFocus id="to-input-grab" onChange={(e) => handleToInput(e.target.value)} className="eth-txBuilder-input" value={scannedValue ? scannedValue : undefined} onFocus={() => setScannedValue()} type="text" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.value</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="Input the amount of tokens you want to send" className="icon" />
                      <div className="data-type-selector-container display-flex">
                        <span style={{ color: "white" }} onClick={(e) => handleMaxAmnt(e)} className={"data-type-selector-container--box"}>
                          MAX AMNT
                        </span>
                      </div>

                      {inputSendAmntError ? (
                        <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "red", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                          Value out of valid range
                          <MdError className="icon--error" />
                        </span>
                      ) : (
                        ""
                      )}

                      {!inputSendAmntError && inputtedValidSendAmnt ? (
                        <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "greenyellow", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                          Send amount in range
                          <MdCheckCircle className="icon--checked" />
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      <input onChange={(e) => inputSendAmntValidation(e.target.value)} className="eth-txBuilder-input" value={maxAmnt ? maxAmnt : undefined} onFocus={() => setMaxAmnt()} type="number" />
                    </div>
                  </div>
                  <div className="tx-builder__blueprint-dashboard__input-field">
                    <div className="tx-builder__blueprint-dashboard__input-field-top">
                      <span>tx.fees</span>
                      <FaQuestionCircle id="Tooltip" data-tooltip-content="The below represents the conservative estimated total amount of gas fees [gasLimit x maxFeePerGas] you will pay based on current network congestion." className="icon" />
                      <FaGasPump id="Tooltip" data-tooltip-content="Adjusting gas fee is currently unavailable." className="icon" />

                      {appState.ethereum.currentBalance < totalFee ? (
                        <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "red", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                          Not enough ${appState.isTestnet ? "gETH" : "ETH"} for gas fees.
                          <MdError className="icon--error" />
                        </span>
                      ) : (
                        ""
                      )}

                      {appState.ethereum.currentBalance > totalFee ? (
                        <span style={{ right: "5px", top: "8px", justifyContent: "flex-end", color: "greenyellow", columnGap: "3px", fontSize: ".8em" }} className="position-absolute display-flex">
                          You have enough {appState.isTestnet ? "gETH" : "ETH"} to pay fees.
                          <MdCheckCircle className="icon--checked" />
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="tx-builder__blueprint-dashboard__input-field-bottom">
                      {fetchFeeDataProgress == "loading" ? (
                        <LazyLoadFallback />
                      ) : fetchFeeDataProgress == "error" ? (
                        <span style={{ color: "red", marginLeft: "14px", fontFamily: "monospace" }}>Error estimating gas fee</span>
                      ) : (
                        <>
                          <input className="eth-txBuilder-input" value={totalFee ? totalFee.toString() : ""} readOnly type="number" />
                          <span style={{ position: "absolute", right: "4px", bottom: "4px", cursor: "default", color: "#8746a6" }}>wei</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ visibility: "hidden" }} className="tx-builder__blueprint-dashboard__input-field"></div>
                </div>
                <p style={{ position: "absolute", bottom: "10px", left: "28px", fontSize: "0.6em" }}>
                  <span style={{ color: "gray" }}>Current ${tokenObjectToOpen.symbol} Balance:</span> {tokenObjectToOpen.balanceOf}
                </p>
                <p style={{ position: "absolute", bottom: "-4px", left: "28px", fontSize: "0.6em" }}>
                  <span style={{ color: "gray" }}>Current {appState.isTestnet ? "gETH" : "ETH"} Available:</span> {formatEther(appState.ethereum.currentBalance)}
                </p>
              </div>
            </>
          )}

          <div className="tx-builder__overlay__outer">{preparedToSend ? <button>Send</button> : ""}</div>
        </IconContext.Provider>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word", zIndex: "103" }} variant="info" />
    </>
  )
}

export default SendTokenPage
