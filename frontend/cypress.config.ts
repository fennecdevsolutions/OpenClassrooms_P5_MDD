import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    specPattern: 'cypress/e2e/All.e2e.cy.ts',
    supportFile: 'cypress/support/e2e.{js,jsx,ts,tsx}',
    async setupNodeEvents(on, config) {
      const coverage = require('@cypress/code-coverage/task');
      coverage(on, config);
      return config;
    },
  }

});