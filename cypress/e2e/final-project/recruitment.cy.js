/// <reference types="cypress" />
import loginPage from "../../pages/LoginPage";
import recruitmentPage from "../../pages/RecruitmentPage";

// ============================================================
// FINAL PROJECT - MODUL RECRUITMENT (POM + Action + Assertion + Data + Intercept)
// 8 Test Case
// ============================================================

describe("Modul Recruitment - OrangeHRM (POM + Intercept)", () => {
  let loginData;
  let recruitmentData;

  before(() => {
    cy.fixture("loginData").then((d) => (loginData = d));
    cy.fixture("recruitmentData").then((d) => (recruitmentData = d));
  });

  beforeEach(() => {
    loginPage.visit();
    loginPage.login(loginData.validUser.username, loginData.validUser.password);
    loginPage.verifyLoginSuccess();
    recruitmentPage.visit();
  });

  it("TC-REC-01 - Menampilkan halaman Recruitment dengan daftar kandidat", () => {
    recruitmentPage.interceptSearchCandidates();
    recruitmentPage.verifyHasResults();
  });

  it("TC-REC-02 - Mencari kandidat berdasarkan nama valid menampilkan hasil sesuai", () => {
    recruitmentPage.interceptSearchCandidates();
    recruitmentPage.searchByCandidateName(recruitmentData.validCandidateName);
    cy.wait("@searchCandidates").its("response.statusCode").should("eq", 200);
    recruitmentPage.verifyResultsContain(recruitmentData.validCandidateName);
  });

  it("TC-REC-03 - Mencari kandidat dengan nama tidak terdaftar menampilkan validasi 'Invalid'", () => {
    recruitmentPage.searchByCandidateNameNotFound(recruitmentData.invalidCandidateName);
    cy.contains("Invalid").should("be.visible");
  });

  it("TC-REC-04 - Filter pencarian berdasarkan Status menampilkan hasil", () => {
    recruitmentPage.interceptSearchCandidates();
    recruitmentPage.searchByStatus(recruitmentData.status);
    cy.wait("@searchCandidates").its("response.statusCode").should("eq", 200);
  });

  it("TC-REC-05 - Reset pencarian mengembalikan ke daftar lengkap", () => {
    recruitmentPage.interceptSearchCandidates();
    recruitmentPage.searchByCandidateName(recruitmentData.validCandidateName);
    cy.wait("@searchCandidates");
    recruitmentPage.reset();
    recruitmentPage.verifyHasResults();
  });

  it("TC-REC-06 - Klik tombol Add membuka form tambah kandidat", () => {
    recruitmentPage.clickAdd();
    recruitmentPage.elements.firstNameInput().should("be.visible");
  });

  it("TC-REC-07 - Menambahkan kandidat baru berhasil disimpan", () => {
    recruitmentPage.interceptAddCandidate();
    recruitmentPage.clickAdd();
    recruitmentPage.fillCandidateForm(recruitmentData.newCandidate);
    recruitmentPage.save();
    cy.wait("@addCandidate").its("response.statusCode").should("be.oneOf", [200, 201]);
    recruitmentPage.verifyToastSuccess();
  });

  it("TC-REC-08 - Dropdown Status menampilkan daftar pilihan setelah diklik", () => {
    recruitmentPage.elements.statusDropdown().click();
    cy.get(".oxd-select-dropdown span").should("have.length.greaterThan", 0);
  });
});