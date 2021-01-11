const { cy } = global;

describe('Buttons', () => {
  it('renders the primary button', () => {
    cy.visit('localhost:6006/iframe.html?id=button--primary');
    cy.get('#root').within(() => {
      cy.get('button').should('have.text', 'Primary');
    });
  });
  it('renders the secondary button', () => {
    cy.visit('localhost:6006/iframe.html?id=button--secondary');
    cy.get('#root').within(() => {
      cy.get('button').should('have.text', 'Secondary');
    });
  });
  it('renders the danger button', () => {
    cy.visit('localhost:6006/iframe.html?id=button--danger');
    cy.get('#root').within(() => {
      cy.get('button').should('have.text', 'Danger');
    });
  });
});
