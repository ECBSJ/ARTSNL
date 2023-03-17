import "../styles/styles.css"

// IMPORTING OF REACT COMPONENTS
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"

// IMPORTING OF COMPONENTS
import Main from "./components/Main"
import Bitcoin from "./components/Bitcoin"
import WalletSelection from "./components/WalletSelection"
import Ethereum from "./components/Ethereum"
import WalletMain from "./components/WalletMain"

function App() {
  const initialState = {
    bitcoin: {
      address: null,
      bufferPrivKey: null,
      bufferPubKey: null,
      keyPair: null,
    },
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "setBufferPrivKey":
        draft.bitcoin.bufferPrivKey = action.value
        return
      case "setBufferPubKey":
        draft.bitcoin.bufferPubKey = action.value
        return
      case "setKeyPair":
        draft.bitcoin.keyPair = action.value
        return
      case "setBitcoinAddress":
        draft.bitcoin.address = action.value
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/WalletSelection" element={<WalletSelection />} />
              <Route path="/bitcoin" element={<Bitcoin />} />
              <Route path="/ethereum" element={<Ethereum />} />
              <Route path="/WalletMain" element={<WalletMain />} />
            </Routes>
          </BrowserRouter>
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
