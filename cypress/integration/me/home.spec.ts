import { withSuccess } from '../../builders/response';
import { userBuilder } from '../../builders/users/current/get';
import { getByTestId } from '../../support';

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
