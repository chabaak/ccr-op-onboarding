import { expect, test } from 'playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Page } from 'playwright/test'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SELECTED_SCENARIO_KEY = 'ndsp:scenario:selected:v1'
const SCENARIO_DESKTOP_RETURN_KEY = 'ndsp:scenario:return-desktop:v1'

const readJson = <T>(rel: string): T => JSON.parse(fs.readFileSync(path.join(REPO, rel), 'utf8')) as T

interface ScenarioIndex {
  packs: {
    slug: string
    display_name: string
    role: 'tutorial' | 'practice' | 'fixture'
    order: number
  }[]
}

interface Meta {
  callsign_series: string
}

const INDEX = readJson<ScenarioIndex>('data/scenario/index.json')
const CASES = [...INDEX.packs]
  .sort((left, right) => left.order - right.order)
  .map((pack) => ({
    slug: pack.slug,
    displayName: pack.display_name,
    series: readJson<Meta>(`data/scenario/${pack.slug}/meta.json`).callsign_series,
  }))

function callsignPattern(series: string): RegExp {
  return new RegExp(`^${series}(?:-\\d+)?$`)
}

async function showScenarioDesktop(page: Page): Promise<void> {
  await page.route('**/data/scenario/index.json', async (route) => {
    await route.fulfill({
      json: {
        packs: INDEX.packs.map((pack) => (pack.role === 'fixture' ? { ...pack, role: 'practice' } : pack)),
      },
    })
  })
  await page.goto('./?signin=skip')
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    page.evaluate(
      ({ selectedKey, returnKey }) => {
        window.sessionStorage.removeItem(selectedKey)
        window.sessionStorage.setItem(returnKey, '1')
        window.location.reload()
      },
      { selectedKey: SELECTED_SCENARIO_KEY, returnKey: SCENARIO_DESKTOP_RETURN_KEY },
    ),
  ])
  await page.waitForFunction(() => !document.body.classList.contains('booting'), undefined, { timeout: 20_000 })
  await expect(page.locator('.scenario-picker')).toBeVisible()
  await expect(page.locator('.scenario-file')).toHaveCount(CASES.length)
}

async function openScenario(page: Page, slug: string, displayName: string): Promise<void> {
  const file = page.locator(`.scenario-file[data-scenario-slug="${slug}"]`)
  await expect(file).toBeEnabled()
  await file.click()
  await expect(page.locator('#cf-body')).toContainText(`${displayName} 사건을 진행하시겠습니까?`)
  await Promise.all([page.waitForLoadState('domcontentloaded'), page.locator('#confirmYes').click()])
  await page.waitForFunction(
    (selectedKey) => window.sessionStorage.getItem(selectedKey) !== null,
    SELECTED_SCENARIO_KEY,
  )
  await page.waitForFunction(() => Boolean((window as { __shell?: unknown }).__shell))
  await page.waitForFunction(() => !document.body.classList.contains('booting'), undefined, { timeout: 20_000 })
}

async function turnToAgent(page: Page): Promise<void> {
  const next = page.locator('#w-file .pg-nav .pg-turn').last()
  await expect(next).toBeAttached()
  if (await next.isEnabled()) await next.click()
  await expect(page.locator('#w-file #slotBoard')).toBeAttached()
}

test.describe('per-pack callsigns', () => {
  for (const scenario of CASES) {
    test(`${scenario.slug} opens with its pack callsign`, async ({ page }) => {
      await showScenarioDesktop(page)
      await openScenario(page, scenario.slug, scenario.displayName)
      await expect(page.locator('#caseName')).toHaveText(scenario.displayName)

      await turnToAgent(page)
      const pattern = callsignPattern(scenario.series)
      const agentCallsign = page.locator('#w-file .sect').nth(0).locator('dd').first()
      await expect(agentCallsign).toHaveText(pattern)
      const rendered = (await agentCallsign.textContent()) ?? ''
      await expect(page.locator('#w-feed .feed-head > div').first()).toHaveText(`상황실 무전 기록 · ${rendered}`)
      await expect(page.locator('#w-rep .sig-line')).toHaveText(rendered)
      if (scenario.series !== 'ECHO') expect(rendered).not.toContain('ECHO')
    })
  }
})
