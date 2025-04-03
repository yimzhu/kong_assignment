module.exports = {
    allureResultsPath: "allure-results",
    allureReportPath: "allure-report",
    environment: process.env.NODE_ENV || 'development',
    reportTitle: "Kong Assignment Test Report",
    testMapping: {
        package: 'cypress/e2e',
        suite: 'Gateway Tests',
    }
}; 