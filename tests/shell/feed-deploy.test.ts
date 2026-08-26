import { beforeEach, describe, expect, it } from 'vitest'
import path from 'node:path'
import { CLIENT, SHELL_DIR, read, rel, stripComments } from './shell-utils.ts'
import { publishFeedDeploy, resetFeedDeploy, subscribeFeedDeploy } from '../../src/client/shell/feed-deploy.ts'

const DEPLOY_TS = path.join(SHELL_DIR, 'feed-deploy.ts')
const RUN_FEED_TS = path.join(CLIENT, 'components/run-feed.ts')
const AGENT_FILE_TS = path.join(CLIENT, 'windows/agent-file.ts')

const code = (p: string): string => stripComments(read(p))

beforeEach(() => {
  resetFeedDeploy()
})

describe('[issue 234] confirmed deploy presses are a shell slot', () => {
  it('(a) publishes only confirmed deploy modes to current listeners', () => {
    const seen: string[] = []
    const unsubscribe = subscribeFeedDeploy((mode) => {
      seen.push(mode)
    })

    publishFeedDeploy('deploy')
    publishFeedDeploy('next')
    unsubscribe()
    publishFeedDeploy('next')

    expect(seen).toEqual(['deploy', 'next'])
  })

  it('(b) reads no DOM, owns no timer and never asks the wall clock', () => {
    const src = code(DEPLOY_TS)
    for (const forbidden of [
      /\bdocument\b/,
      /\bwindow\b/,
      /\bsetTimeout\s*\(/,
      /\bsetInterval\s*\(/,
      /requestAnimationFrame/,
      /\bDate\.now\s*\(/,
      /\bnew Date\s*\(/,
      /performance\.now/,
    ]) {
      expect(src, `feed-deploy.ts reaches for ${String(forbidden)}`).not.toMatch(forbidden)
    }
  })

  it('(c) imports nothing at all', () => {
    expect(code(DEPLOY_TS)).not.toMatch(/\bfrom\s*['"]/)
  })

  it('(d) AGENT FILE publishes and LIVE FEED subscribes without importing each other', () => {
    const agent = code(AGENT_FILE_TS)
    const feed = code(RUN_FEED_TS)

    expect(agent, `${rel(AGENT_FILE_TS)} no longer publishes deploy presses`).toMatch(/publishFeedDeploy\(/)
    expect(feed, `${rel(RUN_FEED_TS)} no longer listens for deploy presses`).toMatch(/subscribeFeedDeploy\(/)
    expect(agent, `${rel(AGENT_FILE_TS)} reached into LIVE FEED`).not.toMatch(/components\/run-feed|windows\/live-feed/)
    expect(feed, `${rel(RUN_FEED_TS)} reached into AGENT FILE`).not.toMatch(/windows\/agent-file/)
  })

  it('(e) the score paper cue stays in score, not in the deploy slot', () => {
    const feed = code(RUN_FEED_TS)
    const score = /case 'score': \{[\s\S]*?case 'report':/.exec(feed)?.[0] ?? ''
    const deploy = /subscribeFeedDeploy\([\s\S]*?\n  \}\)/.exec(feed)?.[0] ?? ''

    expect(score, 'score no longer publishes the score cue').toMatch(/publishFeedReached\(\{ at: 'score', run \}\)/)
    expect(score, 'score still appends the rerun divider instead of only publishing the gate').not.toMatch(
      /appendRerunMark|RERUN_MARK/,
    )
    expect(deploy, 'deploy subscription does not append the rerun divider').toMatch(/appendRerunMark\(\)/)
    expect(deploy, 'deploy subscription moved the score paper cue').not.toMatch(/publishFeedReached/)
  })
})
