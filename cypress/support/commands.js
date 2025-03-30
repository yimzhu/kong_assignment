// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-wait-until';
import 'cypress-dotenv';
import "cypress-image-diff-js/dist/command";

// cypress/support/commands.js
const compareSnapshotCommand = require('cypress-image-diff-js/dist/command');
compareSnapshotCommand();
const gatewayServiceUrl = (Cypress.env('DEV_API_URL') || 'http://localhost:8001')+'/default/services';
const routeServiceUrl = (Cypress.env('DEV_API_URL') || 'http://localhost:8001')+'/default/routes';
const queryParams = {
  sort_desc: 1,
  size: 30,
};

//Safe get elements to avoid exception
Cypress.Commands.add('safeGet', (selector) => {
  return cy.get('body').then(($body) => {
    return $body.find(selector).length > 0 ? cy.wrap($body.find(selector)) : null;
  });
});

/**
 * Set checkbox state
 **/
Cypress.Commands.add('setCheckboxState', (selector, shouldBeChecked) => {
  cy.get(selector).then(($checkbox) => {
    const isChecked = $checkbox.prop('checked')
    
    // Parameter type validation
    if (typeof shouldBeChecked !== 'boolean') {
      throw new Error('Parameter should be (true/false)')
    }

    // Status check
    if (shouldBeChecked && !isChecked) {
      cy.wrap($checkbox).check({ log: false })
    } else if (!shouldBeChecked && isChecked) {
      cy.wrap($checkbox).uncheck({ log: false })
    }

    // final assertion
    cy.wrap($checkbox)
      .should(shouldBeChecked ? 'be.checked' : 'not.be.checked')
      .and('have.attr', 'aria-checked', shouldBeChecked.toString())
  })
});

/**
 * rewrite log function
 */
Cypress.Commands.overwrite("log", function(log, ...args) {
  if (Cypress.browser.isHeadless) {
    return cy.task("log", args, { log: true }).then(() => {
      return log(...args);
    });
  } else {
    console.log(...args);
    return log(...args);
  }
});

/**
 * wait for service ready
 */
Cypress.Commands.add('waitForService', (serviceUrl, maxAttempts = 12, interval = 5000) => {
  const poll = (attempt = 0) => {
    if (attempt >= maxAttempts) {
      throw new Error(`Service failed to be ready in ${maxAttempts * interval / 1000} seconds`);
    }
    cy.wait(15000, { log: false });
    cy.request({ 
      url: serviceUrl,
      failOnStatusCode: false,
      retryOnNetworkFailure: true, 
      timeout: 100000,             
     })
      .then(({ status }) => {
        if (status === 200) return;

        cy.log(`Waiting for [${serviceUrl}] Ready!（Trying ${attempt + 1}/${maxAttempts}）`);
        cy.wait(interval, { log: false })
          .then(() => poll(attempt + 1));
      });
  };

  return poll();
});

/**
 * clear test data
 */
Cypress.Commands.add('clearTestData', ()=>{
  cy.log('Cleaning up services...');
    return cy.deleteRouteIds().then(()=>{
      return cy.deleteGatewayIds()
      })
  })

Cypress.Commands.add('fetchGatewayIds', ()=>{
  // const params = {
  //   sort_desc: 1,
  //   size: 30,
  // };
  cy.request({
    method: 'GET',
    url: gatewayServiceUrl,
    qs: queryParams, 
    headers: {},
  }).then((response) => {
    expect(response.status).to.eq(200);
    cy.log('API Response:', JSON.stringify(response.body, null, 2));
    // assertion
    expect(response.body).to.have.property('data');
    expect(response.body.data).to.be.an('array');
    // get service ids
    const serviceIds = response.body.data.map((item) => item.id);
    cy.log('Service IDs:', serviceIds);
    return cy.wrap(serviceIds);
  });
})

Cypress.Commands.add('deleteGatewayIds', ()=>{
  cy.fetchGatewayIds().then((serviceIds)=>{
    for(let uuid of serviceIds){
      cy.request({
        method: 'DELETE',
        url: `${gatewayServiceUrl}/${uuid}`,
        headers: {
        },
        failOnStatusCode: false, // keep slience if failed
      }).then((response) => {
        if (response.status !== 200 && response.status !== 204) {
          cy.log(`Failed to delete service ${uuid}: ${response.status}`);
        }
      });
    }
  })
});

//delete service by id
Cypress.Commands.add('deleteGatewayById', (uuid) => {
  const url = `/default/services/${uuid}`;
  return cy.request({
    method: 'DELETE',
    url,
    headers: {
    },
    failOnStatusCode: false, // allow deletion failed without throwing an error
  }).then((response) => {
    if (response.status !== 200 && response.status !== 204) {
      cy.log(`Failed to delete service ${uuid}: ${response.status}`);
    }
    return response;
  });
});

Cypress.Commands.add('fetchRouteIds', ()=>{
  cy.request({
    method: 'GET',
    url: routeServiceUrl,
    // url: `http://localhost:8001/default/routes`,
    qs: queryParams, 
    headers: {},
  }).then((response) => {
    expect(response.status).to.eq(200);
    cy.log('API Response:', JSON.stringify(response.body, null, 2));
    // assertion
    expect(response.body).to.have.property('data');
    expect(response.body.data).to.be.an('array');
    // get route ids
    const routeIds = response.body.data.map((item) => item.id);
    cy.log('Route IDs:', routeIds);
    return cy.wrap(routeIds);
  });
})

Cypress.Commands.add('deleteRouteIds', ()=>{
  cy.log('Cleaning up routes...');
  return cy.fetchRouteIds().then((routeIds)=>{
    for(let uuid of routeIds){
      cy.request({
        method: 'DELETE',
        // url: `http://localhost:8001/default/routes/${uuid}`,
        url: `${routeServiceUrl}/${uuid}`,
        headers: {
        },
        failOnStatusCode: false, // keep slience if failed
      }).then((response) => {
        if (response.status !== 200 && response.status !== 204) {
          cy.log(`Failed to delete routes ${uuid}: ${response.status}`);
        }
      });
    }
  })
})

/**
 * start docker
 */
Cypress.Commands.add('startEnv', ()=>{
  cy.exec("docker-compose up -d", { timeout: 180000 }).then(() => cy.waitForService(Cypress.env('DEV_URL')+"/default/services"));
});

/**
 * stop docker
 */
Cypress.Commands.add('stopEnv', ()=>{
  cy.exec("docker-compose down", { failOnNonZeroExit: false });
});