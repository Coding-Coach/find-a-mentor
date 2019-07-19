Cypress.Commands.add('filterByName', name => {
  cy.getByTestId('name-filter-autocomplete').type('Brent M Clark{enter}', {
    force: true,
  });
});
