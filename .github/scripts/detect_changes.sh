#!/bin/bash
set -eo pipefail

# Get event payload
payload=$(cat "$GITHUB_EVENT_PATH")

# Determine commit range based on event type
case "$GITHUB_EVENT_NAME" in
  pull_request)
    # Handle fork PRs safely
    if [ "$(jq -r '.pull_request.head.repo.full_name' <<< "$payload")" != "$(jq -r '.pull_request.base.repo.full_name' <<< "$payload")" ]; then
      echo "::warning::Fork PR detected - using full repository state"
      changed_files=$(git ls-files)
    else
      base_sha=$(jq -r '.pull_request.base.sha' <<< "$payload")
      head_sha=$(jq -r '.pull_request.head.sha' <<< "$payload")
      changed_files=$(git diff --name-only "$base_sha" "$head_sha")
    fi
    ;;

  push)
    before_sha=$(jq -r '.before' <<< "$payload")
    after_sha=$(jq -r '.after' <<< "$payload")
    
    # Handle initial commit
    if [ "$before_sha" = "0000000000000000000000000000000000000000" ]; then
      changed_files=$(git ls-files)
    else
      changed_files=$(git diff --name-only "$before_sha" "$after_sha")
    fi
    ;;

  *)
    echo "::error::Unsupported event: $GITHUB_EVENT_NAME" >&2
    exit 1
    ;;
esac

# Extract unique root items
printf "%s" "$changed_files" | awk -F/ '{
  if (NF > 1) print $1
  else print $0
}' | sort -u > /tmp/changed_roots

# Output results
{ 
  echo "changed_roots<<EOF"
  cat /tmp/changed_roots
  echo "EOF"
} >> "$GITHUB_OUTPUT"

rm -f /tmp/changed_roots