const { cy } = global;

describe('Mentor Filtering', () => {
  it('can filter by technology', () => {
    cy.visit('/')
      .get('[data-testid=name-filter-autocomplete]')
      .type('Brent M Clark')
      .type('{enter}')
      .get('[data-testid=technology-filter-autocomplete]')
      .type('reactjs')
      .type('{enter}')
      .get('[data-testid=mentors-wrapper] .mentors-cards')
      .should('have.length', 1);
  });

  it('can filter by country', () => {
    cy.visit('/')
      .get('[data-testid=name-filter-autocomplete]')
      .type('Brent M Clark')
      .type('{enter}')
      .get('[data-testid=country-filter-autocomplete]')
      .type('United States')
      .type('{enter}')
      .get('[data-testid=mentors-wrapper] .mentors-cards')
      .should('have.length', 1);
  });

  it('can filter by name', () => {
    cy.visit('/')
      .get('[data-testid=name-filter-autocomplete]')
      .type('Brent M Clark')
      .type('{enter}')
      .get('[data-testid=mentors-wrapper] .mentors-cards')
      .should('have.length', 1);
  });

  it('can filter by language', () => {
    cy.visit('/')
      .get('[data-testid=name-filter-autocomplete]')
      .type('Brent M Clark')
      .type('{enter}')
      .get('[data-testid=language-filter-autocomplete]')
      .type('English')
      .type('{enter}')
      .get('[data-testid=mentors-wrapper] .mentors-cards')
      .should('have.length', 1);
  });
});
