// cypress/pages/DirectoryPage.js
// Page Object untuk menu Directory OrangeHRM

class DirectoryPage {
  elements = {
    employeeNameInput: () =>
      cy.get(".oxd-autocomplete-wrapper").first().find("input"),
    autocompleteDropdown: () => cy.get(".oxd-autocomplete-dropdown"),
    jobTitleDropdown: () =>
      cy.contains(".oxd-input-group", "Job Title").find(".oxd-select-text"),
    locationDropdown: () =>
      cy.contains(".oxd-input-group", "Location").find(".oxd-select-text"),
    dropdownOption: (text) => cy.get(".oxd-select-dropdown span").contains(text),
    searchButton: () => cy.get('button[type="submit"]'),
    resetButton: () => cy.contains("button", "Reset"),
    directoryCards: () => cy.get(".orangehrm-directory-card"),
    noRecordsText: () => cy.contains("No Records Found"),
  };

  visit() {
    cy.visit("/web/index.php/directory/viewDirectory");
  }

  // Untuk nama yang PASTI ada di sistem (akan muncul di dropdown saran)
  searchByEmployeeName(name) {
    cy.intercept("GET", "**/api/v2/directory/employees?nameOrId=**").as("autocompleteSearch");
    this.elements.employeeNameInput().type(name);
    cy.wait("@autocompleteSearch", { timeout: 20000 });
    this.elements.autocompleteDropdown().contains(name, { matchCase: false }).click({ force: true });
    this.elements.searchButton().click();
  }

  // Untuk nama yang TIDAK ada (tidak akan muncul saran, langsung klik Search)
  searchByEmployeeNameNotFound(name) {
    this.elements.employeeNameInput().type(name);
    cy.wait(600);
    this.elements.searchButton().click({ force: true });
  }

  searchByJobTitle(jobTitle) {
    this.elements.jobTitleDropdown().click();
    this.elements.dropdownOption(jobTitle).click();
    this.elements.searchButton().click();
  }

  searchByLocation(location) {
    this.elements.locationDropdown().click();
    this.elements.dropdownOption(location).click();
    this.elements.searchButton().click();
  }

  reset() {
    this.elements.resetButton().click();
  }

  // ---------- Assertions ----------
  verifyResultsContain(name) {
    this.elements.directoryCards()
      .invoke("text")
      .then((text) => {
        expect(text.toLowerCase()).to.include(name.toLowerCase());
      });
  }

  verifyHasResults() {
    this.elements.directoryCards().should("have.length.greaterThan", 0);
  }

  verifyNoRecordsFound() {
    this.elements.directoryCards().should("have.length", 0);
  }

  // ---------- Intercept ----------
  interceptSearchEmployees() {
    cy.intercept("GET", "**/api/v2/directory/employees**").as("searchEmployees");
  }

  interceptJobTitles() {
    cy.intercept("GET", "**/api/v2/admin/job-titles**").as("getJobTitles");
  }

  interceptLocations() {
    cy.intercept("GET", "**/api/v2/admin/locations**").as("getLocations");
  }
}

export default new DirectoryPage();