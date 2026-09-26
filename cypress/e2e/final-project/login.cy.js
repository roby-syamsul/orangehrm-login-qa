/// <reference types="cypress" />
import loginPage from "../../pages/LoginPage";

// ============================================================
// FINAL PROJECT - MODUL LOGIN (POM + Action + Assertion + Data + Intercept)
// 8 Test Case
// ============================================================

describe("Modul Login - OrangeHRM (POM + Intercept)", () => {
  let data;

  before(() => {
    cy.fixture("loginData").then((fixtureData) => {
      data = fixtureData;
    });
  });

  beforeEach(() => {
    loginPage.interceptLoginPage();
    loginPage.interceptI18nMessages();
    loginPage.visit();
    cy.wait("@getLoginPage");
  });

  it("TC-LOGIN-01 - Login berhasil dengan username & password valid", () => {
    loginPage.interceptDashboardWidgets();
    loginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@dashboardShortcuts");
    loginPage.verifyLoginSuccess();
  });

  it("TC-LOGIN-02 - Login gagal dengan password salah", () => {
    loginPage.login(data.invalidPassword.username, data.invalidPassword.password);
    loginPage.verifyInvalidCredentials();
  });

  it("TC-LOGIN-03 - Login gagal dengan username tidak terdaftar", () => {
    loginPage.login(data.invalidUsername.username, data.invalidUsername.password);
    loginPage.verifyInvalidCredentials();
  });

  it("TC-LOGIN-04 - Login gagal ketika username dikosongkan", () => {
    loginPage.login(null, data.validUser.password);
    loginPage.verifyRequiredMessage();
  });

  it("TC-LOGIN-05 - Login gagal ketika password dikosongkan", () => {
    loginPage.login(data.validUser.username, null);
    loginPage.verifyRequiredMessage();
  });

  it("TC-LOGIN-06 - Login gagal ketika username & password dikosongkan", () => {
    loginPage.submit();
    loginPage.verifyRequiredMessage();
  });

  it("TC-LOGIN-07 - Verifikasi input password ter-masking", () => {
    loginPage.typePassword(data.validUser.password);
    loginPage.verifyPasswordMasked();
  });

  it("TC-LOGIN-08 - Verifikasi request i18n messages berhasil (status 200) saat halaman dimuat", () => {
    cy.wait("@i18nMessages").its("response.statusCode").should("be.oneOf", [200, 304]);
    loginPage.verifyLogoVisible();
  });
});