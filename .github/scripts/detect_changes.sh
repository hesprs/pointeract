#!/bin/bash
set -eo pipefail

get_changed_files() {
  case "$GITHUB_EVENT_NAME" in
    pull_request)
      jq -r '.pull_request.base.sha,.pull_request.head.sha' "$GITHUB_EVENT_PATH" | 
        xargs git diff --name-only
      ;;
    push)
      if [ "$GITHUB_EVENT_BEFORE" = "0000000000000000000000000000000000000000" ]; then
        git ls-files
      else
        git diff --name-only "$GITHUB_EVENT_BEFORE" "$GITHUB_SHA"
      fi
      ;;
    *)
      echo "::error::Unsupported event: $GITHUB_EVENT_NAME" >&2
      exit 1
      ;;
  esac
}

# Get root items (first path component)
get_changed_files | awk -F/ '{print $1}' | sort -u > /tmp/changed_roots

# Output multi-line result
{
  echo "changed_roots<<EOF"
  cat /tmp/changed_roots
  echo "EOF"
} >> "$GITHUB_OUTPUT"

rm /tmp/changed_roots