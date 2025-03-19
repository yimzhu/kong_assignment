import dropdownSelectors from '../../selectors/dropdowns.json';

class GatewayServicePage {
    constructor() {
        // this.viewAdvancedFields = { /* 默认值 */ };
        // // 标记必填项是否已填写的状态
        // this.requiredFieldsFilled = false; 
    }
    /**
     * Navigate to gateway service page
     * @returns 
     */
    visit() {
        cy.visit("http://localhost:8002/default/services");
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
      if(dataExists==true){
        cy.log('click add gateway service button')
        cy.get("[data-testid='toolbar-add-gateway-service']").should('exist').click();
      }else if(dataExists==false){
        cy.log('click add gateway service button')
        cy.get("[data-testid='empty-state-action']").should('exist').click();
      }else{
        throw new Error('dataExists parameter is missing')
      }
        cy.log('input gateway service name')
        cy.get("[data-testid='gateway-service-name-input']").clear().should('not.have.value', 'oldvalue').type(name);
        cy.log('input gateway service name')
        cy.get("[data-testid='gateway-service-tags-input']").clear().should('not.have.value', 'oldvalue').type(tags);
        cy.log('click gateway service url radio button')
        cy.get("[data-testid='gateway-service-url-radio']").should('be.visible').click();
        cy.log('input gateway service url')
        cy.get("[data-testid='gateway-service-url-input']").clear().should('not.have.value', 'oldvalue').type(url, { delay: 100 });
        return this;
    }
    
    /**
     * New Gateway Service - Full URL fields
     * @param {*} protocol 
     * @param {*} host 
     * @param {*} path 
     * @param {*} port 
     * @returns 
     */
    createNewGatewayByProtocol(protocol, host, path, port){
        cy.get("[data-testid='toolbar-add-gateway-service']").should('be.visible').click();
        cy.get("[data-testid='gateway-service-protocol-radio']").should('be.visible').click();

        //select a protocol
        // cy.get(dropdownSelectors.protocolDropdown.container).click();
        cy.get("[data-testid='gateway-service-protocol-select']").should("be.visible").click();
        cy.get(`[data-testid='select-item-${protocol}'] span`).should("be.visible").click();
        cy.get("[data-testid='gateway-service-host-input']").should('not.have.value', 'oldvalue').type(host);
        cy.get("[data-testid='gateway-service-path-input']").should('not.have.value', 'oldvalue').type(path);
        cy.get("[data-testid='gateway-service-port-input']").should('not.have.value', 'oldvalue').type(port);
        return this;
    }

    /**
    * New Gateway Service - View Advanced Fields
    * @param {{
    *  retries?: number,
    *  timeout?: number,
    *  writeTimeout?: number,
    *  readTimeout?: number,
    *  clientCertId?: number,
    *  certArray?: number[],
    *  TLS?: boolean
    * }} options 
    */
    withViewAdvancedFields(options = {}) {
      const {  
        certArray = [],    
        clientCertId,      
        retries = 5,        
        timeout = 60000,
        writeTimeout = 60000,
        readTimeout = 60000,
        TLS
      } = options
        // Expand Advanced Area
        cy.get("[data-testid='collapse-trigger-label']").click();
    
        // Only for the value exists
        if (options.retries !== undefined) {
          cy.get("[data-testid='gateway-service-retries-input']")
            .should("be.visible")
            .clear()
            .type(options.retries);
        }
        if (options.timeout !== undefined) {
          cy.get("[data-testid='gateway-service-connTimeout-input']")
            .should("be.visible")
            .clear()
            .type(options.timeout);
        }
        if (options.writeTimeout !== undefined) {
            cy.get("[data-testid='gateway-service-writeTimeout-input']")
              .clear()
              .type(options.writeTimeout);
        }
        if (options.readTimeout !== undefined) {
            cy.get("[data-testid='gateway-service-readTimeout-input']")
              .clear()
              .type(options.readTimeout);
        }
        if (options.clientCertId !== undefined) {
            cy.get("[data-testid='gateway-service-clientCert-input']")
              .clear()
              .type(options.clientCertId);
        }
        if (options.certArray?.length !== undefined) {

          // console.log(options.certArray)
            let caCertIds = options.certArray.join(',')
            
            // for (let caCertId of options.certArray){
            //     caCertIds += caCertId
            // }
            cy.get("[data-testid='gateway-service-ca-certs-input']")
              .should("be.visible")
              .clear()
              .type(caCertIds);
          }
        
        if (options.TLS !== undefined) {
            const selector = options.TLS 
                ? "[data-testid='gateway-service-tls-verify-true-option']" 
                : "[data-testid='gateway-service-tls-verify-false-option']";
            cy.get(selector).click();
        }
        return this;
      }

      /**
       * New Gateway Service - Save
       */
      save(){
        cy.get("[data-testid='service-create-form-submit']").should('be.visible').click();
      }

      /**
       * New Gateway Service - Cancel
       */
      cancel(){
        cy.get("[data-testid='service-create-form-cancel']").should('be.visible').click();
      }
  }
  
  export default GatewayServicePage;