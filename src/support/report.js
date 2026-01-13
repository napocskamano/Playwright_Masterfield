const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber-report.json',
  output: 'reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'Test Environment': 'STAGING',
    'Browser': 'Chrome',
    'Platform': process.platform,
    'Executed': new Date().toLocaleString()
  }
};

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

reporter.generate(options);
console.log('✓ Cucumber HTML report generated successfully!');

