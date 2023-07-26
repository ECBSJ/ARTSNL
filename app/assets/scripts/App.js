import "../styles/styles.css"

// IMPORTING OF REACT PACKAGES
import React, { Suspense, useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import * as bitcoin from "../../../bitcoinjs-lib"
import * as base58 from "bs58"
import { useImmerReducer } from "use-immer"
import { IconContext } from "react-icons"
import "react-tooltip/dist/react-tooltip.css"
import * as uint8arraytools from "uint8array-tools"
import * as crypto from "crypto"
import { CSSTransition } from "react-transition-group"
import { ethers } from "ethers"
import * as ecc from "tiny-secp256k1"
import ECPairFactory from "ecpair"

// IMPORTING OF COMPONENTS
import Main from "./components/Main"
import LazyLoadFallback from "./components/LazyLoadFallback"
const CreateKeys = React.lazy(() => import("./components/CreateKeys"))
const AddressSelection = React.lazy(() => import("./components/AddressSelection"))
const WalletMain = React.lazy(() => import("./components/WalletMain"))
import Menu from "./components/Menu"
const BitcoinAddress = React.lazy(() => import("./components/BitcoinAddress"))
const EthereumAddress = React.lazy(() => import("./components/EthereumAddress"))
const BtcTxBuilder = React.lazy(() => import("./components/BtcTxBuilder"))

function App() {
  // cookie setter/getter
  function setCookie(name, value, options = {}) {
    options = {
      path: "/",
      // add other defaults here if necessary
      ...options,
    }

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString()
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey
      let optionValue = options[optionKey]
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue
      }
    }

    document.cookie = updatedCookie
  }

  function getCookie(name) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"))
    return matches ? decodeURIComponent(matches[1]) : undefined
  }

  function deleteCookie(name) {
    setCookie(name, "", {
      "max-age": -1,
    })
  }

  // generate addresses from browser storage encrypted key pair
  function generateBitcoinAddress(bufferPubKey) {
    let riped = bitcoin.crypto.hash160(bufferPubKey)
    let prefix = Buffer.from("00", "hex")
    let prefix_riped = [prefix, riped]
    let combined_prefix_riped = Buffer.concat(prefix_riped)
    let checksum = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped)).slice(0, 4)
    let arr = [prefix, riped, checksum]
    let combinedBuff = Buffer.concat(arr)
    let mainnetAddress = base58.encode(combinedBuff)

    dispatch({ type: "setBitcoinAddress", value: mainnetAddress })
  }

  function generateBitcoinTestnetAddress(bufferPubKey) {
    let riped = bitcoin.crypto.hash160(bufferPubKey)
    let prefix_t = Buffer.from("6F", "hex")
    let prefix_riped_t = [prefix_t, riped]
    let combined_prefix_riped_t = Buffer.concat(prefix_riped_t)
    let checksum_t = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped_t)).slice(0, 4)
    let arr_t = [prefix_t, riped, checksum_t]
    let combinedBuff_t = Buffer.concat(arr_t)
    let testnetAddress = base58.encode(combinedBuff_t)

    dispatch({ type: "setTestnetAddress", value: testnetAddress })
  }

  function generateEthereumAddress(bufferPubKey) {
    let prepareETHpubKey = bufferPubKey.slice(1, 65)
    let keccakPubKey = ethers.keccak256(prepareETHpubKey)
    let removed_0x = keccakPubKey.slice(2)
    let prepareETHpubAdd = Buffer.from(removed_0x, "hex")
    let ETHpubAdd = prepareETHpubAdd.slice(-20)
    let finalETHpubAdd = "0x" + uint8arraytools.toHex(ETHpubAdd)

    dispatch({ type: "setEthereumAddress", value: finalETHpubAdd })
  }

  // immerReducer config
  const initialState = {
    hasBrowserStorage: false,
    isTestnet: true,
    keys: {
      bufferPrivKey: null,
      bufferPubKey: null,
    },
    bitcoin: {
      bitcoinJsNetwork: null,
      mainnetProvider: null,
      testnetProvider: null,
      activeProvider: null,
      keyPair: null,
      address: null,
      testnetAddress: null,
      txBuilder: {
        utxoData_Array: [],
        // selectedArray contains an array of selected indexes from utxoData_Array
        selectedArray: [],
        // selectedUtxoTxHex_Array contains the tx hex's of the selected utxos. Both selectedArray & selectedUtxoTxHex_Array are in same order
        selectedUtxoTxHex_Array: [],
        selectedUtxoInputSig_Array: [],
        totalUtxoValueSelected: 0,
        // output object interface
        // {
        //   validInputtedAddress: "",
        //   validInputtedAddress_Decoded: {},
        //   sendAmount: 0,
        //   scriptPubKey: ""
        // }
        outputs_Array: [],
        TXSIZE_VBYTES_CONSTANTS: {
          OVERHEAD: 10,
          INPUT: 181,
          OUTPUT: 34,
        },
        minAmountToSend: 5000, // sats denomination
        feeAmount: 0,
        estimatedRemainingAmount: 0,
      },
    },
    ethereum: {
      mainnetProvider: null,
      testnetProvider: null,
      activeProvider: null,
      address: null,
    },
    isMenuOpen: false,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "setHasBrowserStorage":
        draft.hasBrowserStorage = true
        return
      case "toggleMenu":
        draft.isMenuOpen = !draft.isMenuOpen
        return
      case "setBufferPrivKey":
        // type will always be set as Buffer
        draft.keys.bufferPrivKey = action.value
        return
      case "setBufferPubKey":
        // if not via import nor browser storage, type will be uint8array instead of Buffer
        draft.keys.bufferPubKey = action.value
        return
      case "setKeyPair":
        draft.bitcoin.keyPair = action.value
        return
      case "setBitcoinAddress":
        draft.bitcoin.address = action.value
        return
      case "setTestnetAddress":
        draft.bitcoin.testnetAddress = action.value
        return
      case "setEthereumAddress":
        draft.ethereum.address = action.value
        return
      case "setLocalStorage":
        let keyPairObject = {
          priv: uint8arraytools.toHex(draft.keys.bufferPrivKey),
          pub: uint8arraytools.toHex(draft.keys.bufferPubKey),
        }

        let tobeEncrypted = JSON.stringify(keyPairObject)

        // instantiating constants
        const secret = Date.now().toString()
        const key = crypto.createHash("sha256").update(secret).digest("hex").slice(0, 32)
        const iv = crypto.randomBytes(16).toString("hex").slice(0, 16)

        // setting constants to localStorage
        localStorage.setItem("key", key)
        localStorage.setItem("iv", iv)
        if (draft.bitcoin.address && draft.ethereum.address) {
          localStorage.setItem("coin", "both")
        } else if (draft.bitcoin.address) {
          localStorage.setItem("coin", "btc")
        } else {
          localStorage.setItem("coin", "eth")
        }

        // instantiating cipher object
        const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
        const encrypted = cipher.update(tobeEncrypted, "utf8", "hex") + cipher.final("hex")
        const authTag = cipher.getAuthTag()

        // setting authTag to localStorage
        localStorage.setItem("authTag", authTag.toString("hex"))

        // setting encrypted as cookie
        setCookie("encryptedKeyPair", encrypted, { "max-age": 3600000000000 })
        return
      case "setBitcoinJsNetwork":
        if (draft.isTestnet == false) {
          draft.bitcoin.bitcoinJsNetwork = bitcoin.networks.bitcoin
        } else {
          draft.bitcoin.bitcoinJsNetwork = bitcoin.networks.testnet
        }
        return
      case "setBitcoinProviders":
        let mempoolProvider = mempoolJS({
          hostname: "mempool.space",
        })

        let mempoolTestnetProvider = mempoolJS({
          hostname: "mempool.space",
          network: "testnet",
        })

        draft.bitcoin.mainnetProvider = mempoolProvider
        draft.bitcoin.testnetProvider = mempoolTestnetProvider
        return
      case "setEthereumProviders":
        let infuraProvider = new ethers.InfuraProvider(1, "19e6398ef2ee4861bfa95987d08fbc50")
        let infuraTestnetProvider = new ethers.InfuraProvider(5, "19e6398ef2ee4861bfa95987d08fbc50")

        draft.ethereum.mainnetProvider = infuraProvider
        draft.ethereum.testnetProvider = infuraTestnetProvider
        return
      case "toggleNetwork":
        draft.isTestnet = !draft.isTestnet
        return
      case "setActiveProvider":
        if (draft.isTestnet == false) {
          draft.bitcoin.activeProvider = draft.bitcoin.mainnetProvider
          draft.ethereum.activeProvider = draft.ethereum.mainnetProvider
        } else {
          draft.bitcoin.activeProvider = draft.bitcoin.testnetProvider
          draft.ethereum.activeProvider = draft.ethereum.testnetProvider
        }
        return
      case "importExternalKey":
        let inputtedPrivKey = action.value
        let inputtedPubKey = ecc.pointFromScalar(inputtedPrivKey, false)
        draft.keys.bufferPrivKey = inputtedPrivKey
        draft.keys.bufferPubKey = inputtedPubKey

        if (inputtedPubKey) {
          // generate bitcoin addresses
          let riped = bitcoin.crypto.hash160(inputtedPubKey)
          let prefix = Buffer.from("00", "hex")
          let prefix_riped = [prefix, riped]
          let combined_prefix_riped = Buffer.concat(prefix_riped)
          let checksum = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped)).slice(0, 4)
          let arr = [prefix, riped, checksum]
          let combinedBuff = Buffer.concat(arr)
          let mainnetAddress = base58.encode(combinedBuff)
          draft.bitcoin.address = mainnetAddress

          let prefix_t = Buffer.from("6F", "hex")
          let prefix_riped_t = [prefix_t, riped]
          let combined_prefix_riped_t = Buffer.concat(prefix_riped_t)
          let checksum_t = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped_t)).slice(0, 4)
          let arr_t = [prefix_t, riped, checksum_t]
          let combinedBuff_t = Buffer.concat(arr_t)
          let testnetAddress = base58.encode(combinedBuff_t)
          draft.bitcoin.testnetAddress = testnetAddress

          // generate ethereum address
          let prepareETHpubKey = inputtedPubKey.slice(1, 65)
          let keccakPubKey = ethers.keccak256(prepareETHpubKey)
          let removed_0x = keccakPubKey.slice(2)
          let prepareETHpubAdd = Buffer.from(removed_0x, "hex")
          let ETHpubAdd = prepareETHpubAdd.slice(-20)
          let finalETHpubAdd = "0x" + uint8arraytools.toHex(ETHpubAdd)
          draft.ethereum.address = finalETHpubAdd
        }

        return
      case "resetWallet":
        draft.hasBrowserStorage = false
        draft.isTestnet = false
        draft.keys.bufferPrivKey = null
        draft.keys.bufferPubKey = null
        draft.bitcoin.keyPair = null
        draft.bitcoin.address = null
        draft.bitcoin.testnetAddress = null
        draft.ethereum.address = null

        localStorage.clear()
        deleteCookie("encryptedKeyPair")
        return
      case "setUtxoData_Array":
        draft.bitcoin.txBuilder.utxoData_Array = action.value
        return
      case "setSelectedUtxo_Array":
        draft.bitcoin.txBuilder.selectedArray = action.value
        return
      case "setSelectedUtxoTxHex_Array":
        draft.bitcoin.txBuilder.selectedUtxoTxHex_Array = action.value
        return
      case "setTotalUtxoValueSelected":
        draft.bitcoin.txBuilder.totalUtxoValueSelected = action.value
        return
      case "setValidInputtedAddress":
        draft.bitcoin.txBuilder.validInputtedAddress = action.value
        return
      case "setValidInputtedAddress_Decoded":
        draft.bitcoin.txBuilder.validInputtedAddress_Decoded = action.value
        return
      case "setSendAmount":
        draft.bitcoin.txBuilder.outputs_Array[action.value.indexToModify].sendAmount = action.value.sendAmountValue
        return
      case "setFeeAmount":
        draft.bitcoin.txBuilder.feeAmount = action.value
        return
      case "setEstimatedRemainingAmount":
        draft.bitcoin.txBuilder.estimatedRemainingAmount = action.value
        return
      case "pushToOutputsArray":
        draft.bitcoin.txBuilder.outputs_Array.push(action.value)
        return
      case "setScriptPubKey":
        draft.bitcoin.txBuilder.outputs_Array[action.value.indexToModify].scriptPubKey = action.value.scriptPubKey
        return
      case "constructPsbtInputOutput":
        const ECPair = ECPairFactory(ecc)
        let keyPair = ECPair.fromPrivateKey(draft.keys.bufferPrivKey, {
          compressed: false,
          network: draft.bitcoin.bitcoinJsNetwork,
        })

        const validator = (pubkey, msghash, signature) => ECPair.fromPublicKey(pubkey).verify(msghash, signature)

        const psbt = new bitcoin.Psbt({ network: draft.bitcoin.bitcoinJsNetwork })

        draft.bitcoin.txBuilder.selectedArray.forEach((selectedUtxoIndex, index) => {
          psbt.addInput({
            hash: draft.bitcoin.txBuilder.utxoData_Array[selectedUtxoIndex].txid,
            index: draft.bitcoin.txBuilder.utxoData_Array[selectedUtxoIndex].vout,
            nonWitnessUtxo: Buffer.from(draft.bitcoin.txBuilder.selectedUtxoTxHex_Array[index], "hex"),
          })
        })

        // handling return address output for remaining amount
        if (draft.bitcoin.txBuilder.estimatedRemainingAmount > 0) {
          let address

          if (draft.isTestnet) {
            address = draft.bitcoin.testnetAddress
          } else {
            address = draft.bitcoin.address
          }

          let amount

          if (draft.bitcoin.txBuilder.estimatedRemainingAmount > draft.bitcoin.txBuilder.TXSIZE_VBYTES_CONSTANTS.OUTPUT) {
            amount = draft.bitcoin.txBuilder.estimatedRemainingAmount - draft.bitcoin.txBuilder.TXSIZE_VBYTES_CONSTANTS.OUTPUT
            draft.bitcoin.txBuilder.feeAmount += draft.bitcoin.txBuilder.TXSIZE_VBYTES_CONSTANTS.OUTPUT
          } else {
            amount = 1
            draft.bitcoin.txBuilder.feeAmount += draft.bitcoin.txBuilder.estimatedRemainingAmount - 1
          }

          let object = {
            validInputtedAddress: address,
            validInputtedAddress_Decoded: bitcoin.address.fromBase58Check(address),
            sendAmount: amount,
            scriptPubKey: uint8arraytools.toHex(bitcoin.address.toOutputScript(address, draft.bitcoin.bitcoinJsNetwork)),
          }

          draft.bitcoin.txBuilder.outputs_Array.push(object)
        }

        draft.bitcoin.txBuilder.outputs_Array.forEach((outputObject, index) => {
          psbt.addOutput({
            address: outputObject.validInputtedAddress,
            value: outputObject.sendAmount,
          })
        })

        draft.bitcoin.txBuilder.selectedArray.forEach((selectedUtxoIndex, index) => {
          psbt.signInput(index, keyPair)
          psbt.validateSignaturesOfInput(index, validator)

          let partialSig_signature = psbt.data.inputs[index].partialSig[0]?.signature
          draft.bitcoin.txBuilder.selectedUtxoInputSig_Array.push(uint8arraytools.toHex(partialSig_signature))
        })

        console.log(psbt)
        console.log(draft.bitcoin.txBuilder.selectedUtxoInputSig_Array)

        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  async function handleDecipher(key, iv, authTag, coin, encryptedKeyPair) {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(Buffer.from(authTag, "hex"))
    const decrypted = decipher.update(encryptedKeyPair, "hex", "utf8") + decipher.final("utf8")

    let keyPairObject = JSON.parse(decrypted)
    let bufferPubKey = null
    if (keyPairObject) {
      let bufferPrivKey = Buffer.from(keyPairObject.priv, "hex")
      bufferPubKey = Buffer.from(keyPairObject.pub, "hex")
      dispatch({ type: "setBufferPrivKey", value: bufferPrivKey })
      dispatch({ type: "setBufferPubKey", value: bufferPubKey })
    }

    if (bufferPubKey) {
      if (coin == "both") {
        generateBitcoinAddress(bufferPubKey)
        generateBitcoinTestnetAddress(bufferPubKey)
        generateEthereumAddress(bufferPubKey)
      } else if (coin == "btc") {
        generateBitcoinAddress(bufferPubKey)
        generateBitcoinTestnetAddress(bufferPubKey)
      } else {
        generateEthereumAddress(bufferPubKey)
      }
    }
  }

  useEffect(() => {
    let checkLocalStorage = localStorage.getItem("key")

    if (checkLocalStorage) {
      console.log("useEffect detected browser storage. Running decipher function.")
      dispatch({ type: "setHasBrowserStorage" })
      // get localStorage constants
      let key = localStorage.getItem("key")
      let iv = localStorage.getItem("iv")
      let authTag = localStorage.getItem("authTag")
      let coin = localStorage.getItem("coin")

      // get encrypted value from cookie
      let encryptedKeyPair = getCookie("encryptedKeyPair")

      // decipher function
      handleDecipher(key, iv, authTag, coin, encryptedKeyPair)
    } else {
      console.log("useEffect detected no browser storage.")
    }
  }, [])

  useEffect(() => {
    dispatch({ type: "setBitcoinJsNetwork" })
  }, [state.isTestnet])

  // useEffect(() => {
  //   dispatch({ type: "setBitcoinProviders" })
  //   dispatch({ type: "setEthereumProviders" })
  // }, [])

  // useEffect(() => {
  //   dispatch({ type: "setActiveProvider" })
  // }, [state.isTestnet])

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <IconContext.Provider value={{ size: "3rem" }}>
            <div className="container">
              <BrowserRouter>
                <CSSTransition in={state.isMenuOpen} timeout={300} classNames="menu__cover" unmountOnExit>
                  <Menu />
                </CSSTransition>
                <Suspense fallback={<LazyLoadFallback />}>
                  <Routes>
                    {/* <Route path="/" element={state.hasBrowserStorage ? <WalletMain /> : <Main />} /> */}
                    <Route path="/" element={<BtcTxBuilder />} />
                    <Route path="/CreateKeys" element={<CreateKeys />} />
                    <Route path="/AddressSelection" element={<AddressSelection />} />
                    <Route path="/BitcoinAddress" element={<BitcoinAddress />} />
                    <Route path="/EthereumAddress" element={<EthereumAddress />} />
                    <Route path="/WalletMain" element={<WalletMain />} />
                    <Route path="/BtcTxBuilder" element={<BtcTxBuilder />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </div>
          </IconContext.Provider>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<App />)

if (module.hot) {
  module.hot.accept()
}
