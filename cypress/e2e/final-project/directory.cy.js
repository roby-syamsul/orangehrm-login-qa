/// <reference types="cypress" />
import loginPage from "../../pages/LoginPage";
import directoryPage from "../../pages/DirectoryPage";

// ============================================================
// FINAL PROJECT - MODUL DIRECTORY (POM + Action + Assertion + Data + Intercept)
// 8 Test Case
// ============================================================

describe("Modul Directory - OrangeHRM (POM + Intercept)", () => {
  let loginData;
  let directoryData;

  before(() => {
    cy.fixture("loginData").then((d) => (loginData = d));
    cy.fixture("directoryData").then((d) => (directoryData = d));
  });

  beforeEach(() => {
    loginPage.visit();
    loginPage.login(loginData.validUser.username, loginData.validUser.password);
    loginPage.verifyLoginSuccess();
    directoryPage.interceptSearchEmployees(); // pasang sebelum visit, biar request awal tertangkap
    directoryPage.visit();
  });

  it("TC-DIR-01 - Menampilkan halaman Directory dengan hasil default", () => {
    directoryPage.verifyHasResults();
  });

  it("TC-DIR-02 - Mencari karyawan berdasarkan nama valid menampilkan hasil sesuai", () => {
    cy.wait("@searchEmployees").then((interception) => {
      const employee = interception.response.body.data[0];
      const searchName = employee.firstName;
      directoryPage.searchByEmployeeName(searchName);
      directoryPage.verifyResultsContain(searchName);
    });
  });

  it("TC-DIR-03 - Mencari karyawan dengan nama tidak terdaftar tidak muncul sebagai saran pencarian", () => {
    directoryPage.elements.employeeNameInput().type(directoryData.invalidEmployeeName);
    cy.wait(800);
    directoryPage.elements.autocompleteDropdown().should(
      "not.contain.text",
      directoryData.invalidEmployeeName
    );
  });

  it("TC-DIR-04 - Filter pencarian berdasarkan Job Title menampilkan hasil", () => {
    directoryPage.searchByJobTitle(directoryData.jobTitle);
    directoryPage.verifyHasResults();
  });

  it("TC-DIR-05 - Filter pencarian berdasarkan Location menampilkan hasil", () => {
    directoryPage.searchByLocation(directoryData.location);
    directoryPage.verifyHasResults();
  });

  it("TC-DIR-06 - Reset pencarian mengembalikan ke daftar lengkap", () => {
    cy.wait("@searchEmployees").then((interception) => {
      const employee = interception.response.body.data[0];
      const searchName = employee.firstName;
      directoryPage.searchByEmployeeName(searchName);
      directoryPage.reset();
      directoryPage.verifyHasResults();
    });
  });

  it("TC-DIR-07 - Dropdown Job Title menampilkan daftar pilihan setelah diklik", () => {
    directoryPage.elements.jobTitleDropdown().click();
    cy.get(".oxd-select-dropdown span").should("have.length.greaterThan", 0);
  });

  it("TC-DIR-08 - Setiap kartu hasil pencarian menampilkan teks yang tidak kosong", () => {
    directoryPage.elements.directoryCards().each(($el) => {
      cy.wrap($el).invoke("text").should("not.be.empty");
    });
  });
});