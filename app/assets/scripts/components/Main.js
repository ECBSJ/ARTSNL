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

// import * as dotenv from "dotenv"
// dotenv.config()

function Main() {
  const [page, setPage] = useState(1)

  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin

  // let privateKey = crypto.randomBytes(32)
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
  // console.log(finalETHpubAdd)
  // console.log(ethers.isAddress(finalETHpubAdd))

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

  // function handleCopyPopup_3() {
  //   document.querySelector(".icon-copy-3").classList.toggle("icon")
  //   document.querySelector(".icon-copy-3").classList.toggle("icon-copy--active")

  //   setTimeout(() => {
  //     document.querySelector(".icon-copy-3").classList.toggle("icon")
  //     document.querySelector(".icon-copy-3").classList.toggle("icon-copy--active")
  //   }, 1000)
  // }

  // let static_privKey = "5e6cca2c25d67950acee3324d41ebef7d886b6762eaadb92210a3604a6188110"
  // let static_pubKey = "0465034a033e228fc298f4be365cdc4555b9ef4a7a53ae9f72a88383a4712095c2cad1d12366842198e6fd4a884bd5f899c3c41f0c105aed2e470b7d0993aa2a27"
  // let static_hash160 = "c47bef1873ec058afeccf205d36e16ba6d336bf0"
  // let static_checksum = "fef7d72e"
  // let static_address = "1JuuugYPD2DjVj99pN5vKkQbbWhVng7nwX"

  // const [showHash160, setShowHash160] = useState(false)
  // const [versionPrefix, setVersionPrefix] = useState("")
  // const [hash160, setHash160] = useState("")
  // const [showChecksum, setShowChecksum] = useState(false)
  // const [isChecksumPending, setIsChecksumPending] = useState(false)
  // const [checksum, setChecksum] = useState("")
  // const [isBase58EncodePending, setIsBase58EncodePending] = useState(false)
  // const [showAddress, setShowAddress] = useState(false)
  // const [isModalDropDownOpen, setIsModalDropDownOpen] = useState(false)
  // const modalDropDownRef = useRef()

  // async function handleHash160() {
  //   document.querySelector("#setLoading").classList.add("text--loading")
  //   document.querySelector("#hash160").innerText = "Applying SHA256..."
  //   document.querySelector("#hash160").classList.remove("button-orange")
  //   document.querySelector("#hash160").classList.add("orange-capsule")
  //   document.querySelector("#hash160").classList.add("orange-capsule--visible")
  //   document.querySelector("#hash160").classList.add("orange-capsule__progress-1")

  //   setTimeout(() => {
  //     document.querySelector("#hash160").classList.remove("orange-capsule__progress-1")

  //     document.querySelector("#hash160").innerText = "Applying RIPEMD160..."
  //     document.querySelector("#hash160").classList.add("orange-capsule__progress-2")
  //   }, 1000)

  //   setTimeout(() => {
  //     document.querySelector("#hash160").classList.remove("orange-capsule__progress-2")

  //     document.querySelector("#hash160").innerText = "Formatting hash result..."
  //     document.querySelector("#hash160").classList.add("orange-capsule__progress-3")
  //   }, 2000)

  //   setTimeout(() => {
  //     document.querySelector("#hash160").classList.remove("orange-capsule__progress-3")

  //     document.querySelector("#hash160").innerText = "Completed HASH160!"
  //     document.querySelector("#hash160").classList.add("orange-capsule__progress-4")
  //     document.querySelector("#hash160").disabled = true
  //     document.querySelectorAll(".appear-grab").forEach(el => {
  //       el.classList.toggle("interface__block-cell--appear")
  //     })
  //     setShowHash160(true)
  //   }, 3000)

  //   setTimeout(() => {
  //     document.querySelector("#hash160").classList.remove("orange-capsule__progress-4")
  //     document.querySelector("#hash160").classList.add("orange-capsule__progress-done")
  //     document.querySelectorAll(".appear-grab").forEach(el => {
  //       el.classList.toggle("interface__block-cell--appear")
  //     })
  //   }, 4000)
  // }

  // async function handleSha256Twice() {
  //   if (versionPrefix && hash160) {
  //     document.querySelector("#checksum-display").classList.remove("interface__block-cell--space-between")
  //     document.querySelector("#checksum-display").classList.remove("interface__block-cell--column-gap")
  //     setIsChecksumPending(true)

  //     document.querySelector(".sha256twice").innerText = "Preparing message block & schedule..."
  //     document.querySelector(".sha256twice").classList.remove("button-orange")
  //     document.querySelector(".sha256twice").classList.add("orange-capsule")
  //     document.querySelector(".sha256twice").classList.add("orange-capsule--visible")
  //     document.querySelector(".sha256twice").classList.add("orange-capsule__progress-1")

  //     setTimeout(() => {
  //       document.querySelector(".sha256twice").classList.remove("orange-capsule__progress-1")

  //       document.querySelector(".sha256twice").innerText = "Applying 1st SHA256..."
  //       document.querySelector(".sha256twice").classList.add("orange-capsule__progress-2")
  //     }, 1000)

  //     setTimeout(() => {
  //       document.querySelector(".sha256twice").classList.remove("orange-capsule__progress-2")

  //       document.querySelector(".sha256twice").innerText = "Applying 2nd SHA256..."
  //       document.querySelector(".sha256twice").classList.add("orange-capsule__progress-3")
  //     }, 2000)

  //     setTimeout(() => {
  //       document.querySelector(".sha256twice").classList.remove("orange-capsule__progress-3")

  //       document.querySelector(".sha256twice").innerText = "Completed SHA256 x2!"
  //       document.querySelector(".sha256twice").classList.add("orange-capsule__progress-4")
  //       document.querySelector(".sha256twice").disabled = true
  //       setIsChecksumPending(false)
  //       setShowChecksum(true)
  //       document.querySelectorAll(".appear-grab-2").forEach(el => {
  //         el.classList.toggle("interface__block-cell--appear")
  //       })
  //     }, 3000)

  //     setTimeout(() => {
  //       document.querySelector(".sha256twice").classList.remove("orange-capsule__progress-4")
  //       document.querySelector(".sha256twice").classList.add("orange-capsule__progress-done")
  //       document.querySelectorAll(".appear-grab-2").forEach(el => {
  //         el.classList.toggle("interface__block-cell--appear")
  //       })
  //     }, 4000)
  //   } else {
  //     null
  //   }
  // }

  // async function handleBase58Encode() {
  //   if (checksum) {
  //     document.querySelector("#base58encode-display").classList.remove("interface__block-cell--space-between")
  //     document.querySelector("#base58encode-display").classList.remove("interface__block-cell--column-gap")
  //     setIsBase58EncodePending(true)

  //     document.querySelector(".base58encode").innerText = "Concatenating values..."
  //     document.querySelector(".base58encode").classList.remove("button-orange")
  //     document.querySelector(".base58encode").classList.add("orange-capsule")
  //     document.querySelector(".base58encode").classList.add("orange-capsule--visible")
  //     document.querySelector(".base58encode").classList.add("orange-capsule__progress-1")

  //     setTimeout(() => {
  //       document.querySelector(".base58encode").classList.remove("orange-capsule__progress-1")

  //       document.querySelector(".base58encode").innerText = "Converting ByteArray..."
  //       document.querySelector(".base58encode").classList.add("orange-capsule__progress-2")
  //     }, 1000)

  //     setTimeout(() => {
  //       document.querySelector(".base58encode").classList.remove("orange-capsule__progress-2")

  //       document.querySelector(".base58encode").innerText = "Converting to Integer..."
  //       document.querySelector(".base58encode").classList.add("orange-capsule__progress-3")
  //     }, 2000)

  //     setTimeout(() => {
  //       document.querySelector(".base58encode").classList.remove("orange-capsule__progress-3")

  //       document.querySelector(".base58encode").innerText = "Completed Base58 encoding!"
  //       document.querySelector(".base58encode").classList.add("orange-capsule__progress-4")
  //       document.querySelector(".base58encode").disabled = true
  //       setIsBase58EncodePending(false)
  //       setIsModalDropDownOpen(true)
  //       setShowAddress(true)
  //       document.querySelector("#base58encode-display").classList.toggle("interface__block-cell--appear")
  //     }, 3000)

  //     setTimeout(() => {
  //       document.querySelector(".base58encode").classList.remove("orange-capsule__progress-4")
  //       document.querySelector(".base58encode").classList.add("orange-capsule__progress-done")
  //       document.querySelector("#base58encode-display").classList.toggle("interface__block-cell--appear")
  //     }, 4000)
  //   } else {
  //     null
  //   }
  // }

  // function handleVersionInput(inputtedValue) {
  //   if (!inputtedValue.trim()) {
  //     setVersionPrefix("")
  //   } else {
  //     if (inputtedValue == "00") {
  //       setVersionPrefix(inputtedValue)
  //     }
  //   }
  // }

  // function handleHash160Input(inputtedValue) {
  //   if (!inputtedValue.trim()) {
  //     setHash160("")
  //   } else {
  //     if (inputtedValue == static_hash160) {
  //       setHash160(inputtedValue)
  //     }
  //   }
  // }

  // function handleChecksumInput(inputtedValue) {
  //   if (!inputtedValue.trim()) {
  //     setChecksum("")
  //   } else {
  //     if (inputtedValue == static_checksum) {
  //       setChecksum(inputtedValue)
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

          {/* {isModalDropDownOpen ? <ModalDropDown setIsModalDropDownOpen={setIsModalDropDownOpen} isModalDropDownOpen={isModalDropDownOpen} modalDropDownRef={modalDropDownRef} emoji={"💯"} title={"Congratulations!"} subtitle={"You just created your"} subtitle_2={"own BTC address"} hasData={true} data={static_address} showFullData={false} ending_content={"Click on 'To Wallet Home'"} ending_content_2={"below to proceed."} /> : ""}

          <IconContext.Provider value={{ size: "1.5rem" }}>
            <div className="interface__block">
              <div className="interface__block-cell interface__block-cell--space-between">
                <div className="title-font title-font--small">
                  <div className="title__subtitle">With your public key, derive your public address.</div>
                  <div style={{ display: "inline-block" }} className="orange-font">
                    📭BTC
                  </div>{" "}
                  Public Address
                </div>
                <IconContext.Provider value={{ size: "3rem" }}>
                  <MdMenu className="icon" />
                </IconContext.Provider>
              </div>
              <div className="interface__block-cell">
                {showHash160 ? (
                  <>
                    <CopyToClipboard text={static_hash160} onCopy={() => handleCopyPopup()}>
                      <MdCopyAll className="icon icon-copy" />
                    </CopyToClipboard>
                    <div data-tooltip-id="static_hash160" data-tooltip-content={static_hash160}>
                      {"{ " + static_hash160.slice(0, 9) + "..." + static_hash160.slice(-9) + " }"}
                    </div>
                    <Tooltip id="static_hash160" style={{ fontSize: "0.6rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
                    <div className="interface__block-cell__annotation interface__block-cell__annotation--orange">HASH160 of Public Key:</div>
                  </>
                ) : (
                  <>
                    <div id="setLoading" data-text={"{" + static_pubKey.slice(0, 10) + "..." + static_pubKey.slice(-10) + "}"} data-tooltip-id="static_pubKey" data-tooltip-content={static_pubKey}>
                      {"{" + static_pubKey.slice(0, 10) + "..." + static_pubKey.slice(-10) + "}"}
                    </div>
                    <Tooltip id="static_pubKey" style={{ fontSize: "0.6rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
                    <div className="interface__block-cell__annotation interface__block-cell__annotation--orange">Uncompressed Public Key:</div>
                  </>
                )}
              </div>
              <div className="interface__block-cell">
                <button onClick={handleHash160} id="hash160" data-tooltip-id="hash160-button" data-tooltip-content={showHash160 ? "Input the HASH160 into the field below." : "Click to apply a hash160 on your public key."} className="button-orange button--smaller-font">
                  SHA256 + RIPEMD160
                </button>
                <Tooltip id="hash160-button" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
              </div>
            </div>
            <div className="interface__block">
              <div id="checksum-display" className="interface__block-cell interface__block-cell--space-between interface__block-cell--column-gap appear-grab">
                {showHash160 ? (
                  <>
                    {showChecksum ? (
                      <>
                        <CopyToClipboard text={static_checksum} onCopy={() => handleCopyPopup_2()}>
                          <MdCopyAll className="icon icon-copy icon-copy-2" />
                        </CopyToClipboard>

                        <div id="Tooltip" data-tooltip-content={static_checksum}>
                          {"{ " + static_checksum + " }"}
                        </div>
                        <div className="interface__block-cell__annotation interface__block-cell__annotation--orange">Checksum:</div>
                      </>
                    ) : (
                      <>
                        {isChecksumPending ? (
                          <>
                            <div id="setChecksumLoading" data-text={"hashing..."} className="text--loading">
                              hashing...
                            </div>
                          </>
                        ) : (
                          <>
                            <input onChange={e => handleVersionInput(e.target.value)} id="Tooltip" data-tooltip-content="Input the version prefix of < 00 >" className={"input--position-off " + (versionPrefix ? "input--focus-green" : "input--focus-red")} type="text" placeholder="version" />
                            +
                            <input onChange={e => handleHash160Input(e.target.value)} id="Tooltip" data-tooltip-content="Input the hash160" className={"input--position-off " + (hash160 ? "input--focus-green" : "input--focus-red")} type="text" placeholder="hash160" />
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
                {showHash160 ? (
                  <>
                    <button onClick={handleSha256Twice} id="Tooltip" data-tooltip-content={showChecksum ? "Input the checksum into the corresponding field below." : "Apply SHA256 x2 to a concatenation of the version prefix & hash160 to generate a checksum."} className="button-orange button--smaller-font sha256twice">
                      SHA256 x2
                    </button>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div id="base58encode-display" className="interface__block-cell interface__block-cell--space-between interface__block-cell--column-gap appear-grab-2">
                {showChecksum ? (
                  <>
                    {showAddress ? (
                      <>
                        <CopyToClipboard text={static_address} onCopy={() => handleCopyPopup_3()}>
                          <MdCopyAll className="icon icon-copy icon-copy-3" />
                        </CopyToClipboard>

                        <div id="Tooltip" data-tooltip-content={static_address}>
                          {"{ " + static_address.slice(0, 7) + "..." + static_address.slice(-7) + " }"}
                        </div>
                        <div className="interface__block-cell__annotation interface__block-cell__annotation--orange">Your BTC Public Address:</div>
                      </>
                    ) : (
                      <>
                        {isBase58EncodePending ? (
                          <>
                            <div id="setBase58EncodeLoading" data-text={"encoding..."} className="text--loading">
                              encoding...
                            </div>
                          </>
                        ) : (
                          <>
                            <input id="Tooltip" data-tooltip-content="Version prefix of < 00 >" className="input--position-off" type="text" placeholder="00" disabled={true} />
                            +
                            <input id="Tooltip" data-tooltip-content="HASH160" className="input--position-off" type="text" placeholder={static_hash160} disabled={true} />
                            +
                            <input onChange={e => handleChecksumInput(e.target.value)} id="Tooltip" data-tooltip-content="Input the checksum" className={"input--position-off " + (checksum ? "input--focus-green" : "input--focus-red")} type="text" placeholder="checksum" required />
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </IconContext.Provider>

          <div className="interface__block">
            <div className="interface__block-cell appear-grab-2">
              {showChecksum ? (
                <>
                  <button onClick={handleBase58Encode} id="Tooltip" data-tooltip-content={"Base58 encode a concatenation of the version prefix, hash160, & checksum."} className="button-orange button--smaller-font base58encode">
                    Base58 encode
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="interface__block-cell">
              {showAddress ? (
                <>
                  <button className="button-orange button--smaller-font button-orange--pulsing">To Wallet Home 🏠</button>
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
