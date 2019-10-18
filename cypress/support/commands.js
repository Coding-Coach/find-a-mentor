Cypress.Commands.add('filterByName', name => {
  cy.getByTestId('name-filter-autocomplete')
    .type(name)
    .type('{enter}');
});

Cypress.Commands.add('login', () => {
  window.localStorage.setItem('auth-data', JSON.stringify({expiresAt: 1887058578000}))
})
