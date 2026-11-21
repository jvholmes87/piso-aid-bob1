# Required security workflow

Applies to public and private repositories. Repository visibility is not a
substitute for security or privacy review. Existing stronger project rules,
ownership, attribution, licensing and owner approval gates continue to apply.

Before pushing: inspect the diff and intended publication artifact, run the
project's relevant security tests, and scan for credentials and private data.
Use invented data. Keep private deny rules and real personal/customer/student
records outside source, Git history, CI output and downloadable artifacts.

The `Security baseline` check rejects tracked environment/credential files and
uses a checksum-verified Gitleaks CLI to scan reachable fetched Git history.
It runs on pull requests and pushes with read-only permissions. It does not
execute application code, receive repository secrets, upload finding reports,
or use the separately licensed Gitleaks Action. Matches and tool failures stop
the check; no automatic allowlist, suppression or baseline is introduced.

Security checks must pass before merging. Jason reviews and merges these PRs.
Enable the required `Security baseline` status check on protected release
branches, preserve existing required checks, prevent force pushes/deletions,
and apply protections to administrators. Workflow configuration alone does
not enforce merges. Availability of private-repository protection depends on
the GitHub plan; record any unsupported control rather than claiming it works.

Dependency update PRs remain subject to review and existing tests. Do not
auto-merge them. Do not add a paid scanner without owner approval.

For code changes, additionally review the applicable authentication,
authorization, tenant isolation, input handling, browser and deployment
security, dependencies and data flows. A credential scan does not establish
application security and cannot reliably identify all personal information.
Review the actual public artifact and publish only intended files. A preview
is public unless access protection has been independently verified.

Incident handling: contain exposure; rotate exposed credentials; review Git
history, deployments, artifacts and caches; coordinate cleanup of clones;
verify the fix and record remaining limitations. Report privately to the
repository owner. Never put an exposed value into a public issue or PR.

For local scanning, install Gitleaks from its official release, verify its
checksum, and run `gitleaks git . --redact=100 --no-banner`. Inspect results
privately. CI uses its own default-rule configuration so repository-local
allowlists cannot silently exempt findings. Scanner version updates require
review and a new verified checksum.
