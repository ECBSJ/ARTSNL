import React, { useState } from "react"
import { MdLibraryBooks } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { SiBitcoin, SiEthereum } from "react-icons/si"

// IMPORT COMPONENTS
import BitcoinAddress from "./BitcoinAddress"
import EthereumAddress from "./EthereumAddress"

function WalletSelection() {
  const [page, setPage] = useState(0)

  return (
    <>
      {page == 1 ? (
        <>
          <BitcoinAddress />
        </>
      ) : page == 2 ? (
        <>
          <EthereumAddress />
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
              <TbRefresh className="icon" />
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
