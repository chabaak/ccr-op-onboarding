import { describe, expect, it, vi } from 'vitest'
import path from 'node:path'

import {
  ABORT_MISSION_COPY,
  confirmAbortMission,
} from '../../src/client/shell/abort-mission.ts'
import { CLIENT, SHELL_DIR, read, stripComments } from './shell-utils.ts'

const WINDOW_MANAGER_TS = path.join(SHELL_DIR, 'window-manager.ts')
const CONFIRM_TS = path.join(SHELL_DIR, 'confirm.ts')
const CONFIRM_CSS = path.join(CLIENT, 'styles/confirm.css')

describe('abort mission control', () => {
  it('(a) asks in plain language that abort resets case progress', () => {
    expect(ABORT_MISSION_COPY.head).toBe('시행 중단')
    expect(ABORT_MISSION_COPY.meta).toBe('현재 시행 폐기')
    expect(ABORT_MISSION_COPY.yes).toBe('중단')
    expect(ABORT_MISSION_COPY.no).toBe('취소')
    expect(`${ABORT_MISSION_COPY.body}\n${ABORT_MISSION_COPY.note}`).toContain('사건 선택 데스크톱')
    expect(ABORT_MISSION_COPY.note).toBe('사건 진행 상황이 초기화됩니다.')
  })

  it('(b) confirming returns through the provided desktop path exactly once', async () => {
    const open = vi.fn(async () => true)
    const returnToDesktop = vi.fn()

    await expect(
      confirmAbortMission({
        app: {} as HTMLElement,
        open,
        returnToDesktop,
      }),
    ).resolves.toBe(true)

    expect(open).toHaveBeenCalledWith({} as HTMLElement, ABORT_MISSION_COPY)
    expect(returnToDesktop).toHaveBeenCalledOnce()
  })

  it('(c) cancelling leaves the run path untouched', async () => {
    const returnToDesktop = vi.fn()

    await expect(
      confirmAbortMission({
        app: {} as HTMLElement,
        open: async () => false,
        returnToDesktop,
      }),
    ).resolves.toBe(false)

    expect(returnToDesktop).not.toHaveBeenCalled()
  })

  it('(d) closing a window still only hides furniture and never aborts', () => {
    const src = stripComments(read(WINDOW_MANAGER_TS))
    const handler = /frame\.close\.addEventListener\([\s\S]*?\n    \}\)/.exec(src)?.[0] ?? ''

    expect(handler, 'window close handler is gone').toMatch(/classList\.add\(\s*['"]hidden['"]\s*\)/)
    expect(handler, 'window close stopped updating the taskbar').toMatch(/syncTaskbar\s*\(\s*\)/)
    expect(handler, 'window close must not reset a scenario').not.toMatch(
      /resetScenarioSession|returnToScenarioDesktop|abort|reload/,
    )
  })

  it('(e) 시행 중단 uses the shared irreversible notice accent', () => {
    expect(read(CONFIRM_TS)).toMatch(
      /copy\.head === '배치 확인' \|\| copy\.head === '시행 중단' \? ' notice-accent'/,
    )
    expect(stripComments(read(CONFIRM_CSS))).toMatch(
      /\.notice-accent\s+\.notice-kind,\s*\.notice-accent\s+\.notice-meta\s*\{[^}]*color\s*:\s*var\(--warning\)/,
    )
  })
})
