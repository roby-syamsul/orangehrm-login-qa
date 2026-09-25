/// <reference types="cypress" />

// ============================================================
// TEST AUTOMATION - FITUR LOGIN ORANGEHRM (dengan cy.intercept)
// 8 Test Case, masing-masing intercept URL/validasi berbeda
// ============================================================

describe("Fitur Login - OrangeHRM Demo (dengan cy.intercept)", () => {
  let data;

  before(() => {
    cy.fixture("loginData").then((fixtureData) => {
      data = fixtureData;
    });
  });

  beforeEach(() => {
    cy.visit("/web/index.php/auth/login");
  });

  // TC-INT-01
  it("TC-INT-01 - Intercept GET halaman login saat pertama kali dimuat", () => {
    cy.intercept("GET", "**/auth/login").as("getLoginPage");
    cy.visit("/web/index.php/auth/login");
    cy.wait("@getLoginPage").its("response.statusCode").should("eq", 200);
  });

  // TC-INT-02
  it("TC-INT-02 - Intercept GET data i18n messages saat halaman login dimuat", () => {
    cy.intercept("GET", "**/core/i18n/messages*").as("i18nMessages");
    cy.visit("/web/index.php/auth/login");
    cy.wait("@i18nMessages").its("response.statusCode").should("eq", 200);
  });

    // TC-INT-03
  it("TC-INT-03 - Intercept GET i18n messages saat login dengan password salah", () => {
    cy.intercept("GET", "**/core/i18n/messages*").as("i18nOnFail");
    cy.fillLoginForm(data.invalidPassword.username, data.invalidPassword.password);
    cy.submitLogin();
    cy.wait("@i18nOnFail").its("response.statusCode").should("be.oneOf", [200, 304]);
    cy.get(".oxd-alert-content-text").should("contain.text", "Invalid credentials");
  });

  // TC-INT-04
  it("TC-INT-04 - Intercept GET buzz feed pada Dashboard setelah login berhasil", () => {
    cy.intercept("GET", "**/api/v2/buzz/feed**").as("buzzFeed");
    cy.fillLoginForm(data.validUser.username, data.validUser.password);
    cy.submitLogin();
    cy.wait("@buzzFeed").its("response.statusCode").should("eq", 200);
  });

  // TC-INT-05
  it("TC-INT-05 - Intercept POST events/push setelah login berhasil", () => {
    cy.intercept("POST", "**/events/push").as("eventsPush");
    cy.fillLoginForm(data.validUser.username, data.validUser.password);
    cy.submitLogin();
    cy.wait("@eventsPush");
  });

  // TC-INT-06
  it("TC-INT-06 - Intercept GET dashboard shortcuts setelah login berhasil", () => {
    cy.intercept("GET", "**/api/v2/dashboard/shortcuts").as("shortcuts");
    cy.fillLoginForm(data.validUser.username, data.validUser.password);
    cy.submitLogin();
    cy.wait("@shortcuts").its("response.statusCode").should("eq", 200);
  });

  // TC-INT-07
  it("TC-INT-07 - Intercept GET employees time-at-work setelah login berhasil", () => {
    cy.intercept("GET", "**/api/v2/dashboard/employees/time-at-work**").as("timeAtWork");
    cy.fillLoginForm(data.validUser.username, data.validUser.password);
    cy.submitLogin();
    cy.wait("@timeAtWork").its("response.statusCode").should("eq", 200);
  });

    // TC-INT-08
  it("TC-INT-08 - Mock response i18n messages menjadi error 500, halaman tetap tampil", () => {
    cy.on("uncaught:exception", () => false); // abaikan error aplikasi akibat mock 500
    cy.intercept("GET", "**/core/i18n/messages*", {
      statusCode: 500,
      body: {},
    }).as("i18nMocked");
    cy.visit("/web/index.php/auth/login");
    cy.wait("@i18nMocked");
    cy.get('input[name="username"]').should("be.visible");
  });
});