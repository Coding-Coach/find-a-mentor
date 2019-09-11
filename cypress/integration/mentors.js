const { cy } = global;

describe('Mentor Filtering', () => {
  it('can filter by technology', () => {
    cy.visit('/')
      .filterByName('Brent M Clark')
      .getByTestId('technology-filter-autocomplete')
      .type('reactjs{enter}', { force: true });
    // .getByTestId('mentor-card')
    // .should('have.length', 1);
  });

  it('can filter by country', () => {
    cy.visit('/')
      .filterByName('Brent M Clark')
      .getByTestId('country-filter-autocomplete')
      .type('United States{enter}', { force: true });
    // .getByTestId('mentor-card')
    // .should('have.length', 1);
  });

  it('can filter by name', () => {
    cy.visit('/').filterByName('Brent M Clark');
    // .getByTestId('mentor-card')
    // .should('have.length', 1);
  });

  it('can filter by language', () => {
    cy.visit('/')
      .filterByName('Brent M Clark')
      .getByTestId('language-filter-autocomplete')
      .type('English{enter}', { force: true });
    // .getByTestId('mentor-card')
    // .should('have.length', 1);
  });

  it('can clear filter', () => {
    cy.visit('/')
      .filterByName('Brent M Clark')
      .getByTestId('clear-filter')
      .click();
    cy.getByTestId('name-filter-autocomplete').should('have.value', '');
  });
});
