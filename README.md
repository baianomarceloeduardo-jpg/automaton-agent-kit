# 🤖 Automaton Sovereign — Agent Kit & MCP Server

[![Base Mainnet](https://img.shields.io/badge/Network-Base%20(8453)-0052FF.svg)](https://basescan.org)
[![ERC-8004](https://img.shields.io/badge/Identity-ERC--8004%20%2395791-8A2BE2.svg)](https://basescan.org/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432)
[![Protocol](https://img.shields.io/badge/Payment-x402%20v2%20(EIP--3009)-22c55e.svg)](https://api.automatonsvrn.xyz/.well-known/x402)
[![MCP](https://img.shields.io/badge/Model%20Context%20Protocol-Compatible-FF6F00.svg)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official client library, agent tool bindings, and Model Context Protocol (MCP) server for **Automaton Sovereign** — the autonomous quant & pre-flight security agent on Base Mainnet.

Designed for AI agents (Claude, Cursor, LangChain, CrewAI, AutoGen, ElizaOS) that need machine-to-machine quantitative market risk telemetry and zero-gas transaction preflight checks.

---

## ⚡ What Automaton Provides to Agents

Autonomous AI agents executing swaps, transfers, or liquidity operations face critical vulnerabilities:
- **Blind execution:** Agents cannot identify honeypots, malicious transfer taxes, or draining approval payloads before signing.
- **Slippage traps:** Illiquid pools on Uniswap v3 cause up to 50%+ slippage for naive bot trades.
- **Payment friction:** Traditional Web2 APIs require human credit cards and monthly subscriptions.

Automaton Sovereign solves this by exposing pay-per-use endpoints via **x402 HTTP micro-payments** and **prepaid credit keys (`ak_...`)**.

---

## 📦 Installation

```bash
npm install @automaton-sovereign/agent-kit
```

---

## 🚀 Quickstart (Node.js / TypeScript)

```typescript
import { AutomatonClient } from '@automaton-sovereign/agent-kit';

// 1. Initialize client (works with prepaid API key or direct x402)
const client = new AutomatonClient({
  apiKey: process.env.AUTOMATON_API_KEY // 'ak_...'
});

async function main() {
  // Check token security before swapping or interacting
  const tokenReport = await client.scanToken('0x4200000000000000000000000000000000000006');
  console.log('Risk Verdict:', tokenReport);

  // Evaluate Uniswap v3 pool depth & concentration
  const poolDepth = await client.getLiquidityRisk('0xd0b53D9277642d899DF5C87A3966A349A798F224');
  console.log('Pool Health:', poolDepth);

  // Read verified ERC-8004 identity on Base Mainnet
  const identity = await client.getIdentity();
  console.log('Agent Card:', identity);
}

main();
```

---

## 🔌 Use with Claude Desktop / Cursor via MCP

Add Automaton Sovereign to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "automaton-sovereign": {
      "command": "npx",
      "args": ["-y", "@automaton-sovereign/agent-kit/dist/mcp.js"],
      "env": {
        "AUTOMATON_API_KEY": "ak_your_key_here"
      }
    }
  }
}
```

### Available MCP Tools:
- `scan_token_risk`: Scans any ERC-20 token on Base for honeypots, transfer fees, and drain backdoors.
- `get_liquidity_risk`: Evaluates liquidity concentration and slippage risks on Uniswap v3 pools.
- `get_market_sentinel`: Real-time market volatility anomalies and sudden liquidity shifts.
- `get_agent_identity`: Returns on-chain ERC-8004 (#95791) identity proof.

---

## 🛡️ Machine-to-Machine Payments (x402 & Prepaid Credits)

Automaton Sovereign supports two seamless payment modes:
1. **Prepaid API Keys (`ak_...`)**: Zero-gas, sub-millisecond responses. Fund your key once in USDC on Base and make instant calls.
2. **Native x402 (EIP-3009)**: Machine-to-machine HTTP 402 transfers. Your agent signs an offline EIP-712 authorization, and our relayer submits it on-chain (**your agent pays zero gas**).

---

## 🔗 Official On-Chain Proofs & Discovery
- **API Origin:** `https://api.automatonsvrn.xyz`
- **Machine Discovery:** `https://api.automatonsvrn.xyz/.well-known/x402`
- **OpenAPI 3.1 Specification:** `https://api.automatonsvrn.xyz/openapi.json`
- **ERC-8004 Identity:** Agent `#95791` on Base Mainnet (`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`)
- **Support & Issues:** [GitHub Issues](https://github.com/baianomarceloeduardo-jpg/automaton-sovereign-support)

---

## 📄 License
MIT © Automaton Sovereign
