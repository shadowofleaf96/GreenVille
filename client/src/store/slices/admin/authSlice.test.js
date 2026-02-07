import { describe, it, expect } from "vitest";
import reducer, { loginSuccess, logout, setUser, setVendor } from "./authSlice";

describe("Admin authSlice reducer", () => {
  const initialState = {
    admin: null,
    adminToken: null,
    vendor: null,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle loginSuccess", () => {
    const payload = {
      admin: { id: "1", email: "admin@example.com", role: "admin" },
      adminToken: "admin-token-123",
    };
    const nextState = reducer(initialState, loginSuccess(payload));
    expect(nextState.admin).toEqual(payload.admin);
    expect(nextState.adminToken).toBe(payload.adminToken);
  });

  it("should handle logout", () => {
    const loggedInState = {
      admin: { id: "1", email: "admin@example.com" },
      adminToken: "token",
      vendor: null,
    };
    const nextState = reducer(loggedInState, logout());
    expect(nextState.admin).toBe(null);
    expect(nextState.adminToken).toBe(null);
  });

  it("should handle setUser", () => {
    const user = { id: "1", email: "user@example.com", role: "vendor" };
    const nextState = reducer(initialState, setUser(user));
    expect(nextState.admin).toEqual(user);
  });

  it("should handle setVendor", () => {
    const vendor = { id: "v1", store_name: "Test Store" };
    const nextState = reducer(initialState, setVendor(vendor));
    expect(nextState.vendor).toEqual(vendor);
  });
});
