import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { clearCookies, login } from "../utils";

context("DNS", () => {
  beforeEach(() => {
    login();
    cy.visit(generateNewURL("/domains"));
  });

  afterEach(() => {
    clearCookies();
  });

  it("renders the correct heading", () => {
    cy.get("[data-test='section-header-title']").contains("DNS");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/domains")
    );
  });
});
