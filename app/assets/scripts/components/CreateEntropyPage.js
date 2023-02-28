import React, { useEffect, useState, useContext } from "react"
import * as bitcoin from "../../../../bitcoinjs-lib"
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"
import * as crypto from "crypto"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { Link } from "react-router-dom"

function CreateEntropyPage({ setOnCreateEntropyPage }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin

  const [entropy, setEntropy] = useState()

  async function handleCreateEntropy() {
    const randomBytes = crypto.randomBytes(32)
    console.log(randomBytes.toString("hex"))
    setEntropy(randomBytes)
  }

  async function handleCreateKey() {
    const key = ECPair.fromPrivateKey(entropy, Mainnet)
    console.log(key)
    console.log(key.toWIF())
    appDispatch({ type: "setUint8ArrayKey", value: key })
    appDispatch({ type: "setBitcoinKey", value: key.toWIF() })

    const { address } = bitcoin.payments.p2wpkh({ pubkey: key.publicKey })
    console.log(address)
    appDispatch({ type: "setBitcoinAddress", value: address })

    setEntropy(false)
  }

  return (
    <>
      {!appState.bitcoin.privKey ? <button onClick={handleCreateEntropy}>Create Entropy</button> : ""}
      {entropy ? <div>{entropy.toString("hex")}</div> : ""}
      {entropy ? <button onClick={handleCreateKey}>Accept Entropy</button> : ""}
      {appState.bitcoin.privKey ? (
        <div>
          <div>{appState.bitcoin.privKey}</div>
          <div>This is your Private Key.</div>
          <Link to="/WalletMain">Proceed to your main wallet page.</Link>
        </div>
      ) : (
        <button
          onClick={() => {
            setOnCreateEntropyPage(false)
            setEntropy("")
          }}
        >
          Back to Creation Selection
        </button>
      )}
    </>
  )
}

export default CreateEntropyPage
