#!/usr/bin/env bash
#
# bootstrap-labels.sh — create the issue label set on a fresh repository.
#
# Idempotent: `--force` updates colour/description if the label already exists,
# so re-running after an edit here is the intended way to change a label.
#
# Usage:
#   ./scripts/bootstrap-labels.sh <owner>/<repo>
#   ./scripts/bootstrap-labels.sh                  # uses the repo in $PWD
#
# Requires: gh (GitHub CLI), authenticated, v2.94+ for sub-issue support.

set -euo pipefail

DEFAULT_REPO="chabaak/ccr-op-onboarding"

REPO="${1:-}"
if [[ -z "$REPO" ]]; then
  if REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)"; then
    :
  else
    REPO="$DEFAULT_REPO"
  fi
fi

if [[ -z "$REPO" ]]; then
  echo "error: no repo resolved. Pass it explicitly: $0 <owner>/<repo>" >&2
  exit 1
fi

# Hard rule carried over from the previous repo: act on github.com as the
# personal account, never through a corporate host.
export GH_HOST="${GH_HOST:-github.com}"

echo "Creating labels on ${REPO} (host: ${GH_HOST})"
echo

mk() { # mk <name> <colour> <description>
  gh label create "$1" --repo "$REPO" --color "$2" --description "$3" --force >/dev/null
  printf '  %-28s %s\n' "$1" "$3"
}

# --- lane -------------------------------------------------------------------
# Not taxonomy. Lane exists so two people can pick disjoint work, and so a
# glance at the board answers "are we about to touch the same files".
echo "lane —"
mk "lane:frontend"     "1f6feb" "client UI, shell, windows, styles"
mk "lane:data"         "0e8a16" "scenario packs, data/, balance tunables"
mk "lane:llm"          "8250df" "prompts, gates, probes, model behaviour"
mk "lane:proxy"        "b60205" "proxy tier, AWS, deploy, secrets"
mk "lane:design"       "d93f0b" "game feel, copy, art, audio, thumbnail/video"
mk "lane:infra"        "5a5a5a" "build, CI, tests, tooling, repo hygiene"
echo

# --- cost -------------------------------------------------------------------
# The joint window (08/24-25) is two evenings after work, not two full days.
# Sizing against that number is what makes cutting mechanical instead of
# emotional — and it is why an L is a decision, not a slot.
echo "cost —"
mk "cost:S"            "c2e0c6" "under ~2h"
mk "cost:M"            "fbca04" "about half a day"
mk "cost:L"            "e99695" "a day or more — needs a decision, not just a slot"
echo

# --- scores -----------------------------------------------------------------
# The five judging criteria. A non-bug issue that cannot name one of these is
# an issue that has not been thought through yet.
echo "scores —"
mk "scores:playability"   "0052cc" "the game functions and is pleasant to operate"
mk "scores:originality"   "0052cc" "novel idea or mechanic"
mk "scores:codex"         "0052cc" "improves the Codex collaboration story"
mk "scores:release"       "0052cc" "release potential / Hive viability"
mk "scores:presentation"  "0052cc" "demo, video, thumbnail, first 60 seconds"
echo

# --- type -------------------------------------------------------------------
# Deliberately absent. `type` is a native organization-level Issue Type on
# `chabaak`, not a label: Bug · Feature · Idea · Chore · Deliverable, set at
# creation with `gh issue create --type <name>`. GitHub's stock `Task` type was
# deleted — it overlapped Chore and was not one of our five.
#
# Types live on the org, so they are NOT recreated by this script. If they ever
# need rebuilding (needs the `admin:org` scope):
#   gh api -X POST /orgs/chabaak/issue-types \
#     -f name=Idea -f description='...' -f color=gray -F is_enabled=true
# `is_enabled` is required and must be a real boolean — `-F`, not `-f`.

# --- state ------------------------------------------------------------------
echo "state —"
mk "structural"        "ff8800" "other work will be built on top — decide early, land early"
mk "blocked"           "000000" "waiting on another issue or an outside answer"
mk "wontfix"           "ffffff" "discussed and declined — close with the reasoning, never delete"
echo

echo "Done. Note: \`type\` is an org Issue Type, not a label — see the comment above."
echo "Remaining setup:"
echo "  1. Wire the Discord webhook (channel webhook URL + '/github')."
echo "  2. Branch protection on main."
