#!/usr/bin/env node
// Loopback-only relay for exercising the browser's live transport against the
// deployed proxy. It deliberately has no key and accepts no arbitrary target.

import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'

export const LOCAL_API_HOST = '127.0.0.1'
export const LOCAL_API_PORT = 8787
export const MAX_BODY_BYTES = 262_144

const CALL_PATH = '/dday/call'
const HEALTH_PATH = '/dday/health'
const EXPOSED_HEADERS = ['content-type', 'cache-control', 'x-request-id', 'x-llm-fallback', 'x-fallback-code']

function configError(message) {
  throw new Error(`local API relay configuration: ${message}`)
}

function exactHttpsOrigin(value, name) {
  let url
  try {
    url = new URL(value)
  } catch {
    configError(`${name} must be an HTTPS origin`)
  }
  if (url.protocol !== 'https:' || url.origin !== value || url.username || url.password) {
    configError(`${name} must be an HTTPS origin without a path`)
  }
  return url.origin
}

function portOf(value) {
  const port = Number(value ?? LOCAL_API_PORT)
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) configError('DDAY_LOCAL_API_PORT must be a valid port')
  return port
}

export function relayConfig(env = process.env) {
  return {
    upstreamUrl: exactHttpsOrigin(env.DDAY_UPSTREAM_URL ?? '', 'DDAY_UPSTREAM_URL'),
    upstreamOrigin: exactHttpsOrigin(env.DDAY_UPSTREAM_ORIGIN ?? '', 'DDAY_UPSTREAM_ORIGIN'),
    host: LOCAL_API_HOST,
    port: portOf(env.DDAY_LOCAL_API_PORT),
  }
}

function reply(res, status, body) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let length = 0
    req.on('data', (chunk) => {
      length += chunk.length
      if (length > MAX_BODY_BYTES) {
        const error = new Error('request too large')
        error.status = 413
        reject(error)
        req.resume()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function pathOf(req) {
  return new URL(req.url ?? '/', `http://${LOCAL_API_HOST}`).pathname
}

function copyResponseHeaders(source, target) {
  for (const name of EXPOSED_HEADERS) {
    const value = source.headers.get(name)
    if (value !== null) target.setHeader(name, value)
  }
}

/**
 * Creates the local-only boundary. The injected fetch keeps its routing and
 * header contract testable without calling AWS.
 */
export function createLocalApiProxy({ upstreamUrl, upstreamOrigin, fetchImpl = fetch }) {
  const target = exactHttpsOrigin(upstreamUrl, 'upstreamUrl')
  const origin = exactHttpsOrigin(upstreamOrigin, 'upstreamOrigin')

  return createServer(async (req, res) => {
    const path = pathOf(req)
    const method = req.method ?? 'GET'
    const isHealth = path === HEALTH_PATH && method === 'GET'
    const isCall = path === CALL_PATH && method === 'POST'

    if (!isHealth && !isCall) {
      reply(res, path === HEALTH_PATH || path === CALL_PATH ? 405 : 404, {
        error: { code: path === HEALTH_PATH || path === CALL_PATH ? 'method_not_allowed' : 'not_found' },
      })
      return
    }

    try {
      const body = isCall ? await readBody(req) : null
      const upstream = await fetchImpl(`${target}${path}`, {
        method,
        headers: {
          origin,
          ...(isCall ? { 'content-type': 'application/json' } : {}),
        },
        ...(body === null ? {} : { body: body.toString('utf8') }),
        redirect: 'error',
      })
      const responseBody = Buffer.from(await upstream.arrayBuffer())
      res.statusCode = upstream.status
      copyResponseHeaders(upstream, res)
      res.end(responseBody)
    } catch (error) {
      const status = error && typeof error === 'object' && error.status === 413 ? 413 : 502
      reply(res, status, { error: { code: status === 413 ? 'request_too_large' : 'local_relay_failure' } })
    }
  })
}

async function main() {
  const config = relayConfig()
  const server = createLocalApiProxy(config)
  server.listen(config.port, config.host, () => {
    process.stdout.write(`DDAY local API relay listening on http://${config.host}:${config.port}\n`)
    process.stdout.write(`  upstream: ${config.upstreamUrl}\n`)
    process.stdout.write(`  origin:   ${config.upstreamOrigin}\n`)
  })
  const close = () => server.close(() => process.exit(0))
  process.on('SIGINT', close)
  process.on('SIGTERM', close)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main()
}
