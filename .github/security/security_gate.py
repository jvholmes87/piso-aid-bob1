"""Fail-closed repository file and credential checks; no finding values logged."""
import argparse
import os
from pathlib import Path, PurePosixPath
import subprocess


def source_ignore_present(repo):
    path = Path(repo) / '.gitleaksignore'
    return path.exists() or path.is_symlink()


def files_allowed(repo):
    try:
        if source_ignore_present(repo):
            return False
        paths = subprocess.check_output(['git', '-C', str(repo), 'ls-files', '-z'], stderr=subprocess.DEVNULL).split(bytes([0]))
        for raw in filter(None, paths):
            name = PurePosixPath(os.fsdecode(raw)).name.lower()
            template = name.endswith(('.example', '.sample', '.template'))
            environment = (name == '.env' or name.startswith('.env.')) and not template
            credential = name.endswith(('.key', '.p12', '.pfx')) or name in ('id_rsa', 'id_ed25519', '.credentials')
            if environment or credential:
                return False
        return True
    except (OSError, subprocess.CalledProcessError):
        return False


def scan_history(repo, scanner, config, ignore_path):
    # Gitleaks loads source/.gitleaksignore in addition to --gitleaks-ignore-path.
    # Reject it explicitly rather than assuming the external path replaces it.
    if source_ignore_present(repo):
        return 2
    if not Path(config).is_file() or not Path(ignore_path).is_file():
        return 2
    try:
        result = subprocess.run([
            str(scanner), 'git', str(repo), '--log-opts=--all',
            '--config', str(config), '--gitleaks-ignore-path', str(ignore_path),
            '--ignore-gitleaks-allow', '--redact=100', '--no-banner', '--no-color',
            '--timeout', '240', '--max-archive-depth', '2', '--log-level', 'fatal',
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=270, check=False)
        return result.returncode
    except (OSError, subprocess.TimeoutExpired):
        return 2


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['files', 'scan'])
    parser.add_argument('--repo', default='.')
    parser.add_argument('--scanner')
    parser.add_argument('--config')
    parser.add_argument('--ignore-path')
    args = parser.parse_args()
    if args.mode == 'files':
        result = 0 if files_allowed(args.repo) else 1
        message = 'Sensitive-file policy passed.' if result == 0 else 'Sensitive-file policy failed. Review environment/key files and source-local scanner ignores privately.'
    else:
        if not all([args.scanner, args.config, args.ignore_path]):
            parser.error('scan requires --scanner, --config and --ignore-path')
        result = scan_history(args.repo, args.scanner, args.config, args.ignore_path)
        message = 'Secret scan passed.' if result == 0 else 'Secret scan failed or found a potential secret. Investigate privately; never paste matching values into logs, issues or PRs.'
    print(message)
    return 0 if result == 0 else 1


if __name__ == '__main__':
    raise SystemExit(main())
