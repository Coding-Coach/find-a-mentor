Cypress.Commands.add('filterByName', name => {
  cy.getByTestId('name-filter-autocomplete')
    .type(name)
    .type('{enter}');
});
