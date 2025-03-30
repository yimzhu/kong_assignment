import GatewayServicesPage from '../support/pages/gateway-services-page'

describe('Create Gateway Service w historical data', () => {
  //init test data
    const gatewayServicesPage = new GatewayServicesPage();
    const gatewayServiceNameHistoricalData = 'test1';
    const gatewayServiceName = 'test2';
    const gatewayServiceTag = 'tag1, tag2';
    const gatewayServiceUrl = 'http://192.168.1.1';

    before(() => {
      if (Cypress.env('START_DOCKER')) {
        cy.log('Starting env...')
        cy.startEnv();
      }
      //Avoid this api failed
      cy.intercept('GET', 'https://api.github.com/repos/kong/kong', (req) => {
        req.reply({ statusCode: 200, body: {} }); 
      });

      cy.clearTestData();
      cy.viewport(1920, 1080);
    });
    beforeEach(() => {
      cy.allure().step('create a new gateway as history data');
      gatewayServicesPage.visit();
      gatewayServicesPage
      .createNewGatewayByFullUrl(gatewayServiceNameHistoricalData, gatewayServiceTag, gatewayServiceUrl, false)
      .withViewAdvancedFields({
        retries: 3,
        timeout: 5000
      })
      .save();
    });

    it('create service by full url with historical data', function () {
      cy.allure().step('create a new gateway by full url');
      gatewayServicesPage.visit();
      cy.compareSnapshot('visit-gateway-service-page', 0.01);
      gatewayServicesPage
        .createNewGatewayByFullUrl(gatewayServiceName, gatewayServiceTag, gatewayServiceUrl, true)
        .withViewAdvancedFields({
          retries: 3,
          timeout: 5000
          // TLS: true
          // certArray: [1001, 1002]
        })
        .save();
    });

    afterEach(() => {
      cy.clearTestData();
    });

    after(() => {
      if (Cypress.env('START_DOCKER')) {
        cy.log('Stopping env...')
        cy.stopEnv();
      }
    });
});