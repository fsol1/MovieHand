// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const addUser = (username, firstName, lastName) => {
  cy.intercept("POST", "sign_up").as("signUp");

  cy.visit("/sign-up");
  cy.get("input#username").type(username);
  cy.get("input#firstname").type(firstName);
  cy.get("input#lastname").type(lastName);
  cy.get("input#password1").type("pAssw0rde", { log: false });
  cy.get("input#password2").type("pAssw0rde", { log: false });
  cy.get("button#signup").click();

  cy.wait("@signUp");
  cy.location("pathname").should("eq", "/log-in");
};

const logIn = (username, password = "pAssw0rde") => {
  cy.intercept("POST", "log_in").as("logIn");

  cy.visit("/log-in");
  cy.get("input#username").type(username);
  cy.get("input#password").type(password, { log: false });
  cy.get("button#login").click();

  cy.wait("@logIn");
};

Cypress.Commands.add("addUser", addUser);
Cypress.Commands.add("logIn", logIn);
