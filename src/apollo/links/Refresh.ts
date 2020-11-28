import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode, { JwtPayload } from "jwt-decode";

export const RefreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return true;
    }

    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      return !(Date.now() >= exp! * 1000);
    } catch (error) {
      return true;
    }
  },
  fetchAccessToken: () => {
    return fetch("http://localhost:5000/refresh_token", {
      method: "POST",
      credentials: "include",
    });
  },
  handleFetch: (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
  },
  handleError: () => {
    console.warn("Your refresh token is invalid. Try to relogin");
    localStorage.removeItem("accessToken");
    window.location.href = "http://localhost:3000/login";
  },
});
