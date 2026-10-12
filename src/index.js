'use strict';

/**
 * Automaton Sovereign Client SDK
 * Official SDK for autonomous AI agents consuming quantitative DeFi and preflight checks on Base Mainnet.
 */
class AutomatonClient {
  /**
   * @param {Object} options
   * @param {string} [options.baseUrl] - API endpoint base URL (default: https://api.automatonsvrn.xyz)
   * @param {string} [options.apiKey] - Prepaid API key (ak_...)
   * @param {string} [options.privateKey] - Ethereum private key for on-chain x402 signing
   */
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || 'https://api.automatonsvrn.xyz').replace(/\/+$/, '');
    this.apiKey = options.apiKey || null;
    this.privateKey = options.privateKey || null;
  }

  /**
   * Internal request handler supporting API Keys and x402 402 challenge handling
   * @private
   */
  async _request(path, method = 'GET', body = null) {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'AutomatonAgentKit/1.0.0'
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    const opts = { method, headers };
    if (body && method !== 'GET') {
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(url, opts);
    if (res.status === 402) {
      const challenge = await res.json().catch(() => ({}));
      throw new Error(`[Payment Required - HTTP 402] Route ${path} requires x402 settlement or prepaid API key. Challenge: ${JSON.stringify(challenge)}`);
    }

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      throw new Error(`[Automaton API Error ${res.status}] ${err}`);
    }

    return await res.json();
  }

  // --- FREE / PUBLIC DISCOVERY ROUTES ---

  /**
   * Get live pricing catalog across all quantitative routes
   */
  async getPricing() {
    return this._request('/pricing');
  }

  /**
   * Get real-time stats and health status
   */
  async getStats() {
    return this._request('/stats');
  }

  /**
   * Get on-chain ERC-8004 identity details
   */
  async getIdentity() {
    return this._request('/agent-card.json');
  }

  // --- PRE-FLIGHT & TRANSACTION SAFETY ROUTES ---

  /**
   * Scan contract bytecode and metadata for honeypot, drainer or fee exploits
   * @param {string} tokenAddress - ERC-20 contract address on Base Mainnet
   */
  async scanToken(tokenAddress) {
    return this._request(`/v2/token/simulate?address=${tokenAddress}`);
  }

  /**
   * Assess transaction simulation risk before signing or submitting to mempool
   * @param {Object} txPayload - Raw transaction parameters
   */
  async simulateTx(txPayload) {
    return this._request('/v2/firewall/simulate-tx', 'POST', txPayload);
  }

  /**
   * Check allowance and approval drain risks for a spender address
   * @param {string} tokenAddress
   * @param {string} spenderAddress
   */
  async checkApprovalRisk(tokenAddress, spenderAddress) {
    return this._request(`/v2/token/approval-risk?token=${tokenAddress}&spender=${spenderAddress}`);
  }

  // --- QUANTITATIVE DEFI & MARKET STRUCTURE ---

  /**
   * Get latest liquidity pool risk telemetry and concentration score
   * @param {string} poolAddress
   */
  async getLiquidityRisk(poolAddress) {
    return this._request(`/v2/token/liquidity-risk?pool=${poolAddress}`);
  }

  /**
   * Query sentinel oracle stream for price & volatility anomalies
   */
  async getSentinelStream() {
    return this._request('/v2/sentinel/latest');
  }
}

// CommonJS and ESM compatibility
module.exports = { AutomatonClient };
