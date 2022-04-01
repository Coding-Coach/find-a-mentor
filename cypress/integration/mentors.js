import { withSuccess } from '../builders/response';
import { userBuilder } from '../builders/users/current/get';

const { before, cy } = global;

describe('Mentor Filtering', () => {
  before(() => {
    const user = userBuilder();
    cy.login();
    cy.server({ urlMatchingOptions: { matchBase: false, dot: true } });
    cy.intercept('GET', '/users/current', withSuccess(user));
    cy.intercept('GET', '/mentors?limit=*', { fixture: 'mentors/get' });
    cy.intercept('/users/1/favorites/1', withSuccess(user));
    cy.intercept('GET', `/users/${user._id}/favorites`, {
      fixture: 'favorites/get',
    });
    cy.visit('/');
  });
  afterEach(() => {
    cy.clearNameFilter();
  });

  it('can filter by technology', () => {
    cy.filterByName('Brent M Clark')
      .getByTestId('technology-filter-autocomplete')
      .type('reactjs{enter}', { force: true });
  });

  it('can filter by country', () => {
    cy.filterByName('Brent M Clark')
      .getByTestId('country-filter-autocomplete')
      .type('United States{enter}', { force: true });
    // .getByTestId('mentor-card')
    // .should('have.length', 1);
  });

  it('can filter by name', () => {
    cy.filterByName('Brent M Clark');
    // .getByTestId('mentor-card')
    // .should('have.length', 1);
  });

  it('can filter by language', () => {
    cy.filterByName('Brent M Clark')
      .getByTestId('language-filter-autocomplete')
      .type('English{enter}', { force: true });
    // .getByTestId('mentor-card')
    // .should('have.length', 1);
  });

  it('can clear filter', () => {
    cy.filterByName('Brent M Clark');
    cy.get('div.input-container:nth-child(3)').within(() => {
      cy.getByText('clear').click();
    });

    cy.getByTestId('name-filter-autocomplete').should('have.value', '');
  });

  it('verify filtered technology label on mentors card', () => {
    cy.getByTestId('technology-filter-autocomplete')
      .type('reactjs')
      .type('{enter}');
    cy.getAllByTestId('mentor-card').first().get('.tag').contains('reactjs');
  });

  it('verify filtered country label on mentors card', () => {
    cy.getByTestId('country-filter-autocomplete')
      .type('United States')
      .type('{enter}');
    cy.getAllByTestId('mentor-card').first().get('.country').contains('US');
  });

  it(`user can't approach non available mentor`, () => {
    cy.filterByName('S');
    cy.getByTestId('mentor-card')
      .get('div.channels')
      .contains('This mentor is not taking new mentees for now');
  });

  it(`user navigates to mentor profile`, () => {
    cy.filterByName('B');
    cy.get('.tags').children().filter('button').should('have.length', 5);
    // user has 6 tags and 5 are shown +1
    cy.getByText('+1');
    cy.getByTestId('mentor-card').get('div.channels').click();

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/u/1');
    });

    cy.get('.tags').children().filter('button').should('have.length', 6);
    cy.getByText('github');
  });

  it.skip('user can like mentor', () => {
    cy.get('button.like-button').first().click();
    cy.get('button.like-button i').first().should('have.class', 'liked');
  });

  it.skip('user can unlike mentor', () => {
    cy.get('button.like-button').first().click();
    cy.get('button.like-button i').first().should('have.class', 'fa-heart-o');
  });
});
