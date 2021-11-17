import { withSuccess } from '../../builders/response';
import { userBuilder } from '../../builders/users/current/get';

describe('Me / home', () => {
  before(() => {
    cy.intercept('GET', '/users/current', withSuccess(userBuilder()));
    cy.login();
    cy.visit('/me');
  });

  describe('Avatar', () => {
    it('should present user avatar', () => {
      cy.get(`img[alt="brentmclark@gmail.com"]`);
    });

    it('should allow the user to click on share and get an input with their profile url', () => {
      cy.get('[aria-label="Share your profile"]').click();
      cy.get('input[readonly]').should('have.value', 'http://localhost:3000/u/1');
    });
  });

  describe('Details', () => {
    it('should present user details', () => {
      cy.getByTestId('email-label').should(
        'have.text',
        'brentmclark@gmail.com'
      );
    });
  });
});
