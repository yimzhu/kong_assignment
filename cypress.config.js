const { defineConfig } = require("cypress");
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
      on("task", {
        log(args) {
          console.log(...args);
          return null;
        }
      });
      // allureWriter(on, config);  // 注册 Allure 插件
      return config;
    },
    // env: {
      // allureResultsPath: "cypress/reports/allure-results",
      // allureAttachRequests: true,
      // allure: true,
      // allureLogCypress: true,
      // allureAttachRequests: true,
    // },
  },
});