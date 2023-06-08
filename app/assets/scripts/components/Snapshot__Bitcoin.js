import React, { useEffect, useState, useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import QRCode from "react-qr-code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdCopyAll, MdOutlineArrowCircleRight } from "react-icons/md"
import { TbWalletOff } from "react-icons/tb"
import { VscBracketError } from "react-icons/vsc"
import LazyLoadFallback from "./LazyLoadFallback"

function Snapshot__Bitcoin({ isAssetDisplayOpen, setIsAssetDisplayOpen, isBitcoinWalletOpen, setIsBitcoinWalletOpen }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

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

  const [hasErrors, setHasErrors] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const [addressData_Object, setAddressData_Object] = useState({
    funded_txo_count: null,
    funded_txo_sum: null,
    spent_txo_count: null,
    spent_txo_sum: null,
    tx_count: null
  })

  const [addressDataMempool_Object, setAddressDataMempool_Object] = useState({
    funded_txo_count: null,
    funded_txo_sum: null,
    spent_txo_count: null,
    spent_txo_sum: null,
    tx_count: null
  })

  async function getBitcoinAddressData() {
    setHasErrors(false)
    setIsFetching(true)

    let address

    if (appState.isTestnet == true) {
      address = appState.bitcoin.testnetAddress
    } else {
      address = appState.bitcoin.address
    }

    try {
      let result = await appState.bitcoin.activeProvider?.bitcoin.addresses.getAddress({ address })

      if (result) {
        console.log(result)
        setAddressData_Object(addressData_Object => ({
          ...result.chain_stats
        }))
        setAddressDataMempool_Object(addressDataMempool_Object => ({
          ...result.mempool_stats
        }))
        setIsFetching(false)
      } else {
        console.error("Bitcoin address data failed to fetch from API. Reason unknown. Please try again.")
        setIsFetching(false)
        setHasErrors(true)
      }
    } catch (error) {
      console.error(error)
      setIsFetching(false)
      setHasErrors(true)
    }
  }

  const [txsDataHasErrors, setTxsDataHasErrors] = useState(false)
  const [isFetchingTxsData, setIsFetchingTxsData] = useState(false)
  const [txsData_Array, setTxsData_Array] = useState([])
  const [lastConfirmedTxDate, setLastConfirmedTxDate] = useState("n/a")

  async function getBitcoinAddressTxsData() {
    setIsFetchingTxsData(true)
    setTxsDataHasErrors(false)

    let address

    if (appState.isTestnet == true) {
      address = appState.bitcoin.testnetAddress
    } else {
      address = appState.bitcoin.address
    }

    try {
      let result = await appState.bitcoin.activeProvider?.bitcoin.addresses.getAddressTxsChain({ address })

      if (result) {
        console.log(result)
        setTxsData_Array(result)

        if (!result.length == 0) {
          let lastDate = new Date(result[0].status.block_time * 1000).toLocaleDateString()
          setLastConfirmedTxDate(lastDate)
        }

        setIsFetchingTxsData(false)
      } else {
        console.error("Bitcoin address tx history failed to fetch from API. Reason unknown. Please try again.")
        setIsFetchingTxsData(false)
        setTxsDataHasErrors(true)
      }
    } catch (error) {
      console.error(error)
      setIsFetchingTxsData(false)
      setTxsDataHasErrors(true)
    }
  }

  useEffect(() => {
    getBitcoinAddressData()
    getBitcoinAddressTxsData()
  }, [])

  return (
    <>
      <div className="snapshot__overlay">
        <div className="snapshot__function-wrapper">
          <div onClick={() => setOpenFunctionView(0)} className={"snapshot__function-titlebar snapshot__function-titlebar--orange " + (openFunctionView == 0 ? "snapshot__function-titlebar--orange--active" : "")}>
            SNAPSHOT
          </div>
          <div className={"snapshot__function-content " + (openFunctionView == 0 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
            {isFetching ? (
              <LazyLoadFallback />
            ) : hasErrors ? (
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
                  <div style={{ fontSize: ".8rem", color: "gray" }}>Value</div>
                  <div>{addressData_Object.funded_txo_sum - addressData_Object.spent_txo_sum}</div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}>Transactions</div>
                  <div>{addressData_Object.tx_count}</div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}># of UTXO</div>
                  <div>{addressData_Object.funded_txo_count - addressData_Object.spent_txo_count}</div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}>Historical rcvd</div>
                  <div>{addressData_Object.funded_txo_sum}</div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}>Historical sent</div>
                  <div>{addressData_Object.spent_txo_sum}</div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}>Tx in mempool</div>
                  <div>{addressDataMempool_Object.tx_count}</div>
                </div>
                <div className="snapshot__function-content__row">
                  <div style={{ fontSize: ".8rem", color: "gray" }}>Last confirmed tx</div>
                  <div>{txsDataHasErrors ? <div style={{ color: "red" }}>error</div> : <div>{lastConfirmedTxDate}</div>}</div>
                </div>
              </>
            )}
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
              {appState.isTestnet ? appState.bitcoin.testnetAddress : appState.bitcoin.address}
            </div>
            <div style={{ fontSize: ".5rem", color: "red", width: "80%", textAlign: "justify" }}>This BTC address is a P2PKH address. Always confirm the receiving address before broadcasting transaction. Sending BTC to the wrong address will result in loss of funds.</div>
          </div>
        </div>
        <div className="snapshot__function-wrapper">
          <div onClick={() => setOpenFunctionView(2)} className={"snapshot__function-titlebar snapshot__function-titlebar--orange " + (openFunctionView == 2 ? "snapshot__function-titlebar--orange--active" : "")}>
            SEND
          </div>
          <div className={"snapshot__function-content " + (openFunctionView == 2 ? "snapshot__function-content--display" : "snapshot__function-content--hide")}>
            {addressData_Object.funded_txo_sum - addressData_Object.spent_txo_sum > 0 ? (
              <>
                <div style={{ paddingBottom: "10px" }}>Start DIY TX</div>
                <MdOutlineArrowCircleRight style={{ width: "80px", height: "80px" }} className="icon" />
                <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                  <p>&#x2022;Before proceeding to the DIY transaction process, please have a valid P2PKH receiving address ready.</p>
                  <p>&#x2022;You still can leave BTC in this wallet as the browser&#39;s secure storage will store your key pair encrypted.</p>
                  <p>&#x2022;Highly advised to not leave large sums of value in this wallet. This wallet is still in beta production.</p>
                  <p>&#x2022;If you want, you can always backup or move your key pair by navigating to the Export option in the Menu.</p>
                </div>
              </>
            ) : (
              <>
                <div style={{ paddingBottom: "10px" }}>
                  You do not have <br /> any BTC to send.
                </div>
                <TbWalletOff onClick={() => setOpenFunctionView(1)} style={{ width: "80px", height: "80px" }} className="icon" />
                <div style={{ width: "80%", fontSize: ".56rem", color: "gray", textAlign: "justify", paddingTop: "10px" }}>
                  <p>&#x2022;Navigate to the Receive tab to fund your BTC wallet in order to construct a transaction.</p>
                  <p>&#x2022;If you don&#39;t want to fund this wallet with mainnet UTXOs, you can switch to the testnet to use tBTC.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Snapshot__Bitcoin
