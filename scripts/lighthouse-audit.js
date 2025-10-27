const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouse() {
  const url = 'http://localhost:3001';

  console.log(`\n🔍 Running Lighthouse audit on ${url}...\n`);

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);

  // Extract scores
  const { lhr } = runnerResult;
  const performanceScore = lhr.categories.performance.score * 100;
  const accessibilityScore = lhr.categories.accessibility.score * 100;

  console.log('\n📊 Lighthouse Audit Results:\n');
  console.log(`Performance Score:   ${performanceScore.toFixed(0)}%`);
  console.log(`Accessibility Score: ${accessibilityScore.toFixed(0)}%\n`);

  // Check PWA-specific audits
  const pwaAudits = {
    'installable-manifest': lhr.audits['installable-manifest'],
    'service-worker': lhr.audits['service-worker'],
    'splash-screen': lhr.audits['splash-screen'],
    'themed-omnibox': lhr.audits['themed-omnibox'],
    'viewport': lhr.audits['viewport'],
    'apple-touch-icon': lhr.audits['apple-touch-icon'],
    'maskable-icon': lhr.audits['maskable-icon'],
  };

  console.log('📱 PWA Installability Checks:\n');

  let pwaPassCount = 0;
  let pwaTotal = 0;

  Object.entries(pwaAudits).forEach(([key, audit]) => {
    if (audit) {
      pwaTotal++;
      const passed = audit.score === 1;
      if (passed) pwaPassCount++;

      const icon = passed ? '✅' : '⚠️';
      console.log(`${icon} ${audit.title}`);

      if (!passed && audit.description) {
        console.log(`   ${audit.description.replace(/<[^>]*>/g, '')}\n`);
      }
    }
  });

  const pwaScore = (pwaPassCount / pwaTotal) * 100;
  console.log(`\n✓ Passed ${pwaPassCount}/${pwaTotal} PWA checks (${pwaScore.toFixed(0)}%)\n`);

  // Save report
  const reportPath = path.join(__dirname, '../lighthouse-report.html');
  fs.writeFileSync(reportPath, runnerResult.report);
  console.log(`📄 Full report saved to: lighthouse-report.html\n`);

  await chrome.kill();

  if (pwaScore >= 85) {
    console.log('✅ PWA installability checks passed! Task 7.11 COMPLETE\n');
    process.exit(0);
  } else {
    console.log(`⚠️  PWA score ${pwaScore.toFixed(0)}% < 85. Review failed checks above.\n`);
    process.exit(1);
  }
}

runLighthouse().catch((error) => {
  console.error('Error running Lighthouse:', error);
  process.exit(1);
});
