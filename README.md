# Kong's Assignment 🚀

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/yimzhu/kong_assignment/cypress.yml?branch=main&label=CI&logo=github)

Demo automation test cases for Kong manager

---

## Table of Contents 📖

- [Project Structure](#Project Structure)
- [Installation](#Installation)
- [Design Consideration](#Design Consideration)
- [Trade-Offs](#Trade-Offs)

---

## Project Structure ✨

├── cypress <br>
│   ├── downloads<br>
│   ├── e2e          # end to end test scenarios<br>
│   │   ├── createGatewayServiceWData.cy.js<br>
│   │   └── createGatewayServiceWoData.cy.js<br>
│   ├── fixtures<br>
│   │   └── example.json<br>
│   ├── integration<br>
│   │   ├── api<br>
│   │   └── utils	#utils for drivers or test lib<br>
│   ├── reports<br>
│   │   ├── allure-reports<br>
│   │   └── allure-results<br>
│   ├── screenshots<br>
│   ├── selectors<br>
│   │   └── dropdowns.json<br>
│   ├── support<br>
│   │   ├── commands.js<br>
│   │   ├── e2e.js<br>
│   │   └── pages	#page objects<br>
│   │         └── gatewayServicesDetailPage.js<br>
│   │         └── gatewayServicesDetailRoutePage.js<br>
│   │         └── gatewayServicesPage.js<br>
│   └── videos<br>
├── cypress.config.js<br>
├── docker-compose.yml<br>
├── package-lock.json<br>
└── package.json<br>

---

## Installation 🛠️

### Prerequisites

- Node.js (>=22.11)
- Docker (>=28.0.1)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/project-name.git
   cd project-name
   ```

2. Execute all test cases && view the report:

```bash
npm run cy:e2e:run
```

3. Execute all test cases only by headless mode

```bash
npm run cy:run
```

4. Execute all test cases only by UI mode

```bash
npm run cy:open
```

5. Clear test results

```bash
npm run clear
```

6. Generate report

```bash
npm run report
```

### **Design Considerations**

- Cypress natively supports both UI automation and API testing. Additionally, more packages can be easily imported to extend test coverage, such as database validation.
- The Page Object Model (POM) is used to enhance reusability and reduce test case coupling.
- Common functions are defined under Cypress commands to keep test cases concise.

### **Trade-Offs**

- The reporting feature is relatively simple. Allure provides more powerful reporting and easier configuration in TypeScript, but it is more complex in JavaScript. Therefore, Mochawesome was chosen as a compromise.
- Some page operation methods can be further abstracted. For example, when adding a route based on a specific gateway, the gateway can be passed as a parameter, and scenarios can be distinguished using different methods. This requires further refinement of user behavior.
- UI elements should be extracted into a JSON file for centralized maintenance.
- A data-driven approach should be used for input values to cover more scenarios.
- The current test coverage for positive gateway service scenarios is insufficient; more granular coverage is needed for edge cases and negative scenarios.
- Parallel execution is not enabled by default, prioritizing stability over speed.
- baseURL is supposed to be defined as varaibles in (process.env), so that it can adapt to different environment
- Some operation like click() has implicit assertions, and we can do far more than that, comparing screenshots or API data in Cypress can improve test accuracy and catch more UI or data discrepancies. But it needs more time. 

### ***E2E Scenarios
Scenario 1:
Steps:
1. go to gateway services "http://localhost:8002/default/services"
2. click "New Gateway Service"
3. fill in "Name", "Tags", "Upstream URL"
4. expand "View Advanced Fields", then fill in "Retries", "Connection Timeout"
5. click 'Save'
6. add a route under the gateway service by clicking 'add a route'
7. fill in "Name", "Tags", and leave "Protocol" as default value "HTTP, HTTPS"
8. fill in "Paths"
9. click "Save"

Scenario 2:
Precondition:
1. historical data exists under gateway services
Steps:
1. go to gateway services "http://localhost:8002/default/services"
2. click "New Gateway Service"
3. fill in "Name", "Tags", "Upstream URL"
4. expand "View Advanced Fields", then fill in "Retries", "Connection Timeout"
5. click 'Save'
