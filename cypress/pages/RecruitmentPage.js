// cypress/pages/RecruitmentPage.js
// Page Object untuk menu Recruitment OrangeHRM

class RecruitmentPage {
  elements = {
    candidateNameInput: () =>
      cy.get(".oxd-autocomplete-wrapper").first().find("input"),
    statusDropdown: () =>
      cy.contains(".oxd-input-group", "Status").find(".oxd-select-text"),
    dropdownOption: (text) => cy.get(".oxd-select-dropdown span").contains(text),
    searchButton: () => cy.get('button[type="submit"]'),
    resetButton: () => cy.contains("button", "Reset"),
    addButton: () => cy.contains("button", "Add"),
    tableRows: () => cy.get(".oxd-table-body .oxd-table-row"),
    firstNameInput: () => cy.get('input[name="firstName"]'),
    lastNameInput: () => cy.get('input[name="lastName"]'),
    emailInput: () =>
      cy.contains(".oxd-input-group", "Email").find("input"),
    saveButton: () => cy.get('button[type="submit"]'),
    toastMessage: () => cy.get(".oxd-toast-content"),
  };

  visit() {
    cy.visit("/web/index.php/recruitment/viewCandidates");
  }

  searchByCandidateName(name) {
    this.elements.candidateNameInput().type(name);
    cy.wait(600);
    this.elements.searchButton().click({ force: true });
  }

  searchByCandidateNameNotFound(name) {
    this.elements.candidateNameInput().type(name).blur();
    cy.wait(500);
  }

  searchByStatus(status) {
    this.elements.statusDropdown().click();
    this.elements.dropdownOption(status).click();
    this.elements.searchButton().click();
  }

  reset() {
    this.elements.resetButton().click();
  }

  clickAdd() {
    this.elements.addButton().click();
  }

  fillCandidateForm(candidate) {
    this.elements.firstNameInput().type(candidate.firstName);
    this.elements.lastNameInput().type(candidate.lastName);
    this.elements.emailInput().type(candidate.email);
  }

  save() {
    this.elements.saveButton().click();
  }

  // ---------- Assertions ----------
  verifyResultsContain(name) {
    this.elements.tableRows()
      .invoke("text")
      .then((text) => {
        const normalize = (str) => str.toLowerCase().replace(/\s+/g, " ");
        expect(normalize(text)).to.include(normalize(name));
      });
  }

  verifyHasResults() {
    this.elements.tableRows().should("have.length.greaterThan", 0);
  }

  verifyToastSuccess() {
    this.elements.toastMessage().should("be.visible");
  }

  // ---------- Intercept ----------
  interceptSearchCandidates() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as("searchCandidates");
  }

  interceptAddCandidate() {
    cy.intercept("POST", "**/api/v2/recruitment/candidates").as("addCandidate");
  }
}

export default new RecruitmentPage();