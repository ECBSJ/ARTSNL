import React, { useState, useTransition, useEffect, useRef } from "react"
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

// import * as dotenv from "dotenv"
// dotenv.config()

function Main() {
  const [page, setPage] = useState(1)

  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin

  // let privateKey = crypto.randomBytes(32)
  // let keyPair = ECPair.fromPrivateKey(privateKey, { compressed: false })

  // let result = ecc.pointFromScalar(privateKey, false)

  // btc pubkey to address
  // let riped = bitcoin.crypto.hash160(result)
  // let prefix = Buffer.from("00", "hex")
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
  //     ...someObject,
  //     ...newObject,
  //   }))

  //   console.log(someObject)
  // }

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

  let static_eth_privKey = "3fdde77e8b442bc89dc890adf8fd72b4314e99ea7a205b9dd302114c9aefc493"
  let static_eth_pubKey = "0488a0dfca9af0d817962b25d1aa92d64e1645c94d452f6e75f61adc3f78d61b623637901afdf2efcb0bbf5badd82c2e559f22fe2f824438515614137443cb62ea"
  let static_eth_keccak = "53d393a6cfa8d868fd33bafc9189561aed3229361a1aca088323a3ab0750c5d6"
  let static_eth_add = "0x9189561aed3229361a1aca088323a3ab0750c5d6"

  let keyPairObject = {
    priv: static_eth_privKey,
    pub: static_eth_pubKey,
    add: static_eth_add
  }
  let stringed = JSON.stringify(keyPairObject)

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
          <div style={{ fontSize: "3rem" }}>ARTSNL</div>
          <div onClick={() => setPage(2)}>
            <MdNavigateNext className="icon" />
          </div>

          {/* <CSSTransition in={isModalDropDownOpen} timeout={400} classNames="modal__cover" unmountOnExit>
            <div ref={modalDropDownRef} className="modal__cover"></div>
          </CSSTransition>

          <CSSTransition in={isModalDropDownOpen} timeout={600} classNames="modal__drop-down" unmountOnExit>
            <ModalDropDown setIsModalDropDownOpen={setIsModalDropDownOpen} isModalDropDownOpen={isModalDropDownOpen} emoji={"💯"} title={"Congratulations!"} subtitle={"You just created your"} subtitle_2={"own ETH address."} hasData={true} data={static_eth_add} showFullData={false} ending_content={"Click on 'To Wallet Home'"} ending_content_2={"below to proceed."} />
          </CSSTransition>

          <IconContext.Provider value={{ size: "1.5rem" }}>
            <div className="interface__block">
              <div className="interface__block-cell interface__block-cell--space-between">
                <div className="title-font title-font--small">
                  <div className="title__subtitle">With your public key, derive your public address.</div>
                  <div style={{ display: "inline-block" }} className="blue-font">
                    📭ETH
                  </div>{" "}
                  Public Address
                </div>
                <IconContext.Provider value={{ size: "3rem" }}>
                  <MdMenu className="icon" />
                </IconContext.Provider>
              </div>
              <div className="interface__block-cell">
                {showKeccak ? (
                  <>
                    <CopyToClipboard text={static_eth_keccak} onCopy={() => handleCopyPopup()}>
                      <MdCopyAll className="icon icon-copy" />
                    </CopyToClipboard>
                    <div data-tooltip-id="static_eth_keccak" data-tooltip-content={static_eth_keccak}>
                      {"{ " + static_eth_keccak.slice(0, 9) + "..." + static_eth_keccak.slice(-9) + " }"}
                    </div>
                    <Tooltip id="static_eth_keccak" style={{ fontSize: "0.6rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
                    <div className="interface__block-cell__annotation interface__block-cell__annotation--blue">KECCAK256 of Public Key:</div>
                  </>
                ) : (
                  <>
                    <div id="setLoading" data-text={"{" + static_eth_pubKey.slice(0, 10) + "..." + static_eth_pubKey.slice(-10) + "}"} data-tooltip-id="static_pubKey" data-tooltip-content={static_eth_pubKey}>
                      {"{" + static_eth_pubKey.slice(0, 10) + "..." + static_eth_pubKey.slice(-10) + "}"}
                    </div>
                    <Tooltip id="static_pubKey" style={{ fontSize: "0.6rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
                    <div className="interface__block-cell__annotation interface__block-cell__annotation--blue">Uncompressed Public Key:</div>
                  </>
                )}
              </div>
              <div className="interface__block-cell">
                <button onClick={handleKeccak} id="keccak256" data-tooltip-id="keccak-button" data-tooltip-content={showKeccak ? "Input the keccak256 result into the field below." : "Click to apply a keccak256 on your public key."} className="button-blue button--smaller-font">
                  KECCAK256
                </button>
                <Tooltip id="keccak-button" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
              </div>
            </div>
            <div className="interface__block">
              <div id="address-display" className="interface__block-cell interface__block-cell--space-between interface__block-cell--column-gap appear-grab appear-grab-2">
                {showKeccak ? (
                  <>
                    {showAddress ? (
                      <>
                        <CopyToClipboard text={static_eth_add} onCopy={() => handleCopyPopup_2()}>
                          <MdCopyAll className="icon icon-copy icon-copy-2" />
                        </CopyToClipboard>

                        <div id="Tooltip" data-tooltip-content={static_eth_add}>
                          {"{ " + static_eth_add.slice(0, 7) + "..." + static_eth_add.slice(-7) + " }"}
                        </div>
                        <div className="interface__block-cell__annotation interface__block-cell__annotation--blue">Your ETH Address:</div>
                      </>
                    ) : (
                      <>
                        {isAddressPending ? (
                          <>
                            <div id="setAddressLoading" data-text={"slicing..."} className="text--loading">
                              slicing...
                            </div>
                          </>
                        ) : (
                          <>
                            <input onChange={e => handleKeccakInput(e.target.value)} id="Tooltip" data-tooltip-content="Input the keccak256" className={"input--position-off " + (inputtedKeccak256 ? "input--focus-green" : "input--focus-red")} type="text" placeholder="keccak256" />
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="interface__block-cell appear-grab">
                {showKeccak ? (
                  <>
                    <button onClick={handleSlice} id="Tooltip" data-tooltip-content={showAddress ? "Your ETH address has been generated." : "Slice off the last 20 bytes of the keccak256 result to derive your ETH address."} className="button-blue button--smaller-font slice">
                      Slice
                    </button>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="interface__block-cell"></div>
            </div>
          </IconContext.Provider>

          <div className="interface__block">
            <div className="interface__block-cell"></div>
            <div className="interface__block-cell">
              {showAddress ? (
                <>
                  <button className="button-blue button--smaller-font button-blue--pulsing">To Wallet Home 🏠</button>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="interface__block-cell interface__block-cell__footer">
              <TbRefresh className="icon" />
              <div className="icon">ARTSNL</div>
              <MdLibraryBooks className="icon" />
            </div>
          </div>
          <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" /> */}
        </>
      )}
    </>
  )
}

export default Main
