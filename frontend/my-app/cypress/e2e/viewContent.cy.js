// cypress/e2e/flashcards.cy.js

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
    });
  
    it('should load and display collections', () => {
      // Verify that the collections are loaded
      cy.contains('Loading collections...').should('not.exist'); 
      cy.get('.collection').should('have.length.greaterThan', 0); 
    });
  
    it('should expand a collection to show flashcard sets', () => {
      // Click on the first collection title to expand it
      cy.get('.collection h2').first().click();
  
      // Verify that the flashcard sets are displayed
      cy.get('.collection').first().within(() => {
        cy.get('ul').should('exist');
        cy.get('li').should('have.length.greaterThan', 0); 
      });
    });
  
    it('should toggle the privacy status of a collection', () => {
        cy.get('.collection button').first().should(($btn) => {
            const initialText = $btn.text();
            const initialBgColor = $btn.css('background-color');
          
            // Ensure the initial state is Public and green
            expect(initialText).to.equal('Public');
            expect(initialBgColor).to.equal('rgb(0, 128, 0)'); // Green color for Public
          });
          
          // Click the button to toggle privacy
          cy.get('.collection button').first().click();
          
          // Verify the new state
          cy.get('.collection button').first().should(($btnAfterClick) => {
            const newText = $btnAfterClick.text();
            const newBgColor = $btnAfterClick.css('background-color');
          
            // Ensure the new state is Private and red
            expect(newText).to.equal('Private');
            expect(newBgColor).to.equal('rgb(255, 0, 0)'); // Red color for Private
          });

          //click button again to reset back to public
          cy.get('.collection button').first().click();

          //verify the state is rest to public 
          cy.get('.collection button').first().should(($btnReset) => {
            const resetText = $btnReset.text();
            const resetBgColor = $btnReset.css('background-color');

            expect(resetText).to.equal('Public');
            expect(resetBgColor).to.equal('rgb(0, 128, 0)');
        });
    });

    it('should navigate to a flashcard set page when a set is clicked', () => {
        // Expand the first collection
        cy.get('.collection h2').first().click();
      
        // Click on the first flashcard set link
        cy.get('.collection ul li a').first().click();
      
        // Verify navigation to the correct flashcard set page
        cy.url().should('include', '/sets/'); // Ensure the URL includes the base path for a set
        cy.contains('testSet'); // Adjust based on the actual content or title
      });
      
    
});
