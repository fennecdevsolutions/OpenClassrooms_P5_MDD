describe('Header Responsiveness', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.login();
        cy.viewport(400, 800);
    });

    it('should display burger menu and toggle navbar on mobile', () => {
        // verify header buttons are hidden
        cy.getBySel('logout-button').should('not.be.visible');
        cy.getBySel('nav-articles').should('not.be.visible');
        cy.getBySel('nav-themes').should('not.be.visible');
        cy.getBySel('nav-profile').should('not.be.visible');


        // check menu button is visible and click it
        cy.getBySel('menu-button').should('be.visible').click();


        // check sidenav is visible
        cy.getBySel('sidenav').should('be.visible');

        //check sidenav buttons are visible
        cy.getBySel('sidenav-logout').should('be.visible');
        cy.getBySel('sidenav-articles').should('be.visible');
        cy.getBySel('sidenav-themes').should('be.visible');
        cy.getBySel('sidenav-profile').should('be.visible');

        // logout and verify landing page display
        cy.getBySel('sidenav-logout').click();

        cy.get('.logo-large').should('be.visible');
        cy.getBySel('register-btn').should('be.visible');
        cy.getBySel('login-btn').should('be.visible');

    });
});