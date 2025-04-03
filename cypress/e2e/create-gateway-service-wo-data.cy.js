import GatewayServicesPage from '../support/pages/gateway-services-page'
import RoutesPage from '../support/pages/routes-page'

describe('Create Gateway Service wo historical data', () => {
    const gatewayServicesPage = new GatewayServicesPage();
    const routesPage = new RoutesPage();

    // Declare variables that will be populated by fixture
    let testData;

    before(() => {
      // Load the fixture data before tests
      cy.fixture('create-gateway-service-wo-data').then((data) => {
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
      cy.viewport(1920, 1080);
    });

    beforeEach(() => {
      cy.allure().step('browse to gateway service page');
    });

    it('create service by full url without historical data', function () {
      const { gatewayService, route } = testData;
      
      gatewayServicesPage.visit();
      cy.wait(1000);
      gatewayServicesPage.cleanupMainPage();
      // cy.pause();
      cy.compareSnapshot('visit-gateway-service-page', { testThreshold: 0 });

      gatewayServicesPage
        .createNewGatewayByFullUrl(
          gatewayService.name, 
          gatewayService.tags, 
          gatewayService.url, 
          false
        )
        .withViewAdvancedFields(gatewayService.advancedFields)
        .save();
      
      cy.wait(1000);
      gatewayServicesPage.cleanupDetailPage();
      //TODO: snapshot full page
      cy.compareSnapshot(`gateway-detail-page-${gatewayService.name}`, { testThreshold: 0 });

      routesPage
        .clickNewRouteBtn()
        .fillCreateRoutePage(
          route.name, 
          route.tags, 
          route.protocol, 
          route.options
        );
      cy.wait(1000);

      cy.window().should('have.property', 'document');
      cy.wait(1000);
      // gatewayServicesPage.cleanupDetailPage();
      cy.compareSnapshot(`gateway-detail-page-${route.name}`, { testThreshold: 0 });

      routesPage.save();
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