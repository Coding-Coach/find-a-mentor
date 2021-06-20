describe('Me / home', () => {
  before(() => {
    cy.intercept('GET', '/mentors?limit=*', { fixture: 'mentors/get' });
    cy.intercept('GET', '/users/current', { fixture: 'users/current/get' });
    cy.login();
    cy.visit('/me');
  });

  describe('Avatar', () => {
    it('should present user avatar', () => {
      cy.get(`img[alt="brentmclark@gmail.com"]`);
    });
  });

  describe('Details', () => {
    it('should present user details', () => {
      cy.getByTestId('email-label').should(
        'have.text',
        'brentmclark@gmail.com'
      );
    });
  });
});
