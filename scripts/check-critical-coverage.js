/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const SUMMARY_PATH = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
const MIN_LINES_PCT = 70;

const CRITICAL_FILES = [
  'src/utils/validation.js',
  'src/utils/scheduleLogic.js',
  'src/utils/dateUtils.js',
  'src/hooks/useChurchDashboard.js',
];

const resolveEntry = (summary, relativePath) => {
  if (summary[relativePath]) return summary[relativePath];
  const foundKey = Object.keys(summary).find((key) => key.endsWith(relativePath));
  return foundKey ? summary[foundKey] : null;
};

if (!fs.existsSync(SUMMARY_PATH)) {
  console.error(`Arquivo não encontrado: ${SUMMARY_PATH}`);
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8'));
const failures = [];

CRITICAL_FILES.forEach((file) => {
  const entry = resolveEntry(summary, file);
  if (!entry) {
    failures.push(`${file}: sem dados de cobertura`);
    return;
  }

  const linesPct = entry.lines && typeof entry.lines.pct === 'number' ? entry.lines.pct : 0;
  if (linesPct < MIN_LINES_PCT) {
    failures.push(`${file}: linhas ${linesPct}% (< ${MIN_LINES_PCT}%)`);
  }
});

if (failures.length > 0) {
  console.error('Falha na cobertura crítica (V3):');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Cobertura crítica aprovada (>= ${MIN_LINES_PCT}% em linhas):`);
CRITICAL_FILES.forEach((file) => {
  const entry = resolveEntry(summary, file);
  const linesPct = entry.lines.pct;
  console.log(`- ${file}: ${linesPct}%`);
});
