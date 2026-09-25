/// <reference types="cypress" />
import loginPage from "../../pages/LoginPage";

// ============================================================
// TEST AUTOMATION - FITUR LOGIN ORANGEHRM (Page Object Model)
// 8 Test Case, menggunakan LoginPage.js untuk action & selector
// ============================================================

describe("Fitur Login - OrangeHRM Demo (POM)", () => {
  let data;

  before(() => {
    cy.fixture("loginData").then((fixtureData) => {
      data = fixtureData;
    });
  });

  beforeEach(() => {
    loginPage.visit();
  });

  it("TC-POM-01 - Login berhasil dengan username dan password valid", () => {
    loginPage.login(data.validUser.username, data.validUser.password);
    loginPage.verifyLoginSuccess();
  });

  it("TC-POM-02 - Login gagal dengan password salah", () => {
    loginPage.login(data.invalidPassword.username, data.invalidPassword.password);
    loginPage.verifyInvalidCredentials();
  });

  it("TC-POM-03 - Login gagal dengan username tidak terdaftar", () => {
    loginPage.login(data.invalidUsername.username, data.invalidUsername.password);
    loginPage.verifyInvalidCredentials();
  });

  it("TC-POM-04 - Login gagal ketika kolom username dikosongkan", () => {
    loginPage.login(null, data.validUser.password);
    loginPage.verifyRequiredMessage();
  });

  it("TC-POM-05 - Login gagal ketika kolom password dikosongkan", () => {
    loginPage.login(data.validUser.username, null);
    loginPage.verifyRequiredMessage();
  });

  it("TC-POM-06 - Login gagal ketika username dan password dikosongkan", () => {
    loginPage.submit();
    loginPage.verifyRequiredMessage();
  });

  it("TC-POM-07 - Verifikasi input password ter-masking", () => {
    loginPage.typePassword(data.validUser.password);
    loginPage.verifyPasswordMasked();
  });

  it("TC-POM-08 - Logo OrangeHRM tampil pada halaman login", () => {
    loginPage.verifyLogoVisible();
  });
});