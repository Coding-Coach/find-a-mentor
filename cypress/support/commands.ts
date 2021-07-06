import '@testing-library/cypress/add-commands';

Cypress.Commands.add('filterByName', name => {
  cy.getByTestId('name-filter-autocomplete')
    .type(name)
    .type('{enter}');
});

Cypress.Commands.add('login', () => {
  window.localStorage.setItem(
    'auth-data',
    JSON.stringify({ expiresAt: 1887058578000 })
  );
});

Cypress.Commands.add('getByTestId', function(testId: string) {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('getAllByTestId', function(testId: string) {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('getByAltText', function(alt: string) {
  return cy.get(`[alt="${alt}"]`);
});

Cypress.Commands.add('getByText', function(text: string) {
  return cy.contains(text);
});
