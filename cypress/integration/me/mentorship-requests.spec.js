/* eslint-disable no-undef */
/// <reference types="cypress" />

import { userBuilder } from '../../builders/users/current/get';
import { mentorshipRequestBuilder } from '../../builders/mentorship-requests';
import { withSuccess } from '../../builders/response';

import reqData from '../../fixtures/mentorship-requests/get.json';
import { STATUS } from '../../../src/helpers/mentorship';

const response = withSuccess(userBuilder());
const { data: user } = response;
const { data: requests } = reqData;
const reqType = {
  approved: requests.find(({ status }) => status === STATUS.approved),
  rejected: requests.find(({ status }) => status === STATUS.rejected),
  new: requests.find(({ status }) => status === STATUS.new),
};

const regex = ({ mentee: { id } }) => new RegExp(`User ${id}`);

describe('Mentorship Requests', () => {
  describe('Mentor requests', () => {
    beforeEach(() => {
      cy.login();
      cy.intercept('GET', '/users/current', withSuccess(user));

      cy.intercept('GET', `/mentorships/${user._id}/requests`, {
        fixture: 'mentorship-requests/get',
      });
      cy.visit(`/me/requests`);
    });

    it('Should show spinner while loading requests', () => {
      cy.get('[role=status]').should('exist');
    });

    it('got 3 requests', () => {
      cy.findByText('Mentorship Requests')
        .get('ul')
        .findAllByText(/User.*/)
        .should('exist')
        .should('have.length', 3);
    });

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
          .should('have.length', 3);
        cy.findAllByTestId('request-content')
          .get('p')
          .then($ps => {
            // 3 for each mentorship request + 1 no My Mentorship Requests
            expect($ps).to.have.length(10);
          });
      });
    });
  });

  describe('Cancel request', () => {
    let mentorships = [
      mentorshipRequestBuilder({
        id: reqType.new.id,
        status: 'New',
        isMine: true,
      }),
    ];

    const testkit = {
      cancelButton: () => cy.get('button').contains('Cancel request'),
    };

    beforeEach(() => {
      cy.login();
      cy.intercept('GET', '/users/current', withSuccess(user));
      cy.intercept(
        'GET',
        `/mentorships/${user._id}/requests`,
        withSuccess(mentorships)
      );
      cy.intercept('PUT', `/mentorships/${user._id}/requests/789`, {
        success: true,
        // can't use withSuccess because the payload has no "data" prop (unlike other endpoints) :(
        mentorship: { status: 'Cancelled' },
      }).as('updateMentorshipStatus');
      cy.visit(`/me/requests`);

      cy.get('li')
        .contains(mentorships[0].mentor.name)
        .click();
    });

    it('should display cancel button', () => {
      testkit.cancelButton();
    });

    it('should display cancel request modal', () => {
      testkit.cancelButton().click();

      cy.get('header').contains('Cancel mentorship request');
    });

    it('should cancel the request when user clicks on cancel', () => {
      testkit.cancelButton().click();
      cy.get('button')
        .contains(/^Cancel$/)
        .click();
      cy.wait('@updateMentorshipStatus');

      cy.get('[role=status]').contains(/^Cancelled$/);
    });
  });
});
