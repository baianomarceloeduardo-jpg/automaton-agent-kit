#!/usr/bin/env node
'use strict';

/**
 * Automaton Sovereign Model Context Protocol (MCP) Server
 * Exposes quantitative DeFi tools to AI Agents (Claude Desktop, Cursor, LangChain, etc.)
 */
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { AutomatonClient } = require('./index.js');

const apiKey = process.env.AUTOMATON_API_KEY || null;
const client = new AutomatonClient({ apiKey });

const server = new Server(
  {
    name: 'automaton-sovereign',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Register available tools for autonomous agents
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'scan_token_risk',
        description: 'Scans an ERC-20 token on Base Mainnet for honeypots, transfer fees, drainer backdoors and contract simulation risks.',
        inputSchema: {
          type: 'object',
          properties: {
            tokenAddress: {
              type: 'string',
              description: 'The contract address of the token (0x...)'
            }
          },
          required: ['tokenAddress']
        }
      },
      {
        name: 'get_liquidity_risk',
        description: 'Evaluates liquidity concentration, pool depth, and slippage vulnerabilities on Uniswap v3 Base pools.',
        inputSchema: {
          type: 'object',
          properties: {
            poolAddress: {
              type: 'string',
              description: 'Uniswap v3 Pool address on Base'
            }
          },
          required: ['poolAddress']
        }
      },
      {
        name: 'get_market_sentinel',
        description: 'Fetches real-time market structure anomalies, flash crashes, and volatility spikes detected on Base Mainnet.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_agent_identity',
        description: 'Returns the verified on-chain ERC-8004 identity (Agent #95791) of Automaton Sovereign on Base.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  };
});

// Handle tool execution requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;
    switch (name) {
      case 'scan_token_risk':
        result = await client.scanToken(args.tokenAddress);
        break;
      case 'get_liquidity_risk':
        result = await client.getLiquidityRisk(args.poolAddress);
        break;
      case 'get_market_sentinel':
        result = await client.getSentinelStream();
        break;
      case 'get_agent_identity':
        result = await client.getIdentity();
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `[Automaton Error] ${error.message}`
        }
      ]
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  console.error('Fatal MCP Server error:', err);
  process.exit(1);
});
