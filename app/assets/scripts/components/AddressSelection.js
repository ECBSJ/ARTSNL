import React, { useState } from "react"

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
        <div>
          <button onClick={() => setPage(1)}>Bitcoin Address</button>
          <button onClick={() => setPage(2)}>Ethereum Address</button>
        </div>
      )}
    </>
  )
}

export default WalletSelection
