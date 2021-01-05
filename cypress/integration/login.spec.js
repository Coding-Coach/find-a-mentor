import { createPublicKey } from 'crypto';

const { cy } = global;

describe('login', () => {
  it('should be able to login a user', () => {
    cy.login();
    cy.intercept('GET', '/users/current', { fixture: 'users/current/get' });
    cy.intercept('GET', '/mentors?limit=*', { fixture: 'mentors/get' });
    cy.visit('/');
    cy.getByTestId('user-avatar')
      .getByAltText('brentmclark@gmail.com')
      .click();
    cy.getByText('Logout').should('have.length', 1);
  });
});
