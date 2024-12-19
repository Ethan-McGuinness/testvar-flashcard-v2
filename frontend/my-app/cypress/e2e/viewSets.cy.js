
describe('Expanding Collections on Flashcards Page', () => {
    beforeEach(() => {
      // Log in before each test
      cy.visit('http://localhost:3000/'); // Ensure this is the correct URL for your login page
      cy.get('#username').type('testUser');
      cy.get('#password').type('testPassword');
      cy.get('button[type="submit"]').click();
  
      // Verify the URL includes the home path and navigate to flashcards
      cy.url().should('include', '/home');
      cy.visit('http://localhost:3000/flashcards'); 

      cy.get('.collection h2').first().click();
      
      // Click on the first flashcard set link
      cy.get('.collection ul li a').first().click();
      
      // Verify navigation to the correct flashcard set page
      cy.url().should('include', '/sets/'); // Ensure the URL includes the base path for a set
      cy.contains('testSet'); // Adjust based on the actual content or title
      
    });

    it('should navigate to the next flashcard', () => {
        cy.contains('button', 'Next').click();
        cy.contains('testQuestion2');
      });
    it('should navigate to the previous flashcard', () => {
        cy.contains('button', 'Back').click();
        cy.contains('testQuestion2');
      });  
    it('should hide the flashcard', () => {
        cy.contains('button', 'Hide').click();
        cy.contains('testQuestion2');
        cy.contains('Unhide');
        cy.contains('button', 'Unhide').click();
        cy.contains('unhide').should('not.exist');;
    });  
    it('should flip the flashcard', () => {
        cy.contains('testQuestion');
        cy.get('.flashcard').first().click
        cy.contains('testAnswer');
      });  
    

});