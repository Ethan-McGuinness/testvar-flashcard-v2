
describe('Expanding Collections on Flashcards Page', () => {
    beforeEach(() => {
      // Log in before each test
      cy.visit('http://localhost:3000/'); // Ensure this is the correct URL for your login page
      cy.get('#username').type('testUser');
      cy.get('#password').type('testPassword');
      cy.get('button[type="submit"]').click();
  
      // Verify the URL includes the home path and navigate to flashcards
      cy.url().should('include', '/home');
      cy.visit('http://localhost:3000/browse'); 
    });

      it('should navigate to browse flashcards', () => {
        cy.contains('button', 'Flashcards').click();
        cy.contains('Public Flashcards');
      });
    
      it('should navigate to browse flashcards sets', () => {
        cy.contains('button', 'Sets').click();
        cy.contains('Public Sets - Click on a set to view its content');
      });
    
      it('should navigate to browse collection', () => {
        cy.contains('button', 'Collections').click();
        cy.contains('Public Collections - click on a collection & set to view its content');
      });

      it('should create popup with all sets in the collection', () => {
        cy.contains('button', 'Collection').click(); 
        cy.contains('li', 'testCollection').click(); 
        cy.contains('testSet'); 
      });

      it('should create popup with all cards in the set', () => {
        cy.contains('button', 'Sets').click(); 
        cy.contains('li', 'testSet').click(); 
        cy.contains('testSet'); 
      });

}); 