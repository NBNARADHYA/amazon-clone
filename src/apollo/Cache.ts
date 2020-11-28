import {
  FieldMergeFunction,
  FieldReadFunction,
  InMemoryCache,
} from "@apollo/client";
import { FetchProductsOutput } from "../generated/graphql";

const merge: FieldMergeFunction<FetchProductsOutput, FetchProductsOutput> = (
  existing = { count: 0, products: [] },
  incoming,
  { args }
) => {
  let products = [...existing.products];
  if (args!.skip >= products.length) {
    products = [
      ...products,
      ...Array(args!.skip - products.length).fill({}),
      ...incoming.products,
    ];
  } else {
    products = [
      ...products.slice(0, args!.skip),
      ...incoming.products,
      ...products.slice(args!.skip + args!.take),
    ];
  }
  return { count: incoming.count, products };
};

const read: FieldReadFunction<FetchProductsOutput, FetchProductsOutput> = (
  existing,
  { args }
) => {
  if (
    !existing ||
    !existing.products[args!.skip] ||
    existing.products[args!.skip].id
  ) {
    return undefined;
  }
  return {
    count: existing.count,
    products: existing.products.slice(args!.skip, args!.skip + args!.take),
  };
};

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          keyArgs: ["category", "order"],
          merge,
          read,
        },
      },
    },
  },
});
