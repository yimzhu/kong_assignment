const { defineConfig } = require("cypress");
const path = require('path');
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/plugin');
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

// const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome, mocha-allure-reporter',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports/mochawesome',
      overwrite: false,
      html: true,
      json: true
    },
    mochaAllureReporterOptions: {
      reportDir: 'allure-results'
    }
  },
  e2e: {
    // baseUrl: "http://localhost:8002",
    // default timeout 40 s:ml-citation{ref="6" data="citationList"}
    defaultCommandTimeout: 40000,  
    retries: {
    // run mode automatically retry 2 times‌:ml-citation{ref="3" data="citationList"}
      runMode: 2,                 
      openMode: 0
    },
    execTimeout: 600000,
    //disable CORS
    chromeWebSecurity: false, 
    defaultCommandTimeout: 10000,
    failOnStatusCode: false,
    chromeWebSecurity: false,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    video: false,
    screenshotOnRunFailure: false,

    garbageCollection: true,
    setupNodeEvents(on, config) {
      on("task", {
        log(args) {
          console.log(...args);
          return null;
        }
      });
      
      on('after:spec', (spec, results) => {
        if (global.gc) {
          global.gc();
        }
      });
      
      // Configure Allure
      allureWriter(on, config);
      
      // Configure image comparison
      return getCompareSnapshotsPlugin(on, config);
    },
    env: {
      START_DOCKER: true,
      DEV_URL: "http://localhost:8002",
      DEV_API_URL: "http://localhost:8001",
      allure: true
    }
  },
});