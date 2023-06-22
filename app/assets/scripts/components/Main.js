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
import { ethers } from "ethers"
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

// import * as dotenv from "dotenv"
// dotenv.config()

function Main() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [page, setPage] = useState(1)

  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin
  let Testnet = bitcoin.networks.testnet

  const testnetPrivKey = "938zbGqYYvZvFaHNXMNDpQZ4hEQE89ugGEjrv9QCKWCL6H2c4ps"
  const testnetAdd = "mqxJ66EMdF1nKmyr3yPxbx7tRAd1L4dPrW"

  const testnetPrivKey_2 = "93MPV1RsWMvfLCpGZcnPG1U8EA3QDqdNxkCVJwmeTGrjEHFZ5v6"
  const testnetAdd_2 = "mx4k2ersuW9k3uc4ybNEEB1TsQ1qJkMZ4w"

  // let testnetKeyPair = ECPair.fromWIF(testnetPrivKey, Testnet)
  // const p2pkhObject = bitcoin.payments.p2pkh({ pubkey: testnetKeyPair.publicKey, network: Testnet })

  // const validator = (pubkey, msghash, signature) => ECPair.fromPublicKey(pubkey).verify(msghash, signature)

  // const psbt = new bitcoin.Psbt({ network: Testnet })

  // psbt.addInput({
  //   hash: "2cb6fa84428fc0ec7a9938888263d38262ab8eced7f32b086093fae1c44b066a",
  //   index: 0,
  //   nonWitnessUtxo: Buffer.from("0200000002b934e59a25ff84414975d05fc944a770ee17542326eb708851b7cb87d0c24cc5000000008a47304402202c0b9314b95df5ad4a4e87c8c856a1cad0e8969792c105301b8ba6e7f885de7302205aab52e8258d16630a3346874aae063212b68d0ee263fb52593a24d3ebf26b7e014104a5631b324d8f870a2693236b4c89e42f2ed0cda08a0e6a07db95884d1e82e9bec0e44c0885e281ab8dfb58f53215e70d7f33ee4359ac0f9c421c2f07544ae177ffffffff507d63594f9749a26bfeb583bf36f4188006757eb006d21dc2e61e3846a79186000000008b4830450221009384c907b787322bff92172554782440bb3f564616a6486850a4db40fbab97f002204e7d4ee290225551f95b90a32b2e6256db003bb72a7b329204109cd08d17d78c014104a5631b324d8f870a2693236b4c89e42f2ed0cda08a0e6a07db95884d1e82e9bec0e44c0885e281ab8dfb58f53215e70d7f33ee4359ac0f9c421c2f07544ae177ffffffff01bc2e0000000000001976a914727c2e0ba76f7cea7b41ab920eec10117a35370388ac00000000", "hex")
  // })

  // psbt.addInput({
  //   hash: "8691a746381ee6c21dd206b07e75068018f436bf83b5fe6ba249974f59637d50",
  //   index: 0,
  //   nonWitnessUtxo: Buffer.from("020000000001019462cf8959a06d5b65215a648ad8ccb17814efa08f70f7b2c8ee376415176e5a000000001716001497cccf62d2ed3dded4a86d6cce118bd08c571cbdfeffffff023c1b0000000000001976a914b58515a69527c806fd404d3d4aa490d56692310b88aceb32f901000000001976a914c80c4fdbc8d70bac6a20a7af273d137132f3c89788ac0247304402205085f90c858ea1eb81938371b0b6659a191f2c0c1816b6f48b64ff96fa404ffc02205321c63d54db7c3fb68667c1c95009f0522aa3a2b8c2a191a30419eca06aa9f30121025404399c93d61fa75f76c49377bd7eea76efe4a73021a4e04fd237b4913c2e5e7f212500", "hex")
  // })

  // psbt.addOutput({
  //   address: "mx4k2ersuW9k3uc4ybNEEB1TsQ1qJkMZ4w",
  //   value: 11564
  // })

  // psbt.signInput(0, testnetKeyPair)
  // psbt.signInput(1, testnetKeyPair)
  // psbt.validateSignaturesOfInput(0, validator)
  // psbt.validateSignaturesOfInput(1, validator)
  // psbt.finalizeAllInputs()

  // const transactionHEX = psbt.extractTransaction().toHex()

  // Main - Select UTXOs to use (carousel selection)
  // Main - Show selected UTXOs
  // Main - Prompt user to start ScriptSig formation for each input
  // Overlay - ScriptSig formation for each input (an overlay to appear)
  // Main - After ScriptSig completion, determine if user will send all out (if not a return output is needed)
  // Input receiving address
  // Determine if return address output needed
  // Deconstruct receiving address
  // Extract hash160
  // Form ScriptPubKey for output
  // Overlay - First output formation
  // Overlay - locktime option
  // Main - Summary and review of completed fields
  // Main - Display of Transaction hex
  // Main - Broadcast

  // let static_eth_privKey = "3fdde77e8b442bc89dc890adf8fd72b4314e99ea7a205b9dd302114c9aefc493"
  // let static_eth_pubKey = "0488a0dfca9af0d817962b25d1aa92d64e1645c94d452f6e75f61adc3f78d61b623637901afdf2efcb0bbf5badd82c2e559f22fe2f824438515614137443cb62ea"
  // let static_eth_keccak = "53d393a6cfa8d868fd33bafc9189561aed3229361a1aca088323a3ab0750c5d6"
  // let static_eth_add = "0x9189561aed3229361a1aca088323a3ab0750c5d6"

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
  // let result = ecc.pointFromScalar(privateKey, false)

  // btc pubkey to address
  // let riped = bitcoin.crypto.hash160(result)
  // let prefix = Buffer.from("6F", "hex")
  // let prefix_riped = [prefix, riped]
  // let combined_prefix_riped = Buffer.concat(prefix_riped)
  // let checksum = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped)).slice(0, 4)
  // let arr = [prefix, riped, checksum]
  // let combinedBuff = Buffer.concat(arr)
  // let address = base58.encode(combinedBuff)

  // eth pubkey to address
  // let provider = new ethers.InfuraProvider(1, "19e6398ef2ee4861bfa95987d08fbc50")
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

  // function handleCopyPopup() {
  //   document.querySelector(".icon-copy").classList.toggle("icon")
  //   document.querySelector(".icon-copy").classList.toggle("icon-copy--active")

  //   setTimeout(() => {
  //     document.querySelector(".icon-copy").classList.toggle("icon")
  //     document.querySelector(".icon-copy").classList.toggle("icon-copy--active")
  //   }, 1000)
  // }

  // function handleCopyPopup_2() {
  //   document.querySelector(".icon-copy-2").classList.toggle("icon")
  //   document.querySelector(".icon-copy-2").classList.toggle("icon-copy--active")

  //   setTimeout(() => {
  //     document.querySelector(".icon-copy-2").classList.toggle("icon")
  //     document.querySelector(".icon-copy-2").classList.toggle("icon-copy--active")
  //   }, 1000)
  // }

  // let static_privKey = "5e6cca2c25d67950acee3324d41ebef7d886b6762eaadb92210a3604a6188110"
  // let static_pubKey = "0465034a033e228fc298f4be365cdc4555b9ef4a7a53ae9f72a88383a4712095c2cad1d12366842198e6fd4a884bd5f899c3c41f0c105aed2e470b7d0993aa2a27"
  // let static_hash160 = "c47bef1873ec058afeccf205d36e16ba6d336bf0"
  // let static_checksum = "fef7d72e"
  // let static_address = "1JuuugYPD2DjVj99pN5vKkQbbWhVng7nwX"

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

  const [isTestnet, setIsTestnet] = useState(false)

  const static_privKey = "3fdde77e8b442bc89dc890adf8fd72b4314e99ea7a205b9dd302114c9aefc493"
  const static_publicKey = "0488a0dfca9af0d817962b25d1aa92d64e1645c94d452f6e75f61adc3f78d61b623637901afdf2efcb0bbf5badd82c2e559f22fe2f824438515614137443cb62ea"
  const static_btc_address = "19G4UV3YDkTYj4G3XSYeUkzp4Ew6voQFiR"
  const static_btc_testnet_address = "mon1mY8X2mtoWAjfF1X2JgD8vEXotDVsiY"
  const static_eth_address = "0x9189561aed3229361a1aca088323a3ab0750c5d6"

  return (
    <>
      {page == 2 ? (
        <>
          <div style={{ textAlign: "center", fontSize: "2rem" }}>
            Your Keys. <br /> Your TX. <br /> DIY'ed, by you.
          </div>
          <Link to="/CreateKeys">
            <MdNavigateNext className="icon" />
          </Link>
        </>
      ) : (
        <>
          {/* <div style={{ fontSize: "3rem" }}>ARTSNL</div>
          <div onClick={() => setPage(2)}>
            <MdNavigateNext className="icon" />
          </div> */}

          <div className="tx-builder__overlay">
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
          </div>
        </>
      )}
    </>
  )
}

export default Main
