import gatewaySelectors from '../../selectors/gateway-service-page-selectors.json';
import 'cypress-dotenv';

class GatewayServicePage {
    /**
     * Navigate to gateway service page
     * @returns 
     */
    visit() {
      cy.log("Navigate to: "+Cypress.env('DEV_URL')+"/default/services");
      cy.visit(Cypress.env('DEV_URL')+"/default/services", {
        onBeforeLoad: (win) => {
          // Disable animations
          win.sessionStorage.setItem('cypress-animation-disabled', 'true');
        }
      });
      
      // Wait efficiently
      cy.get('body').should('be.visible');
      
      // Hide elements more efficiently
      return this;
    }

    /**
    * New Gateway Service - Full URL fields
    * @param {string} name 
    * @param {string} tags
    * @param {string} url 
    * @param {boolean} dataExists if gateway service data exists
    */
    createNewGatewayByFullUrl(name, tags, url, dataExists) {
      if (typeof dataExists !== 'boolean') {
        throw new Error('dataExists parameter is missing or not a boolean')
      }

      // Add gateway btn is different if data exists
      cy.log('Click add gateway service button');
      const addButtonSelector = dataExists 
        ? gatewaySelectors.addGatewayBtn 
        : gatewaySelectors.addGatewayBtnAtEmptyAction;

      cy.get(addButtonSelector).should('exist').click();
    
      // choose url method
      cy.get("[data-testid='gateway-service-url-radio']").click();
    
      // input
      const inputFields = [
        { selector: gatewaySelectors.gatewayName, value: name, log: 'name' },
        { selector: gatewaySelectors.gatewayTags, value: tags, log: 'tags' },
        { selector: gatewaySelectors.gatewayUrlInput, value: url, log: 'URL', options: { delay: 100 } }
      ];
    
      inputFields.forEach(({ selector, value, log, options }) => {
        cy.log(`Input gateway service ${log}`);
        cy.get(selector).clear().type(value, options);
      });
    
      return this;
    }
    
    /**
     * New Gateway Service - Protocol fields
     * @param {*} protocol 
     * @param {*} host 
     * @param {*} path 
     * @param {*} port 
     * @returns 
     */
    createNewGatewayByProtocol(name, tags, protocol, host, dataExists, options={}){
      if (typeof dataExists !== 'boolean') {
        throw new Error('dataExists parameter is missing or not a boolean')
      }
      
      // choose which Add Gateway Service Button to use
      cy.log('Click add gateway service button');
      const addButtonSelector = dataExists 
        ? gatewaySelectors.addGatewayBtn 
        : gatewaySelectors.addGatewayBtnAtEmptyAction;

      cy.get(addButtonSelector).should('exist').click();

      // common input fields
      const inputFields = [
        { selector: gatewaySelectors.gatewayName, value: name, log: 'name' },
        { selector: gatewaySelectors.gatewayTags, value: tags, log: 'tags' },
      ];
      
      inputFields.forEach(({ selector, value, log, options }) => {
        cy.log(`Input gateway service ${log}`);
        cy.get(selector).clear().type(value, options);
      });

      // protocol selection
      cy.get(gatewaySelectors.protocolRadioBtn).click();
      cy.get(gatewaySelectors.protocolDropdown.select).should("be.visible").click();

      const SUPPORTED_PROTOCOLS = ['grpc', 'grpcs', 'http', 'https', 'tcp', 'tls', 'tls_passthrough', 'udp', 'ws', 'wss'];
      const normalizedProtocol = protocol?.toLowerCase();
      if (!SUPPORTED_PROTOCOLS.includes(normalizedProtocol)) {
        throw new Error(`Unsupported protocol: ${protocol}. Valid values: ${SUPPORTED_PROTOCOLS.join(', ')}`);
      }
      cy.get(gatewaySelectors.protocolDropdown.options[normalizedProtocol]).click();
    
      // handle optioanl fields
      const handleOptionalField = (field, selector) => {
        if (options?.[field] != null) {
          cy.get(selector)
            .should('not.have.value', 'oldvalue')
            .type(options[field]);
        }
      };
    
      // port logic
      if (['http', 'https', 'grpc', 'grpcs', 'tcp', 'udp', 'tls'].includes(normalizedProtocol)) {
        handleOptionalField('port', gatewaySelectors.protocolPort);
      }
    
      // path logic
      if (['http', 'https', 'ws', 'wss'].includes(normalizedProtocol)) {
        handleOptionalField('path', gatewaySelectors.protocolPath);
      }

      // host（mandatory field）
      cy.get(gatewaySelectors.protocolHost)
      .should('not.have.value', 'oldvalue')
      .type(host);

      return this;
    }

    /**
    * New Gateway Service - View Advanced Fields
    * @param {{
    *  retries?: number,
    *  connTimeout?: number,
    *  writeTimeout?: number,
    *  readTimeout?: number,
    *  clientCertId?: number,
    *  certArray?: number[],
    *  TLS?: boolean
    * }} options 
    */
    withViewAdvancedFields(options = {}) {
      // Expand advanced fields
      cy.get("[data-testid='collapse-trigger-label']").click();
    
      // Dynamically handle each optional field（only operate when passed）
      const optionalFields = [
        { key: 'retries', selector: gatewaySelectors.retries, visible: true },
        { key: 'connTimeout', selector: gatewaySelectors.connTimeout, visible: true },
        { key: 'writeTimeout', selector: gatewaySelectors.writeTimeout, visible: true },
        { key: 'readTimeout', selector: gatewaySelectors.readTimeout, visible: true  },
        { key: 'clientCertId', selector: gatewaySelectors.clientCertId, visible: true  }
      ];
    
      optionalFields.forEach(({ key, selector, visible }) => {
        if (options[key] !== undefined) {
          const chain = cy.get(selector);
          if (visible) chain.should("be.visible");
          chain.clear().type(options[key]);
        }
      });
    
      // Handle certArray（explicitly pass in an array and the length > 0）
      if (Array.isArray(options.certArray) && options.certArray.length > 0) {
        cy.get(gatewaySelectors.certArray)
          .should("be.visible")
          .clear()
          .type(options.certArray.join(','));
      }
    
      // Handle TLS
      if (typeof options.TLS === 'boolean') {
        const selector = options.TLS
          ? gatewaySelectors.tlsTrue
          : gatewaySelectors.tlsFalse;
        cy.get(selector).click();
      }
    
      return this;
    }
    
    /**
       * enter specific gateway
       * @param {*} name 
       */
    setFilter(options = {}) {
      if (typeof options !== "object" || options === null) {
        throw new Error("Params must be object!");
      }
      if (Object.entries(options).length === 0) {
        throw new Error("Options should NOT be empty");
      }
    
      cy.get(gatewaySelectors.filterBtn).click();
    
      const optionMap = {
        name: () => {
          cy.get(gatewaySelectors.expandName).click();
          cy.get(gatewaySelectors.filterName).type(options.name);
          cy.get(gatewaySelectors.applyName).click();
        },
        enabled: () => {
          cy.get(gatewaySelectors.expandEnabled).click();
          cy.get(gatewaySelectors.filterEnabled).click();
          cy.get(gatewaySelectors.filterEnabled.options[options.enabled ? 'true' : 'false']).click();
          cy.get(gatewaySelectors.applyEnabled).click();
        },
        protocol: () => { /* TODO */ },
        host: () => { /* TODO */ },
        port: () => { /* TODO */ },
        path: () => { /* TODO */ }
      };
    
      // Iterate `options` and call the specific operations
      Object.keys(options).forEach(key => {
        if (optionMap[key]) optionMap[key]();
      });
      return this;
    }

    /**
     * Click on an item
     * @param {string} name 
     */
    clickItem(name){
      //TODO: if there is two more items here
      cy.get(`${gatewaySelectors.clickOneItem}${name}']`).click(); 
      return this;
    }
    
    /**
       * Clear specific options
       * @param {*} options 
       */
    clearFilter(options = {}) {
      // Do validation on parameters
      const validateOptions = (options) => {
        if (typeof options !== "object" || options === null) {
          throw new Error("Params must be an object!");
        }
        if (Object.keys(options).length === 0) {
          throw new Error("Options cannot be empty!");
        }
      };
    
      // Gather all elements according to the UI
      const FIELD_ACTIONS = {
        name: {
          expand: gatewaySelectors.expandName,
          clear: gatewaySelectors.clearName,
        },
        enabled: {
          expand: gatewaySelectors.expandEnabled,
          clear: gatewaySelectors.clearEnabled,
        },
        // TODO: all other options（like protocol/host/port etc）
      };
    
      // Validate parameters
      validateOptions(options); 
      // Open filter panel
      cy.get(gatewaySelectors.filterBtn).click(); 
    
      // Do clear according to options
      Object.entries(options).forEach(([field, value]) => {
        if (value != null && FIELD_ACTIONS[field]) {
          const { expand, clear } = FIELD_ACTIONS[field];
          cy.get(expand).click();
          cy.get(clear).click();
        }
      });
    }

    /**
     * New Gateway Service -> Click Filter -> Clear all filters
     */
    clearAllFilters(){
      cy.get(gatewaySelectors.filterBtn).click()
      cy.get(gatewaySelectors.clearAllFilters).click();
    }

    /**
     * New Gateway Service -> Save
     */
    save(){
      cy.get(gatewaySelectors.save).click();
    }

    /**
     * New Gateway Service -> Cancel
     */
    cancel(){
      cy.get(gatewaySelectors.cancel).click();
    }

    // Add efficient cleanup method
    cleanupMainPage() {
      cy.window().should('have.property', 'document');
      cy.wait(1000);
      cy.get(gatewaySelectors.headerSpan).invoke('remove');
      cy.get("[data-testid='dropdown-trigger']").ç;

      // cy.get(gatewaySelectors.footer).invoke('remove');
      cy.get(gatewaySelectors.navbar).invoke('remove');
      cy.get(gatewaySelectors.popover).invoke('remove');

      return this;
    }

    cleanupDetailPage(){
      cy.window().should('have.property', 'document');
      cy.wait(1000);
      cy.get(gatewaySelectors.lastUpdated).invoke('remove');
      cy.get(gatewaySelectors.copyText).invoke('remove');
    }
  }
  
  export default GatewayServicePage;