import React, { useEffect, useContext, useState, useRef } from "react"
import * as bitcoin from "../../../../bitcoinjs-lib"
import * as base58 from "bs58"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { IconContext } from "react-icons"
import { useNavigate } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Tooltip } from "react-tooltip"
import ModalDropDown from "./ModalDropDown"
import * as uint8arraytools from "uint8array-tools"
import { CSSTransition } from "react-transition-group"

function BitcoinAddress() {
  const navigate = useNavigate()

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [hash160Buffer, setHash160Buffer] = useState()
  const [versionPrefixBuffer, setVersionPrefixBuffer] = useState()
  const [generatedChecksumBuffer, setGeneratedChecksumBuffer] = useState()

  const [showHash160, setShowHash160] = useState(false)
  const [showChecksum, setShowChecksum] = useState(false)
  const [showAddress, setShowAddress] = useState(false)

  const [inputtedVersionPrefix, setInputtedVersionPrefix] = useState("")
  const [inputtedHash160, setInputtedHash160] = useState("")
  const [inputtedChecksum, setInputtedChecksum] = useState("")

  const [isChecksumPending, setIsChecksumPending] = useState(false)
  const [isBase58EncodePending, setIsBase58EncodePending] = useState(false)

  const [static_pubKey, setStaticPubKey] = useState("")
  const [static_hash160, setStaticHash160] = useState("")
  const [static_checksum, setStaticChecksum] = useState("")
  const [static_address, setStaticAddress] = useState("")

  const [isModalDropDownOpen, setIsModalDropDownOpen] = useState(false)
  const modalDropDownRef = useRef()

  // let riped = bitcoin.crypto.hash160(appState.keys.bufferPubKey)
  // let prefix = Buffer.from("00", "hex")
  // let prefix_riped = [prefix, riped]
  // let combined_prefix_riped = Buffer.concat(prefix_riped)
  // let checksum = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped)).slice(0, 4)
  // let arr = [prefix, riped, checksum]
  // let combinedBuff = Buffer.concat(arr)
  // let address = base58.encode(combinedBuff)

  function handleNext() {
    appDispatch({ type: "setBitcoinAddress", value: static_address })
    navigate("/WalletMain")
  }

  function handleCopyPopup() {
    document.querySelector(".icon-copy").classList.toggle("icon")
    document.querySelector(".icon-copy").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy").classList.toggle("icon")
      document.querySelector(".icon-copy").classList.toggle("icon-copy--active")
    }, 1000)
  }

  function handleCopyPopup_2() {
    document.querySelector(".icon-copy-2").classList.toggle("icon")
    document.querySelector(".icon-copy-2").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-2").classList.toggle("icon")
      document.querySelector(".icon-copy-2").classList.toggle("icon-copy--active")
    }, 1000)
  }

  function handleCopyPopup_3() {
    document.querySelector(".icon-copy-3").classList.toggle("icon")
    document.querySelector(".icon-copy-3").classList.toggle("icon-copy--active")

    setTimeout(() => {
      document.querySelector(".icon-copy-3").classList.toggle("icon")
      document.querySelector(".icon-copy-3").classList.toggle("icon-copy--active")
    }, 1000)
  }

  async function handleHash160() {
    let result = bitcoin.crypto.hash160(appState.keys.bufferPubKey)
    setHash160Buffer(result)
    setStaticHash160(uint8arraytools.toHex(result))

    document.querySelector("#setLoading").classList.add("text--loading")
    document.querySelector("#hash160").innerText = "Applying SHA256..."
    document.querySelector("#hash160").classList.remove("button-orange")
    document.querySelector("#hash160").classList.add("orange-capsule")
    document.querySelector("#hash160").classList.add("orange-capsule--visible")
    document.querySelector("#hash160").classList.add("orange-capsule__progress-1")

    setTimeout(() => {
      document.querySelector("#hash160").classList.remove("orange-capsule__progress-1")

      document.querySelector("#hash160").innerText = "Applying RIPEMD160..."
      document.querySelector("#hash160").classList.add("orange-capsule__progress-2")
    }, 1000)

    setTimeout(() => {
      document.querySelector("#hash160").classList.remove("orange-capsule__progress-2")

      document.querySelector("#hash160").innerText = "Formatting hash result..."
      document.querySelector("#hash160").classList.add("orange-capsule__progress-3")
    }, 2000)

    setTimeout(() => {
      document.querySelector("#hash160").classList.remove("orange-capsule__progress-3")

      document.querySelector("#hash160").innerText = "Completed HASH160!"
      document.querySelector("#hash160").classList.add("orange-capsule__progress-4")
      document.querySelector("#hash160").disabled = true
      document.querySelectorAll(".appear-grab").forEach(el => {
        el.classList.toggle("interface__block-cell--appear")
      })
      setShowHash160(true)
    }, 3000)

    setTimeout(() => {
      document.querySelector("#hash160").classList.remove("orange-capsule__progress-4")
      document.querySelector("#hash160").classList.add("orange-capsule__progress-done")
      document.querySelectorAll(".appear-grab").forEach(el => {
        el.classList.toggle("interface__block-cell--appear")
      })
    }, 4000)
  }

  async function handleSha256Twice() {
    if (inputtedVersionPrefix && inputtedHash160) {
      let prefix_riped = [versionPrefixBuffer, hash160Buffer]
      let combined_prefix_riped = Buffer.concat(prefix_riped)
      let result = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped)).slice(0, 4)
      setGeneratedChecksumBuffer(result)
      setStaticChecksum(uint8arraytools.toHex(result))

      document.querySelector("#checksum-display").classList.remove("interface__block-cell--space-between")
      document.querySelector("#checksum-display").classList.remove("interface__block-cell--column-gap")
      setIsChecksumPending(true)

      document.querySelector(".sha256twice").innerText = "Preparing message block & schedule..."
      document.querySelector(".sha256twice").classList.remove("button-orange")
      document.querySelector(".sha256twice").classList.add("orange-capsule")
      document.querySelector(".sha256twice").classList.add("orange-capsule--visible")
      document.querySelector(".sha256twice").classList.add("orange-capsule__progress-1")

      setTimeout(() => {
        document.querySelector(".sha256twice").classList.remove("orange-capsule__progress-1")

        document.querySelector(".sha256twice").innerText = "Applying 1st SHA256..."
        document.querySelector(".sha256twice").classList.add("orange-capsule__progress-2")
      }, 1000)

      setTimeout(() => {
        document.querySelector(".sha256twice").classList.remove("orange-capsule__progress-2")

        document.querySelector(".sha256twice").innerText = "Applying 2nd SHA256..."
        document.querySelector(".sha256twice").classList.add("orange-capsule__progress-3")
      }, 2000)

      setTimeout(() => {
        document.querySelector(".sha256twice").classList.remove("orange-capsule__progress-3")

        document.querySelector(".sha256twice").innerText = "Completed SHA256 x2!"
        document.querySelector(".sha256twice").classList.add("orange-capsule__progress-4")
        document.querySelector(".sha256twice").disabled = true
        setIsChecksumPending(false)
        setShowChecksum(true)
        document.querySelectorAll(".appear-grab-2").forEach(el => {
          el.classList.toggle("interface__block-cell--appear")
        })
      }, 3000)

      setTimeout(() => {
        document.querySelector(".sha256twice").classList.remove("orange-capsule__progress-4")
        document.querySelector(".sha256twice").classList.add("orange-capsule__progress-done")
        document.querySelectorAll(".appear-grab-2").forEach(el => {
          el.classList.toggle("interface__block-cell--appear")
        })
      }, 4000)
    } else {
      null
    }
  }

  async function handleBase58Encode() {
    if (inputtedChecksum) {
      let arr = [versionPrefixBuffer, hash160Buffer, generatedChecksumBuffer]
      let combinedBuff = Buffer.concat(arr)
      let result = base58.encode(combinedBuff)
      setStaticAddress(result)

      document.querySelector("#base58encode-display").classList.remove("interface__block-cell--space-between")
      document.querySelector("#base58encode-display").classList.remove("interface__block-cell--column-gap")
      setIsBase58EncodePending(true)

      document.querySelector(".base58encode").innerText = "Concatenating values..."
      document.querySelector(".base58encode").classList.remove("button-orange")
      document.querySelector(".base58encode").classList.add("orange-capsule")
      document.querySelector(".base58encode").classList.add("orange-capsule--visible")
      document.querySelector(".base58encode").classList.add("orange-capsule__progress-1")

      setTimeout(() => {
        document.querySelector(".base58encode").classList.remove("orange-capsule__progress-1")

        document.querySelector(".base58encode").innerText = "Converting ByteArray..."
        document.querySelector(".base58encode").classList.add("orange-capsule__progress-2")
      }, 1000)

      setTimeout(() => {
        document.querySelector(".base58encode").classList.remove("orange-capsule__progress-2")

        document.querySelector(".base58encode").innerText = "Converting to Integer..."
        document.querySelector(".base58encode").classList.add("orange-capsule__progress-3")
      }, 2000)

      setTimeout(() => {
        document.querySelector(".base58encode").classList.remove("orange-capsule__progress-3")

        document.querySelector(".base58encode").innerText = "Completed Base58 encoding!"
        document.querySelector(".base58encode").classList.add("orange-capsule__progress-4")
        document.querySelector(".base58encode").disabled = true
        setIsBase58EncodePending(false)
        setIsModalDropDownOpen(true)
        setShowAddress(true)
        document.querySelector("#base58encode-display").classList.toggle("interface__block-cell--appear")
      }, 3000)

      setTimeout(() => {
        document.querySelector(".base58encode").classList.remove("orange-capsule__progress-4")
        document.querySelector(".base58encode").classList.add("orange-capsule__progress-done")
        document.querySelector("#base58encode-display").classList.toggle("interface__block-cell--appear")
      }, 4000)
    } else {
      null
    }
  }

  function handleVersionInput(inputtedValue) {
    if (!inputtedValue.trim()) {
      setInputtedVersionPrefix("")
    } else {
      if (inputtedValue == "00") {
        setVersionPrefixBuffer(Buffer.from(inputtedValue, "hex"))
        setInputtedVersionPrefix(inputtedValue)
      }
    }
  }

  function handleHash160Input(inputtedValue) {
    if (!inputtedValue.trim()) {
      setInputtedHash160("")
    } else {
      if (inputtedValue == static_hash160) {
        setInputtedHash160(inputtedValue)
      }
    }
  }

  function handleChecksumInput(inputtedValue) {
    if (!inputtedValue.trim()) {
      setInputtedChecksum("")
    } else {
      if (inputtedValue == static_checksum) {
        setInputtedChecksum(inputtedValue)
      }
    }
  }

  useEffect(() => {
    let handler = e => {
      if (isModalDropDownOpen) {
        if (modalDropDownRef.current.contains(e.target)) {
          setIsModalDropDownOpen(!isModalDropDownOpen)
        }
      }
    }

    document.addEventListener("mousedown", handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  })

  useEffect(() => {
    setStaticPubKey(uint8arraytools.toHex(appState.keys.bufferPubKey))
  }, [])

  return (
    <>
      <CSSTransition in={isModalDropDownOpen} timeout={400} classNames="modal__cover" unmountOnExit>
        <div ref={modalDropDownRef} className="modal__cover"></div>
      </CSSTransition>

      <CSSTransition in={isModalDropDownOpen} timeout={600} classNames="modal__drop-down" unmountOnExit>
        <ModalDropDown setIsModalDropDownOpen={setIsModalDropDownOpen} isModalDropDownOpen={isModalDropDownOpen} emoji={"💯"} title={"Congratulations!"} subtitle={"You just created your"} subtitle_2={"own BTC address"} hasData={true} data={static_address} showFullData={false} ending_content={"Click on 'To Wallet Home'"} ending_content_2={"below to proceed."} />
      </CSSTransition>

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
                        <input onChange={e => handleVersionInput(e.target.value)} id="Tooltip" data-tooltip-content="Input the version prefix of < 00 >" className={"input--position-off " + (inputtedVersionPrefix ? "input--focus-green" : "input--focus-red")} type="text" placeholder="version" />
                        +
                        <input onChange={e => handleHash160Input(e.target.value)} id="Tooltip" data-tooltip-content="Input the hash160" className={"input--position-off " + (inputtedHash160 ? "input--focus-green" : "input--focus-red")} type="text" placeholder="hash160" />
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
                        <input onChange={e => handleChecksumInput(e.target.value)} id="Tooltip" data-tooltip-content="Input the checksum" className={"input--position-off " + (inputtedChecksum ? "input--focus-green" : "input--focus-red")} type="text" placeholder="checksum" required />
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
              <button onClick={handleNext} className="button-orange button--smaller-font button-orange--pulsing">
                To Wallet Home 🏠
              </button>
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
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word" }} variant="info" />
    </>
  )
}

export default BitcoinAddress
