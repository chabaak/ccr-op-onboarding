import { describe, expect, it } from 'vitest'

import { createTransport } from '../../src/transport/index.ts'
import type { FetchLike, FetchResponseLike } from '../../src/transport/index.ts'

import { BASE_URL, JUDGMENT_200, JUDGMENT_REQUEST, errorBody, stubFetch } from './_helpers.ts'

describe('live transport caches successful identical requests', () => {
  it('a byte-identical successful request is sent to the wire once', async () => {
    const stub = stubFetch([{ status: 200, body: JSON.stringify(JUDGMENT_200) }])
    const transport = createTransport({ baseUrl: BASE_URL, fetch: stub.fetch })

    const first = await transport.send(JUDGMENT_REQUEST)
    const second = await transport.send({ ...JUDGMENT_REQUEST, slots: { ...JUDGMENT_REQUEST.slots } })

    expect(first.ok && second.ok).toBe(true)
    expect(stub.calls).toHaveLength(1)
    expect(JSON.stringify(second)).toBe(JSON.stringify(first))
  })

  it('concurrent identical requests share the in-flight proxy call', async () => {
    let resolveResponse: (response: FetchResponseLike) => void = () => {}
    const response = new Promise<FetchResponseLike>((resolve) => {
      resolveResponse = resolve
    })
    const calls: unknown[] = []
    const fetch: FetchLike = (url, init) => {
      calls.push({ url, init })
      return response
    }
    const transport = createTransport({ baseUrl: BASE_URL, fetch })

    const first = transport.send(JUDGMENT_REQUEST)
    const second = transport.send(JUDGMENT_REQUEST)
    expect(calls).toHaveLength(1)

    resolveResponse({
      status: 200,
      headers: { get: () => null },
      text: () => Promise.resolve(JSON.stringify(JUDGMENT_200)),
    })

    const [a, b] = await Promise.all([first, second])
    expect(a.ok && b.ok).toBe(true)
    expect(calls).toHaveLength(1)
  })

  it('a cached body is cloned before it is returned again', async () => {
    const stub = stubFetch([{ status: 200, body: JSON.stringify(JUDGMENT_200) }])
    const transport = createTransport({ baseUrl: BASE_URL, fetch: stub.fetch })

    const first = await transport.send(JUDGMENT_REQUEST)
    expect(first.ok).toBe(true)
    if (!first.ok) return
    first.body.inner_note = 'MUTATED'
    first.body.because_block_ids.push('b-poison')

    const second = await transport.send(JUDGMENT_REQUEST)
    expect(second.ok).toBe(true)
    if (!second.ok) return
    expect(second.body.inner_note).toBe(JUDGMENT_200.inner_note)
    expect(second.body.because_block_ids).toEqual(JUDGMENT_200.because_block_ids)
    expect(stub.calls).toHaveLength(1)
  })

  it('failures are evicted so a transient miss can recover', async () => {
    const stub = stubFetch([
      { status: 400, body: errorBody('invalid_request') },
      { status: 200, body: JSON.stringify(JUDGMENT_200) },
    ])
    const transport = createTransport({ baseUrl: BASE_URL, fetch: stub.fetch })

    const failed = await transport.send(JUDGMENT_REQUEST)
    const recovered = await transport.send(JUDGMENT_REQUEST)

    expect(failed.ok).toBe(false)
    expect(recovered.ok).toBe(true)
    expect(stub.calls).toHaveLength(2)
  })
})
