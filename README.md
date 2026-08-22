# ccr-op-onboarding

Competition entry for **OpenAI Game Builders Seoul**, Track 1: `긴급상황대응실 운영자 임용을 축하합니다` (English working title: *Central Control Room Operator Onboarding*). The game is a browser-based emergency control room simulation built by a 2-person team.

**Status:** OpenAI competition phase — see [AGENTS.md](./AGENTS.md) for permanent repo rules and GitHub issues/PRs for mutable project state.

**Live:** https://chabaak.github.io/ccr-op-onboarding/

## Stack

- Vite + TypeScript (vanilla, strict mode) for the browser client.
- Node-based authoring, probe, and driver tools.
- AWS Lambda proxy for runtime LLM calls.
- GitHub Pages deploy on every push to `main`.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
npm run audio:table # refresh audio binding table; requires ffprobe on PATH
```

## Layout

```
src/            browser bundle + isomorphic core (engine, composer, client)
authoring/      authoring-time preprocessing: datapack compile, lint, type generation
tools/          Node-only executables: probe runner, beat driver, shared call libs
proxy/          LLM tier: Lambda + Bedrock, deployed separately from Pages
planning/       planning archive, including meeting notes and legacy research
public/assets/  static assets served as-is
data/           balance-as-data: datapacks, policy, prompt inputs
docs/           kept design reference and orchestration note
.github/        CI/CD workflows
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). **Important:** verify your git identity before your
first commit (this repo must be attributed to personal accounts, not corporate ones).

## License

MIT for our own code — see [LICENSE](./LICENSE). Third-party asset licenses are tracked
separately in [`assets-manifest.json`](./assets-manifest.json).
