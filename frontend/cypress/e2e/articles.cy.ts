import { Comment } from '../../../frontend/src/app/core/models/comment.model';

describe('Article Creation e2e tests', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.login();
        cy.intercept('GET', '/api/articles?direction=desc', { fixture: 'articles.json' }).as('getArticles');
        cy.intercept('GET', '/api/themes', { fixture: 'themes.json' }).as('getThemes');
    });


    it('should display the list of articles and retrigger articles fetching with ascending order', () => {
        cy.fixture('articles.json').then((articles: any[]) => {
            const reversedArticles = [...articles].reverse();
            //check default direction query
            cy.wait('@getArticles').its('request.query.direction').should('equal', 'desc');

            // verify defautl order
            cy.getBySel('article-title').should('have.length', 10);
            cy.getBySel('article-title').first().should('contain', articles[0].title);

            // intercept new request
            cy.intercept('GET', '/api/articles?direction=asc', {
                body: reversedArticles
            }).as('getArticlesAsc')

            // click sort button
            cy.getBySel('sort-button').click();

            //check asc direction query
            cy.wait('@getArticlesAsc').its('request.query.direction').should('equal', 'asc');

            // verify cards order
            cy.getBySel('article-title').first().should('contain', reversedArticles[0].title);

            // intercept new request
            cy.intercept('GET', '/api/articles?direction=desc', {
                body: articles
            }).as('getArticlesDesc2')

            // click sort button
            cy.getBySel('sort-button').click();

            //check asc direction query
            cy.wait('@getArticlesDesc2').its('request.query.direction').should('equal', 'desc');

            // verify cards order
            cy.getBySel('article-title').first().should('contain', articles[0].title);
        });

    })

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


    it('should display comments and allow user to post a new one', () => {

        const newCommentText = 'Ceci est un commentaire de test E2E !';
        const newComment: Comment = {
            id: '4',
            content: newCommentText,
            articleId: '16',
            authorUsername: 'Abdel_Dev',
            createdAt: '2026-03-30T17:52:17',
        };

        // intercept article details, comments and new comment posting
        cy.intercept('GET', '/api/articles/16', {
            body: { id: '16', title: 'New Article', content: '...', authorName: 'Abdel_Dev' }
        }).as('getArticle');

        cy.intercept('GET', '/api/articles/16/comments', { fixture: 'comments.json' }).as('getInitialComments');

        cy.intercept('POST', '/api/articles/16/comments', {
            statusCode: 200,
            body: newComment
        }).as('postComment');

        cy.visit('/articles/16');
        cy.wait(['@getArticle', '@getInitialComments']);

        cy.getBySel('comment-card').should('have.length', 3);

        // intercept comments refresh
        cy.intercept('GET', '/api/articles/16/comments', {
            body: [
                newComment,
                {
                    "id": 14,
                    "content": "New comment",
                    "articleId": 16,
                    "authorUsername": "Abdel_Dev",
                    "createdAt": "2026-03-22T17:52:17"
                },
                {
                    "id": 1,
                    "content": "Excellente explication sur les Signals !",
                    "articleId": 16,
                    "authorUsername": "Abdel_Dev",
                    "createdAt": "2026-03-21T12:00:48"
                },
                {
                    "id": 2,
                    "content": "Je me demande si ça remplace totalement RxJS ?",
                    "articleId": 16,
                    "authorUsername": "Jean_Test",
                    "createdAt": "2026-03-21T12:00:48"
                }
            ]
        }).as('getUpdatedComments');

        // Post new comment
        cy.getBySel('comment-input').type(newCommentText);
        cy.getBySel('submit-comment').should('not.be.disabled').click();

        // Wait for requests to finish
        cy.wait('@postComment');
        cy.wait('@getUpdatedComments');

        // check snackbar
        cy.get('.mat-mdc-simple-snack-bar')
            .should('be.visible')
            .and('contain', 'Commentaire ajouté');

        // Verify text area is empty
        cy.getBySel('comment-input').should('have.value', '');

        // Verify new comment
        cy.getBySel('comment-card').first().within(() => {
            cy.contains(newCommentText).should('be.visible');
            cy.contains('Abdel_Dev').should('be.visible');
        });
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


    it('should show  error message when error during comment posting', () => {

        // Intercept article details request
        cy.intercept('GET', '/api/articles/16', {
            body: { id: '16', title: 'New Article', content: 'Article contest', authorName: 'Abdel_Dev' }
        }).as('getArticle');
        cy.intercept('GET', '/api/articles/16/comments', { fixture: 'comments.json' }).as('getComments');

        // intercept post and reply with error
        cy.intercept('POST', '/api/articles/16/comments', {
            statusCode: 403,
            body: { message: 'Forbidden' }
        }).as('postCommentError403');

        cy.visit('/articles/16');
        cy.wait(['@getArticle', '@getComments']);

        // Post comment
        cy.getBySel('comment-input').type('Test commentaire interdit');
        cy.getBySel('submit-comment').click();

        cy.wait('@postCommentError403');

        // verify snackbar
        cy.get('.mat-mdc-simple-snack-bar')
            .should('be.visible')
            .and('contain', 'Veuillez vous connecter avant de commenter');


        // intercept post and reply with  error 500
        cy.intercept('POST', '/api/articles/16/comments', {
            statusCode: 500,
            body: { message: 'Forbidden' }
        }).as('postCommentError500');

        cy.getBySel('submit-comment').click();

        cy.wait('@postCommentError500');

        // verify snackbar
        cy.get('.mat-mdc-simple-snack-bar')
            .should('be.visible')
            .and('contain', 'Une erreur est survenue');


        // check text area is not reset
        cy.getBySel('comment-input').should('have.value', 'Test commentaire interdit');
    });


});