import { onError } from "@apollo/client/link/error";

export const ErrorLink = onError(
  ({ graphQLErrors, networkError, forward, operation }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
        if (message.includes("NOT_AUTHORIZED")) {
          window.location.href = `${process.env.REACT_APP_CLIENT_HOST}/login`;
        }
      });

    if (networkError) console.log(`[Network error]: ${networkError}`);

    return forward(operation);
  }
);
