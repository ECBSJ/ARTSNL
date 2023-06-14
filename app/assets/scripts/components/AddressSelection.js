import React, { useState, useContext } from "react"
import { MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { SiBitcoin, SiEthereum } from "react-icons/si"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

// IMPORT COMPONENTS
import BitcoinAddress from "./BitcoinAddress"
import EthereumAddress from "./EthereumAddress"

function WalletSelection() {
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [page, setPage] = useState(0)

  return (
    <>
      {page == 1 ? (
        <>
          <BitcoinAddress setPage={setPage} />
        </>
      ) : page == 2 ? (
        <>
          <EthereumAddress setPage={setPage} />
        </>
      ) : (
        <>
          <div className="interface__block">
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell"></div>
          </div>
          <div className="interface__block">
            <div className="interface__block-cell">
              <button className="button-orange button--smaller-font" onClick={() => setPage(1)}>
                Bitcoin Address
                <SiBitcoin className="btc-logo" />
              </button>
            </div>
            <div className="interface__block-cell">OR</div>
            <div className="interface__block-cell">
              <button className="button-blue button--smaller-font" onClick={() => setPage(2)}>
                Ethereum Address
                <SiEthereum className="eth-logo" />
              </button>
            </div>
          </div>
          <div className="interface__block">
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell interface__block-cell__footer">
              <TbRefresh
                onClick={() => {
                  appDispatch({ type: "setBufferPrivKey", value: null })
                  appDispatch({ type: "setBufferPubKey", value: null })
                  navigate("/CreateKeys")
                }}
                className="icon"
              />
              <div className="icon">ARTSNL</div>
              <MdLibraryBooks className="icon" />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default WalletSelection
