# Your Toolkit to Build Privacy Apps

## Welcome to Nox
Nox is a privacy layer that enables confidential computations on encrypted data while preserving full DeFi composability. It combines on-chain smart contracts with off-chain Trusted Execution Environments (Intel TDX) to process encrypted data without ever exposing plaintext on-chain.

With Nox, you build confidential smart contracts and tokens that stay fully composable with existing DeFi protocols. Your contracts can process encrypted inputs, execute computations privately, and maintain hidden balances, without asking users to change wallets or developers to rewrite contracts.
## Why Nox Matters?
DeFi is transparent by default. That's a feature for retail users. It's a blocker for institutional adoption.

Imagine you want to build:

A lending protocol that doesn't expose collateral ratios to liquidation bots
A yield vault that protects strategy positions from copy-trading
A tokenized fund where investor allocations stay off the public ledger
A payment system that hides transaction amounts while staying verifiable Your institutional users have the capital. But they won't touch a protocol that exposes everything.
With Nox, they will. You unlock the capital. They get the confidentiality. DeFi grows.

## Key Concepts
Native composability
Nox implements the confidential token and remains fully ERC-20 compatible. Nox interacts with existing DeFi without custom logic, isolated pools, or liquidity fragmentation.

Developer-friendly
Write confidential smart contracts in standard Solidity using Nox privacy primitives. No new language to learn, no specialized toolchain to configure.

No special wallets
Users interact with confidential tokens through any standard Ethereum wallet. No custom client, no UX friction, no migration ask.

Production-ready
Built on Intel TDX-based TEEs. iExec has operated confidential computing infrastructure since 2017.

## How Nox Works
Nox enables confidential DeFi through a distributed architecture built on three core concepts:

Handles: When you encrypt data using the JS SDK, Nox creates a unique 32-byte identifier called a handle. Think of handles as secure pointers. Your smart contracts reference confidential values through these handles without exposing the underlying encrypted data, which is stored securely off-chain.

Access Control Lists (ACL): Each handle is protected by an ACL that manages permissions on-chain. By default, only you can access your data. You can grant view permissions to specific addresses, smart contracts, or auditors. This enables selective disclosure: maintaining privacy while allowing authorized parties to verify transactions when needed.

Trusted Execution Environments (TEE): When your smart contract needs to process confidential data, the computation happens inside Intel TDX-based TEE enclaves. These hardware-protected environments ensure that even infrastructure providers cannot access the plaintext data during execution.

## The Nox Toolkit
Solidity Library: Add privacy to your contracts using familiar Solidity syntax, no specialized wallets or off-chain steps required.

JS SDK: Encrypt sensitive inputs and handle decryption with a developer-friendly TypeScript SDK.

Confidential Smart Contracts: Build smart contracts that process encrypted data on-chain while maintaining privacy.

Confidential Tokens: Create ERC-7984 compliant confidential tokens with hidden balances and private transfers. Wrap existing ERC-20 tokens or build native confidential assets that maintain full DeFi compatibility.

## Real-world Use Cases
With Nox, you can build a wide range of privacy-preserving applications that seamlessly integrate with the broader DeFi ecosystem:

Yield with confidential vault: Build yield-generating vaults that protect strategy positions and capital allocations from copy-trading and MEV.
cRWA with confidential tokenized equity: Enable confidential tokenized equity on-chain, protecting investor positions and allocations while maintaining regulatory compliance.
Confidential value transfers: Create private payment systems, payroll, and confidential transfers that hide transaction amounts while remaining verifiable.
Privacy-preserving DeFi primitives: Build lending, borrowing, and other DeFi primitives that process sensitive data without exposing it publicly.
Tokens with hidden balances & amounts: Create ERC-7984 compliant tokens where balances and transaction amounts are hidden from public view.
Selective disclosure workflows: Implement audit and compliance workflows where users control exactly who can access their data, enabling regulatory requirements without sacrificing privacy.
Institutional-grade DeFi & RWAs: Enable institutional adoption by removing transparency blockers, making DeFi and RWA products ready for discretion-sensitive capital.
The next chapters guide you through our Hello World journey: how to protect sensitive data and build and deploy confidential smart contracts.

# Hello World

A piggy bank is a simple savings container: you put money in, and only the owner can take it out. In this tutorial, you will first write a classic piggy bank, then turn it into a confidential one using Nox. By the end, balances and amounts will be fully encrypted: nobody can see how much is inside.

## Write a simple contract
Start with a standard Solidity contract. Nothing encrypted yet:

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PiggyBank {
    uint256 private balance;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit(uint256 amount) external {
        balance += amount;
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner);
        require(amount <= balance);
        balance -= amount;
    }

    function getBalance() external view returns (uint256) {
        return balance;
    }
}

## Turn it into a confidential contract
Nox provides confidentiality, not anonymity. Addresses and function calls remain visible on-chain, only balances and amounts are encrypted.

Import Nox and update types
Add the Nox library and swap uint256 for euint256. On-chain, the value is now stored as a 32-byte handle that points to encrypted data. The actual value is never visible.


import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol"; 

contract ConfidentialPiggyBank {
    uint256 private balance; 
    euint256 public balance; 

Initialize encrypted state
Unlike plain uint256 (which defaults to 0), an euint256 must be explicitly initialized to a valid encrypted handle. Use Nox.toEuint256() in the constructor:


constructor() {
    owner = msg.sender;
    balance = Nox.toEuint256(0); 
}

Convert deposit()
Users encrypt values off-chain with the JS SDK and send a handle (a reference to the encrypted data) along with a proof that the encryption is valid. Replace the plain parameter with externalEuint256, then call Nox.fromExternal() to verify the proof and convert the external handle into an euint256 the contract can use. Finally, use Nox.add() instead of +=:


function deposit(uint256 amount) external { 
    balance += amount; 
} 
function deposit(externalEuint256 inputHandle, bytes calldata inputProof) external { 
    euint256 amount = Nox.fromExternal(inputHandle, inputProof); 
    balance = Nox.add(balance, amount); 
} 

Convert withdraw()
The require(amount <= balance) check cannot work on encrypted values. Replace it with Nox.sub(), which subtracts two encrypted values:


function withdraw(uint256 amount) external { 
    require(msg.sender == owner); 
    require(amount <= balance); 
    balance -= amount; 
} 
function withdraw(externalEuint256 inputHandle, bytes calldata inputProof) external { 
    require(msg.sender == owner); 
    euint256 amount = Nox.fromExternal(inputHandle, inputProof); 
    balance = Nox.sub(balance, amount); 
} 

Grant permissions
By default, only the handle creator has access. After each operation that produces a new handle, you need to grant two permissions:

Nox.allowThis(balance): lets the contract reuse the handle in future computations
Nox.allow(balance, owner): lets the owner decrypt the balance off-chain
Add both calls at the end of the constructor, deposit(), and withdraw():


Nox.allowThis(balance);
Nox.allow(balance, owner);


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// A piggy bank is a simple savings container: you put money in
// and only the owner can take it out. This version keeps the
// balance encrypted so nobody can see how much is inside.

import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

contract ConfidentialPiggyBank {
    euint256 public balance;
    address public owner;

    constructor() {
        owner = msg.sender;
        balance = Nox.toEuint256(0);
        Nox.allowThis(balance);
        Nox.allow(balance, owner);
    }

    function deposit(externalEuint256 inputHandle, bytes calldata inputProof) external {
        euint256 amount = Nox.fromExternal(inputHandle, inputProof);
        balance = Nox.add(balance, amount);
        Nox.allowThis(balance);
        Nox.allow(balance, owner);
    }

    function withdraw(externalEuint256 inputHandle, bytes calldata inputProof) external {
        require(msg.sender == owner);
        euint256 amount = Nox.fromExternal(inputHandle, inputProof);
        balance = Nox.sub(balance, amount);
        Nox.allowThis(balance);
        Nox.allow(balance, owner);
    }
}

## Building Confidential Tokens
ERC-7984 is a confidential fungible token standard designed from the ground up with privacy in mind. Unlike ERC-20, where balances and transfer amounts are visible on-chain, ERC-7984 stores everything as encrypted handles. Only authorized parties can decrypt the actual values.

The @iexec-nox/nox-confidential-contracts library provides a ready-to-use ERC7984 base contract, similar to how OpenZeppelin provides ERC20. You inherit from it and add your own logic (minting, burning, access control).

ERC-7984 vs ERC-20
Feature	ERC-20	ERC-7984
Balances	Public uint256	Encrypted euint256
Transfer amounts	Public	Encrypted
Total supply	Public	Encrypted
Approval mechanism	Allowances	Time-bound operators
Callbacks	No (ERC-1363)	Built-in (transferAndCall)
Addresses	Public	Public (confidentiality, not anonymity)
Key Concepts
Encrypted handles
Balances and amounts are not stored as plain numbers. They are stored as euint256 handles: 32-byte references to encrypted data managed by the Nox protocol. All arithmetic on these values happens off-chain inside a TEE.

Operators (not allowances)
ERC-7984 replaces the ERC-20 approve/transferFrom pattern with operators. An operator can move any amount of tokens on behalf of a holder until a timestamp. This is simpler and avoids the well-known ERC-20 approval front-running issue.

All-or-nothing transfers
Transfers never revert on insufficient balance. Instead, the contract uses Nox.safeSub() internally: if the sender does not have enough tokens, the transfer silently succeeds with zero tokens moved. This prevents leaking balance information through transaction reverts.

Callbacks
ERC-7984 has built-in transferAndCall support (inspired by ERC-1363). When transferring to a smart contract, the recipient's onConfidentialTransferReceived hook is called. If the callback returns false (encrypted), the transfer is automatically refunded.

What You'll Learn
How to create ERC-7984 compliant tokens
How to wrap existing ERC20 tokens
How to build token swap applications
Best practices for confidential token design
Next Steps
ERC7984 Token - Create native confidential tokens
ERC20 to ERC7984 - Wrap existing ERC20 tokens
Live Demo - Explore a live application showcasing confidential tokens

## Create a Confidential ERC-7984 Token

This guide walks you through creating a confidential token using the ERC7984 base contract from @iexec-nox/nox-confidential-contracts. By the end you will have a token with encrypted balances, private transfers, and owner-controlled minting and burning.

Prerequisites
Hardhat or Foundry project set up with Nox
Solidity ^0.8.28
Installation

pnpm

npm

yarn

bun

pnpm add @iexec-nox/nox-confidential-contracts
This also installs @iexec-nox/nox-protocol-contracts and @openzeppelin/contracts as dependencies.

Deploying the contract
Start by inheriting from ERC7984 and adding mint/burn functions restricted to the owner:


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import {ERC7984} from "@iexec-nox/nox-confidential-contracts/contracts/token/ERC7984.sol";

contract ConfidentialToken is ERC7984, Ownable {
    constructor()
        ERC7984("Confidential Token", "CTOK", "")
        Ownable(msg.sender)
    {}

    /// @notice Mint tokens to `to` with an encrypted amount
    function mint(
        address to,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external onlyOwner returns (euint256) {
        euint256 amount = Nox.fromExternal(encryptedAmount, inputProof);
        return _mint(to, amount);
    }

    /// @notice Burn tokens from `from` with an encrypted amount
    function burn(
        address from,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external onlyOwner returns (euint256) {
        euint256 amount = Nox.fromExternal(encryptedAmount, inputProof);
        return _burn(from, amount);
    }
}
That's it. The ERC7984 base contract handles everything else: encrypted balances, transfers, operators, callbacks, and access control on handles.

Operators
ERC-7984 replaces ERC-20 allowances with time-bound operators. An operator can transfer any amount on behalf of the holder until a given timestamp:


// Grant operator access until a specific timestamp
token.setOperator(spenderAddress, uint48(block.timestamp + 1 hours));

// Operator calls transferFrom
token.confidentialTransferFrom(
    holderAddress,
    recipientAddress,
    encryptedAmount,
    inputProof
);

Receiving tokens in a contract
Smart contracts that want to react to incoming ERC-7984 transfers should implement the IERC7984Receiver interface:


import {ebool, euint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import {IERC7984Receiver} from "@iexec-nox/nox-confidential-contracts/contracts/interfaces/IERC7984Receiver.sol";

contract Vault is IERC7984Receiver {
    function onConfidentialTransferReceived(
        address operator,
        address from,
        euint256 amount,
        bytes calldata data
    ) external returns (ebool) {
        // Process the incoming transfer...
        // Return encrypted true to accept, false to refund
        ebool accepted = Nox.toEbool(true);
        Nox.allowTransient(accepted, msg.sender);
        return accepted;
    }
}

Swap ERC-7984 to ERC-7984
A common use case is swapping between two confidential tokens. Below is a contract that swaps fromToken for toToken at a 1:1 rate. The caller must have set this contract as an operator on fromToken beforehand.
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import {IERC7984} from "@iexec-nox/nox-confidential-contracts/contracts/interfaces/IERC7984.sol";

contract ConfidentialSwap {
    function swap(
        IERC7984 fromToken,
        IERC7984 toToken,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external {
        require(fromToken.isOperator(msg.sender, address(this)));

        euint256 amount = Nox.fromExternal(encryptedAmount, inputProof);

        // Transfer fromToken: caller → this contract
        Nox.allowTransient(amount, address(fromToken));
        euint256 received = fromToken.confidentialTransferFrom(
            msg.sender, address(this), amount
        );

        // Transfer toToken: this contract → caller
        Nox.allowTransient(received, address(toToken));
        toToken.confidentialTransfer(msg.sender, received);
    }
}

The steps are:

Check operator approval (the caller must have called fromToken.setOperator(swapContract, until))
Allow fromToken to access the encrypted amount
Transfer fromToken from caller to the swap contract
Allow toToken to access the actually transferred amount
Transfer toToken from the swap contract back to the caller
The swap amount remains encrypted throughout, nobody watching the blockchain can see how much was swapped.

Customizing behavior
The _update function is the single entry point for all balance changes (mint, burn, transfer). Override it to add custom logic:


function _update(
    address from,
    address to,
    euint256 amount
) internal override returns (euint256 transferred) {
    // Custom logic before update...

    transferred = super._update(from, to, amount);

    // Custom logic after update...
}

## Wrap ERC-20 into Confidential ERC-7984
An ERC-7984 wrapper lets users convert any existing ERC-20 token into a confidential ERC-7984 token and back. The underlying ERC-20 tokens are held by the wrapper contract, while confidential tokens with encrypted balances are minted 1:1.
Key concepts
One-step wrap
Wrapping is straightforward: the ERC-20 amount is public, so the wrapper can transfer and mint in a single transaction. The user approves the wrapper, calls wrap(), and their confidential balance is updated immediately.

Two-step unwrap
Unwrapping is more complex because the burn amount is encrypted. The wrapper cannot transfer ERC-20 tokens without knowing the plaintext amount. This requires two steps:

Request unwrap: the user calls unwrap(), which burns the encrypted ERC-7984 tokens
Finalize unwrap: after the burnt amount is decrypted off-chain (via the Nox protocol), the user calls finalizeUnwrap() with the decrypted value and a decryption proof. The wrapper then transfers the corresponding ERC-20 tokens.

Deploying a wrapper
To deploy a wrapper, you only need the address of the ERC-20 token you want to wrap:


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20ToERC7984Wrapper} from "@iexec-nox/nox-confidential-contracts/contracts/token/extensions/ERC20ToERC7984Wrapper.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WrappedUSDC is ERC20ToERC7984Wrapper {
    constructor(IERC20 usdc)
        ERC20ToERC7984Wrapper(usdc)
        ERC7984("Wrapped Confidential USDC", "wcUSDC", "")
    {}
}

Swap ERC-20 to ERC-7984
Swapping from a plaintext ERC-20 to a confidential ERC-7984 is done via the wrap function. It transfers ERC-20 tokens from the caller to the wrapper, then mints the equivalent confidential tokens:


function wrap(address to, uint256 amount) public virtual returns (euint256) {
    SafeERC20.safeTransferFrom(IERC20(underlying()), msg.sender, address(this), amount);
    euint256 wrappedAmount = _mint(to, Nox.toEuint256(amount));
    Nox.allowTransient(wrappedAmount, msg.sender);
    return wrappedAmount;
}
From the caller's perspective:

// 1. Approve the wrapper
usdc.approve(address(wrappedUSDC), 100e18);

// 2. Wrap into confidential tokens
wrappedUSDC.wrap(msg.sender, 100e18);

// Balance is now encrypted, nobody can see how much you hold

The ERC-20 transfer would revert on failure (insufficient balance, missing approval). The _mint is guaranteed to succeed since it only adds to balances.

Swap ERC-7984 to ERC-20
Swapping from a confidential token back to a plaintext ERC-20 is more complex. The wrapper needs to know the plaintext amount to transfer ERC-20 tokens, but the burn amount is encrypted. This requires two steps:

Step 1: Request unwrap
The user burns their confidential tokens. The burnt amount is recorded as an encrypted handle, and the function returns an unwrapRequestId needed for finalization:

// Encrypt the amount to unwrap
// (off-chain via JS SDK, then call the contract)
euint256 unwrapRequestId = wrappedUSDC.unwrap(
    msg.sender,      // burn from
    msg.sender,      // send ERC-20 to
    encryptedAmount,
    inputProof
);
Step 2: Finalize with decryption proof
After the Nox protocol decrypts the burnt amount off-chain, the user calls finalizeUnwrap with the unwrapRequestId and the decrypted amount bundled with
 its proof:

 wrappedUSDC.finalizeUnwrap(
    unwrapRequestId,
    decryptedAmountAndProof
);
// ERC-20 tokens are transferred to the recipient
The wrapper verifies the decryption proof, then transfers the plaintext amount of the underlying ERC-20 to the recipient.

Admins
Admins are addresses that have the most permissions on a handle. Admins can:

decrypt the handle
use the handle as input to create new handles
add other addresses as viewers for the handle
allow other addresses to become admins for the handle
make the handle publicly decryptable
Checking Admins
The Nox protocol smart contract provides a function to check if a specific address is an allowed admin for a given handle:

TIP

isAllowed checks admin access specifically. To check viewer access, use isViewer instead (see Manage Viewers).


function isAllowed(bytes32 handle, address account) external view returns (bool);
isAllowed ABI:


[
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "handle",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isAllowed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

ethers

viem

const noxContract = new Contract(
  NOX_CONTRACT_ADDRESS,
  NOX_CONTRACT_ABI,
  provider
);
const isAllowed: boolean = await noxContract.isAllowed(handle, account);
Allowing Admins
The Nox protocol smart contract provides a function for admins to allow a specific address as an admin for a given handle:

INFO

Only allowed admins can allow new admins.

WARNING

Once allowed, an admin cannot be revoked.


function allow(bytes32 handle, address account) external;
allow ABI:


[
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "handle",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "allow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

ethers

viem

const noxContract = new Contract(
  NOX_CONTRACT_ADDRESS,
  NOX_CONTRACT_ABI,
  signer
);
const tx = await noxContract.allow(handle, accountToAllow);
await tx.wait();

# Getting Started
The Nox JS SDK lets you encrypt values and decrypt handles for use with confidential smart contracts, without dealing directly with the Handle Gateway or the underlying cryptography. It manages encryption, proof generation, EIP-712 signatures, and key exchange transparently.

How It Works
Working with confidential data on Nox follows a three-step workflow:

Encrypt — You encrypt a plaintext value (a balance, a vote, a flag…) using encryptInput. The SDK sends the value to the Handle Gateway, which returns a handle (a 32-byte on-chain identifier pointing to the encrypted data) and a handleProof (an EIP-712 signed proof that the handle was created by a legitimate Gateway).

Compute — Your smart contract receives the handle and proof, verifies them, and performs operations on encrypted data. Handles are composable: they can be stored, transferred, or combined in contract logic without ever exposing the underlying values.

Decrypt — When a user needs to read the actual value, there are two paths depending on the handle's visibility:

ACL-protected handles — Use decrypt. The SDK signs an EIP-712 authorization message (no gas required). If the on-chain ACL authorizes the request, the plaintext is securely returned to the caller.
Publicly decryptable handles — Use publicDecrypt. No ACL check or EIP-712 signature is needed: anyone can decrypt the value as long as the handle has been marked as publicly decryptable on-chain.

Intallation

npm 
npm install @iexec-nox/handle

yarn 
yarn add @iexec-nox/handle

bun 
bun add @iexec-nox/handle

Initialization
The SDK exposes a dedicated factory function for each supported wallet library. Pick the one that matches your stack — each is async and returns a Promise<HandleClient>.

Factory	Wallet library	Accepted client
createEthersHandleClient	Ethers.js v6	BrowserProvider or AbstractSigner with Provider
createViemHandleClient	Viem v2	WalletClient or SmartAccount (ERC-4337 account abstraction)
createHandleClient	Any	Auto-detects ethers or viem (including SmartAccount)

With Ethers.js

Browser

NodeJS

import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const handleClient = await createEthersHandleClient(provider);
With Viem

Browser

NodeJS

import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';

const walletClient = createWalletClient({
  transport: custom(window.ethereum),
});
const handleClient = await createViemHandleClient(walletClient);

With Viem Smart Account (ERC-4337)
The SDK supports viem Smart Accounts for account abstraction. Pass a SmartAccount instance directly to the factory.


import { createViemHandleClient } from '@iexec-nox/handle';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { toSimple7702SmartAccount } from 'viem/account-abstraction';
import { privateKeyToAccount } from 'viem/accounts';

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(RPC_URL),
});

const smartAccount = await toSimple7702SmartAccount({
  owner: privateKeyToAccount(PRIVATE_KEY),
  client: publicClient,
});

const handleClient = await createViemHandleClient(smartAccount as any);

## encryptInput
Encrypts a plaintext value and registers it with the Handle Gateway. The latter stores the encrypted data and returns a handle — a 32-byte on-chain identifier — along with a handleProof that smart contracts can use to verify the handle was created by a legitimate Handle Gateway.

What happens under the hood
The SDK encodes the value according to the given Solidity type.
It sends the encoded value plus the caller's address to the Handle Gateway.
The Handle Gateway encrypts and stores the data, then returns a deterministic handle and a signed EIP-712 proof.
The handle can then be passed to a smart contract alongside the handleProof for on-chain verification. From that point, the contract works with the handle without ever seeing the plaintext.

Usage

import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);

const { handle, handleProof } = await handleClient.encryptInput(
  100_000_000n,
  'uint256',
  '0x123...abc' // applicationContract - the contract that will use this handle
);

Parameters

import type { SolidityType } from '@iexec-nox/handle';
value Required *
Type: boolean | string | bigint

The plaintext value to encrypt. The expected JavaScript type depends on the solidityType parameter:

Solidity type	JavaScript type	Example
bool	boolean	true
string	string	"Hello, Nox!"
address, bytes, bytesN	string	"0x742d…bEb0" (hex with 0x prefix)
uintN, intN	bigint	1000n

// Encrypt a boolean flag
await handleClient.encryptInput(true, 'bool', CONTRACT_ADDRESS); 

// Encrypt a token amount
await handleClient.encryptInput(1000n, 'uint256', CONTRACT_ADDRESS); 

// Encrypt an Ethereum address
await handleClient.encryptInput(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', 
  'address', 
  CONTRACT_ADDRESS
); 

solidityType Required *
Type: SolidityType

The Solidity type the value will be treated as on-chain. The type code is embedded in the handle (byte 30) so the Handle Gateway and contracts know how to interpret the encrypted data.

Supported types:

Boolean: bool
Address: address (coming soon)
Dynamic types: bytes (coming soon), string (coming soon)
Unsigned integers: uint8 (coming soon), uint16, uint24 (coming soon), ... , uint256
Signed integers: int8 (coming soon), int16, int24 (coming soon), ... , int256
Fixed-size bytes: bytes1 (coming soon), bytes2 (coming soon), ... , bytes32 (coming soon)

await handleClient.encryptInput(true, 'bool', '0x123...abc'); 
await handleClient.encryptInput(42n, 'uint64', '0x123...abc'); 
await handleClient.encryptInput('Hello, Nox!', 'string', '0x123...abc'); 
applicationContract Required *
Type: string (Ethereum address)

The address of the smart contract that will use this handle. The handle is bound to this contract: only the application contract can validate the handleProof on-chain. After successful validation, it receives transient access on the ACL for this handle. The contract must then explicitly persist that access and grant permissions to any address that needs to use or decrypt the handle.


// The handle will be used by contract at 0x742d...bEb0
await handleClient.encryptInput(
  1000n,
  'uint256',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'
);

Return Value

{
  handle: Handle<T>;
  handleProof: `0x${string}`;
}

decrypt
Requests the original plaintext value associated with an encrypted handle. The connected wallet must be authorized by the on-chain ACL to access the data — only handle owners or explicitly allowed addresses can decrypt.

Decryption is gasless: the SDK authenticates the request with an EIP-712 signature, not an on-chain transaction.

What happens under the hood
The SDK generates an ephemeral RSA keypair and builds an EIP-712 message.
Your wallet signs the message (no transaction, no gas).
The Handle Gateway verifies the signature and checks the on-chain ACL.
The KMS returns the encrypted data wrapped with your RSA public key.
The SDK decrypts locally — the plaintext never travels over the network.


import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);

const { value, solidityType } = await handleClient.decrypt(handle);

Parameters
handle Required *
Type: Handle<T> (a 0x-prefixed hex string, 32 bytes)

The handle to decrypt. It must have been created on the same chain as the one the client is connected to.


const { value, solidityType } = await handleClient.decrypt(handle); 
Gasless operation

Decryption uses an EIP-712 signature for authentication — it does not submit an on-chain transaction and costs no gas.

Return Value

{
  value: boolean | string | bigint;
  solidityType: SolidityType;
}
value
Type: boolean | string | bigint

The decrypted plaintext. The JavaScript type depends on the Solidity type encoded in the handle:

Solidity type	JavaScript type	Example
bool	boolean	true
string	string	"Hello, Nox!"
address, bytes, bytesN	string	"0x742d…bEb0"
uintN, intN	bigint	1000n

solidityType
Type: SolidityType

The Solidity type decoded from the handle (e.g. "uint256", "bool", "address"). Useful when you receive a handle without knowing its type ahead of time.


const { value, solidityType } = await handleClient.decrypt(handle);

console.log(`${solidityType}:`, value);
// e.g. "uint256: 1000n" or "bool: true"

publicDecrypt
Decrypts a handle that has been marked as publicly decryptable on-chain and returns the plaintext value along with a signed decryption proof. Unlike decrypt, this method does not require the caller to be in the ACL, anyone can call it as long as the handle is public.

The decryption proof is a signed attestation returned by the Handle Gateway that can be verified in a smart contract to produce the plaintext value on-chain. Unlike decrypt, publicDecrypt does not involve EIP-712 signatures from the caller.

What happens under the hood
The SDK checks on-chain that the handle is publicly decryptable (isPubliclyDecryptable).
It calls the Handle Gateway's public decryption endpoint.
The gateway verifies the on-chain flag, decrypts the value internally via KMS, and returns a signed DecryptionProof.
The SDK extracts the plaintext from the proof and decodes it according to the Solidity type embedded in the handle.

import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);

const { value, solidityType, decryptionProof } =
  await handleClient.publicDecrypt(handle);

Parameters
handle Required *
Type: Handle<T> (a 0x-prefixed hex string, 32 bytes)

The handle to decrypt. It must be marked as publicly decryptable on-chain and created on the same chain as the one the client is connected to.


const { value, solidityType, decryptionProof } =
  await handleClient.publicDecrypt(handle); 

Return Value

{
  value: boolean | string | bigint;
  solidityType: SolidityType;
  decryptionProof: `0x${string}`;
}

viewACL
Retrieves the Access Control List (ACL) for a handle. The ACL describes who can interact with the encrypted data: whether it is publicly decryptable, which addresses have admin permissions, and which addresses have viewer permissions.

This method queries the protocol's subgraph, not the blockchain directly, so it is fast and does not require gas.

Usage

import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);

const { isPublic, admins, viewers } = await handleClient.viewACL(handle);

Advanced Configuration
You can customize the SDK by passing a configuration object when creating the client. These options are for advanced use cases — you won't need them for standard usage on supported networks.

Custom / unsupported chains

When targeting an unsupported chain, you must provide all three settings: gatewayUrl, smartContractAddress, and subgraphUrl. Omitting any of them will result in a non-functional client.

Usage

import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const signer = new BrowserProvider(window.ethereum);

const handleClient = await createEthersHandleClient(signer, {
  gatewayUrl: 'https://nox-gateway.custom.example.com',
  smartContractAddress: '0xCustomNoxContractAddress',
  subgraphUrl: 'https://subgraph.custom.example.com',
});

Parameters

import type { HandleClientConfig } from '@iexec-nox/handle';
gatewayUrl Optional
Type: string (base URL without path or query parameters)

The Nox Gateway endpoint URL. The SDK communicates with the Gateway for encryption and decryption operations.


import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const signer = new BrowserProvider(window.ethereum);

const handleClient = await createEthersHandleClient(signer, {
  gatewayUrl: 'https://nox-gateway.custom.example.com', 
});

Solidity Library
The Nox library is the developer-facing Solidity SDK for building confidential smart contracts. It provides type-safe wrappers around encrypted values, handles proof validation, manages access control, and triggers off-chain TEE computation, all through a single import.

Quick Overview

import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

contract ConfidentialVault {
    mapping(address => euint256) private _balances;

    function deposit(externalEuint256 encryptedAmount, bytes calldata proof) external {
        euint256 amount = Nox.fromExternal(encryptedAmount, proof);
        euint256 balance = _balances[msg.sender];

        if (!Nox.isInitialized(balance)) {
            balance = Nox.toEuint256(0);
            Nox.allowThis(balance);
        }

        euint256 newBalance = Nox.add(balance, amount);
        Nox.allowThis(newBalance);
        Nox.allow(newBalance, msg.sender);
        _balances[msg.sender] = newBalance;
    }
}

Core Primitives
The foundational building blocks for confidential computation. These low-level operations let you perform arithmetic, comparisons, and conditional logic directly on encrypted values.

Plaintext to Encrypted: convert plaintext values to encrypted handles
fromExternal: validate user-submitted handles with EIP-712 proofs
Arithmetic: add, sub, mul, div with wrapping semantics
Safe Arithmetic: safeAdd, safeSub, safeMul, safeDiv with overflow detection
Comparisons: eq, ne, lt, le, gt, ge returning ebool
select: encrypted conditional branching
Access Control: allow, allowThis, addViewer, allowPublicDecryption and more

