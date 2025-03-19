import dropdownSelectors from '../../selectors/dropdowns.json';

class GatewayServiceDetailPage {
    constructor() {
    }
    /**
     * Navigate to gateway service page
     * @returns 
     */
    visit(uuid) {
        cy.visit(`http://localhost:8002/default/services/${uuid}`);
        return this;
    }
  }
  
  export default GatewayServiceDetailPage;