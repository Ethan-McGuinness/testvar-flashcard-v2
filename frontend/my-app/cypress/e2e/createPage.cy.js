
describe('Expanding Collections on Flashcards Page', () => {
    beforeEach(() => {
      // Log in before each test
      cy.visit('http://localhost:3000/'); // Ensure this is the correct URL for your login page
      cy.get('#username').type('testUser');
      cy.get('#password').type('testPassword');
      cy.get('button[type="submit"]').click();
  
      // Verify the URL includes the home path and navigate to flashcards
      cy.url().should('include', '/home');
      cy.visit('http://localhost:3000/create'); 
    });

    it('should create a flashcard collection', () => {
        cy.get('input[type="text"]').type('My new Collection');

        cy.get('button[type="submit"]').click();
        cy.contains('Collection created successfully!')
      });

      it('should create a flashcard set', () => {
        cy.contains('button', 'Create Flashcard Set').click();
        cy.get('select').select('testCollection');
        cy.get('input[type="text"]').type('My new Set');
        cy.get('button[type="submit"]').click();
        cy.contains('Flashcard set created successfully!')
      });
      it('should create a flashcard set', () => {
        cy.contains('button', 'Create Flashcards').click();
        cy.get('label').contains('Question:').next('input').type('a question');
        cy.get('label').contains('Answer:').next('input').type('a answer');
        cy.get('label').contains('Difficulty:').next('input').type('easy');
        cy.get('select').select('testSet');
        cy.get('button[type="submit"]').click();
        cy.contains('Flashcard created successfully!')
      });
});