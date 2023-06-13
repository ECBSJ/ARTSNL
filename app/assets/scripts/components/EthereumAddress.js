import React, { useEffect, useContext, useState, useRef } from "react"
import { ethers } from "ethers"
import * as uint8arraytools from "uint8array-tools"
import { useNavigate } from "react-router-dom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { IconContext } from "react-icons"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Tooltip } from "react-tooltip"
import ModalDropDown from "./ModalDropDown"
import { CSSTransition } from "react-transition-group"

function EthereumAddress() {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  // let provider = new ethers.InfuraProvider(1, "19e6398ef2ee4861bfa95987d08fbc50")
  // let prepareETHpubKey = appState.keys.bufferPubKey.slice(1, 65)
  // let keccakPubKey = ethers.keccak256(prepareETHpubKey)
  // let removed_0x = keccakPubKey.slice(2)
  // let prepareETHpubAdd = Buffer.from(removed_0x, "hex")
  // let ETHpubAdd = prepareETHpubAdd.slice(-20)
  // let finalETHpubAdd = "0x" + uint8arraytools.toHex(ETHpubAdd)

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

  const [static_eth_pubKey, setStaticEthPubKey] = useState("")
  const [static_eth_keccak, setStaticEthKeccak] = useState("")
  const [static_eth_add, setStaticEthAdd] = useState("")

  const [showKeccak, setShowKeccak] = useState(false)
  const [inputtedKeccak256, setInputtedKeccak256] = useState("")

  const [showAddress, setShowAddress] = useState(false)
  const [isAddressPending, setIsAddressPending] = useState(false)

  const [isModalDropDownOpen, setIsModalDropDownOpen] = useState(false)
  const modalDropDownRef = useRef()

  async function handleKeccak() {
    let prepareETHpubKey = appState.keys.bufferPubKey.slice(1, 65)
    let keccakPubKey = ethers.keccak256(prepareETHpubKey)
    let removed_0x = keccakPubKey.slice(2)
    setStaticEthKeccak(removed_0x)

    document.querySelector("#setLoading").classList.add("text--loading")
    document.querySelector("#keccak256").innerText = "Preparing message schedule..."
    document.querySelector("#keccak256").classList.remove("button-blue")
    document.querySelector("#keccak256").classList.add("blue-capsule")
    document.querySelector("#keccak256").classList.add("blue-capsule--visible")
    document.querySelector("#keccak256").classList.add("blue-capsule__progress-1")

    setTimeout(() => {
      document.querySelector("#keccak256").classList.remove("blue-capsule__progress-1")

      document.querySelector("#keccak256").innerText = "Applying keccak256..."
      document.querySelector("#keccak256").classList.add("blue-capsule__progress-2")
    }, 1000)

    setTimeout(() => {
      document.querySelector("#keccak256").classList.remove("blue-capsule__progress-2")

      document.querySelector("#keccak256").innerText = "Formatting hash result..."
      document.querySelector("#keccak256").classList.add("blue-capsule__progress-3")
    }, 2000)

    setTimeout(() => {
      document.querySelector("#keccak256").classList.remove("blue-capsule__progress-3")

      document.querySelector("#keccak256").innerText = "Completed keccak256!"
      document.querySelector("#keccak256").classList.add("blue-capsule__progress-4")
      document.querySelector("#keccak256").disabled = true
      document.querySelectorAll(".appear-grab").forEach(el => {
        el.classList.toggle("interface__block-cell--appear")
      })
      setShowKeccak(true)
    }, 3000)

    setTimeout(() => {
      document.querySelector("#keccak256").classList.remove("blue-capsule__progress-4")
      document.querySelector("#keccak256").classList.add("blue-capsule__progress-done")
      document.querySelectorAll(".appear-grab").forEach(el => {
        el.classList.toggle("interface__block-cell--appear")
      })
    }, 4000)
  }

  function handleSlice() {
    if (inputtedKeccak256) {
      let prepareETHpubAdd = Buffer.from(static_eth_keccak, "hex")
      let ETHpubAdd = prepareETHpubAdd.slice(-20)
      let finalETHpubAdd = "0x" + uint8arraytools.toHex(ETHpubAdd)
      setStaticEthAdd(finalETHpubAdd)
      appDispatch({ type: "setEthereumAddress", value: finalETHpubAdd })

      document.querySelector("#address-display").classList.remove("interface__block-cell--space-between")
      document.querySelector("#address-display").classList.remove("interface__block-cell--column-gap")
      setIsAddressPending(true)

      document.querySelector(".slice").innerText = "Preparing keccak256 result buffer..."
      document.querySelector(".slice").classList.remove("button-blue")
      document.querySelector(".slice").classList.add("blue-capsule")
      document.querySelector(".slice").classList.add("blue-capsule--visible")
      document.querySelector(".slice").classList.add("blue-capsule__progress-1")

      setTimeout(() => {
        document.querySelector(".slice").classList.remove("blue-capsule__progress-1")

        document.querySelector(".slice").innerText = "Isolating last 20 bytes..."
        document.querySelector(".slice").classList.add("blue-capsule__progress-2")
      }, 1000)

      setTimeout(() => {
        document.querySelector(".slice").classList.remove("blue-capsule__progress-2")

        document.querySelector(".slice").innerText = "Slicing off last 20 bytes..."
        document.querySelector(".slice").classList.add("blue-capsule__progress-3")
      }, 2000)

      setTimeout(() => {
        document.querySelector(".slice").classList.remove("blue-capsule__progress-3")

        document.querySelector(".slice").innerText = "ETH Address Generated!"
        document.querySelector(".slice").classList.add("blue-capsule__progress-4")
        document.querySelector(".slice").disabled = true
        setIsAddressPending(false)
        setShowAddress(true)
        document.querySelectorAll(".appear-grab-2").forEach(el => {
          el.classList.toggle("interface__block-cell--appear")
        })
      }, 3000)

      setTimeout(() => {
        setIsModalDropDownOpen(true)
        document.querySelector(".slice").classList.remove("blue-capsule__progress-4")
        document.querySelector(".slice").classList.add("blue-capsule__progress-done")
        document.querySelectorAll(".appear-grab-2").forEach(el => {
          el.classList.toggle("interface__block-cell--appear")
        })
      }, 4000)
    } else {
      null
    }
  }

  function handleKeccakInput(inputtedValue) {
    if (!inputtedValue.trim()) {
      setInputtedKeccak256("")
    } else {
      if (inputtedValue == static_eth_keccak) {
        setInputtedKeccak256(inputtedValue)
      }
    }
  }

  function handleNext() {
    // Need to update local storage key, "coin", with a value of "both"
    let checkLocalStorage = localStorage.getItem("coin")
    if (checkLocalStorage) {
      localStorage.setItem("coin", "both")
    } else {
      appDispatch({ type: "setLocalStorage" })
    }

    navigate("/WalletMain")
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
    setStaticEthPubKey(uint8arraytools.toHex(appState.keys.bufferPubKey))
  }, [])

  return (
    <>
      <CSSTransition in={isModalDropDownOpen} timeout={400} classNames="modal__cover" unmountOnExit>
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
              <MdMenu onClick={() => appDispatch({ type: "toggleMenu" })} className="icon" />
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
              <button onClick={handleNext} className="button-blue button--smaller-font button-blue--pulsing">
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

export default EthereumAddress
