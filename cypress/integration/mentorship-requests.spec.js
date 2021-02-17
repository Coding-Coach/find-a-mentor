/* eslint-disable no-undef */
import userData from '../fixtures/users/current/get.json';
import reqData from '../fixtures/mentorship-requests/get.json';
import { STATUS } from '../../src/helpers/mentorship';

const { cy } = global;

const { data: user } = userData;
const { data: requests } = reqData;
const reqType = {
  approved: requests.find(({ status }) => status === STATUS.approved),
  rejected: requests.find(({ status }) => status === STATUS.rejected),
  new: requests.find(({ status }) => status === STATUS.new),
};

const regex = ({ mentee: { id } }) => new RegExp(`User ${id}`);

describe('Mentorship Requests', () => {
  before(function() {
    cy.login();
    cy.intercept('GET', '/users/current', { fixture: 'users/current/get' });
    cy.intercept('GET', `/mentorships/${user._id}/requests`, {
      fixture: 'mentorship-requests/get',
    });
    cy.intercept('PUT', `/mentorships/${user._id}/requests/${reqType.new.id}`, {
      fixture: 'mentorship-requests/put',
    });
    cy.visit(`/me/requests`);
  });

  // TODO enable it if possible
  // it('Should show spinner while loading requests', () => {
  //   cy.findAllByRole('status').should('exist');
  // });
  // it('got 3 requests', () => {
  //   cy.findByText('Mentorship Requests')
  //     .get('ul')
  //     .findAllByText(/User.*/)
  //     .should('exist')
  //     .should('have.length', 3);
  // });

  describe('Mentorship Content', () => {
    it('Should expand and show more details on request item click', () => {
      const errorMessage =
        'Unable to find an element by: [data-testid="request-content"]';

      cy.on('fail', err => {
        expect(err.message).to.contain(errorMessage);
      });
      
      cy.findAllByTestId('request-content');
    });
    it('Should toggle item on Click', () => {
      cy.findByText('Mentorship Requests')
        .get('ul')
        .findByText(regex(reqType.new))
        .click();

      cy.findAllByTestId('request-content');
    });
    it('Should only expand one item at a time', () => {
      const { message } = reqType.new;
      const errorMessage = `Unable to find an element with the text: ${message}`;
      cy.on('fail', err => {
        expect(err.message).to.contain(errorMessage);
      });

      cy.findByText('Mentorship Requests')
        .get('ul')
        .findByText(regex(reqType.rejected))
        .click();

      cy.findAllByTestId('request-content').within(() => {
        cy.findByText(message).should('not.exist');
      });
    });
    it('Should have Message, Background and Expectation', () => {
      cy.findAllByTestId('request-content')
        .findAllByText(/Message|Background|Expectations/)
        .should('have.length', 9);
      cy.findAllByTestId('request-content')
        .get('p')
        .then($ps => {
          // 3 for each mentorship request + 1 no My Mentorship Requests
          expect($ps).to.have.length(10);
        });
    });
  });
});
