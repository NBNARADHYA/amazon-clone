import { HttpLink as HTTPLINK } from "@apollo/client";

export const HttpLink = new HTTPLINK({
  uri: "http://localhost:5000/graphql",
  credentials: "include",
});
