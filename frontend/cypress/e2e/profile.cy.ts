describe('Profile e2e tests', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.login()
        cy.intercept('GET', '/api/user', { fixture: 'user.json' }).as('getMe');
        cy.intercept('GET', '/api/themes/subscriptions', { fixture: 'subscriptions.json' }).as('getSubscriptions');

    });


    it('should display profile data and subscribed themes', () => {
        cy.visit('/me');

        cy.wait(['@getMe', '@getSubscriptions']);

        // verify data prefill
        cy.getBySel('username-input').should('have.value', 'Abdel_Dev');
        cy.getBySel('email-input').should('have.value', 'abdel@mdd.com');

        // verify theme listing
        cy.getBySel('theme-title').should('have.length', 3);
        cy.getBySel('theme-title').first().contains('Java');
        cy.getBySel('theme-title').last().contains('Architecture');

    })

    it('should allow user to update their profile information', () => {

        cy.visit('/me');
        cy.wait('@getMe');
        // intercept profile update and new profile fetch
        cy.intercept('PUT', '/api/user', { fixture: 'token.json' }).as('updateUser');
        cy.intercept('GET', '/api/user', { body: { username: 'NewName', email: 'new@email.com' } }).as('getMe');

        // input new profile data and submit
        cy.getBySel('username-input').clear().type('NewName');
        cy.getBySel('email-input').clear().type('new@email.com');
        cy.getBySel('submit-btn').click();

        cy.wait('@updateUser');

        // verify success message
        cy.get('.mat-mdc-simple-snack-bar').should('be.visible')
            .and('contain', 'Profile mis à jour avec succès');
    });

    it('should allow user to unsubscribe from a theme', () => {
        // intercept unsubscription request
        cy.intercept('DELETE', '/api/themes/1/unsubscribe', { statusCode: 200 }).as('unsubscribe');

        cy.visit('/me');
        cy.wait('@getSubscriptions');

        // intercept subscriptions refresh request
        cy.intercept('GET', '/api/themes/subscriptions', {
            body: [{ id: 2, title: 'Java', description: '...' }]
        }).as('getUpdatedSubscribed');

        // unsubscribe
        cy.get('app-theme-card').first().within(() => {
            cy.getBySel("unsubscribe-btn").contains('Se désabonner').click();
        });

        cy.wait('@unsubscribe');

        // verify success message and new subscriptions list
        cy.getBySel('theme-title').should('have.length', 1);
        cy.get('.mat-mdc-simple-snack-bar').should('be.visible')
            .and('contain', 'Désabonnement réussi');
    })

    it('should show default error message if profile update fails', () => {
        cy.intercept('GET', '/api/user', { fixture: 'user.json' }).as('getMe');

        cy.intercept('PUT', '/api/user', {
            statusCode: 500,
            body: {}
        }).as('updateError');

        cy.visit('/me');
        cy.wait('@getMe');

        cy.getBySel('username-input').clear().type('NewName');
        cy.getBySel('submit-btn').click();

        cy.wait('@updateError');

        cy.getBySel("server-error")
            .scrollIntoView()
            .should('be.visible')
            .and('contain', 'Une erreur est survenue');
    });


    it('should show error if unsubscription from theme fails', () => {
        // intercept unsubscription request
        cy.intercept('DELETE', '/api/themes/1/unsubscribe', {
            statusCode: 500,
            body: 'Server Error'
        }).as('unsubscribeError');

        cy.visit('/me');
        cy.wait('@getSubscriptions');

        // unsubscribe
        cy.get('app-theme-card').first().within(() => {
            cy.getBySel("unsubscribe-btn").contains('Se désabonner').click();
        });

        cy.wait('@unsubscribeError');

        // verify error message
        cy.get('.mat-mdc-simple-snack-bar').should('be.visible')
            .and('contain', 'Une erreur est survenue');

        // intercept and reply with forbidden error status
        cy.intercept('DELETE', '/api/themes/1/unsubscribe', {
            statusCode: 403,
            body: 'Forbidden'
        }).as('unsubscribeErrorForbidden');

        cy.get('app-theme-card').first().within(() => {
            cy.getBySel("unsubscribe-btn").contains('Se désabonner').click();
        });

        cy.wait('@unsubscribeErrorForbidden');

        // verify error message
        cy.get('.mat-mdc-simple-snack-bar').should('be.visible')
            .and('contain', 'Veuillez vous connecter avant de vous désabonner');
    })
})
