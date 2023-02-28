import React, { useEffect, useContext, useState } from "react"
import * as bitcoin from "../../../../bitcoinjs-lib"
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { Link } from "react-router-dom"
import { sha256 } from "js-sha256"
import * as wif from "wif"

function CreateBitsPage({ setOnCreateBitsPage }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin

  const [bits, setBits] = useState()
  const [sha, setSHA] = useState()
  const [WIF, setWIF] = useState()

  async function generateSHA256() {
    let value = sha256(bits)

    if (value) {
      setSHA(value)
    }
  }

  async function generateBits2WIF() {
    let value = Buffer.from(sha, "hex")

    let WIF_key = wif.encode(128, value, true)

    let aKeyPair = ECPair.fromWIF(WIF_key, Mainnet)
    const { address } = bitcoin.payments.p2wpkh({ pubkey: aKeyPair.publicKey })
    console.log(aKeyPair)
    console.log(address)

    if (WIF_key) {
      setWIF(WIF_key)
      appDispatch({ type: "setBitcoinKey", value: aKeyPair.toWIF() })
      appDispatch({ type: "setUint8ArrayKey", value: aKeyPair })
      appDispatch({ type: "setBitcoinAddress", value: address })
    }

    setSHA("")
  }

  return (
    <>
      {sha ? (
        <>
          <div>{sha}</div>
          <button onClick={() => generateBits2WIF()}>Generate WIF Key</button>
        </>
      ) : WIF ? (
        <>
          <div>{WIF}</div>
          <div>{appState.bitcoin.privKey}</div>
          <div>This is your Private Key.</div>
          <Link to="/WalletMain">Proceed to your main wallet page.</Link>
        </>
      ) : (
        <>
          <input onChange={(e) => setBits(e.target.value)} type="text" placeholder="Input 256 bits" />
          <button onClick={() => generateSHA256()}>sha256</button>
        </>
      )}
      {appState.bitcoin.privKey ? (
        ""
      ) : (
        <>
          <button
            onClick={() => {
              setSHA("")
              setOnCreateBitsPage(false)
            }}
          >
            Back to Creation Selection
          </button>
        </>
      )}
    </>
  )
}

export default CreateBitsPage
