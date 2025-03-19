import GatewayServicesPage from '../support/pages/gatewayServicesPage'

describe('Create Gateway Service w historical data', () => {
  //init test data
    const gatewayServicesPage = new GatewayServicesPage();
    const gatewayServiceNameHistoricalData = 'test1';
    const gatewayServiceName = 'test2';
    const gatewayServiceTag = 'tag1, tag2';
    const gatewayServiceUrl = 'http://192.168.1.1';

    before(() => {
      //Avoid this api failed
      cy.intercept('GET', 'https://api.github.com/repos/kong/kong', (req) => {
        req.reply({ statusCode: 200, body: {} }); 
      });
      cy.allure().step('init env').then(() => {
        cy.startEnv();
      });
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
      cy.clearData();
    });

    after(() => {
      cy.allure()
      .step('leash env') 
      .then(() => {
        cy.stopEnv();
      });    
    });
});