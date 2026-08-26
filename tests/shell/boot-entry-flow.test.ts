import { describe, expect, it } from 'vitest'

import { entryStateOf } from '../../src/client/shell/pack-session.ts'
import type { EntryStateInput } from '../../src/client/shell/pack-session.ts'

const state = (overrides: Partial<EntryStateInput> = {}): EntryStateInput => ({
  signinFlag: null,
  webdriver: false,
  signedIn: false,
  scenarioPackSelected: false,
  ...overrides,
})

describe('shell entry door priority', () => {
  it.each([
    ['skip', state({ signinFlag: 'skip' }), 'desk'],
    ['show', state({ signinFlag: 'show' }), 'door'],
    ['show with a selected scenario', state({ signinFlag: 'show', scenarioPackSelected: true }), 'door'],
    ['show while already signed in', state({ signinFlag: 'show', signedIn: true }), 'door'],
    ['unsigned webdriver', state({ webdriver: true }), 'desk'],
    ['unsigned player', state(), 'door'],
    ['signed in without a selected scenario', state({ signedIn: true }), 'select'],
    ['signed in with a selected scenario', state({ signedIn: true, scenarioPackSelected: true }), 'desk'],
  ])('(%s)', (_name, input, expected) => {
    expect(entryStateOf(input)).toBe(expected)
  })
})
