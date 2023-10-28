# THE ARTSNL PROJECT

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Twitter Follow](https://img.shields.io/twitter/follow/artsnl?style=social)](https://twitter.com/ARTSNL)

ARTSNL is a fully open-sourced, DIY’ed approached cryptocurrency wallet entirely written in React and bundled with Webpack.

Try out the Beta release [here](https://artsnl.app/)!

## QUICK DEMO VIDEOS

- [Using WalletConnect with ARTSNL](https://twitter.com/ARTSNL/status/1717743872032301406)
- [Building & broadcasting ether transactions](https://twitter.com/ARTSNL/status/1711952805265645866)
- [Managing ERC20 tokens in ARTSNL](https://twitter.com/ARTSNL/status/1711928038416613652)
- [Constructing P2PKH pay-to-multiple bitcoin testnet transactions](https://twitter.com/ARTSNL/status/1704086686207242733)

## INTRODUCTION

ARTSNL is a fully open-sourced, DIY’ed approached cryptocurrency wallet. Common wallet UX processes, such as key generation and transaction structuring, are expanded upon for a more educational hands-on manner. More control is given to the end user making the entire crypto wallet experience more artisanal.

ARTSNL was developed with the education of the end user in mind. Many modern and new crypto wallets are focused on simplifying UX, albeit sacrificing the crucial basic knowledge of how it all works beneath the surface. ARTSNL focuses on balancing both by providing contextual knowledge of fundamental crypto wallet concepts, each step of the way.

## MOTIVATION & MEANING BEHIND ARTSNL

The term "artisanal" refers to something that is produced in a traditional or skilled manner, often by hand, using craftsmanship and expertise. It's used to describe products or goods that are made with attention to detail, high-quality ingredients or materials, and a focus on preserving traditional methods and techniques. Artisanal products are typically seen as unique, authentic, and often of higher quality due to the care and skill put into their creation. This term is commonly associated with food, beverages, crafts, and other products that are made in small batches and with a strong emphasis on craftsmanship.

Every ARTSNL crypto wallet is a one-of-a-kind creation, self-constructed using basic fundamental methods that reflect the pastime of early crypto users. The carefully designed UI & UX allows for a granular control of flow, giving each user’s wallet a unique character that sets it apart from mass-produced alternatives that abstract important technical processes. We believe every crypto ownership should be familiar with these technical processes as a fundamental skill set in their gamut of crypto knowledge.

## FEATURES

- Full self-custody
- Serveless
- Client side
- **Bitcoin support**:
  - P2PKH
  - Pay to multiple
  - PSBT transaction structuring
- **Ethereum support**:
  - Type 2 transactions
  - Arbitrary data property
- **Import external key**:
  - Raw hexadecimal
  - WIF
  - BIP38
- Self-creation of entropy (use prudently)
- Bitcoin mainnet and testnet support
- Ethereum mainnet and Goerli testnet support
- Local browser key management

## ARTSNL ADVANTAGES

ARTSNL, as a web app, provides easy access as long as you have access to the internet. No hardware setup or downloading is needed.

At the moment, ARTSNL is designed in a way to store your encrypted key pair in your local browser. Easy access to them is fulfilled via the ARTSNL web app. Having a backup is not mandatory but is highly suggested. As long as your browser and local computer is free from any phishing attempts, malware, and etc., your key pair is secure. Modern cipher tools are used to encrypt your raw hexadecimal key with a unique secret.

ARTSNL processes, such as key pair and transaction creation, are laid out in an explanatory manner making you better equipped with basic wallet fundamentals.

## GETTING STARTED

On your familiar & trusted desktop web browser, just navigate to [artsnl.app](https://artsnl.app/) and begin!

> The design of the UI should display properly on most new mobile phones but it is intended for a modern desktop web browser.

## SECURITY

> Private key management is hard.

There is no single, proven method for perfect private key security. It doesn’t matter if you’re using a mobile, web, software, hardware, analog, or etc. for your private key storage. They all come with their own set of disadvantages and advantages.

Security & UX are diametrically separate but there is a prudent balance to obtain. ARTSNL utilizes the security of the browser for your private key management. Your raw hexadecimal key and uncompressed public key is ciphered and stored in your browser’s local storage and cookie storage. As long as you don’t have any malicious malware (or any other dangerous forms of hacking) on your computer, you should be fine.

But do keep in mind to **NEVER** store all your crypto in one wallet nor should you ever give out your private key to someone else.

> One should always be [wallet agnostic](https://mirror.xyz/ecbsj.eth/tTKWbKhRBP5_fjMjS60biFxouxGVNrUQZFP7c2DkBGU).

## RAW CODE EXAMPLES

- [Generate raw hexadecimal key from entropy](https://github.com/ECBSJ/ARTSNL/blob/main/app/assets/scripts/components/DisplayMultipleRaw.js)

```
let binary = "1010100101000101011010101101010010100101010010010100111010100101001010010101110010100100101010010100101001111011001010100101001010010100101001010010100111100001010101001010101010010101011001111100101010010101010010101111001010100101010010100101111010101010"
let bigIntBinary = BigInt("0b" + binary)
let decimalString = bigIntBinary.toString(10)
let hexString = bigIntBinary.toString(16)
let privateKeyBuffer = Buffer.from(hexString, "hex")
let keyPair = ECPair.fromPrivateKey(privateKeyBuffer, Mainnet)
let eccPubKeyBuffer = ecc.pointFromScalar(privateKeyBuffer, true)
```

- Deriving `x` and `y` coordinates from uncompressed public key

```
let result = ecc.pointFromScalar(privateKey, false)
let xCoordinate = result.slice(1, 33)
let yCoordinate = result.slice(33, 65)
```

- [Generate bitcoin address](https://github.com/ECBSJ/ARTSNL/blob/main/app/assets/scripts/components/BitcoinAddress.js)

```
let result = ecc.pointFromScalar(privateKey, false)
let riped = bitcoin.crypto.hash160(result)
let prefix = Buffer.from("6F", "hex")
let prefix_riped = [prefix, riped]
let combined_prefix_riped = Buffer.concat(prefix_riped)
let checksum = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped)).slice(0, 4)
let arr = [prefix, riped, checksum]
let combinedBuff = Buffer.concat(arr)
let address = base58.encode(combinedBuff)
```

- [Generate ethereum address](https://github.com/ECBSJ/ARTSNL/blob/main/app/assets/scripts/components/EthereumAddress.js)

```
let result = ecc.pointFromScalar(privateKey, false)
let prepareETHpubKey = result.slice(1, 65)
let keccakPubKey = ethers.keccak256(prepareETHpubKey)
let removed_0x = keccakPubKey.slice(2)
let prepareETHpubAdd = Buffer.from(removed_0x, "hex")
let ETHpubAdd = prepareETHpubAdd.slice(-20)
let finalETHpubAdd = "0x" + uint8arraytools.toHex(ETHpubAdd)
```

## CURRENT BUGS

- Brave browser caps cookie max-age to 1 week by default for some users.

## ROADMAP

- ERC20 support
- WalletConnect v2
- P2WPKH bitcoin tx
- Ledger hardware wallet support
- Light/Dark mode feature
- Compressed Public Key address derivation
- BIP39 external seed phrase import

## Design

- For the original custom designs of artsnl.app and artsnl.xyz, check out the Figma file [here](https://www.figma.com/file/0Uwx9Ur3lPq7BjZy9sIeGO/ARTSNL?type=design&mode=design&t=8eJ8AaSH0yhNQ0Sl-1).

## TECHNOLOGY TOOLING SUPPORT

- [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)
- [ethers.js](https://github.com/ethers-io/ethers.js)
- [Mempool.space API](https://mempool.space/docs/api/rest)
- [Infura’s EVM providers](https://www.infura.io)

## CONTRIBUTING

Clone this repo and start playing around!

```
$ git clone https://github.com/ECBSJ/ARTSNL.git
$ npm install
$ npm run dev
```

Reach out to the dev team at our [Discord](https://discord.gg/t2z36UvaTc)

## STAY UPDATED

- [Main Website](https://artsnl.xyz)
- [Twitter](https://twitter.com/ARTSNL)
- [Blog](https://mirror.xyz/artsnl.eth)
- [Knowledge](https://artsnl.gitbook.io/artsnl-knowledge-space/)
- [Chat](https://discord.gg/t2z36UvaTc)
