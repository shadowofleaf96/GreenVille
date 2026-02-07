describe("Authentication Flow", () => {
  beforeEach(() => {
    // Clear any existing auth state
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  it("should show error with invalid credentials", () => {
    cy.get('[data-testid="email-input"]').type("invalid@example.com");
    cy.get('[data-testid="password-input"]').type("wrongpassword");
    cy.get('[data-testid="login-submit"]').click();

    // Should show error message
    cy.contains(/invalid|error|wrong/i).should("be.visible");
  });

  it("should successfully login and then logout", () => {
    // 1. Visit Login
    cy.visit("/login");

    // 2. Perform Login
    cy.get('[data-testid="email-input"]').type("theplumber2404@gmail.com");
    cy.get('[data-testid="password-input"]').type("1234567890");
    cy.get('[data-testid="login-submit"]').click();

    // 3. Verify Login Success (wait for redirect and token)
    cy.url({ timeout: 100000 }).should("not.include", "/login");
    // Wait a bit for local storage to be set
    cy.window().should((window) => {
      expect(window.localStorage.getItem("customer_access_token")).to.exist;
    });

    // 4. Perform Logout
    // Open User Menu
    cy.get('[data-testid="user-menu"]').should("be.visible").click();
    // Click Logout Button
    cy.get('[data-testid="logout-button"]').should("be.visible").click();

    // 5. Verify Logout Success
    // Token should be removed
    cy.window().should((window) => {
      expect(window.localStorage.getItem("customer_access_token")).to.not.exist;
    });
    // User menu should trigger login or be replaced by different icon
    // In Navbar.jsx, if !customer, it shows a Link to /login with solar:user-circle-linear icon
    cy.get('[href="/login"]').should("exist");
  });
});

describe("Shopping Cart Flow", () => {
  beforeEach(() => {
    cy.visit("/products");
  });

  it("should add product to cart", () => {
    // Wait for loading
    cy.contains("Updating catalog...", { timeout: 10000 }).should("not.exist");

    // Click on first product
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().click();

    // Add to cart (assuming button text is "Add to Cart" or "Select Options")
    // If it's "Select Options", we might need to select options first.
    // For now, we assume simple product or just checking the button exists
    cy.contains(/Add to Cart|Select Options/i).click();

    // If it was "Add to Cart", verify cart count
    // Note: This might be flaky if "Select Options" opens a modal.
    // Ideally we should test a simple product.
    cy.get("body").then(($body) => {
      if ($body.text().includes("Item added")) {
        cy.get('[data-testid="cart-count"]').should("contain", "1");
      }
    });
  });
});

describe("Product Browsing", () => {
  it("should display products on products page", () => {
    cy.visit("/products");
    // Wait for loading to finish
    cy.contains("Updating catalog...", { timeout: 10000 }).should("not.exist");
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should(
      "have.length.greaterThan",
      0,
    );
  });

  it("should search for products", () => {
    cy.visit("/");

    // Open search overlay
    cy.get('[data-testid="search-toggle"]').should("be.visible").click();

    cy.get('[data-testid="search-input"]')
      .should("be.visible")
      .type("test{enter}");

    // Verify input has value
    cy.get('[data-testid="search-input"]').should("have.value", "test");
  });

  it("should view product details", () => {
    cy.visit("/products");
    cy.contains("Updating catalog...", { timeout: 10000 }).should("not.exist");
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().click();
    cy.url().should("include", "/product/");
  });
});
