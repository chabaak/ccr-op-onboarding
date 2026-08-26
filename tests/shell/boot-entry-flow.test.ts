import { describe, expect, it } from 'vitest'

import { shouldOpenSignInDoor } from '../../src/client/shell/pack-session.ts'
import type { SignInDoorState } from '../../src/client/shell/pack-session.ts'

const state = (overrides: Partial<SignInDoorState> = {}): SignInDoorState => ({
  signinFlag: null,
  webdriver: false,
  returnToDesktop: false,
  scenarioPackSelected: false,
  ...overrides,
})

describe('shell entry door priority', () => {
  it.each([
    ['skip', state({ signinFlag: 'skip' }), false],
    ['show', state({ signinFlag: 'show' }), true],
    ['show with a selected scenario', state({ signinFlag: 'show', scenarioPackSelected: true }), true],
    ['scenario desktop return', state({ returnToDesktop: true }), false],
    ['selected scenario', state({ scenarioPackSelected: true }), false],
    ['webdriver', state({ webdriver: true }), false],
    ['first boot', state(), true],
  ])('(%s)', (_name, input, expected) => {
    expect(shouldOpenSignInDoor(input)).toBe(expected)
  })
})
