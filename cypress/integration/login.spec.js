import { withSuccess } from '../builders/response';
import { userBuilder } from '../builders/users/current/get';
const { cy } = global;

describe('login', () => {
  it('should be able to login a user', () => {
    const user = userBuilder();
    cy.login();
    cy.intercept('GET', '/users/current', withSuccess(user));
    cy.intercept('GET', '/mentors?limit=*', { fixture: 'mentors/get' });
    cy.intercept('GET', `/users/${user._id}/favorites`, {
      fixture: 'favorites/get',
    });
    cy.visit('/');
    cy.getByTestId('user-avatar').getByAltText('brentmclark@gmail.com').click();
    cy.getByText('Logout').should('have.length', 1);
  });
});
