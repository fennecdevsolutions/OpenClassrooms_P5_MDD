describe('Authentication e2e tests', () => {

  beforeEach(() => {
    cy.intercept('GET', '/api/articles?direction=desc', { fixture: 'articles.json' }).as('getArticles');
    cy.intercept('POST', '/api/auth/login', { fixture: 'token.json' }).as('loginUser');
  });
  it('Visits the initial page and log in', () => {
    cy.visit('/')
    cy.get('.logo-large').should('be.visible')
    cy.getBySel('login-btn').click()
    cy.url().should('include', '/login');
    cy.getBySel('login-input')
      .should('be.visible').click()
      .type('test@email.com');

    cy.getBySel('password-input')
      .should('be.visible')
      .type('Password123!');

    cy.getBySel('login-form').should('exist');

    cy.getBySel('submit-btn').should('not.be.disabled').click();

    cy.wait('@loginUser');
    cy.wait('@getArticles');
    cy.url().should('include', '/articles');



  });
});
