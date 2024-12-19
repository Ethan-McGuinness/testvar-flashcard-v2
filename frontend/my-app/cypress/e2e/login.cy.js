
describe('Login Flow', () => {
    it('should successfully log in with a valid credentials', () => {

        //step 1 visit the login page
        cy.visit('http://localhost:3000/');
        
        //step 2: Enter username and password
        cy.get('#username').type('testUser');
        cy.get ('#password').type('testPassword');

        //Step 3: submit the form 
        cy.get('button[type="submit"]').click();

        //Step 4: verify if login was succeful
        cy.url().should('include', '/home');
        
    });

    it('should show an error message with invalid credentials', () => {
        //Step 1: Visit the login page
        cy.visit('http://localhost:3000/');

        //Step 2: Enter invalid username and password into fields
        cy.get('#username').type('wrongUser');
        cy.get ('#password').type('wrongPassword');

        //Step 3: submit the form 
        cy.get('button[type="submit"]').click();

        //Step 4: Verify that error showed correctly
        cy.contains('Invalid credentials. Please try again.');
    });
});