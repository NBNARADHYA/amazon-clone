import { HttpLink } from "./links/Http";
import { AuthLink } from "./links/Auth";
import { cache } from "./Cache";
import { RefreshLink } from "./links/Refresh";
import { ApolloClient, from } from "@apollo/client";
import { ErrorLink } from "./links/Error";

export const client = new ApolloClient({
  link: from([RefreshLink, ErrorLink, AuthLink, HttpLink]),
  cache,
});
