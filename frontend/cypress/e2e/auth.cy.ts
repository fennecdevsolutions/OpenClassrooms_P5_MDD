describe('Authentication e2e tests', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
  });
  it('Visits the initial page and register new user', () => {
    cy.intercept('GET', '/api/articles?direction=desc', {}).as('getNewUserArticles');
    cy.intercept('POST', '/api/auth/register', { fixture: 'token.json' }).as('registerUser');

    cy.visit('/')
    cy.get('.logo-large').should('be.visible')

    cy.getBySel('register-btn').click()
    cy.url().should('include', '/register');
    cy.getBySel('register-form').should('exist');

    cy.getBySel('register-username')
      .should('be.visible').click()
      .type('new_user');

    cy.getBySel('register-email')
      .should('be.visible').click()
      .type('test@email.com');

    cy.getBySel('password-input')
      .should('be.visible')
      .and('have.attr', 'type', 'password')
      .type('Password123!');

    // toggle password visibility and check it
    cy.getBySel('toggle-password-btn').click();

    cy.getBySel('password-input')
      .should('be.visible')
      .and('have.attr', 'type', 'text')


    cy.getBySel('submit-btn').should('not.be.disabled').click();
    cy.wait('@registerUser');
    cy.url().should('include', '/articles');

    cy.wait('@getNewUserArticles');
    cy.getBySel('create-article-btn').should('be.visible');


  });



  it('Visits the initial page and log in', () => {
    cy.intercept('GET', '/api/articles?direction=desc', { fixture: 'articles.json' }).as('getArticles');
    cy.intercept('POST', '/api/auth/login', { fixture: 'token.json' }).as('loginUser');

    cy.visit('/')

    cy.get('.logo-large').should('be.visible')

    cy.getBySel('login-btn').click()

    cy.url().should('include', '/login');
    cy.getBySel('login-form').should('exist');

    cy.getBySel('login-input')
      .should('be.visible').click()
      .type('test@email.com');

    cy.getBySel('password-input')
      .should('be.visible')
      .and('have.attr', 'type', 'password')
      .type('Password123!');

    // toggle password visibility and check it
    cy.getBySel('toggle-password-btn').click();

    cy.getBySel('password-input')
      .should('be.visible')
      .and('have.attr', 'type', 'text')

    cy.getBySel('submit-btn').should('not.be.disabled').click();
    cy.wait('@loginUser');
    cy.url().should('include', '/articles');

    cy.wait('@getArticles');
    cy.getBySel('article-title').should('have.length', 10)
      .contains('La révolution des Signals en Angular').should('be.visible');

  });

  it('log out when connected', () => {
    cy.login();
    cy.getBySel('logout-button').click();
    cy.url().should('include', '/articles');
    cy.get('.logo-large').should('be.visible')
    cy.getBySel('login-btn').should('be.visible');
  })

  it('should show error message on login failure', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginError');

    cy.visit('/login');
    cy.getBySel('login-input').type('wrong@email.com');
    cy.getBySel('password-input').type('WrongPassword!');
    cy.getBySel('submit-btn').click();

    cy.wait('@loginError');
    cy.getBySel("server-error").should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('should show error message when registering with an existing email', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: { message: 'Email already exists' }
    }).as('registerError');

    cy.visit('/register');
    cy.getBySel('register-username').type('existing_user');
    cy.getBySel('register-email').type('already@used.com');
    cy.getBySel('password-input').type('Password123!');
    cy.getBySel('submit-btn').click();

    cy.wait('@registerError');
    cy.getBySel("server-error").should('be.visible')
      .and('contain', 'Email already exists');
  });

  it('should show default message when server return empty error', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 500,
      body: {}
    }).as('registerError');

    cy.visit('/register');
    cy.getBySel('register-username').type('existing_user');
    cy.getBySel('register-email').type('already@used.com');
    cy.getBySel('password-input').type('Password123!');
    cy.getBySel('submit-btn').click();

    cy.wait('@registerError');
    cy.getBySel("server-error").should('be.visible')
      .and('contain', 'Une erreur est survenue');
  });
});
