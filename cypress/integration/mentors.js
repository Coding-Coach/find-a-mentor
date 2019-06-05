const { cy } = global;

describe('Mentor Filtering', () => {
  it('can filter by technology', () => {
    cy.visit('/')
      .filterByName('Brent M Clark')
      .getByTestId('technology-filter-autocomplete')
      .type('reactjs')
      .type('{enter}')
      .getByTestId('mentor-card')
      .should('have.length', 1);
  });

  it('can filter by country', () => {
    cy.visit('/')
      .filterByName('Brent M Clark')
      .getByTestId('country-filter-autocomplete')
      .type('United States')
      .type('{enter}')
      .getByTestId('mentor-card')
      .should('have.length', 1);
  });

  it('can filter by name', () => {
    cy.visit('/')
      .filterByName('Brent M Clark')
      .getByTestId('mentor-card')
      .should('have.length', 1);
  });

  it('can filter by language', () => {
    cy.visit('/')
      .filterByName('Brent M Clark')
      .getByTestId('language-filter-autocomplete')
      .type('English')
      .type('{enter}')
      .getByTestId('mentor-card')
      .should('have.length', 1);
  });
});
