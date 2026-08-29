// The explicit run abort.
//
// Window close is furniture: it hides a pane and leaves the sitting alive.
// This control is the opposite, so it is not a window operation and it asks
// through the same centred confirmation plate as the deploy press.
import { button } from './dom.ts'
import { openConfirm } from './confirm.ts'
import type { ConfirmCopy } from './confirm.ts'

export const ABORT_MISSION_COPY: ConfirmCopy = {
  head: '시행 중단',
  meta: '현재 시행 폐기',
  body: '현재 사건 진행을 중단하고 사건 선택 데스크톱으로 돌아갑니다.',
  note: '사건 진행 상황이 초기화됩니다.',
  yes: '중단',
  no: '취소',
}

interface AbortConfirmDeps {
  app: HTMLElement
  open?: (app: HTMLElement, copy: ConfirmCopy) => Promise<boolean>
  returnToDesktop: () => void | Promise<void>
}

export async function confirmAbortMission(deps: AbortConfirmDeps): Promise<boolean> {
  const confirmed = await (deps.open ?? openConfirm)(deps.app, ABORT_MISSION_COPY)
  if (!confirmed) return false
  await deps.returnToDesktop()
  return true
}

export interface AbortMissionDeps {
  app: HTMLElement
  taskbar: HTMLElement
  returnToDesktop: () => void | Promise<void>
}

export function installAbortMissionControl(deps: AbortMissionDeps): HTMLButtonElement {
  const control = button('abort-mission', '현재 시행 중단', '중단')
  control.id = 'abortMission'
  control.setAttribute('aria-label', '현재 시행 중단')
  control.addEventListener('click', () => {
    control.disabled = true
    confirmAbortMission({
      app: deps.app,
      returnToDesktop: deps.returnToDesktop,
    })
      .finally(() => {
        if (control.isConnected) control.disabled = false
      })
      .catch(() => undefined)
  })
  deps.taskbar.append(control)
  return control
}
