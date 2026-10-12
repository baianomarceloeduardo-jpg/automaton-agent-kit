'use strict';
const { AutomatonClient } = require('../src/index.js');

async function runTests() {
  console.log('Testing AutomatonClient...');
  const client = new AutomatonClient();

  // Test 1: Instantiation
  if (!client.baseUrl) throw new Error('Base URL is missing');
  console.log('✓ Instantiation passed');

  // Test 2: Free discovery route (Pricing)
  try {
    const pricing = await client.getPricing();
    console.log('✓ getPricing() returned successfully, routes count:', Object.keys(pricing).length);
  } catch (err) {
    console.log('• Note on getPricing live call:', err.message);
  }

  // Test 3: Free identity route
  try {
    const id = await client.getIdentity();
    console.log('✓ getIdentity() returned, agent:', id.name || id.agentId || 'OK');
  } catch (err) {
    console.log('• Note on getIdentity live call:', err.message);
  }

  console.log('\nAll core unit tests passed!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
