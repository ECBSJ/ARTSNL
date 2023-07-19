import React, { useEffect, useState, useContext, memo } from "react"
import Suspensify from "../Suspensify"
import StateContext from "../../StateContext"

function FeeDataDisplay({ setMinAmountTxFee }) {
  const appState = useContext(StateContext)

  const [promise, setPromise] = useState()

  async function grabData() {
    let urlForFetch

    if (appState.isTestnet) {
      urlForFetch = "https://mempool.space/testnet/api/v1/fees/recommended"
    } else {
      urlForFetch = "https://mempool.space/api/v1/fees/recommended"
    }
    let result = await fetch(urlForFetch)

    return result.json()
  }

  const onClick = () => {
    setPromise(Suspensify(grabData()))
  }

  if (promise) {
    let result = promise.read()
    result && setMinAmountTxFee(result.fastestFee)
  }

  return (
    <>
      <div onClick={() => onClick()} style={{ width: "103px", height: "34px", borderRadius: "7px", backgroundColor: "#b3670a", position: "absolute", bottom: "7px", right: "15px", fontSize: "0.6em", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Use High Fee
      </div>
    </>
  )
}

export default memo(FeeDataDisplay)
