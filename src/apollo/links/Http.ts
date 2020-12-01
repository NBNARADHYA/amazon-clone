import { HttpLink as HTTPLINK } from "@apollo/client";

export const HttpLink = new HTTPLINK({
  uri: `${process.env.REACT_APP_SERVER_HOST}/graphql`,
  credentials: "include",
});
