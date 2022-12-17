import { faker } from "@faker-js/faker";

const username = faker.internet.email();
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();

Cypress.on("uncaught:exception", () => false);

describe("HandPage", function () {
  it("Renders correctly", function () {
    cy.visit("/hand/1");
    cy.get("[data-testid=title]").should("exist");
    cy.get("[data-testid=cards]").should("exist");
    cy.get("[data-testid=profile]").should("exist");
    cy.get("[data-cy=return]").should("exist");
  });

  it("Comment form not rendered when not logged", function () {
    cy.visit("/hand/1");
    cy.get("[data-testid=body]").should("not.exist");
  });

  it("Comment form rendered when logged", function () {
    cy.logIn("gary.cole@example.com", "pAssw0rd");
    cy.visit("/hand/1");
    cy.get("[data-testid=body]").should("exist");
  });
});
