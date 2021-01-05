const { cy } = global;

describe('Mentor Filtering', () => {
  before(function() {
    cy.login();
    cy.server({ urlMatchingOptions: { matchBase: false, dot: true } });
    cy.intercept('GET', '/users/current', { fixture: 'users/current/get' });
    cy.intercept('GET', '/mentors?limit=*', { fixture: 'mentors/get' });
    cy.visit('/');
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
    cy.getAllByTestId('mentor-card')
      .first()
      .get('.tag')
      .contains('reactjs');
  });

  it('verify filtered country label on mentors card', () => {
    cy.getByTestId('country-filter-autocomplete')
      .type('United States')
      .type('{enter}');
    cy.getAllByTestId('mentor-card')
      .first()
      .get('.country')
      .contains('US');
  });

  it('logged users can click on mentors channel', () => {
    cy.filterByName('Brent M Clark');
    cy.getAllByTestId('mentor-card')
      .first()
      .get('div.channels')
      .first()
      .click();
  });

  it('user can like mentor', () => {
    cy.get('button.like-button')
      .first()
      .click();
    cy.get('button.like-button i')
      .first()
      .should('have.class', 'liked');
  });

  it('user can unlike mentor', () => {
    cy.get('button.like-button')
      .first()
      .click();
    cy.get('button.like-button i')
      .first()
      .should('have.class', 'fa-heart-o');
  });
});
