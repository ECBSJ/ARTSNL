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

// IMPORTING OF COMPONENTS
import Main from "./components/Main"
import LazyLoadFallback from "./components/LazyLoadFallback"
const CreateKeys = React.lazy(() => import("./components/CreateKeys"))
const AddressSelection = React.lazy(() => import("./components/AddressSelection"))
const WalletMain = React.lazy(() => import("./components/WalletMain"))
import Menu from "./components/Menu"

function App() {
  // cookie setter/getter
  function setCookie(name, value, options = {}) {
    options = {
      path: "/",
      // add other defaults here if necessary
      ...options
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
      "max-age": -1
    })
  }

  // immerReducer config
  const initialState = {
    hasBrowserStorage: false,
    isTestnet: false,
    keys: {
      bufferPrivKey: null,
      bufferPubKey: null
    },
    bitcoin: {
      mainnetProvider: null,
      testnetProvider: null,
      activeProvider: null,
      keyPair: null,
      address: null,
      testnetAddress: null
    },
    ethereum: {
      mainnetProvider: null,
      testnetProvider: null,
      activeProvider: null,
      address: null
    },
    isMenuOpen: false
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
        draft.keys.bufferPrivKey = action.value
        return
      case "setBufferPubKey":
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
          pub: uint8arraytools.toHex(draft.keys.bufferPubKey)
        }

        let tobeEncrypted = JSON.stringify(keyPairObject)

        // instantiating constants
        const secret = Date.now().toString()
        const key = crypto.createHash("sha256").update(secret).digest("hex").slice(0, 32)
        const iv = crypto.randomBytes(16).toString("hex").slice(0, 16)

        // setting constants to localStorage
        localStorage.setItem("key", key)
        localStorage.setItem("iv", iv)
        if (draft.bitcoin.address) {
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
      case "setBitcoinProviders":
        let mempoolProvider = mempoolJS({
          hostname: "mempool.space"
        })

        let mempoolTestnetProvider = mempoolJS({
          hostname: "mempool.space",
          network: "testnet"
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
      if (coin == "btc") {
        let riped = bitcoin.crypto.hash160(bufferPubKey)
        let prefix = Buffer.from("00", "hex")
        let prefix_riped = [prefix, riped]
        let combined_prefix_riped = Buffer.concat(prefix_riped)
        let checksum = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped)).slice(0, 4)
        let arr = [prefix, riped, checksum]
        let combinedBuff = Buffer.concat(arr)
        let mainnetAddress = base58.encode(combinedBuff)
        dispatch({ type: "setBitcoinAddress", value: mainnetAddress })

        let prefix_t = Buffer.from("6F", "hex")
        let prefix_riped_t = [prefix_t, riped]
        let combined_prefix_riped_t = Buffer.concat(prefix_riped_t)
        let checksum_t = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped_t)).slice(0, 4)
        let arr_t = [prefix_t, riped, checksum_t]
        let combinedBuff_t = Buffer.concat(arr_t)
        let testnetAddress = base58.encode(combinedBuff_t)
        dispatch({ type: "setTestnetAddress", value: testnetAddress })
      } else {
        let prepareETHpubKey = bufferPubKey.slice(1, 65)
        let keccakPubKey = ethers.keccak256(prepareETHpubKey)
        let removed_0x = keccakPubKey.slice(2)
        let prepareETHpubAdd = Buffer.from(removed_0x, "hex")
        let ETHpubAdd = prepareETHpubAdd.slice(-20)
        let finalETHpubAdd = "0x" + uint8arraytools.toHex(ETHpubAdd)
        dispatch({ type: "setEthereumAddress", value: finalETHpubAdd })
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
    dispatch({ type: "setBitcoinProviders" })
    dispatch({ type: "setEthereumProviders" })
  }, [])

  useEffect(() => {
    dispatch({ type: "setActiveProvider" })
  }, [state.isTestnet])

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <IconContext.Provider value={{ size: "3rem" }}>
            <div className="container">
              <CSSTransition in={state.isMenuOpen} timeout={1000} classNames="menu__cover" unmountOnExit>
                <Menu />
              </CSSTransition>
              <BrowserRouter>
                <Suspense fallback={<LazyLoadFallback />}>
                  <Routes>
                    <Route path="/" element={state.hasBrowserStorage ? <WalletMain /> : <Main />} />
                    <Route path="/CreateKeys" element={<CreateKeys />} />
                    <Route path="/AddressSelection" element={<AddressSelection />} />
                    <Route path="/WalletMain" element={<WalletMain />} />
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
