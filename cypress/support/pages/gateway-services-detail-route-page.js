import dropdownSelectors from '../../selectors/dropdowns.json';

class GatewayServiceDetailRoutePage {
    constructor() {
    }
    /**
     * Navigate to gateway service page
     * @returns 
     */
    visit(uuid) {
        cy.visit(Cypress.env('DEV_URL')+`http://localhost:8002/default/services/${uuid}/routes`);
        return this;
    }

    /**
     * click 'add a route' button
     */
    addRoute(){
      cy.get("div.k-alert button").click();
    }

    /**
     * create route with madatory fields
     * @param {*} name 
     * @param {*} tags 
     * @param {*} path 
     * @returns 
     */
    createRoute(name, tags, protocol, options={}){
      cy.log('Options:', options); 
      cy.get("[data-testid='route-form-name']").should('not.have.value', 'oldvalue').type(name);
      cy.get("[data-testid='route-form-tags']").should('not.have.value', 'oldvalue').type(tags);
      if(protocol?.toUpperCase() === 'HTTP'){
        const requiredFields = ['hosts', 'methods', 'paths', 'headers'];
  
        // validation
        if (requiredFields.every(field => options[field] === undefined)) {
          throw new Error(`At least one fields should be placed: ${requiredFields.join(', ')}`);
        }
        if(options.hosts !== undefined){
          //TODO
        }
        if(options.methods !== undefined){
          //TODO
        }
        if(options.paths !== undefined){
          cy.get("[data-testid='route-form-paths-input-1']").clear().should('not.have.value', 'oldvalue').type(options.paths);
        }
        if(options.headers !== undefined){
          //TODO
        }
      }
      cy.get("[data-testid='route-create-form-submit']").click();
      return this
    }

    /**
     * create route with optional fields
     * @param {*} protocols 
     * @param {*} rules 
     * @returns 
     */
    viewAdvancedFields(protocols, rules={}){
      const {  
          isStripPath = false,
          pathHandling = 'v0',
          httpsRedirectStatusCode = '426',
          regexPriority = '0',
          isPreserveHost = true,
          requestBuffering = false,
          responseBuffering = false
        } = rules

      //Certain protocols include dedicated checkboxes, with their functionality dynamically linked to dropdown menus."
      if (!['GRPC', 'GRPCS', 'GRPC&GRPCS'].includes(protocols)) {
        if(isStripPath !== true){
          cy.get("[data-testid='route-form-strip-path']").then(($checkbox) => {
            if ($checkbox.is(':checked')) {
                cy.log('isStripPath has been already ticked');
            } else {
                // tick if not ticked
                cy.wrap($checkbox).check(); 
            }
          });
        }
      }
      
      if(rules.pathHandling != undefined){
          cy.get("[data-testid='route-form-path-handling']").click();
          cy.get(`[data-testid='select-item-${rules.pathHandling}'] span`).click();
      }
      if(rules.httpsRedirectStatusCode != undefined){
          cy.get("[data-testid='route-form-http-redirect-status-code']").click();
          cy.get(`[data-testid='select-item-${rules.httpsRedirectStatusCode}'] span`).click();
      }
      if(rules.regexPriority != undefined){
        cy.get("[data-testid='route-form-regex-priority']").should('not.have.value', 'oldvalue').type(regexPriority);
      }
      if(rules.isPreserveHost != undefined){
          cy.setCheckboxState("[data-testid='route-form-preserve-host']",rules.isPreserveHost)
      }
      if(rules.requestBuffering != undefined){
        cy.setCheckboxState('[data-testid="route-form-response-buffering"]',rules.requestBuffering)
      }
      if(rules.responseBuffering != undefined){
        cy.setCheckboxState('[data-testid="route-form-response-buffering"]',rules.responseBuffering)
      }
      return this;
  }

      /**
       * New Gateway Service - Service - Route - Save
       */
      save(){
        cy.get("[data-testid='route-create-form-submit']").click();
      }

      /**
       * New Gateway Service - Service - Route - Cancel
       */
      cancel(){
        cy.get("[data-testid='route-create-form-cancel']").click();
      }
  }
  
  export default GatewayServiceDetailRoutePage;