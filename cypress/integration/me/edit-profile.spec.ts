import { User } from '../../../src/types/models';
import { withSuccess } from '../../builders/response';
import { userBuilder } from '../../builders/users/current/get';

const driverFactory = () => {
  let user: Partial<User> = {};

  return {
    given: {
      user: (_user: Partial<User>) => {
        user = _user;
      },
    },
    init() {
      cy.intercept('GET', '/users/current', withSuccess(userBuilder(user)));
      cy.intercept('PUT', '/users/1', withSuccess());
      cy.login();
      cy.visit('/me');
      openEditModal();
    },
  };
};

const openEditModal = () => {
  cy.contains('Edit').click();
};

describe('Me / edit profile', () => {
  let driver: ReturnType<typeof driverFactory>;

  beforeEach(() => {
    driver = driverFactory();
  });

  it('should form has the user details', () => {
    driver.init();
    cy.get('input[name="name"]').should('have.value', 'Brent M Clark');
  });

  it('should show validation message when missing required fields', () => {
    driver.given.user({ title: '' });
    driver.init();

    cy.contains('button', 'Save').click();

    cy.get('div').should(
      'include.text',
      'The following fields is missing or invalid'
    );
  });

  it('should show success toast upon successful submit', () => {
    driver.init();

    cy.contains('button', 'Save').click();

    cy.get('.Toastify').should(
      'include.text',
      'Your details updated successfully'
    );
  });
});
