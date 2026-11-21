"""Synthetic-only regression tests for the required repository security gate."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

import security_gate as gate


class FilePolicyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.repo = Path(self.temp.name)
        subprocess.run(['git', 'init', '-q', str(self.repo)], check=True)

    def tearDown(self):
        self.temp.cleanup()

    def track(self, *names):
        for name in names:
            path = self.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('invented placeholder only', encoding='utf-8')
        subprocess.run(['git', '-C', str(self.repo), 'add', '--', *names], check=True)

    def test_allows_clean_files_and_templates(self):
        self.track('README.md', '.env.example', 'config/.env.sample', '.env.template')
        self.assertTrue(gate.files_allowed(self.repo))

    def test_blocks_environment_file_among_multiple_tracked_paths(self):
        self.track('.env', 'game/index.html', 'z-last.txt')
        self.assertFalse(gate.files_allowed(self.repo))

    def test_blocks_nested_environment_files(self):
        self.track('README.md', 'config/.env.production', 'z-last.txt')
        self.assertFalse(gate.files_allowed(self.repo))

    def test_blocks_each_credential_file_type(self):
        for name in ['secret.key', 'secret.p12', 'secret.pfx', 'id_rsa', 'id_ed25519', '.credentials']:
            with self.subTest(name=name):
                self.track(name)
                self.assertFalse(gate.files_allowed(self.repo))

    def test_blocks_source_local_scanner_ignore(self):
        self.track('.gitleaksignore', 'README.md')
        self.assertFalse(gate.files_allowed(self.repo))


class ScannerTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.repo = self.root / 'repo'
        self.repo.mkdir()
        self.binary = os.environ['GITLEAKS_BIN']
        self.config = self.root / 'config.toml'
        self.config.write_text('[extend]\nuseDefault = true\n')
        self.ignore = self.root / 'approved-ignore'
        self.ignore.write_text('')
        for args in [['init', '-q'], ['config', 'user.name', 'Synthetic Security Test'], ['config', 'user.email', 'test@example.invalid']]:
            subprocess.run(['git', '-C', str(self.repo), *args], check=True)

    def tearDown(self):
        self.temp.cleanup()

    def commit(self, body):
        (self.repo / 'fixture.txt').write_text(body, encoding='utf-8')
        subprocess.run(['git', '-C', str(self.repo), 'add', 'fixture.txt'], check=True)
        subprocess.run(['git', '-C', str(self.repo), 'commit', '-qm', 'Synthetic fixture'], check=True)

    def fake_credential(self):
        # Construct invented data at runtime so this test source is not a leak.
        return 'github_token = "' + 'ghp_' + '0123456789abcdefghijklmnopqrstuvABCD' + '"'

    def scan(self, binary=None):
        return gate.scan_history(self.repo, binary or self.binary, self.config, self.ignore)

    def test_clean_history_passes(self):
        self.commit('Invented clean demonstration content.')
        self.assertEqual(self.scan(), 0)

    def test_synthetic_credential_fails(self):
        self.commit(self.fake_credential())
        self.assertNotEqual(self.scan(), 0)

    def test_missing_scanner_fails_closed(self):
        self.commit('Invented clean demonstration content.')
        self.assertNotEqual(self.scan(str(self.root / 'missing-scanner')), 0)

    def test_invalid_scanner_configuration_fails_closed(self):
        self.commit('Invented clean demonstration content.')
        self.config.write_text('this is invalid TOML [')
        self.assertNotEqual(self.scan(), 0)

    def test_source_local_ignore_cannot_hide_a_synthetic_credential(self):
        self.commit(self.fake_credential())
        result = subprocess.run([self.binary, 'git', str(self.repo), '--config', str(self.config), '--redact=100', '--no-banner', '--log-level', 'fatal', '--report-format', 'json', '--report-path', '-'], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, check=False)
        findings = json.loads(result.stdout)
        self.assertTrue(findings)
        (self.repo / '.gitleaksignore').write_text('\n'.join(f['Fingerprint'] for f in findings) + '\n')
        self.assertNotEqual(self.scan(), 0)

    def test_exact_reviewed_fingerprint_does_not_allow_a_new_credential(self):
        self.commit(self.fake_credential())
        self.ignore.write_text('0000000000000000000000000000000000000000:elsewhere.txt:generic-api-key:1\n')
        self.assertNotEqual(self.scan(), 0)


if __name__ == '__main__':
    unittest.main()
