# Kong's Assignment 🚀

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/yimzhu/kong_assignment/cypress.yml?branch=main&label=CI&logo=github)

Demo automation test cases for Kong manager

---

## Table of Contents 📖

- [Project Structure](#project-structure)
- [Installation](#Installation)
- [Design Consideration](#Design-Consideration)
- [Trade-Offs](#Trade-Offs)
- [E2E Scenarios](#E2E-Scenarios)

---

## Project Structure ✨

---

## Installation 🛠️

### Prerequisites

- Node.js (>=22.11)
- Docker (>=28.0.1)
- Kong image (=3.9) : The application under test

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yimzhu/kong_assignment.git
   cd project-name
   ```

2. Execute all test cases && view the report:

   ```bash
   npm run cy:e2e:run
   ```

  Or execute all test cases only by headless mode

   ```bash
   npm run cy:run
   ```

  Or execute all test cases only by UI mode

   ```bash
   npm run cy:open
   ```

  Or clear test results

   ```bash
   npm run clear
   ```

  Or generate report

   ```bash
   npm run report
   ```

### **Design Considerations**

- Cypress natively supports both UI automation and API testing. Additionally, more packages can be easily imported to extend test coverage, such as database validation.
- The Page Object Model (POM) is used to enhance reusability and reduce test case coupling.
- Common functions are defined under Cypress commands to keep test cases concise.

### **Trade-Offs**
- A data-driven approach should be used for input values to cover more scenarios.
- The current test coverage for positive gateway service scenarios is insufficient; more granular coverage is needed for edge cases and negative scenarios.

### **E2E Scenarios**
Scenario 1:<br>
Steps:<br>
1. go to gateway services "http://localhost:8002/default/services"<br>
2. click "New Gateway Service"<br>
3. fill in "Name", "Tags", "Upstream URL"<br>
4. expand "View Advanced Fields", then fill in "Retries", "Connection Timeout"<br>
5. click 'Save'<br>
6. add a route under the gateway service by clicking 'add a route'<br>
7. fill in "Name", "Tags", and leave "Protocol" as default value "HTTP, HTTPS"<br>
8. fill in "Paths"<br>
9. click "Save"<br>

Scenario 2:<br>
Precondition:<br>
1. historical data exists under gateway services<br>
Steps:<br>
1. go to gateway services "http://localhost:8002/default/services"<br>
2. click "New Gateway Service"<br>
3. fill in "Name", "Tags", "Upstream URL"<br>
4. expand "View Advanced Fields", then fill in "Retries", "Connection Timeout"<br>
5. click 'Save'<br>
