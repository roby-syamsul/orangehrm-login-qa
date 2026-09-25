// cypress/pages/LoginPage.js
// Page Object untuk halaman Login OrangeHRM

class LoginPage {
  // ---------- Selectors ----------
  elements = {
    usernameInput: () => cy.get('input[name="username"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    submitButton: () => cy.get('button[type="submit"]'),
    errorMessage: () => cy.get(".oxd-alert-content-text"),
    requiredMessage: () => cy.get(".oxd-input-group__message"),
    forgotPasswordLink: () => cy.contains(/forgot your password\?/i),
    logo: () => cy.get(".orangehrm-login-branding img"),
  };

  // ---------- Actions ----------
  visit() {
    cy.visit("/web/index.php/auth/login");
  }

  typeUsername(username) {
    if (username !== null && username !== undefined) {
      this.elements.usernameInput().clear().type(username);
    }
  }

  typePassword(password) {
    if (password !== null && password !== undefined) {
      this.elements.passwordInput().clear().type(password);
    }
  }

  submit() {
    this.elements.submitButton().click();
  }

  login(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.submit();
  }

  clickForgotPassword() {
    this.elements.forgotPasswordLink().click();
  }

  // ---------- Assertions helper ----------
  verifyLoginSuccess() {
    cy.url().should("include", "/dashboard/index");
  }

  verifyInvalidCredentials() {
    this.elements.errorMessage().should("contain.text", "Invalid credentials");
  }

  verifyRequiredMessage() {
    this.elements.requiredMessage().should("contain.text", "Required");
  }

  verifyLogoVisible() {
    this.elements.logo().should("be.visible");
  }

  verifyPasswordMasked() {
    this.elements.passwordInput().should("have.attr", "type", "password");
  }
}

export default new LoginPage();