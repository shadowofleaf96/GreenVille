import { describe, it, expect } from "vitest";
import reducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setCustomer,
} from "./customerSlice";

describe("customerSlice reducer", () => {
  const initialState = {
    customer: null,
    customerToken: null,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle loginStart", () => {
    const nextState = reducer(initialState, loginStart());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it("should handle loginSuccess", () => {
    const payload = {
      customer: { id: "1", name: "John Doe" },
      token: "abc123",
    };
    const nextState = reducer(initialState, loginSuccess(payload));
    expect(nextState.loading).toBe(false);
    expect(nextState.customer).toEqual(payload.customer);
    expect(nextState.customerToken).toBe(payload.token);
  });

  it("should handle loginFailure", () => {
    const error = "Invalid credentials";
    const nextState = reducer(initialState, loginFailure(error));
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(error);
  });

  it("should handle logout", () => {
    const loggedInState = {
      customer: { id: "1" },
      customerToken: "token",
      loading: false,
      error: null,
    };
    const nextState = reducer(loggedInState, logout());
    expect(nextState.customer).toBe(null);
    expect(nextState.customerToken).toBe(null);
  });

  it("should handle setCustomer", () => {
    const customer = { id: "1", name: "Jane Doe" };
    const nextState = reducer(initialState, setCustomer(customer));
    expect(nextState.customer).toEqual(customer);
    expect(nextState.loading).toBe(false);
  });
});
