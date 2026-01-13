const common = {
  require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    'junit:reports/cucumber-report.xml'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  dryRun: false,
  paths: ['src/features/**/*.feature']
};

module.exports = {
  default: common
};
