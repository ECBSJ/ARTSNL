import "../styles/styles.css"

// IMPORTING OF REACT PACKAGES
import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"
import { IconContext } from "react-icons"
import "react-tooltip/dist/react-tooltip.css"
import * as uint8arraytools from "uint8array-tools"
import * as crypto from "crypto"

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
    keys: {
      bufferPrivKey: null,
      bufferPubKey: null
    },
    bitcoin: {
      keyPair: null,
      address: null
    },
    ethereum: {
      address: null
    }
  }

  function ourReducer(draft, action) {
    switch (action.type) {
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
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <IconContext.Provider value={{ size: "3rem" }}>
            <div className="container">
              <Menu />
              <BrowserRouter>
                <Suspense fallback={<LazyLoadFallback />}>
                  <Routes>
                    <Route path="/" element={<Main />} />
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
