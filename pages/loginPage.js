
class LoginPage {
  constructor(page) {
    this.page = page;
    this.useEmailPasswordButton = page.locator('button.btn-auth').first();
    this.userNameField = page.locator('input#username');
    this.passwordField = page.locator('input#password');
    this.submitButton = page.locator('button.btn-auth');
  }

  /**
   * Signs in the user using the provided username and password.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   */
  async signIn(username, password) {
    try {
      await this.useEmailPasswordButton.click();
      await this.userNameField.fill(username);
      await this.userNameField.press('Tab');
      await this.passwordField.fill(password);
      await this.submitButton.click();
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  }
}

module.exports = LoginPage;