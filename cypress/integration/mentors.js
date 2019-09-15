const { cy } = global;

describe('Mentor Filtering', () => {
  beforeEach(function() {
    cy.fixture("users/credentials.json").as("user");
  });

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

  it('login user to apply for mentor', () => {
    cy.visit('/');
    cy.get('div.auth').contains('Login / Sign up').click();
    cy.get('@user')
      .then((user) => {
        cy.get('input[name="email"]').type(user.email);
        cy.get('input[name="password"]').type(user.password);
        cy.get('button').click();
      })
  });

  it('logged users can click on mentors channel', () => {
    cy.visit('/').filterByName('Brent M Clark')
    cy.getAllByTestId('mentor-card').first()
      .get('div.channels')
      .first()
      .click();
  });

  it( 'verify filtered technology label on mentors card', ()=> {
    cy.visit('/')
      .getByTestId('technology-filter-autocomplete')
      .type('aws')
      .type('{enter}');
    cy.getAllByTestId('mentor-card').first()
      .get('.tag').contains('aws')
  });

  it( 'verify filtered country label on mentors card', ()=> {
    cy.visit('/')
      .getByTestId('country-filter-autocomplete')
      .type('France')
      .type('{enter}');
    cy.getAllByTestId('mentor-card').first()
      .get('.country').contains('FR')
  })
});
