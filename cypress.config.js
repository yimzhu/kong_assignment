const { defineConfig } = require("cypress");
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin');

// const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    overwrite: false,
    html: true,
    json: true,
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
    setupNodeEvents(on, config) {
      // visualRegression(on, config, {
      //   failureThreshold: 0,
      //   screenshotPath: './cypress/screenshots'
      // });
      getCompareSnapshotsPlugin(on, config);
      on("task", {
        log(args) {
          console.log(...args);
          return null;
        }
      });
      // allureWriter(on, config);  // 注册 Allure 插件
      return config;
    },
    env: {
      START_DOCKER: true,
      DEV_URL: "http://localhost:8002",
      DEV_API_URL: "http://localhost:8001",
      "cypress-image-diff": {
        "baseDir": "cypress/custom_snapshots/base",   // Baseline 存储路径
        "diffDir": "cypress/custom_snapshots/diff",    // Diff 存储路径
        "failureThreshold": 0.01, 
        "failureThresholdType": "percent" // Use percentage (default: "pixel")
      }
    }
  },
});