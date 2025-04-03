import routeSelectors from '../../selectors/route-page-selectors.json';

class RoutesPage {
    constructor() {
    }
    /**
     * Navigate to gateway service page
     * @returns 
     */
    visit(uuid) {
      cy.visit(Cypress.env('DEV_URL')+`/default/services/${uuid}/routes`);
      return this;
    }

    clickNewRouteBtn(){
      cy.get(routeSelectors.addRoute).click();
      return this;
    }

    /**
     * 
     * @param {*} uuid 
     * @returns 
     */
    vistCreateRoutePageByGateway(uuid) {
        cy.visit(Cypress.env('DEV_URL')+`/default/routes/create?serviceId=${uuid}&redirect=/default/services/${uuid}/routes`);
        return this;
    }

   /**
    * Fill in the route creation form
    * @param {string} name - Route name
    * @param {string} tags - Route tags
    * @param {string} protocol - Route protocol
    * @param {Object} options - Route options including paths, hosts, methods, etc.
    */
    fillCreateRoutePage(name, tags, protocol, options={}){
      cy.log('Creating new route:', { name, tags, protocol, options });

      cy.get(routeSelectors.routeName).should('not.have.value', 'oldvalue').type(name);
      cy.get(routeSelectors.routeTags).should('not.have.value', 'oldvalue').type(tags);
      cy.get(routeSelectors.protocolDropdown.select).should("be.visible").click();
      cy.get(routeSelectors.protocolDropdown.options[protocol.toLowerCase()]).click();


      const FIELDS_VALIDATION = {
        "grpc": ["hosts", "paths", "headers", "sni"],
        "grpcs": ["hosts", "paths", "headers", "sni"],
        "grpcgrpcs": ["hosts", "paths", "headers", "sni"],
        "http": ["hosts", "methods", "paths", "headers", "sni"]
        //TODO: finish the rest of items
      }

      // 1. Validate the protocol type
      if (!(protocol.toLowerCase() in FIELDS_VALIDATION)) {
        throw new Error(`Invalid protocol: ${protocol}`);
      }
      
      // Step 2: Retrieve the allowed fields
      const allowedKeys = FIELDS_VALIDATION[protocol];
      if (!Array.isArray(allowedKeys)) {
        throw new Error(`protocol ${protocol} must be an array`);
      }
      // Step 3: Check if all keys in options are legal
      const optionKeys = Object.keys(options);
      const illegalKeys = optionKeys.filter(key => !allowedKeys.includes(key));

      if (illegalKeys.length > 0) {
        throw new Error(
          `Iilegal field: [${illegalKeys.join(", ")}] legal:${allowedKeys.join(", ")}`
        );
      }

      // Step 4: Iterate through the legal fields
      for (const [key, value] of Object.entries(options)) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            cy.log(`Routing Rules is:${key}, No.[${index}] item is ${item}`);
            if(key === "hosts"){
              //Check host tab is enabled
              cy.log("check if host tab is enabled")
              cy.get(routeSelectors.host).then(($label) => {
                const isSelected = $label.hasClass('is-selected');
                if (!isSelected) {
                  cy.log("enabling host tab")
                  cy.get(routeSelectors.host).click();
                }
              });
              if(index === 0){
                cy.get(`[data-testid='route-form-hosts-input-${index + 1}']`).clear().should('not.have.value', 'oldvalue').type(item);
              }else if(index === 1){
                cy.get(routeSelectors.addRouteFirst).click();
                cy.get(`${routeSelectors.hostsPrefix}${index+1}']`).clear().should('not.have.value', 'oldvalue').type(item);

              }else if(index === 2){
                cy.get(routeSelectors.addRouteSecond).click();
                cy.get(`${routeSelectors.hostsPrefix}${index+1}']`).clear().should('not.have.value', 'oldvalue').type(item);
              }else{
                cy.get(`${routeSelectors.addHostThirdHalfOne}${index+1}${routeSelectors.addHostThirdHalfTwo}`).click();
                cy.get(`${routeSelectors.hostsPrefix}${index+1}']`).clear().should('not.have.value', 'oldvalue').type(item);
              }
            }else if(key === "paths"){ 
              //Check host tab is enabled
              cy.log("check if path tab is enabled")
              cy.get('[data-testid="routing-rule-paths"]').then(($label) => {
                const isSelected = $label.hasClass('is-selected');
                if (!isSelected) {
                  cy.get(routeSelectors.path).click();
                }
              });
              if(index === 0){
                cy.get(`[data-testid='route-form-paths-input-${index + 1}']`).clear().should('not.have.value', 'oldvalue').type(item);              }else if(index === 1){
                cy.get(routeSelectors.addPathFirst).click();
                cy.get(`${routeSelectors.pathsPrefix}${index+1}']`).clear().should('not.have.value', 'oldvalue').type(item);

              }else if(index === 2){
                cy.get(routeSelectors.addPathSecond).click();
                cy.get(`${routeSelectors.pathsPrefix}${index+1}']`).clear().should('not.have.value', 'oldvalue').type(item);
              }else{
                cy.get(`${routeSelectors.addPathThirdHalfOne}${index+1}${routeSelectors.addPathThirdHalfTwo}`).click();
                cy.get(`${routeSelectors.pathsPrefix}${index+1}']`).clear().should('not.have.value', 'oldvalue').type(item);
              }
            }else if(key === "methods"){
              //TODO
            }else if(key === "headers"){

            }else if(key === "sni"){

            }else{
              throw new Error(`Invaild method: ${key}`)
            }
          });
        }
      }
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
      if (!['HTTP', 'HTTPS', 'HTTPHTTPS'].includes(protocols)) {
        if(isStripPath !== true){
          cy.get(gatewaySelectors.path).then(($checkbox) => {
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
        cy.get(gatewaySelectors.pathHandling.select).click()
        switch (rules.pathHandling?.toString().toLowerCase()) {
          case "v0":
            cy.get(gatewaySelectors.pathHandling.options.v0).click()
            break;
          case "v1":
            cy.get(gatewaySelectors.pathHandling.options.v1).click()
            break;
          default:
            throw new Error(`Unsupported value: ${rules.pathHandling}`); 
          }
      }
      if(rules.httpsRedirectStatusCode != undefined){
        cy.get(gatewaySelectors.httpsRedirectStatusCode.select).click()
        switch (rules.httpsRedirectStatusCode?.toString().toLowerCase()) {
          case "426":
            cy.get(gatewaySelectors.httpsRedirectStatusCode.options["426"]).click()
            break;
          case "308":
            cy.get(gatewaySelectors.httpsRedirectStatusCode.options["308"]).click()
            break;
          case "307":
            cy.get(gatewaySelectors.httpsRedirectStatusCode.options["307"]).click()
            break;
          case "302":
            cy.get(gatewaySelectors.httpsRedirectStatusCode.options["302"]).click()
            break;
          case "301":
            cy.get(gatewaySelectors.httpsRedirectStatusCode.options["301"]).click()
            break;
          default:
            throw new Error(`Unsupported value: ${rules.httpsRedirectStatusCode}`); 
        }
      }
      if(rules.regexPriority != undefined){
        cy.get(gatewaySelectors.regexPriority).should('not.have.value', 'oldvalue').type(rules.regexPriority);
      }
      if(rules.isPreserveHost != undefined){
        cy.setCheckboxState(gatewaySelectors.isPreserveHost,rules.isPreserveHost)
      }
      if(rules.requestBuffering != undefined){
        cy.setCheckboxState(gatewaySelectors.requestBuffering,rules.requestBuffering)
      }
      if(rules.responseBuffering != undefined){
        cy.setCheckboxState(gatewaySelectors.responseBuffering,rules.responseBuffering)
      }
      return this;
    } 
    /**
     * New Gateway Service - Service - Route - Save
     */
    save(){
      cy.get(routeSelectors.save).click();
    }

    /**
     * New Gateway Service - Service - Route - Cancel
     */
    cancel(){
      cy.get(routeSelectors.cancel).click();
    }
  }
  
  export default RoutesPage;