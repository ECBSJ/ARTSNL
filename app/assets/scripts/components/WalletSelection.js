import React, { useEffect } from "react"
import { Link } from "react-router-dom"

function WalletSelection() {
  return (
    <>
      <div>
        <Link to="/bitcoin">Bitcoin</Link>
        <Link to="/ethereum">Ethereum</Link>
      </div>
    </>
  )
}

export default WalletSelection
