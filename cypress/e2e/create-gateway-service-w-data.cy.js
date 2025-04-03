import GatewayServicesPage from '../support/pages/gateway-services-page'

describe('Create Gateway Service w historical data', () => {
  const gatewayServicesPage = new GatewayServicesPage();
  let testData;

    before(() => {
      // Load and validate the fixture data
      cy.fixture('create-gateway-service-w-data').then((data) => {
        // Validate required fields
        const requiredFields = ['historicalService', 'newService'];
        requiredFields.forEach(field => {
          expect(data).to.have.property(field);
          expect(data[field]).to.have.all.keys(['name', 'tags', 'url', 'advancedFields']);
        });
        testData = data;
      });
      
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
      .createNewGatewayByFullUrl(testData.historicalService.name, testData.historicalService.tags, testData.historicalService.url, false)
      .withViewAdvancedFields({
        retries: 3,
        timeout: 5000
      })
      .save();
    });

    it('create service by full url with historical data', function () {
      cy.allure().step('create a new gateway by full url');
      gatewayServicesPage.visit();
      cy.wait(1000);
      gatewayServicesPage.cleanupMainPage();
      // cy.compareSnapshot('visit-gateway-service-page', { testThreshold: 0 });

      gatewayServicesPage
        .createNewGatewayByFullUrl(testData.newService.name, testData.newService.tags, testData.newService.url, true)
        .withViewAdvancedFields({
          retries: 3,
          timeout: 5000
          // TLS: true
          // certArray: [1001, 1002]
        })
        .save();
      
      gatewayServicesPage.visit();
      gatewayServicesPage
        .setFilter({"name": testData.newService.name});
      gatewayServicesPage.clickItem(testData.newService.name);

      gatewayServicesPage.cleanupDetailPage();
      cy.compareSnapshot({
        name: `gateway-detail-page-${testData.newService.name}`
      });
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