Cypress.on("uncaught:exception", () => false);

describe("Navigation", function () {
  it("Can navigate to log in from home", function () {
    cy.visit("/");
    cy.get("a").contains("Log in").click();
    cy.location("pathname").should("eq", "/log-in");
  });

  it("Can navigate to home from home", function () {
    cy.viewport(1920, 1080);
    cy.visit("/");
    cy.get("a").contains("Home").click();
    cy.location("pathname").should("eq", "/");
  });

  it("Can navigate to home from explore", function () {
    cy.viewport(1920, 1080);
    cy.visit("/");
    cy.get("a").contains("Explore").click();
    cy.location("pathname").should("eq", "/explore");
  });

  it("Can navigate to sign up from log in", function () {
    cy.viewport(1920, 1080);
    cy.visit("/log-in");
    cy.get("a").contains("Sign up for MovieHand").click();
    cy.location("pathname").should("eq", "/sign-up");
  });

  it("Cannot navigate to new hand when not logged", function () {
    cy.viewport(1920, 1080);
    cy.visit("/");
    cy.get("a").contains("New Hand").click();
    cy.location("pathname").should("eq", "/log-in");
  });

  it("Cannot navigate to account when not logged", function () {
    cy.viewport(1920, 1080);
    cy.visit("/");
    cy.get("a").contains("Account").click();
    cy.location("pathname").should("eq", "/log-in");
  });

  it("Can navigate to hand page from home", function () {
    cy.viewport(1920, 1080);
    cy.visit("/");
    cy.get("div#hand-1").find("a#title").click();
    cy.location("pathname").should("eq", "/hand/1");
  });

  it("Can navigate to profile from hand", function () {
    cy.viewport(1920, 1080);
    cy.visit("/");
    cy.get("div#hand-1").find("a#profile").click();
    cy.url().should("include", "/profile");
  });
});
