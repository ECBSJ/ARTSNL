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
import { MdMenu, MdLibraryBooks, MdQrCodeScanner, MdContentPasteGo, MdPhonelinkRing, MdVerifiedUser, MdOutlineWarning, MdAppBlocking, MdOutlineConnectWithoutContact } from "react-icons/md"
import { TbRefresh, TbActivityHeartbeat, TbPlugConnected, TbError404 } from "react-icons/tb"
import { BsHddNetworkFill, BsHddNetwork, BsReception4, BsQuestionOctagonFill, BsFillSignStopFill } from "react-icons/bs"
import { IoIosApps } from "react-icons/io"
import { FaSignature, FaUserCircle, FaLink } from "react-icons/fa"
import { Tooltip } from "react-tooltip"
import { CSSTransition } from "react-transition-group"
import { useNavigate } from "react-router-dom"
import LazyLoadFallback from "../LazyLoadFallback"
import { CodeBlock, tomorrowNightBlue, tomorrowNightBright } from "react-code-blocks"

function WalletConnect_Main() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

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

  const [verifyState, setVerifyState] = useState({
    state: "",
    message: ""
  })

  function determineVerifyState(verifyContext) {
    // interface verifyContext: {
    //   verified: {
    //     verifyUrl: "https://verify.walletconnect.com",
    //     validation: "VALID",
    //     origin: "https://react-app.walletconnect.com",
    //     isScam: null,
    //   },
    // }

    const validation = verifyContext.verified.validation // can be VALID, INVALID or UNKNOWN
    const origin = verifyContext.verified.origin // the actual verified origin of the request
    const isScam = verifyContext.verified.isScam ? verifyContext.verified.isScam : null // true if the domain is flagged as malicious

    if (isScam) {
      setVerifyState({
        state: "SCAM",
        message: "This domain is flagged as malicious and potentially harmful."
      })

      return
    }

    switch (validation) {
      case "VALID":
        setVerifyState({
          state: "VALID",
          message: "The domain linked to this request has been verified as this application's domain."
        })
        break
      case "INVALID":
        setVerifyState({
          state: "INVALID",
          message: "The application's domain doesn't match the sender of this request."
        })
        break
      case "UNKNOWN":
        setVerifyState({
          state: "UNKNOWN",
          message: "The domain sending the request cannot be verified."
        })
        break
    }
  }

  useEffect(() => {
    web3wallet?.on("session_proposal", async sessionProposal => {
      console.log(sessionProposal)
      setHasProposal(true)
      setSessionProposal(sessionProposal)

      const { verifyContext } = sessionProposal
      determineVerifyState(verifyContext)
      setProgress("success")
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

      const { id, params, verifyContext } = request

      determineVerifyState(verifyContext)

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
    try {
      setProgress("loading")
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
      setProgress("success")
      setIsResultModalOpen(true)
      setResultModalCode(1)

      setTimeout(() => {
        setIsResultModalOpen(false)
        setResultModalCode(0)
        navigate("/WalletMain")
      }, 3000)
    } catch (err) {
      console.error(err)
      setProgress("error")
    }
  }

  async function rejectAuth() {
    try {
      setProgress("loading")
      await web3wallet.respondAuthRequest(
        {
          id: authObject.request.id,
          error: getSdkError("USER_REJECTED")
        },
        authObject.iss
      )

      console.log("[ARTSNL]: Rejected Auth Signature.")
      setAttemptSIWE(false)
      setProgress("success")
      setAuthObject({
        request: null,
        iss: null,
        message: null
      })
      setVerifyState({
        state: "",
        message: ""
      })

      setIsResultModalOpen(true)
      setResultModalCode(2)

      setTimeout(() => {
        setProgress(null)
        setIsResultModalOpen(false)
      }, 3000)
    } catch (err) {
      console.error(err)
      setProgress("error")
    }
  }

  async function rejectSesh() {
    try {
      setProgress("loading")
      await web3wallet.rejectSession({
        id: sessionProposal.id,
        reason: getSdkError("USER_REJECTED_METHODS")
      })

      setHasProposal(false)
      setSessionProposal(null)
      setVerifyState({
        state: "",
        message: ""
      })

      setIsResultModalOpen(true)
      setResultModalCode(2)

      setTimeout(() => {
        setProgress(null)
        setIsResultModalOpen(false)
      }, 3000)
    } catch (err) {
      console.error(err)
      setProgress("error")
    }
  }

  const [session, setSession] = useState(null)
  const session_Struct = {
    relay: {
      protocol: "irn"
    },
    namespaces: {
      eip155: {
        chains: ["eip155:5"],
        methods: ["eth_sendTransaction", "personal_sign", "eth_sign", "eth_signTransaction"],
        events: ["accountsChanged", "chainChanged"],
        accounts: ["eip155:5:0x58e2534aaf92c018e8838d5c1d2adef358160161"]
      }
    },
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
    pairingTopic: "4c826f3a3d8bc8ae5ffa17fdf9496dfe8149f45f7b4462b26d6df50148c5c19f",
    controller: "70c09bda721849774ff96a31859fe50606d8d4d3c35e0876621a10cc63b3b51c",
    expiry: 1697371735,
    topic: "d88899647f868f29ea9e33f8d15437d2929fe5942a22c3d573a2ae8f3d0a9514",
    acknowledged: false,
    self: {
      publicKey: "70c09bda721849774ff96a31859fe50606d8d4d3c35e0876621a10cc63b3b51c",
      metadata: {
        name: "Demo app",
        description: "Demo Client as Wallet/Peer",
        url: "www.walletconnect.com",
        icons: []
      }
    },
    peer: {
      publicKey: "0e99577975613af66c8294a608505da4c9aee836f46d86fc88c1ef1b3701672e",
      metadata: {
        description: "React App for WalletConnect",
        url: "https://react-app.walletconnect.com",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
        name: "React App",
        verifyUrl: "https://verify.walletconnect.com"
      }
    }
  }

  async function approveSesh() {
    try {
      setProgress("loading")
      const { id, params } = sessionProposal

      // ------- namespaces builder util ------------ //
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: ["eip155:1", "eip155:5", "eip155:10", "eip155:137", "eip155:42161"],
            methods: ["eth_sendTransaction", "personal_sign", "eth_signTransaction"],
            events: ["accountsChanged", "chainChanged"],
            accounts: [`eip155:1:${appState.ethereum.address}`, `eip155:5:${appState.ethereum.address}`, `eip155:10:${appState.ethereum.address}`, `eip155:137:${appState.ethereum.address}`, `eip155:42161:${appState.ethereum.address}`]
          }
        }
      })
      // ------- end namespaces builder util ------------ //

      const session = await web3wallet.approveSession({
        id,
        namespaces: approvedNamespaces
      })
      console.log(session)
      setSession(session)
      setHasProposal(false)
      setProgress(null)
    } catch (err) {
      console.error(err)
      setProgress("error")
    }
  }

  async function disconnectSesh() {
    try {
      setProgress("loading")
      await web3wallet.disconnectSession({
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED")
      })

      setSession(null)
      setSessionProposal(null)
      setVerifyState({
        state: "",
        message: ""
      })

      setResultModalCode(4)
      setIsResultModalOpen(true)

      setTimeout(() => {
        setProgress(null)
        setIsResultModalOpen(false)
      }, 3000)

      setTimeout(() => {
        navigate("/WalletMain")
      }, 3300)
    } catch (err) {
      console.error(err)
      setProgress("error")
    }
  }

  async function onSessionPing() {
    try {
      setProgress("loading")
      const { topic } = session
      await web3wallet.engine.signClient.ping({ topic })
      console.log("[ARTSNL]: Connection ping to dApp session, via WalletConnect, success.")

      setResultModalCode(3)
      setIsResultModalOpen(true)

      setTimeout(() => {
        setProgress(null)
        setIsResultModalOpen(false)
      }, 3000)
    } catch (err) {
      console.error(err)
      console.error("[ARTSNL]: Connection ping to dApp session, via WalletConnect, failed.")
      setProgress("error")
    }
  }

  const [sessionRequestReceived, setSessionRequestReceived] = useState(false)
  const [sessionEvent, setSessionEvent] = useState(null)
  // interface Event {
  //   id: number
  //   topic: string
  //   params: {
  //     request: {
  //       method: string
  //       params: any
  //     }
  //     chainId: string
  //   }
  //   verifyContext: {}
  // }

  const [requestPayloadMessage, setRequestPayloadMessage] = useState(null)

  useEffect(() => {
    web3wallet?.on("session_request", async event => {
      console.log(event)
      setSessionRequestReceived(true)
      setSessionEvent(event)

      const { topic, params, id } = event
      const { request, chainId } = params
      const requestParamsMessage = request.params[0]

      switch (request?.method) {
        case "personal_sign":
          // convert `requestParamsMessage` by using a method like hexToUtf8
          let buffered = Buffer.from(requestParamsMessage.slice(2), "hex")
          let message = buffered.toString("utf8")
          console.log("[ARTSNL]: " + message)
          setRequestPayloadMessage(message)
          break
        case "eth_sendTransaction":
          console.log("[ARTSNL]: {Object} for send approval below:")
          console.log(requestParamsMessage)
          setRequestPayloadMessage(requestParamsMessage)
          break
        case "eth_signTransaction":
          console.log("[ARTSNL]: {Object} to sign below:")
          console.log(requestParamsMessage)
          setRequestPayloadMessage(requestParamsMessage)
          break
        default:
          console.error("[ARTSNL]: Request method invalid or unsupported.")
          break
      }
    })

    web3wallet?.engine.signClient.on("session_ping", event => {
      // interface Event {
      //   id: number
      //   topic: string
      // }

      if (event) {
        setProgress("loading")
        console.log("[ARTSNL]: Connection ping from dApp session, via WalletConnect, success.")
        console.log(event)

        setResultModalCode(3)
        setIsResultModalOpen(true)

        setTimeout(() => {
          setProgress(null)
          setIsResultModalOpen(false)
        }, 3000)
      } else {
        console.error("[ARTSNL]: Connection ping from dApp session, via WalletConnect, failed.")
      }
    })

    web3wallet?.on("session_delete", async event => {
      setProgress("loading")
      console.log(event)
      // interface Event {
      //   id: number
      //   topic: string
      // }
      const { id, topic } = event
      setSession(null)
      setSessionProposal(null)
      console.log("[ARTSNL]: WalletConnect session has been disconnected from the dApp side.")

      setVerifyState({
        state: "",
        message: ""
      })

      setResultModalCode(4)
      setIsResultModalOpen(true)

      setTimeout(() => {
        setProgress(null)
        setIsResultModalOpen(false)
      }, 3000)

      setTimeout(() => {
        navigate("/WalletMain")
      }, 3300)
    })
  }, [web3wallet])

  async function handleApproveRequest() {
    try {
      setProgress("loading")
      const { topic, params, id } = sessionEvent
      const { request, chainId } = params
      const requestParamsMessage = request.params[0]
      // chainId_struct = "eip155:10"
      let splitString = chainId.split(":")
      let parsedChainId = Number(splitString[1])
      let key_string = appState.keys.bufferPrivKey.toString("hex")

      const provider = new InfuraProvider(parsedChainId, process.env.INFURA)
      const wallet = new Wallet(key_string, provider)

      let response

      switch (request?.method) {
        case "personal_sign":
          // convert `requestParamsMessage` by using a method like hexToUtf8
          let buffered = Buffer.from(requestParamsMessage.slice(2), "hex")
          let message = buffered.toString("utf8")
          let signedMessage = await wallet.signMessage(message)
          console.log("[ARTSNL]: " + signedMessage)
          // const response = { id, result: signedMessage, jsonrpc: "2.0" }
          response = formatJsonRpcResult(id, signedMessage)
          break
        case "eth_sendTransaction":
          const { hash } = await wallet.sendTransaction(requestParamsMessage)
          console.log("[ARTSNL]: " + hash)
          // const response = { id, result: hash, jsonrpc: "2.0" }
          response = formatJsonRpcResult(id, hash)
          break
        case "eth_signTransaction":
          const signature = await wallet.signTransaction(requestParamsMessage)
          console.log("[ARTSNL]: " + signature)
          // const response = { id, result: signature, jsonrpc: "2.0" }
          response = formatJsonRpcResult(id, signature)
          break
        default:
          console.error("[ARTSNL]: Request method invalid or unsupported.")
          break
      }

      await web3wallet.respondSessionRequest({
        topic,
        response
      })

      setSessionRequestReceived(false)
      setSessionEvent(null)
      setRequestPayloadMessage(null)

      setResultModalCode(1)
      setIsResultModalOpen(true)

      setTimeout(() => {
        setProgress(null)
        setIsResultModalOpen(false)
      }, 3000)
    } catch (err) {
      console.error(err)
      setProgress("error")
    }
  }

  async function handleRejectRequest() {
    try {
      setProgress("loading")
      const { topic, params, id } = sessionEvent

      const response = {
        id,
        jsonrpc: "2.0",
        error: {
          code: 5000,
          message: "User rejected!"
        }
      }

      await web3wallet.respondSessionRequest({
        topic,
        response: formatJsonRpcError(id, response.error)
      })

      setSessionRequestReceived(false)
      setSessionEvent(null)
      setRequestPayloadMessage(null)

      setResultModalCode(2)
      setIsResultModalOpen(true)

      setTimeout(() => {
        setProgress(null)
        setIsResultModalOpen(false)
      }, 3000)
    } catch (err) {
      console.error(err)
      setProgress("error")
    }
  }

  function navigateToWalletHome() {
    navigate("/WalletMain")
  }

  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [resultModalCode, setResultModalCode] = useState(0)
  // Result modal codes
  // 1 = approve
  // 2 = reject
  // 3 = ping
  // 4 = disconnect

  return (
    <>
      <CSSTransition in={progress == "error"} timeout={300} classNames="wc--error" unmountOnExit>
        <div className="wc--error">
          <IconContext.Provider value={{ size: "120px", color: "white" }}>
            <TbError404 onClick={() => navigateToWalletHome()} className="icon" />
          </IconContext.Provider>
          Uh oh, looks like an unexpected error happened with your WalletConnect instance. Please check browser console and try again.
        </div>
      </CSSTransition>

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
                <div style={{ width: "45px", height: "45px", marginBottom: "4px" }}>{authObject.request.params.requester.metadata.icons.length > 0 ? <IoIosApps /> : <IoIosApps />}</div>
                {authObject.request.params.requester.metadata.name}
                <br />
                wants to authenticate your
                <br />
                address ownership
                <br />
                <span id="Tooltip" data-tooltip-content={verifyState.message} style={{ fontSize: ".7rem", color: "darkgray", columnGap: "5px" }} className="display-flex font--michroma">
                  <IconContext.Provider value={{ size: "17px" }}>{verifyState.state == "SCAM" ? <BsFillSignStopFill style={{ color: "red" }} /> : verifyState.state == "VALID" ? <MdVerifiedUser style={{ color: "#27bf77" }} /> : verifyState.state == "INVALID" ? <MdOutlineWarning style={{ color: "orange" }} /> : <BsQuestionOctagonFill style={{ color: "gray" }} />}</IconContext.Provider>

                  {authObject.request.params.requester.metadata.url}
                </span>
              </div>
              <div className="wc-dashboard__bottom">{authObject.message}</div>
            </>
          ) : (
            ""
          )}

          {hasProposal ? (
            <>
              <div className="wc-dashboard__top display-flex display-flex--column">
                <div style={{ width: "45px", height: "45px", marginBottom: "4px" }}>{sessionProposal.params.proposer.metadata.icons.length > 0 ? <IoIosApps /> : <IoIosApps />}</div>
                {sessionProposal.params.proposer.metadata.name}
                <br />
                wants to connect
                <br />
                <span id="Tooltip" data-tooltip-content={verifyState.message} style={{ fontSize: ".7rem", color: "darkgray", columnGap: "5px" }} className="display-flex font--michroma">
                  <IconContext.Provider value={{ size: "17px" }}>{verifyState.state == "SCAM" ? <BsFillSignStopFill style={{ color: "red" }} /> : verifyState.state == "VALID" ? <MdVerifiedUser style={{ color: "#27bf77" }} /> : verifyState.state == "INVALID" ? <MdOutlineWarning style={{ color: "orange" }} /> : <BsQuestionOctagonFill style={{ color: "gray" }} />}</IconContext.Provider>

                  {sessionProposal.params.proposer.metadata.url}
                </span>
              </div>
              <div className="wc-dashboard__bottom">
                <CodeBlock text={JSON.stringify(sessionProposal, null, 2)} language={"json"} showLineNumbers={true} theme={tomorrowNightBlue} wrapLongLines={true} />
              </div>
            </>
          ) : (
            ""
          )}

          {session && !sessionRequestReceived ? (
            <>
              <div className="wc-dashboard__top display-flex display-flex--column">
                <div style={{ width: "45px", height: "45px", marginBottom: "4px" }}>{session.peer.metadata.icons.length > 0 ? <IoIosApps /> : <IoIosApps />}</div>
                {session.peer.metadata.name}
                <br />
                is currently connected
                <br />
                to your wallet
                <br />
                <span id="Tooltip" data-tooltip-content={verifyState.message} style={{ fontSize: ".7rem", color: "darkgray", columnGap: "5px" }} className="display-flex font--michroma">
                  <IconContext.Provider value={{ size: "17px" }}>{verifyState.state == "SCAM" ? <BsFillSignStopFill style={{ color: "red" }} /> : verifyState.state == "VALID" ? <MdVerifiedUser style={{ color: "#27bf77" }} /> : verifyState.state == "INVALID" ? <MdOutlineWarning style={{ color: "orange" }} /> : <BsQuestionOctagonFill style={{ color: "gray" }} />}</IconContext.Provider>

                  {session.peer.metadata.url}
                </span>
              </div>
              <div style={{ justifyContent: "flex-end" }} className="wc-dashboard__bottom display-flex display-flex--column">
                <IconContext.Provider value={{ size: "53px" }}>
                  <TbActivityHeartbeat className="pulse-me" />
                </IconContext.Provider>
                <button onClick={e => onSessionPing()} style={{ color: "lightblue", height: "50px", marginTop: "20px" }} className="button-blue">
                  Ping
                </button>
                <button onClick={e => disconnectSesh()} style={{ color: "pink", height: "50px", marginTop: "10px" }} className="button-red">
                  Disconnect
                </button>
              </div>
            </>
          ) : (
            ""
          )}

          {session && sessionRequestReceived ? (
            <>
              <div className="wc-dashboard__top display-flex display-flex--column">
                <div style={{ width: "45px", height: "45px", marginBottom: "4px" }}>{session.peer.metadata.icons.length > 0 ? <IoIosApps /> : <IoIosApps />}</div>
                {session.peer.metadata.name}
                <br />
                wants you to
                <br />
                sign a transaction
                <br />
                <span id="Tooltip" data-tooltip-content={verifyState.message} style={{ fontSize: ".7rem", color: "darkgray", columnGap: "5px" }} className="display-flex font--michroma">
                  <IconContext.Provider value={{ size: "17px" }}>{verifyState.state == "SCAM" ? <BsFillSignStopFill style={{ color: "red" }} /> : verifyState.state == "VALID" ? <MdVerifiedUser style={{ color: "#27bf77" }} /> : verifyState.state == "INVALID" ? <MdOutlineWarning style={{ color: "orange" }} /> : <BsQuestionOctagonFill style={{ color: "gray" }} />}</IconContext.Provider>

                  {session.peer.metadata.url}
                </span>
              </div>
              <div className="wc-dashboard__bottom">
                <CodeBlock text={sessionEvent.params.chainId} language={"json"} theme={tomorrowNightBright} />
                <CodeBlock text={JSON.stringify(requestPayloadMessage, null, 2)} language={"json"} showLineNumbers={true} theme={tomorrowNightBlue} wrapLongLines={true} />
              </div>
            </>
          ) : (
            ""
          )}

          <CSSTransition in={isResultModalOpen} timeout={300} classNames="wc-modal" unmountOnExit>
            <IconContext.Provider value={{ size: "120px", color: "white" }}>
              {resultModalCode === 1 ? (
                <div style={{ backgroundColor: "green" }} className="wc-modal display-flex display-flex--column">
                  <FaSignature />
                  <br />
                  Request via WalletConnect <br /> Signed & Approved!
                </div>
              ) : (
                ""
              )}

              {resultModalCode === 2 ? (
                <div style={{ backgroundColor: "red" }} className="wc-modal display-flex display-flex--column">
                  <MdAppBlocking />
                  <br />
                  Request via WalletConnect <br /> Rejected!
                </div>
              ) : (
                ""
              )}

              {resultModalCode === 3 ? (
                <div style={{ backgroundColor: "blue" }} className="wc-modal display-flex display-flex--column">
                  <MdOutlineConnectWithoutContact />
                  <br />
                  Ping Received <br /> & Acknowledged!
                </div>
              ) : (
                ""
              )}

              {resultModalCode === 4 ? (
                <div style={{ backgroundColor: "darkgray" }} className="wc-modal display-flex display-flex--column">
                  <TbPlugConnected />
                  <br />
                  WalletConnect Session <br /> Disconnected!
                </div>
              ) : (
                ""
              )}
            </IconContext.Provider>
          </CSSTransition>
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

          {hasProposal ? (
            <>
              <button onClick={e => rejectSesh()} style={{ color: "pink" }} className="button-red">
                Reject
              </button>
              <button onClick={e => approveSesh()} style={{ color: "lightblue" }} className="button-blue">
                Approve
              </button>
            </>
          ) : (
            ""
          )}

          {session && !sessionRequestReceived ? (
            <>
              <div style={{ fontSize: "1.2rem", color: "lightsteelblue" }} className="font--russo-one">
                Initiate transaction from <br /> the dApp to approve here
              </div>
            </>
          ) : (
            ""
          )}

          {session && sessionRequestReceived ? (
            <>
              <button onClick={e => handleRejectRequest()} style={{ color: "pink" }} className="button-red">
                Reject
              </button>
              <button onClick={e => handleApproveRequest()} style={{ color: "lightblue" }} className="button-blue">
                Approve
              </button>
            </>
          ) : (
            ""
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }} className="wc-logo">
          {progress == "loading" ? <LazyLoadFallback /> : <img id="Tooltip" data-tooltip-content={"ARTSNL with WalletConnect currently only supports the following EIP155 chains: mainnet, goerli, optimism, polygon, arbitrum"} style={{ width: "70px" }} src="https://walletconnect.com/_next/static/media/brand_logo_blue.60e0f59b.svg" alt="wc-logo" />}
        </div>
      </div>

      {/* the below jsx is used as the header, footer, and backbone foundational layout for the above components */}
      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div style={{ cursor: "default" }} className="title-font title-font--large">
            <IconContext.Provider value={{ size: "11px", color: "white" }}>
              <div className="title__subtitle display-flex">
                WalletConnect Status:{" "}
                {session ? (
                  <span style={{ color: "lightcyan", marginLeft: "3px" }}>
                    Connected Session <span style={{ backgroundColor: "lightgreen", display: "inline-block", width: "7px", height: "7px" }} className="circle"></span>
                  </span>
                ) : (
                  "No connected sessions"
                )}
              </div>
              {session ? (
                <>
                  <div style={{ bottom: "-24px" }} className="title__subtitle display-flex">
                    <FaUserCircle style={{ marginRight: "6px" }} />
                    {appState.ethereum.address}
                  </div>
                  <div style={{ bottom: "-37px" }} className="title__subtitle display-flex">
                    <FaLink style={{ marginRight: "6px" }} />
                    {session.namespaces.eip155.chains.map((chain, index) => {
                      return chain
                    })}
                  </div>
                </>
              ) : (
                ""
              )}
              <div style={{ display: "inline-block" }} className="purple-font">
                🌐dive into
              </div>{" "}
              web3
            </IconContext.Provider>
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
          <TbRefresh style={{ visibility: "hidden" }} />
          <BsHddNetworkFill style={{ visibility: "hidden" }} />
          <div onClick={() => navigateToWalletHome()} id="Tooltip" data-tooltip-content={"Home"} className="icon">
            ARTSNL
          </div>
          <BsReception4 style={{ visibility: "hidden" }} />
          <MdLibraryBooks id="Tooltip" data-tooltip-content={"Guide currently unavailable."} className="icon" />
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
