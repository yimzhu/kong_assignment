function checkContainerStatus(retries = 12) {
    if (retries === 0) {
      throw new Error("PostgreSQL failed to launch!");
    }
  
    return cy.exec("docker ps --filter 'name=kong-ee-database' --format '{{.Status}}'").then((result) => {
      cy.log("PostgreSQL Status: " + result.stdout);
      if (!result.stdout.includes("Up")) {
        cy.wait(5000); 
        checkContainerStatus(retries - 1); 
      }
    });
  }