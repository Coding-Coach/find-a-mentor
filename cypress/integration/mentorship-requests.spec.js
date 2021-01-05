/* eslint-disable no-undef */
import userData from '../fixtures/users/current/get.json';
import reqData from '../fixtures/mentorship-requests/get.json';

const { cy } = global;

const { data: user } = userData;
const { data } = reqData;
const reqType = {
  approved: data.find(({ status }) => status === 'Approved'),
  rejected: data.find(({ status }) => status === 'Rejected'),
  pending: data.find(({ status }) => status === 'Pending'),
};

const regex = ({ user: { id } }) => new RegExp(`User ${id}`);

describe('Mentorship Requests', () => {
  before(function() {
    cy.login();
    cy.server({ urlMatchingOptions: { matchBase: false, dot: true } });
    cy.intercept('GET', '/users/current', { fixture: 'users/current/get' });
    cy.intercept('GET', `/mentorship/${user.id}/requests`, {
      fixture: 'mentorship-requests/get',
    });
    cy.visit(`/me/requests`);
  });

  it('Should show spinner while loading requests', () => {
    cy.findByRole('status').should('exist');
  });
  it('got 3 requests', () => {
    cy.findByTestId('mentorship-req')
      .get('ul')
      .findAllByText(/User.*/)
      .should('exist')
      .should('have.length', 3);
  });

  describe('Mentorship Content', () => {
    beforeEach(() => {
      cy.findByTestId('mentorship-req')
        .get('ul')
        .findByText(regex(reqType.pending))
        .click();
    });
    it('Should expand and show more details on request item click', () => {
      cy.findByTestId('request-content');
    });
    it('Should toggle item on Click', () => {
      const errorMessage =
        'Unable to find an element by: [data-testid="request-content"]';

      cy.on('fail', err => {
        expect(err.message).to.contain(errorMessage);
      });

      cy.findByTestId('mentorship-req')
        .get('ul')
        .findByText(regex(reqType.pending))
        .click();

      cy.findByTestId('request-content');
    });
    it('Should only expand one item at a time', () => {
      const { message } = reqType.pending;
      const errorMessage = `Unable to find an element with the text: ${message}`;
      cy.on('fail', err => {
        expect(err.message).to.contain(errorMessage);
      });

      cy.findByTestId('mentorship-req')
        .get('ul')
        .findByText(regex(reqType.rejected))
        .click();

      cy.findByTestId('request-content').within(() => {
        cy.findByText(message).should('not.exist');
      });
    });
    it('Should have Message, Background and Expectation with at least 20 char', () => {
      cy.findByTestId('request-content')
        .findAllByText(/Message|Background|Expectations/)
        .should('have.length', 3);
      cy.findByTestId('request-content')
        .get('p')
        .each($p => {
          return expect($p.get(0).innerText).to.match(/(.{20,})$/gm);
        })
        .then($ps => {
          expect($ps).to.have.length(3);
        });
    });
  });
});
