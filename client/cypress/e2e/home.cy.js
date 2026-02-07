describe("Home Page", () => {
  it("loads successfully", () => {
    cy.visit("/");
    // Check if the page title or a key element is present
    // Adjust selector based on your actual application
    cy.get("nav").should("be.visible");
  });
});
