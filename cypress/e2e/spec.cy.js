/// <reference types="cypress" />

// ============================================================
// TEST AUTOMATION - FITUR LOGIN ORANGEHRM DEMO
// URL     : https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
// Tool    : Cypress
// Jumlah  : 12 Test Case
// ============================================================

describe("Fitur Login - OrangeHRM Demo", () => {
  let data;

  before(() => {
    cy.fixture("loginData").then((fixtureData) => {
      data = fixtureData;
    });
  });

  beforeEach(() => {
    cy.visit("/web/index.php/auth/login");
  });

  // TC01
  it("TC01 - Berhasil login dengan username dan password yang valid", () => {
    cy.fillLoginForm(data.validUser.username, data.validUser.password);
    cy.submitLogin();
    cy.url().should("include", "/dashboard/index");
    cy.get(".oxd-topbar-header-breadcrumb").should("contain.text", "Dashboard");
  });

  // TC02
  it("TC02 - Gagal login dengan username tidak valid dan password valid", () => {
    cy.fillLoginForm(data.invalidUsername.username, data.invalidUsername.password);
    cy.submitLogin();
    cy.get(".oxd-alert-content-text").should(
      "contain.text",
      "Invalid credentials"
    );
    cy.url().should("include", "/auth/login");
  });

  // TC03
  it("TC03 - Gagal login dengan username valid dan password tidak valid", () => {
    cy.fillLoginForm(data.invalidPassword.username, data.invalidPassword.password);
    cy.submitLogin();
    cy.get(".oxd-alert-content-text").should(
      "contain.text",
      "Invalid credentials"
    );
    cy.url().should("include", "/auth/login");
  });

  // TC04
  it("TC04 - Gagal login ketika username dan password dikosongkan", () => {
    cy.submitLogin();
    cy.get(".oxd-input-group__message")
      .should("have.length.at.least", 2)
      .each(($el) => {
        cy.wrap($el).should("contain.text", "Required");
      });
    cy.url().should("include", "/auth/login");
  });

  // TC05
  it("TC05 - Gagal login ketika hanya username yang dikosongkan", () => {
    cy.fillLoginForm(null, data.validUser.password);
    cy.submitLogin();
    cy.get(".oxd-input-group__message").should("contain.text", "Required");
    cy.url().should("include", "/auth/login");
  });

  // TC06
  it("TC06 - Gagal login ketika hanya password yang dikosongkan", () => {
    cy.fillLoginForm(data.validUser.username, null);
    cy.submitLogin();
    cy.get(".oxd-input-group__message").should("contain.text", "Required");
    cy.url().should("include", "/auth/login");
  });

    // TC07
  it("TC07 - Link 'Forgot your password?' mengarahkan ke halaman reset password", () => {
    cy.contains(/forgot your password\?/i).click();
    cy.url().should("include", "/auth/requestPasswordResetCode");
    cy.get("h6").should("contain.text", "Reset Password");
  });

  // TC08
  it("TC08 - Logo OrangeHRM tampil pada halaman login", () => {
    cy.get(".orangehrm-login-branding img").should("be.visible");
  });

    // TC09
  it("TC09 - Gagal login ketika username diapit spasi (leading/trailing space)", () => {
    cy.fillLoginForm(data.usernameWithSpace.username, data.usernameWithSpace.password);
    cy.submitLogin();
    cy.get(".oxd-alert-content-text").should(
      "contain.text",
      "Invalid credentials"
    );
    cy.url().should("include", "/auth/login");
  });

  // TC10
  it("TC10 - Field password ter-masking (type=password)", () => {
    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });

    // TC11
  it("TC11 - Tetap berhasil login walau username huruf kecil semua (case insensitive)", () => {
    cy.fillLoginForm(data.wrongCaseUsername.username, data.wrongCaseUsername.password);
    cy.submitLogin();
    cy.url().should("include", "/dashboard/index");
  });

  // TC12
  it("TC12 - Footer 'OrangeHRM, LLC' tampil pada halaman login", () => {
    cy.get(".orangehrm-copyright-wrapper").should("contain.text", "OrangeHRM");
  });
});