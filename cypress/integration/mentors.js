const { cy } = global;

describe('Mentor Filtering', () => {
  it('can filter by technology', () => {
    cy.visit('/')
      .getByTestId('name-filter-autocomplete')
      .type('Brent M Clark')
      .type('{enter}')
      .getByTestId('technology-filter-autocomplete')
      .type('reactjs')
      .type('{enter}')
      .get('.mentors-cards')
      .should('have.length', 1);
  });

  it('can filter by country', () => {
    cy.visit('/')
      .getByTestId('name-filter-autocomplete')
      .type('Brent M Clark')
      .type('{enter}')
      .getByTestId('country-filter-autocomplete')
      .type('United States')
      .type('{enter}')
      .get('.mentors-cards')
      .should('have.length', 1);
  });

  it('can filter by name', () => {
    cy.visit('/')
      .getByTestId('name-filter-autocomplete')
      .type('Brent M Clark')
      .type('{enter}')
      .get('.mentors-cards')
      .should('have.length', 1);
  });

  it('can filter by language', () => {
    cy.visit('/')
      .getByTestId('name-filter-autocomplete')
      .type('Brent M Clark')
      .type('{enter}')
      .getByTestId('language-filter-autocomplete')
      .type('English')
      .type('{enter}')
      .get('.mentors-cards')
      .should('have.length', 1);
  });
});
