
class GatewayServiceDetailRoutePage {
    constructor() {
    }
    /**
     * Navigate to gateway service page
     * @returns 
     */
    visit(uuid) {
      cy.log("Navigate to: "+Cypress.env('DEV_URL')+"/default/services");
      cy.visit(Cypress.env('DEV_URL')+`/default/services/${uuid}/routes`);
      return this;
    }
  }
  
  export default GatewayServiceDetailRoutePage;