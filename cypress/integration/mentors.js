const { cy } = global;

describe('Mentor Filtering', () => {
  it('can filter by technology', () => {
    cy.visit('/')
      .filterByName('Brent M Clark')
      .getByTestId('technology-filter-autocomplete')
      .type('reactjs{enter}', { force: true });
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

  it( 'verify filtered technology label on mentors card', ()=> {
    cy.visit('/')
      .getByTestId('technology-filter-autocomplete')
      .type('reactjs')
      .type('{enter}');
    cy.getAllByTestId('mentor-card').first()
      .get('.tag').contains('reactjs')
  });

  it( 'verify filtered country label on mentors card', ()=> {
    cy.visit('/')
      .getByTestId('country-filter-autocomplete')
      .type('United States')
      .type('{enter}');
    cy.getAllByTestId('mentor-card').first()
      .get('.country').contains('US')
  })

  it('logged users can click on mentors channel', () => {
    cy.login();
    cy.server({urlMatchingOptions: { matchBase: false, dot: true }});
    cy.route('GET', '/users/current', 'fixture:users/current/get');
    cy.route('GET', '/mentors?limit=*', 'fixture:mentors/get');
    cy.visit('/').filterByName('Brent M Clark')
    cy.getAllByTestId('mentor-card').first()
      .get('div.channels')
      .first()
      .click();
  });
});
