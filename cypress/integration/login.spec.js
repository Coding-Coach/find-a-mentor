import { createPublicKey } from "crypto";

const { cy } = global;

describe('login', () => {
	it('should be able to login a user', () => {
    cy.login();
    cy.server({urlMatchingOptions: { matchBase: false, dot: true }});
    cy.route('GET', '/users/current', 'fixture:users/current/get');
    cy.route('GET', '/mentors?limit=*', 'fixture:mentors/get');
    cy.visit('/')
    cy.getByTestId('user-avatar')
      .getByAltText('brentmclark@gmail.com')
      .click()
    cy.getByText('Logout')
      .should('have.length', 1)
	})
})
