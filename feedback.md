## iExec Tools Feedback

**Project:** AnticreticSafe — a confidential real-estate anticretico workflow dApp built for the iExec Vibe Coding Challenge.

We used the Nox JS SDK together with the ERC-7984 Confidential Token standard to encrypt the deposit amount, mint a confidential asUSD token, and register that amount on-chain without exposing the value publicly. The full flow ran on Arbitrum Sepolia, integrated into a React + wagmi + viem front-end.

---

### What Worked Well

- The Nox SDK's handle + proof flow was reliable once the parameters were wired correctly. For a use case like AnticreticSafe — where the deposit amount must be private between property owner and occupant — this was exactly the primitive we needed.
- The confidential token pattern (handle, proof, ACL) maps naturally to real-world privacy contracts. Being able to grant decryption rights only to the parties involved in an agreement is a genuine differentiator.
- The available code examples and documentation snippets gave us a solid starting point to verify expected parameter shapes and transaction flows during integration.

---

### Friction Points

- SDK error messages are often low-level and opaque. When a proof was invalid or a handle had gone stale, the error surfaced as a generic revert with no actionable detail. Debugging required guesswork rather than a clear failure reason.
- The developer journey is spread across multiple documentation sources — Nox, confidential tokens, TEE usage, and network setup — with no single path tying them together. We had to cross-reference constantly to answer questions that should have one-sentence answers.
- Testnet network setup guidance is thin. Expected chain IDs, working RPC endpoints, and faucet links for Arbitrum Sepolia were not consolidated in one place, which added unnecessary friction early in the project.

---

### Suggestions

- **Single opinionated quickstart:** One guide that walks through the complete confidential flow end-to-end — encrypt amount → mint confidential token → register on-chain → read encrypted balance. No jumping between pages.
- **Troubleshooting reference:** A section covering the most common failure modes with their root causes: invalid proof, mismatched chain ID, stale handle, incorrect ACL configuration.
- **Front-end integration example:** A reference showing how to wire the Nox SDK into a wagmi + viem stack, including how to handle async proof generation alongside wallet transactions.

---

### Summary

The iExec confidentiality stack is a strong fit for privacy-first real-world asset use cases like AnticreticSafe. Once the setup was correct, the core guarantees — on-chain confidentiality, selective disclosure, verifiable proofs — held up exactly as expected. The technology is solid; the main opportunity is making the path to that working state faster and less reliant on trial and error.
