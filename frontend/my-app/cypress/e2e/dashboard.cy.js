

// cypress/e2e/navigation.cy.js

describe('Navigation Links', () => {
    beforeEach(() => {
      // Log in before each test
      cy.visit('http://localhost:3000/'); 
      cy.get('#username').type('testUser');
      cy.get('#password').type('testPassword');
      cy.get('button[type="submit"]').click();
  
      // Verify the URL includes the home path
      cy.url().should('include', '/home');
    });
  
    it('should navigate to View Your Flashcards', () => {
      cy.contains('View your Flashcard').click();
      cy.url().should('include', '/flashcards');
      // Verify the flashcards page content
      cy.contains('View Collections'); 
    });
  
    it('should navigate to Create Flashcards', () => {
      cy.contains('Create Flashcards').click();
      cy.url().should('include', '/create');
      // Verify the create flashcards page content
      cy.contains('Create'); 
    });
  
    it('should navigate to Browse Flashcards', () => {
      cy.contains('Browse Flashcards').click();
      cy.url().should('include', '/browse');
      // Verify the browse flashcards page content
      cy.contains('Public Flashcards'); 
    });
  
    it('should log out and navigate to the login page', () => {
      cy.contains('log Out').click();
      cy.url().should('include', '/'); 
      // Verify the login page content
      cy.contains('TESTVARS FLASHCARDS'); 
    });
  });
  