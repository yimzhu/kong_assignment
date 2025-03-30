import GatewayServicesPage from '../support/pages/gateway-services-page'
// import GatewayServicesDetailPage from '../support/pages/gatewayServicesDetailPage'
import GatewayServiceDetailRoutePage from '../support/pages/gateway-services-detail-route-page'

// Cypress.env('allure')
describe('Create Gateway Service wo historical data', () => {
    const gatewayServicesPage = new GatewayServicesPage();
    // const gatewayServicesDetailPage = new GatewayServicesDetailPage();
    const gatewayServiceDetailRoutePage = new GatewayServiceDetailRoutePage();
    const gatewayServiceName = 'test2';
    const gatewayServiceTags = 'tag1, tag2';
    const gatewayServiceUrl = 'http://192.168.1.1';
    const routeName = 'route1';
    const routeTags = 'tag3, tag4';
    const routeProtocol = 'HTTP';
    const routeOptions = {paths : '/dummy'}

    before(() => {
      if (Cypress.env('START_DOCKER')) {
        cy.log('Starting env...')
        cy.startEnv();
      }
      //Avoid this api failed
      cy.intercept('GET', 'https://api.github.com/repos/kong/kong', (req) => {
        req.reply({ statusCode: 200, body: {} }); 
      });
      cy.viewport(1920, 1080);
    });
    beforeEach(() => {
      cy.allure().step('browse to gateway service page');
    });

    it('create service by full url without historical data', function () {
      cy.allure().step('create a new gateway by full url');
      gatewayServicesPage.visit();
      cy.compareSnapshot('visit-gateway-service-page');
      gatewayServicesPage
        .createNewGatewayByFullUrl(gatewayServiceName, gatewayServiceTags, gatewayServiceUrl, false)
        .withViewAdvancedFields({
          retries: 3,
          timeout: 5000
        })
        .save();
      cy.allure().step('create a new route under the gateway');
      gatewayServiceDetailRoutePage.addRoute()
      gatewayServiceDetailRoutePage.createRoute(routeName, routeTags, routeProtocol, routeOptions)
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