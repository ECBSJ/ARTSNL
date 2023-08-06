import React, { useState, useTransition, useEffect, useRef, useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import * as bitcoin from "../../../../bitcoinjs-lib"
import * as crypto from "crypto"
import { Link } from "react-router-dom"
import * as wif from "wif"
import { sha256 } from "js-sha256"
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"
import * as uint8arraytools from "uint8array-tools"
import * as base58 from "bs58"
import { decodeRlp, encodeRlp, ethers, formatEther, parseEther, Signature, Transaction, Wallet } from "ethers"
import { MdNavigateNext, MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { IconContext } from "react-icons"
import { SiBitcoin, SiEthereum } from "react-icons/si"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Tooltip } from "react-tooltip"
import ModalDropDown from "./ModalDropDown"
import { CSSTransition } from "react-transition-group"
import * as bip38 from "bip38"
import { FaBitcoin, FaEthereum } from "react-icons/fa"
import { BsHddNetworkFill, BsHddNetwork, BsReception1, BsReception4 } from "react-icons/bs"

function Main() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [page, setPage] = useState(0)
  const pages = [1, 2, 3, 4, 5, 6]

  // const ECPair = ECPairFactory(ecc)
  // const Mainnet = bitcoin.networks.bitcoin
  // let Testnet = bitcoin.networks.testnet

  // let testnetKeyPair = ECPair.fromWIF(testnetPrivKey, Testnet)
  // const p2pkhObject = bitcoin.payments.p2pkh({ pubkey: testnetKeyPair.publicKey, network: Testnet })

  // const validator = (pubkey, msghash, signature) => ECPair.fromPublicKey(pubkey).verify(msghash, signature)

  // const psbt = new bitcoin.Psbt({ network: Testnet })

  // psbt.addInput({
  //   hash: "a296be122cc5c90bfc7e50f65b2c2e12d231a761d69ff05ec8a05b48f6f16b9a",
  //   index: 0,
  //   nonWitnessUtxo: Buffer.from("02000000000101fc17bccc0117b0d0f1955d6ac84d1bf47399f77d6a8944f73c3ab0bb8c035a320100000000feffffff02a8160000000000001976a914727c2e0ba76f7cea7b41ab920eec10117a35370388acf2d71300000000001976a914845b731431f519d2856ccc481087621eda16cc8a88ac0247304402206d0d4095dd5b45a84b01eadafce1ba87d6ebb2b51c43ace4982867a84991b83c02206bab4d2ae888deb8282149de576beadbced24b53e1285699f051dcfd0736d0f10121037955b1e146d3f87f4ebb897e6fbdd34ce2abe63641aea18aaa774c6a40d63b6639252500", "hex"),
  // })

  // psbt.addInput({
  //   hash: "9153e5420b1092ff65d90a028df8840e0e3dfc8b9c8e1c1c0664e02f000c5def",
  //   index: 0,
  //   nonWitnessUtxo: Buffer.from("02000000000101e46381154e9fcc1dec31a5edb6afd23063508c83b647c80b01433709440482740000000000feffffff0284350000000000001976a914727c2e0ba76f7cea7b41ab920eec10117a35370388acfb1b1500000000001976a914428d17adc0c17119b9f5c5689b61cd094b00c7e088ac0247304402201ffb958b864bcf2ac92b6f6485c6bc0cf9e9a9d223ee913fdb88eaa9945a670402203c80ae2cb29696cdbb4ac25d8ffb92f7811636197900bb5633591870587c5b65012103f2ebb8d108f78594dd2829f9e283e1977f226165d985278a6aa8ecc91302e3c1d7252500", "hex")
  // })

  // psbt.addOutput({
  //   address: "mx4k2ersuW9k3uc4ybNEEB1TsQ1qJkMZ4w",
  //   value: 13000
  // })

  // psbt.signInput(0, testnetKeyPair)
  // psbt.validateSignaturesOfInput(0, validator)
  // let partialSig_signature = psbt.data.inputs[0].partialSig[0].signature
  // let partialSig_pubkey = psbt.data.inputs[0].partialSig[0].pubkey
  // psbt.signInput(1, testnetKeyPair)
  // psbt.validateSignaturesOfInput(1, validator)
  // psbt.finalizeAllInputs()
  // has finalScriptSig
  // console.log(psbt)

  // const transactionHEX = psbt.extractTransaction().toHex()
  // const raw = psbt.extractTransaction()
  // console.log(raw)
  // console.log(transactionHEX)

  // let keyPairObject = {
  //   priv: static_eth_privKey,
  //   pub: static_eth_pubKey,
  //   add: static_eth_add
  // }

  // let tobeEncrypted = JSON.stringify(keyPairObject)

  // const tobeEncrypted = "some secret string"

  let btc = true

  async function handleCipher(tobeEncrypted) {
    // instantiating constants
    const secret = Date.now().toString()
    const key = crypto.createHash("sha256").update(secret).digest("hex").slice(0, 32)
    const iv = crypto.randomBytes(16).toString("hex").slice(0, 16)

    // setting constants to localStorage
    localStorage.setItem("key", key)
    localStorage.setItem("iv", iv)
    if (btc) {
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
    setCookie("encryptedKeyPair", encrypted, { "max-age": 36000000 })
  }

  async function handleDecipher(key, iv, authTag, coin, encryptedKeyPair) {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(Buffer.from(authTag, "hex"))
    const decrypted = decipher.update(encryptedKeyPair, "hex", "utf8") + decipher.final("utf8")
    console.log(decrypted)
    console.log(coin)
  }

  // useEffect(() => {
  //   let checkLocalStorage = localStorage.getItem("key")

  //   if (checkLocalStorage) {
  //     // get localStorage constants
  //     let key = localStorage.getItem("key")
  //     let iv = localStorage.getItem("iv")
  //     let authTag = localStorage.getItem("authTag")
  //     let coin = localStorage.getItem("coin")

  //     // get encrypted value from cookie
  //     let encryptedKeyPair = getCookie("encryptedKeyPair")

  //     // decipher function
  //     handleDecipher(key, iv, authTag, coin, encryptedKeyPair)
  //   }
  // }, [])

  // let privateKey = crypto.randomBytes(32)
  // // for WIF testnet: 239
  // let wifResult = wif.encode(128, privateKey, false)
  // let result = ecc.pointFromScalar(privateKey, false)

  // // btc pubkey to address
  // let riped = bitcoin.crypto.hash160(result)
  // let prefix = Buffer.from("6F", "hex")
  // let prefix_riped = [prefix, riped]
  // let combined_prefix_riped = Buffer.concat(prefix_riped)
  // let checksum = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped)).slice(0, 4)
  // let arr = [prefix, riped, checksum]
  // let combinedBuff = Buffer.concat(arr)
  // let address = base58.encode(combinedBuff)

  // eth pubkey to address
  // let prepareETHpubKey = result.slice(1, 65)
  // let keccakPubKey = ethers.keccak256(prepareETHpubKey)
  // let removed_0x = keccakPubKey.slice(2)
  // let prepareETHpubAdd = Buffer.from(removed_0x, "hex")
  // let ETHpubAdd = prepareETHpubAdd.slice(-20)
  // let finalETHpubAdd = "0x" + uint8arraytools.toHex(ETHpubAdd)

  // PUBLIC KEY POINT ON CURVE
  // let xCoordinate = result.slice(1, 33)
  // let yCoordinate = result.slice(33, 65)
  // console.log("(" + uint8arraytools.toHex(xCoordinate) + ", " + uint8arraytools.toHex(yCoordinate) + ")")

  // proper binary to decimal to hex to buffer conversion
  let binary = "1010100101000101011010101101010010100101010010010100111010100101001010010101110010100100101010010100101001111011001010100101001010010100101001010010100111100001010101001010101010010101011001111100101010010101010010101111001010100101010010100101111010101010"
  // let bigIntBinary = BigInt("0b" + binary)
  // let decimalString = bigIntBinary.toString(10)
  // let hexString = bigIntBinary.toString(16)
  // let privateKeyBuffer = Buffer.from(hexString, "hex")
  // let keyPair = ECPair.fromPrivateKey(privateKeyBuffer, Mainnet)
  // let eccPubKeyBuffer = ecc.pointFromScalar(privateKeyBuffer, true)

  // USING OBJECTS IN USESTATE
  // const [someObject, setSomeObject] = useState({
  //   key0: "value0",
  // })
  // console.log(someObject)

  // function handleObjectUpdate() {
  //   let newObject = {
  //     key1: "value1",
  //     key2: "value2",
  //     key3: "value3",
  //   }

  //   setSomeObject((someObject) => ({
  //     ...newObject,
  //   }))

  //   console.log(someObject)
  // }

  // useEffect(() => {
  //   handleObjectUpdate()
  // }, [])

  async function handleStoredKeysBrowserStorage() {
    let wallet = new ethers.Wallet(static_eth_privKey)
    let encryptedJSON = null
    let decryptedWallet = null
    let secret = Date.now().toString()
    localStorage.setItem("secret", secret)

    await wallet
      .encrypt(secret)
      .then(res => {
        encryptedJSON = res
        setCookie("key", encryptedJSON, { "max-age": 36000 })
      })
      .catch(console.error)

    if (encryptedJSON) {
      await ethers.Wallet.fromEncryptedJson(encryptedJSON, secret).then(res => (decryptedWallet = res))
    }

    console.log(secret)
    console.log(JSON.parse(encryptedJSON))
  }

  async function decryptStoredKeys() {
    let secret = localStorage.getItem("secret")
    let keyStore = getCookie("key")

    if (typeof secret == "string" && typeof keyStore == "string") {
      await ethers.Wallet.fromEncryptedJson(keyStore, secret).then(res => console.log(res))
    }
  }

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

  // const [showKeccak, setShowKeccak] = useState(false)
  // const [inputtedKeccak256, setInputtedKeccak256] = useState("")

  // const [showAddress, setShowAddress] = useState(false)
  // const [isAddressPending, setIsAddressPending] = useState(false)

  // const [isModalDropDownOpen, setIsModalDropDownOpen] = useState(false)
  // const modalDropDownRef = useRef()

  // async function handleKeccak() {
  //   document.querySelector("#setLoading").classList.add("text--loading")
  //   document.querySelector("#keccak256").innerText = "Preparing message schedule..."
  //   document.querySelector("#keccak256").classList.remove("button-blue")
  //   document.querySelector("#keccak256").classList.add("blue-capsule")
  //   document.querySelector("#keccak256").classList.add("blue-capsule--visible")
  //   document.querySelector("#keccak256").classList.add("blue-capsule__progress-1")

  //   setTimeout(() => {
  //     document.querySelector("#keccak256").classList.remove("blue-capsule__progress-1")

  //     document.querySelector("#keccak256").innerText = "Applying keccak256..."
  //     document.querySelector("#keccak256").classList.add("blue-capsule__progress-2")
  //   }, 1000)

  //   setTimeout(() => {
  //     document.querySelector("#keccak256").classList.remove("blue-capsule__progress-2")

  //     document.querySelector("#keccak256").innerText = "Formatting hash result..."
  //     document.querySelector("#keccak256").classList.add("blue-capsule__progress-3")
  //   }, 2000)

  //   setTimeout(() => {
  //     document.querySelector("#keccak256").classList.remove("blue-capsule__progress-3")

  //     document.querySelector("#keccak256").innerText = "Completed keccak256!"
  //     document.querySelector("#keccak256").classList.add("blue-capsule__progress-4")
  //     document.querySelector("#keccak256").disabled = true
  //     document.querySelectorAll(".appear-grab").forEach(el => {
  //       el.classList.toggle("interface__block-cell--appear")
  //     })
  //     setShowKeccak(true)
  //   }, 3000)

  //   setTimeout(() => {
  //     document.querySelector("#keccak256").classList.remove("blue-capsule__progress-4")
  //     document.querySelector("#keccak256").classList.add("blue-capsule__progress-done")
  //     document.querySelectorAll(".appear-grab").forEach(el => {
  //       el.classList.toggle("interface__block-cell--appear")
  //     })
  //   }, 4000)
  // }

  // async function handleSlice() {
  //   if (inputtedKeccak256) {
  //     document.querySelector("#address-display").classList.remove("interface__block-cell--space-between")
  //     document.querySelector("#address-display").classList.remove("interface__block-cell--column-gap")
  //     setIsAddressPending(true)

  //     document.querySelector(".slice").innerText = "Preparing keccak256 result buffer..."
  //     document.querySelector(".slice").classList.remove("button-blue")
  //     document.querySelector(".slice").classList.add("blue-capsule")
  //     document.querySelector(".slice").classList.add("blue-capsule--visible")
  //     document.querySelector(".slice").classList.add("blue-capsule__progress-1")

  //     setTimeout(() => {
  //       document.querySelector(".slice").classList.remove("blue-capsule__progress-1")

  //       document.querySelector(".slice").innerText = "Isolating last 20 bytes..."
  //       document.querySelector(".slice").classList.add("blue-capsule__progress-2")
  //     }, 1000)

  //     setTimeout(() => {
  //       document.querySelector(".slice").classList.remove("blue-capsule__progress-2")

  //       document.querySelector(".slice").innerText = "Slicing off last 20 bytes..."
  //       document.querySelector(".slice").classList.add("blue-capsule__progress-3")
  //     }, 2000)

  //     setTimeout(() => {
  //       document.querySelector(".slice").classList.remove("blue-capsule__progress-3")

  //       document.querySelector(".slice").innerText = "ETH Address Generated!"
  //       document.querySelector(".slice").classList.add("blue-capsule__progress-4")
  //       document.querySelector(".slice").disabled = true
  //       setIsAddressPending(false)
  //       setShowAddress(true)
  //       document.querySelectorAll(".appear-grab-2").forEach(el => {
  //         el.classList.toggle("interface__block-cell--appear")
  //       })
  //     }, 3000)

  //     setTimeout(() => {
  //       setIsModalDropDownOpen(true)
  //       document.querySelector(".slice").classList.remove("blue-capsule__progress-4")
  //       document.querySelector(".slice").classList.add("blue-capsule__progress-done")
  //       document.querySelectorAll(".appear-grab-2").forEach(el => {
  //         el.classList.toggle("interface__block-cell--appear")
  //       })
  //     }, 4000)
  //   } else {
  //     null
  //   }
  // }

  // function handleKeccakInput(inputtedValue) {
  //   if (!inputtedValue.trim()) {
  //     setInputtedKeccak256("")
  //   } else {
  //     if (inputtedValue == static_eth_keccak) {
  //       setInputtedKeccak256(inputtedValue)
  //     }
  //   }
  // }

  // useEffect(() => {
  //   let handler = e => {
  //     if (isModalDropDownOpen) {
  //       if (modalDropDownRef.current.contains(e.target)) {
  //         setIsModalDropDownOpen(!isModalDropDownOpen)
  //       }
  //     }
  //   }

  //   document.addEventListener("mousedown", handler)

  //   return () => {
  //     document.removeEventListener("mousedown", handler)
  //   }
  // })

  function nextPage() {
    setPage(prev => prev + 1)
  }

  return (
    <>
      <CSSTransition in={page === 0} timeout={300} classNames="container__overlay" unmountOnExit>
        <div className="container__overlay">
          <div style={{ fontSize: "2.5rem" }} className="display-flex">
            <img style={{ width: "34px", marginRight: "12px", transform: "translateY(3px)" }} src="https://i.imgur.com/5fv5p7q.png" alt="artsnl-logo" />
            ARTSNL
          </div>
          <div onClick={() => setPage(1)}>
            <MdNavigateNext className="icon" />
          </div>
        </div>
      </CSSTransition>

      <CSSTransition in={page === 1} timeout={300} classNames="container__overlay" unmountOnExit>
        <div className="container__overlay">
          <h1 style={{ textAlign: "center", width: "65%" }} className={"font--russo-one"}>
            The World&#39;s Worst Wallet UX
          </h1>
          <p style={{ textAlign: "justify", width: "60%", fontSize: ".8em" }}>Sure, the wallet UX maybe a bit more hands on and slower, yet artisanal, but you&#39;ll learn the nuts & bolts of certain processes we all commonly take for granted.</p>
        </div>
      </CSSTransition>

      <CSSTransition in={page === 2} timeout={300} classNames="container__overlay" unmountOnExit>
        <div className="container__overlay">
          <h1 style={{ textAlign: "center", width: "65%" }} className={"font--russo-one"}>
            Build Your <br /> Own Keys
          </h1>
          <p style={{ textAlign: "justify", width: "60%", fontSize: ".8em" }}>Although it&#39;s never advised to be your own entropy, but in this wallet you can create your own entropy. Don&#39;t rely on other 3rd party tools to do it for you. All 256 bits are yours to create.</p>
        </div>
      </CSSTransition>

      <CSSTransition in={page === 3} timeout={300} classNames="container__overlay" unmountOnExit>
        <div className="container__overlay">
          <h1 style={{ textAlign: "center", width: "65%" }} className={"font--russo-one"}>
            Build Your <br /> Own TX
          </h1>
          <p style={{ textAlign: "justify", width: "60%", fontSize: ".8em" }}>Have you ever wondered how a transaction is processed underneath the surface of an app UI? Get more hands on with structuring, signing, and broadcasting your very own transaction.</p>
        </div>
      </CSSTransition>

      <CSSTransition in={page === 4} timeout={300} classNames="container__overlay" unmountOnExit>
        <div className="container__overlay">
          <h1 style={{ textAlign: "center", width: "65%" }} className={"font--russo-one"}>
            Multi-Chain <br /> Friendly
          </h1>
          <p style={{ textAlign: "justify", width: "60%", fontSize: ".8em" }}>The testnet & mainnet of both Bitcoin and Ethereum are supported.</p>
        </div>
      </CSSTransition>

      <CSSTransition in={page === 5} timeout={300} classNames="container__overlay" unmountOnExit>
        <div className="container__overlay">
          <h1 style={{ textAlign: "center", width: "65%" }} className={"font--russo-one"}>
            #NYKNYC
          </h1>
          <p style={{ textAlign: "justify", width: "60%", fontSize: ".8em" }}>In crypto, you are your own bank. Noone else has access to your keys. You can always export & import keys to and from this app.</p>
        </div>
      </CSSTransition>

      <CSSTransition in={page === 6} timeout={300} classNames="container__overlay" unmountOnExit>
        <div className="container__overlay">
          <div style={{ textAlign: "center", fontSize: "2rem" }}>
            Your Keys. <br /> Your TX. <br /> DIY'ed, by you.
          </div>
          <Link to="/CreateKeys">
            <MdNavigateNext className="icon" />
          </Link>
        </div>
      </CSSTransition>

      {page === 0 ? (
        ""
      ) : (
        <>
          {page === pages[pages.length - 1] ? "" : <MdNavigateNext onClick={() => nextPage()} style={{ position: "absolute", zIndex: "1", right: "19px" }} className="icon" />}

          <span style={{ position: "absolute", zIndex: "1", bottom: "50px", color: "mediumpurple" }}>ARTSNL</span>
          <div style={{ position: "absolute", zIndex: "1", bottom: "26px", minWidth: "164px", height: "auto", justifyContent: "space-between" }} className="display-flex">
            {pages.map((thisPage, index) => {
              return <span key={index} className={"circle " + (page === thisPage ? "circle--selected" : "")}></span>
            })}
          </div>
        </>
      )}
    </>
  )
}

export default Main

{
  /* <div className="tx-builder__overlay">
            <IconContext.Provider value={{ size: "300px" }}>
              <div className="tx-builder__overlay__outer">Step 1: Select UTXOs</div>
              <div className="tx-builder__blueprint">
                <div className="tx-builder__blueprint-carousel"></div>
              </div>
              <div className="tx-builder__overlay__outer">
                <button className="button-purple"></button>
              </div>
            </IconContext.Provider>
          </div>

          <div className="interface__block">
            <div className="interface__block-cell interface__block-cell--space-between">
              <div className="title-font title-font--large">
                <div className="title__subtitle">Build your own transaction.</div>
                <div style={{ display: "inline-block" }} className="purple-font">
                  🏗️ TX
                </div>{" "}
                Builder
              </div>
              <MdMenu className="icon" />
            </div>
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell"></div>
          </div>
          <div className="interface__block">
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell"></div>
          </div>
          <div className="interface__block">
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell interface__block-cell__footer">
              <TbRefresh className="icon" />
              {isTestnet ? <BsHddNetwork onClick={() => setIsTestnet(!isTestnet)} className="icon" /> : <BsHddNetworkFill onClick={() => setIsTestnet(!isTestnet)} className="icon" />}
              <div className="icon">ARTSNL</div>
              <BsReception4 className="icon" />
              <MdLibraryBooks className="icon" />
            </div>
          </div> */
}
