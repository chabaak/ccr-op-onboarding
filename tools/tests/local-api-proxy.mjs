import assert from 'node:assert/strict'
import { once } from 'node:events'
import { test } from 'node:test'

import { createLocalApiProxy, relayConfig } from '../local-api-proxy.mjs'

const UPSTREAM = 'https://proxy.example.test'
const ORIGIN = 'https://pages.example.test'

async function withServer(fetchImpl, run) {
  const server = createLocalApiProxy({ upstreamUrl: UPSTREAM, upstreamOrigin: ORIGIN, fetchImpl })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  try {
    await run(`http://127.0.0.1:${address.port}`)
  } finally {
    server.close()
    await once(server, 'close')
  }
}

test('local API relay has explicit public configuration', () => {
  assert.deepEqual(
    relayConfig({
      DDAY_UPSTREAM_URL: UPSTREAM,
      DDAY_UPSTREAM_ORIGIN: ORIGIN,
      DDAY_LOCAL_API_PORT: '8788',
    }),
    { upstreamUrl: UPSTREAM, upstreamOrigin: ORIGIN, host: '127.0.0.1', port: 8788 },
  )
  assert.throws(() => relayConfig({ DDAY_UPSTREAM_URL: UPSTREAM }), /DDAY_UPSTREAM_ORIGIN/)
  assert.throws(
    () => relayConfig({ DDAY_UPSTREAM_URL: 'http://proxy.example.test', DDAY_UPSTREAM_ORIGIN: ORIGIN }),
    /HTTPS origin/,
  )
})

test('forwards the fixed origin, payload, and live-response headers', async () => {
  const calls = []
  await withServer(async (url, init) => {
    calls.push({ url, init })
    return new Response(JSON.stringify({ stance: 'listen' }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'x-request-id': 'req-local-smoke',
        'x-llm-fallback': 'false',
      },
    })
  }, async (base) => {
    const payload = JSON.stringify({ call_type: 'judgment' })
    const response = await fetch(`${base}/dday/call`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
    })
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('x-request-id'), 'req-local-smoke')
    assert.equal(response.headers.get('x-llm-fallback'), 'false')
    assert.deepEqual(await response.json(), { stance: 'listen' })
    assert.deepEqual(calls, [
      {
        url: `${UPSTREAM}/dday/call`,
        init: {
          method: 'POST',
          headers: { origin: ORIGIN, 'content-type': 'application/json' },
          body: payload,
          redirect: 'error',
        },
      },
    ])
  })
})

test('forwards health without a body and rejects other routes locally', async () => {
  const calls = []
  await withServer(async (url, init) => {
    calls.push({ url, init })
    return new Response(JSON.stringify({ ok: true, calls: true }), { status: 200 })
  }, async (base) => {
    const health = await fetch(`${base}/dday/health`)
    assert.equal(health.status, 200)
    assert.deepEqual(await health.json(), { ok: true, calls: true })

    const wrongMethod = await fetch(`${base}/dday/health`, { method: 'POST' })
    assert.equal(wrongMethod.status, 405)
    assert.deepEqual(await wrongMethod.json(), { error: { code: 'method_not_allowed' } })

    const missing = await fetch(`${base}/not-a-route`)
    assert.equal(missing.status, 404)
    assert.deepEqual(await missing.json(), { error: { code: 'not_found' } })
  })
  assert.deepEqual(calls, [
    {
      url: `${UPSTREAM}/dday/health`,
      init: { method: 'GET', headers: { origin: ORIGIN }, redirect: 'error' },
    },
  ])
})
