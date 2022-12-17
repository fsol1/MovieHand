import { faker } from "@faker-js/faker";

const username = faker.internet.email();
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();

Cypress.on("uncaught:exception", () => false);

describe("Authentication", function () {
  it("Can sign up.", function () {
    cy.addUser(username, firstName, lastName);
  });

  it("Cannot visit the sign up page when logged in.", function () {
    cy.logIn(username);
    cy.visit("/sign-up");
    cy.location("pathname").should("eq", "/");
  });

  it("Can log out.", function () {
    cy.logIn(username);
    cy.get('[data-cy="logOut"]')
      .click()
      .should(() => {
        expect(window.localStorage.getItem("movie.auth")).to.be.null;
      });
    cy.get('[data-cy="logOut"]').should("not.exist");
  });

  it("Can log in.", function () {
    cy.logIn(username);
    cy.location("pathname").should("eq", "/");
  });

  it("Cannot visit the login page when logged in.", function () {
    cy.logIn(username);
    cy.visit("/log-in");
    cy.location("pathname").should("eq", "/");
  });
});
