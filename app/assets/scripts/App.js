import "../styles/styles.css"

// IMPORTING OF REACT PACKAGES
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"
import { IconContext } from "react-icons"
import "react-tooltip/dist/react-tooltip.css"

// IMPORTING OF COMPONENTS
import Main from "./components/Main"
import CreateKeys from "./components/CreateKeys"
import AddressSelection from "./components/AddressSelection"
import WalletMain from "./components/WalletMain"

function App() {
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
        draft.ethereum.address = active.value
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
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/CreateKeys" element={<CreateKeys />} />
                  <Route path="/AddressSelection" element={<AddressSelection />} />
                  <Route path="/WalletMain" element={<WalletMain />} />
                </Routes>
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
