import React, { useContext, useEffect, useState, useRef } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

// WalletConnect UI Components
import QRreaderPopup from "../QRreaderPopup"

// WalletConnect Function Components
import { Core, RELAYER_EVENTS } from "@walletconnect/core"
import { Web3Wallet } from "@walletconnect/web3wallet"
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils"
import { Wallet, InfuraProvider } from "ethers"
import { formatJsonRpcResult, formatJsonRpcError } from "@walletconnect/jsonrpc-utils"

// REACT NPM TOOLS
import { IconContext } from "react-icons"
import { MdMenu, MdLibraryBooks, MdQrCodeScanner, MdContentPasteGo, MdPhonelinkRing, MdVerifiedUser } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"
import { BsHddNetworkFill, BsHddNetwork, BsReception4 } from "react-icons/bs"
import { IoIosApps } from "react-icons/io"
import { Tooltip } from "react-tooltip"
import { CSSTransition } from "react-transition-group"
import { useNavigate } from "react-router-dom"
import LazyLoadFallback from "../LazyLoadFallback"

function WalletConnect_Main() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [txStatus, setTxStatus] = useState(0)
  const [progress, setProgress] = useState(null)

  // WALLETCONNECT_PROJECT_ID=d2f7fad8d0481469a4d421d508e54f1f
  const core = new Core({
    projectId: "d2f7fad8d0481469a4d421d508e54f1f"
  })

  const [web3wallet, setWeb3Wallet] = useState()

  async function initWeb3Wallet() {
    const web3wallet = await Web3Wallet.init({
      core, // <- pass the shared `core` instance
      metadata: {
        name: "ARTSNL",
        description: "An open-sourced DIY wallet concept.",
        url: "https://artsnl.xyz",
        icons: []
      }
    })

    setWeb3Wallet(web3wallet)
  }

  useEffect(() => {
    initWeb3Wallet()
  }, [])

  const [hasProposal, setHasProposal] = useState(false)
  const [sessionProposal, setSessionProposal] = useState(null)
  const sessionProposal_Struct = {
    id: 1696767315254710,
    params: {
      id: 1696767315254710,
      pairingTopic: "d734982cb96ea841155acf8821203c3cde0a742f820808fc262d20a5c8b5655c",
      expiry: 1696767620,
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction", "personal_sign"],
          chains: ["eip155:5"],
          events: ["chainChanged", "accountsChanged"]
        }
      },
      optionalNamespaces: {
        eip155: {
          methods: ["eth_signTransaction", "eth_sign", "eth_signTypedData", "eth_signTypedData_v4"],
          chains: ["eip155:5"],
          events: []
        }
      },
      relays: [
        {
          protocol: "irn"
        }
      ],
      proposer: {
        publicKey: "ce8f22bf6d16f1ec4186cf3bac144f34dd81cc075fcb7d6dcc11f56d3570d928",
        metadata: {
          description: "React App for WalletConnect",
          url: "https://react-app.walletconnect.com",
          icons: ["https://avatars.githubusercontent.com/u/37784886"],
          name: "React App",
          verifyUrl: "https://verify.walletconnect.com"
        }
      }
    },
    verifyContext: {
      verified: {
        verifyUrl: "https://verify.walletconnect.com",
        validation: "VALID",
        origin: "https://react-app.walletconnect.com",
        isScam: null
      }
    }
  }

  const [authObject, setAuthObject] = useState({
    request: null,
    iss: null,
    message: null
  })
  const [attemptSIWE, setAttemptSIWE] = useState(false)

  useEffect(() => {
    web3wallet?.on("session_proposal", async sessionProposal => {
      console.log(sessionProposal)
      setHasProposal(true)
      setSessionProposal(sessionProposal)

      const { verifyContext } = sessionProposal
      const validation = verifyContext?.verified.validation // can be VALID, INVALID or UNKNOWN
      const origin = verifyContext?.verified.origin // the actual verified origin of the request
      const isScam = verifyContext?.verified.isScam // true if the domain is flagged as malicious

      // if the domain is flagged as malicious, you can should warn the user as they may lose their funds - check the `Threat` case for more info
      if (isScam) {
        // show a warning screen to the user
        // and proceed only if the user accepts the risk
      }

      switch (validation) {
        case "VALID":
          // proceed with the request - check the `Domain match` case for more info
          break
        case "INVALID":
          // show a warning dialog to the user - check the `Mismatch` case for more info
          // and proceed only if the user accepts the risk
          break
        case "UNKNOWN":
          // show a warning dialog to the user - check the `Unverified` case for more info
          // and proceed only if the user accepts the risk
          break
      }
    })

    web3wallet?.on("auth_request", async request => {
      const authRequestObject_struct = {
        id: 1697944971564319,
        topic: "3bd54564920744d1dfcdad50013a732d6bb2c4d0b254dc3810dada4c3e22b4d6",
        params: {
          requester: {
            publicKey: "f7c3fe28d13e4059eae3aa9e89f253388e23379ea95f7ec43b5af5ec089ab17c",
            metadata: {
              name: "react-dapp-auth",
              description: "React Example Dapp for Auth",
              url: "react-auth-dapp.walletconnect.com",
              icons: []
            }
          },
          cacaoPayload: {
            type: "eip4361",
            chainId: "eip155:1",
            statement: "Sign in with wallet.",
            aud: "https://react-auth-dapp.walletconnect.com/",
            domain: "walletconnect.com",
            version: "1",
            nonce: "W0ihqtlCRkIseWlKl",
            iat: "2023-10-22T03:22:51.564Z"
          }
        },
        verifyContext: {
          verified: {
            verifyUrl: "",
            validation: "UNKNOWN",
            origin: "www.walletconnect.com"
          }
        }
      }
      console.log(request)

      const { id, params } = request

      // the user’s address
      const iss = `did:pkh:eip155:1:${appState.ethereum.address}`

      // format the cacao payload with the user’s address
      const message = web3wallet.formatMessage(params.cacaoPayload, iss)
      console.log(message)

      let newObject = { request: request, iss: iss, message: message }
      setAuthObject(newObject)
      setProgress("success")
      setAttemptSIWE(true)
    })
  }, [web3wallet])

  const inputRef = useRef()
  const [openQRreader, setOpenQRreader] = useState(false)
  const [scannedValue, setScannedValue] = useState()

  function handlePaste() {
    navigator.clipboard
      .readText()
      .then(res => {
        inputRef.current.value = res
      })
      .catch(console.error)
  }

  async function handleConnect(e) {
    e.preventDefault()
    let uri = inputRef.current.value

    if (!uri.trim()) {
      null
    } else {
      try {
        setProgress("loading")
        await web3wallet.pair({ uri })
      } catch (error) {
        setProgress("error")
        console.error(error)
      }
    }
  }

  async function approveAuth() {
    let key_string = appState.keys.bufferPrivKey.toString("hex")
    const wallet = new Wallet(key_string)
    const signature = await wallet.signMessage(authObject.message)
    console.log("[ARTSNL]: Auth Signature: " + signature)

    // approve
    await web3wallet.respondAuthRequest(
      {
        id: authObject.request.id,
        signature: {
          s: signature,
          t: "eip191"
        }
      },
      authObject.iss
    )

    setAttemptSIWE(false)
  }

  async function rejectAuth() {
    await web3wallet.respondAuthRequest(
      {
        id: authObject.request.id,
        error: getSdkError("USER_REJECTED")
      },
      authObject.iss
    )

    console.log("[ARTSNL]: Rejected Auth Signature.")
    setAttemptSIWE(false)
  }

  const [session, setSession] = useState(null)

  function navigateToWalletHome() {
    navigate("/WalletMain")
  }

  return (
    <>
      {/* <CSSTransition in={txStatus === 0} timeout={300} classNames="tx-builder__overlay" unmountOnExit>
        <WC_Scanner setTxStatus={setTxStatus} />
      </CSSTransition> */}

      {openQRreader ? <QRreaderPopup setInputValue={setScannedValue} setScannedValue={setScannedValue} openQRreader={openQRreader} setOpenQRreader={setOpenQRreader} /> : ""}

      <div style={{ justifyContent: "flex-end" }} className="tx-builder__overlay">
        <div className="wc-dashboard display-flex display-flex--column">
          {!hasProposal && !attemptSIWE && !session ? (
            <>
              <IconContext.Provider value={{ size: "120px" }}>
                <MdQrCodeScanner onClick={() => setOpenQRreader(!openQRreader)} id="Tooltip" data-tooltip-content="Scan QR code of WalletConnect URI." className="icon" />
              </IconContext.Provider>
              <span className="font--russo-one">Scan QR Code</span>
            </>
          ) : (
            ""
          )}

          {attemptSIWE ? (
            <>
              <div className="wc-dashboard__top display-flex display-flex--column">
                <div style={{ width: "45px", height: "45px", marginBottom: "4px" }}>{authObject.request.params.requester.metadata.icons.length > 0 ? authObject.request.params.requester.metadata.icons : <IoIosApps />}</div>
                {authObject.request.params.requester.metadata.name}
                <br />
                wants to authenticate your
                <br />
                address ownership
                <br />
                <span style={{ fontSize: ".7rem", color: "darkgray" }} className="display-flex font--michroma">
                  <MdVerifiedUser style={{ width: "17px", height: "17px", marginRight: "4px", color: "#27bf77" }} />
                  {authObject.request.params.requester.metadata.url}
                </span>
              </div>
              <div className="wc-dashboard__bottom">{authObject.message}</div>
            </>
          ) : (
            ""
          )}
        </div>

        <div style={{ position: "relative", columnGap: "10px", alignItems: "flex-start" }} className="wc-inputs display-flex">
          {!hasProposal && !attemptSIWE && !session ? (
            <>
              <IconContext.Provider value={{ size: "40px" }}>
                <MdContentPasteGo id="Tooltip" data-tooltip-content="Paste WalletConnect URI string from dApp" onClick={() => handlePaste()} style={{ zIndex: "1", top: "6", right: "50", transform: "scaleX(-1)" }} className="icon position-absolute" />
              </IconContext.Provider>

              <IconContext.Provider value={{ size: "40px" }}>
                <MdPhonelinkRing onClick={e => handleConnect(e)} id="Tooltip" data-tooltip-content="Submit inputted URI for WalletConnect connection" style={{ zIndex: "1", top: "6", right: "7" }} className="icon position-absolute" />
              </IconContext.Provider>
              <form onSubmit={e => handleConnect(e)}>
                <input id="uri-input" ref={inputRef} style={{ borderRadius: "10px", height: "100%", position: "inherit" }} value={scannedValue ? scannedValue : undefined} onFocus={() => setScannedValue()} placeholder="Input URI" type="text" />
              </form>
            </>
          ) : (
            ""
          )}

          {attemptSIWE ? (
            <>
              <button onClick={() => rejectAuth()} style={{ color: "pink" }} className="button-red">
                Reject
              </button>
              <button onClick={() => approveAuth()} style={{ color: "lightblue" }} className="button-blue">
                Approve
              </button>
            </>
          ) : (
            ""
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }} className="wc-logo">
          {progress == "loading" ? <LazyLoadFallback /> : <img style={{ width: "70px" }} src="https://walletconnect.com/_next/static/media/brand_logo_blue.60e0f59b.svg" alt="wc-logo" />}
        </div>
      </div>

      {/* the below jsx is used as the header, footer, and backbone foundational layout for the above components */}
      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div style={{ cursor: "default" }} className="title-font title-font--large">
            <div className="title__subtitle">WalletConnect Status: No open pairings</div>
            <div style={{ display: "inline-block" }} className="purple-font">
              Connect to
            </div>{" "}
            web3
          </div>
          <MdMenu onClick={() => appDispatch({ type: "toggleMenu" })} className="icon" />
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
          <TbRefresh id="Tooltip" data-tooltip-content={"Refresh"} onClick={null} className="icon" />
          {appState.isTestnet ? <BsHddNetwork id="Tooltip" data-tooltip-content={"On Testnet"} className={"icon"} /> : <BsHddNetworkFill id="Tooltip" data-tooltip-content={"On Mainnet"} className={"icon"} />}
          <div onClick={() => navigateToWalletHome()} id="Tooltip" data-tooltip-content={"Home"} className="icon">
            ARTSNL
          </div>
          <BsReception4 id="Tooltip" data-tooltip-content={appState.bitcoin.activeProvider && appState.ethereum.activeProvider ? "Network Status: Connected" : "Network Status: Disconnected"} className="icon" />
          <MdLibraryBooks className="icon" />
        </div>
      </div>
      <Tooltip anchorSelect="#Tooltip" style={{ fontSize: "0.7rem", maxWidth: "100%", overflowWrap: "break-word", zIndex: "101" }} variant="info" />
    </>
  )
}

export default WalletConnect_Main

{
  /* <div style={{ justifyContent: "flex-end" }} className="tx-builder__overlay">
  <div className="wc-dashboard"></div>
  <div className="wc-inputs"></div>
  <div className="wc-logo"></div>
</div> */
}
