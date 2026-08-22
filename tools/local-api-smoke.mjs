#!/usr/bin/env node
// Human-run, paid smoke. It proves that the local relay reaches Bedrock rather
// than the fixture transport; it intentionally records metadata, not model prose.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_BASE_URL = 'http://127.0.0.1:8787'

function baseUrl(argv) {
  const flag = argv.find((arg) => arg.startsWith('--base-url='))
  const value = flag === undefined ? DEFAULT_BASE_URL : flag.slice('--base-url='.length)
  const url = new URL(value)
  if (url.origin !== value.replace(/\/$/, '')) throw new Error('--base-url must be an origin without a path')
  return url.origin
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function responseJson(response, label) {
  const body = await response.json().catch(() => null)
  assert(body !== null && typeof body === 'object', `${label} did not return JSON`)
  return body
}

async function main() {
  const base = baseUrl(process.argv.slice(2))
  const health = await fetch(new URL('/dday/health', base))
  const healthBody = await responseJson(health, 'health')
  assert(health.status === 200, `health returned HTTP ${health.status}`)
  assert(healthBody.ok === true && healthBody.calls === true, 'health did not confirm callable proxy')

  const event = JSON.parse(readFileSync(resolve(ROOT, 'proxy/events/call.json'), 'utf8'))
  const started = performance.now()
  const call = await fetch(new URL('/dday/call', base), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: event.body,
  })
  const latencyMs = Math.round(performance.now() - started)
  const callBody = await responseJson(call, 'call')
  const fallback = call.headers.get('x-llm-fallback')
  const requestId = call.headers.get('x-request-id')

  assert(call.status === 200, `call returned HTTP ${call.status}`)
  assert(fallback === 'false', `expected x-llm-fallback: false, got ${JSON.stringify(fallback)}`)
  assert(typeof requestId === 'string' && requestId.length > 0, 'call returned no x-request-id')
  assert(typeof callBody.stance === 'string' && callBody.stance.length > 0, 'judgment response has no stance')

  process.stdout.write(`${JSON.stringify({ ok: true, base, requestId, fallback, latencyMs, model: healthBody.model }, null, 2)}\n`)
}

void main()
