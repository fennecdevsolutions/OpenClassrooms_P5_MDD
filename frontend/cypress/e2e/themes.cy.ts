describe('Themes e2e tests', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.login();

        cy.intercept('GET', '/api/themes', { fixture: 'themes.json' }).as('getAllThemes');
        cy.intercept('GET', '/api/themes/subscriptions', { fixture: 'subscriptions.json' }).as('getSubscriptions');
    });

    it('should display all themes with correct subscription status', () => {
        cy.visit('/themes');

        cy.wait(['@getAllThemes', '@getSubscriptions']);

        // verify theme cards display
        cy.getBySel('theme-title').should('have.length', 5);

        // verify "Déja abonné" state
        cy.getBySel('theme-title').contains('Java & Spring')
            .parents('app-theme-card')
            .within(() => {
                cy.getBySel('subscribe-btn').should('contain', 'Déjà abonné')
                    .and('be.disabled');
            });

        // verify "S'abonner" state
        cy.getBySel('theme-title').contains('DevOps & Cloud')
            .parents('app-theme-card')
            .within(() => {
                cy.getBySel('subscribe-btn').should('contain', "S'abonner")
                    .and('not.be.disabled');
            });
    });

    it('should allow user to subscribe to a new theme', () => {

        // intercept subscription request
        cy.intercept('POST', '/api/themes/4/subscribe', { statusCode: 200 }).as('subscribeRequest');

        cy.visit('/themes');
        cy.wait(['@getAllThemes', '@getSubscriptions']);

        // intercept  subscription refresh request
        cy.intercept('GET', '/api/themes/subscriptions', {
            body: [
                { id: 1, title: 'Java & Spring' },
                { id: 2, title: 'Angular & TypeScript' },
                { id: 3, title: 'Architecture & Design' },
                { id: 4, title: 'Bases de Données' }
            ]
        }).as('getUpdatedSubscriptions');

        // Click on subscription button for "Bases de Données"
        cy.getBySel('theme-title').contains('Bases de Données')
            .parents('app-theme-card')
            .find('button').click();

        cy.wait('@subscribeRequest');

        // verify snackbar
        cy.get('.mat-mdc-simple-snack-bar')
            .should('be.visible')
            .and('contain', 'Abonnement réussi');

        // Verify that the button state changed
        cy.getBySel('theme-title').contains('Bases de Données')
            .parents('app-theme-card')
            .find('button').should('contain', 'Déjà abonné').and('be.disabled');
    });

    it('should show error message if subscription fails', () => {
        cy.intercept('POST', '/api/themes/4/subscribe', {
            statusCode: 500,
            body: 'Server Error'
        }).as('subscribeError');

        cy.visit('/themes');
        cy.wait(['@getAllThemes', '@getSubscriptions']);

        cy.get('app-theme-card').contains('Bases de Données')
            .parents('app-theme-card')
            .find('button').click();

        cy.wait('@subscribeError');

        // verify error snackbar
        cy.get('.mat-mdc-simple-snack-bar')
            .should('be.visible')
            .and('contain', 'Une erreur est survenue');
    });
});