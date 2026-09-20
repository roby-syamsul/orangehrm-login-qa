const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {},
  },
});
