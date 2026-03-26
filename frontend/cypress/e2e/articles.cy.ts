describe('Article Creation e2e tests', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.login();
        cy.intercept('GET', '/api/articles?direction=desc', { fixture: 'articles.json' }).as('getArticles');
        cy.intercept('GET', '/api/themes', { fixture: 'themes.json' }).as('getThemes');
    });

    it('should create a new article successfully and redirect to details', () => {
        // intercept article creation
        cy.intercept('POST', '/api/articles', {
            body: { id: 16, title: 'New Article', content: 'Contenu de test' }
        }).as('createArticle');

        cy.intercept('GET', '/api/articles/16', {
            body: { id: 16, title: 'New Article', content: 'Contenu de test', authorName: 'Abdel_Dev', themeTitle: 'Angular & TypeScript', createdAt: '2026-03-21T12:00:48' }
        }).as('getArticle');

        cy.intercept('GET', '/api/articles/16/comments', {
            body: {}
        }).as('getArticleComments');

        cy.wait('@getArticles');
        cy.getBySel("create-article-btn").click();
        cy.wait('@getThemes');

        //fill the form
        cy.getBySel('theme-select').click();
        cy.getBySel('theme-option').contains('Angular & TypeScript').click();
        cy.getBySel('title-input').type('New Article');
        cy.getBySel('content-input').type('Contenu de test');

        // submit
        cy.getBySel('submit-btn').should('not.be.disabled').click();

        cy.url().should('include', '/articles/16');
        cy.wait(['@createArticle', '@getArticle', '@getArticleComments']);

    });

    it('should load and display article details correctly', () => {

        cy.intercept('GET', '/api/articles/16', {
            body: {
                id: 16,
                title: 'New Article',
                content: 'Contenu de test détaillé',
                authorName: 'Abdel_Dev',
                themeTitle: 'Angular & TypeScript',
                createdAt: '2026-03-21T12:00:48'
            }
        }).as('getArticle');

        cy.intercept('GET', '/api/articles/16/comments', { fixture: 'comments.json' }).as('getArticleComments');

        cy.wait('@getArticles');
        cy.visit('/articles/16');
        cy.wait(['@getArticle', '@getArticleComments']);

        cy.getBySel('article-title')
            .scrollIntoView()
            .should('be.visible')
            .and('contain', 'New Article');

        cy.getBySel('article-author')
            .should('be.visible')
            .and('contain', 'Abdel_Dev');

        cy.getBySel('article-date')
            .should('be.visible')
            .and('contain', '21/03/2026');

        cy.getBySel('article-theme')
            .should('be.visible')
            .and('contain', 'Angular & TypeScript');

        cy.getBySel('article-content')
            .should('be.visible')
            .and('contain', 'Contenu de test détaillé');
    });

    it('should show an error message if the creation fails', () => {

        cy.intercept('POST', '/api/articles', {
            statusCode: 500,
            body: {}
        }).as('createError');

        cy.wait('@getArticles');
        cy.getBySel("create-article-btn").click();
        cy.wait('@getThemes');

        //fill the form
        cy.getBySel('theme-select').click();
        cy.getBySel('theme-option').contains('Angular & TypeScript').click();
        cy.getBySel('title-input').type('Nouvel Article');
        cy.getBySel('content-input').type('Contenu de test');

        // submit
        cy.getBySel('submit-btn').should('not.be.disabled').click();
        cy.wait('@createError');

        // Verify message
        cy.get('.mat-mdc-simple-snack-bar')
            .should('be.visible')
            .and('contain', 'Une erreur est survenue');
    });

    it('should show specific error for unauthorized user (403)', () => {
        cy.intercept('POST', '/api/articles', {
            statusCode: 403,
            body: { message: 'Forbidden' }
        }).as('forbiddenError');

        cy.wait('@getArticles');
        cy.getBySel("create-article-btn").click();
        cy.wait('@getThemes');

        //fill the form
        cy.getBySel('theme-select').click();
        cy.getBySel('theme-option').contains('Angular & TypeScript').click();
        cy.getBySel('title-input').type('Nouvel Article');
        cy.getBySel('content-input').type('Contenu de test');

        // submit
        cy.getBySel('submit-btn').should('not.be.disabled').click();

        cy.wait('@forbiddenError');

        //verify error message
        cy.get('.mat-mdc-simple-snack-bar')
            .should('be.visible')
            .and('contain', 'Veuillez vous connecter avant de créer un article');
    });
});