#!/bin/bash
set -eo pipefail

# Initialize with safe defaults
needs_test=true
needs_deploy_docs=false

# Detect fork PRs (no git history access)
is_fork_pr() {
  if [[ "$GITHUB_EVENT_NAME" == "pull_request" ]]; then
    if [[ "$GITHUB_HEAD_REPO_FULL_NAME" != "$GITHUB_REPOSITORY" ]]; then
      echo "::warning::Fork PR detected - no access to full git history"
      return 0  # true = is fork PR
    fi
  fi
  return 1  # false = not fork PR
}

# Main logic
if is_fork_pr; then
  echo "Detected fork PR - defaulting to needs_test=true, needs_deploy_docs=false"
  # Note: We keep needs_deploy_docs=false for fork PRs since we typically don't want
  # to deploy docs from untrusted forks
elif [[ "$GITHUB_EVENT_BEFORE" == "0000000000000000000000000000000000000000" ]]; then
  echo "::warning::Initial commit detected - defaulting to needs_test=true, needs_deploy_docs=false"
  # For initial commits, we assume docs deployment is handled separately
else
  # Attempt diff with error capture
  if changed_files=$(git diff --name-only "$GITHUB_EVENT_BEFORE" "$GITHUB_SHA" 2>&1); then
    # Check for src/ or test/ changes
    if echo "$changed_files" | grep -qE '^(src|test)/'; then
      needs_test=true
      echo "Changes detected in src/ or test/ - needs_test=true"
    else
      needs_test=false
      echo "No relevant changes detected in src/ or test/ - needs_test=false"
    fi
    
    # Check for docs/ changes
    if echo "$changed_files" | grep -q '^docs/'; then
      needs_deploy_docs=true
      echo "Changes detected in docs/ - needs_deploy_docs=true"
    else
      needs_deploy_docs=false
      echo "No changes detected in docs/ - needs_deploy_docs=false"
    fi
  else
    git_exit_code=$?
    echo "::error::Git diff failed (exit $git_exit_code)"
    echo "Command output:"
    echo "$changed_files"
    echo "::warning::Defaulting to needs_test=true, needs_deploy_docs=false due to error"
  fi
fi

# Output results
echo "needs_test=$needs_test" >> "$GITHUB_OUTPUT"
echo "needs_deploy_docs=$needs_deploy_docs" >> "$GITHUB_OUTPUT"