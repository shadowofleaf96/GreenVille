export const clearUserSession = (userType) => {
  if (userType === "customer" || !userType) {
    localStorage.removeItem("customer_access_token");
  }
  if (userType === "admin" || !userType) {
    localStorage.removeItem("user_access_token");
  }
  // Clear any other session-related data here
};

export const handleUnauthorized = (userType) => {
  clearUserSession(userType);
  window.location.href = userType === "admin" ? "/admin/login" : "/login";
};
