import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  cart: Array<Cart>;
  orders: Array<Order>;
  products: FetchProductsOutput;
  product: Product;
};


export type QueryProductsArgs = {
  category: Scalars['String'];
  order?: Maybe<Scalars['Int']>;
  skip: Scalars['Int'];
  take: Scalars['Int'];
  search?: Maybe<Scalars['String']>;
};


export type QueryProductArgs = {
  id: Scalars['String'];
};

export type Cart = {
  __typename?: 'Cart';
  id: Scalars['ID'];
  email: Scalars['String'];
  productId: Scalars['String'];
  nos?: Maybe<Scalars['Int']>;
  priceForOne: Scalars['Int'];
};

export type Order = {
  __typename?: 'Order';
  id: Scalars['ID'];
  products: Array<OrderContent>;
};

export type OrderContent = {
  __typename?: 'OrderContent';
  id: Scalars['ID'];
  productId: Scalars['String'];
  priceForOne: Scalars['Int'];
  nos: Scalars['Int'];
};

export type FetchProductsOutput = {
  __typename?: 'FetchProductsOutput';
  products: Array<Product>;
  count: Scalars['Int'];
};

export type Product = {
  __typename?: 'Product';
  crawlTimeStamp?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  nameSource?: Maybe<Scalars['String']>;
  retailer?: Maybe<Scalars['String']>;
  category: Scalars['String'];
  brand?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  price?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  contents?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginOutput;
  signUp: User;
  logout: Scalars['Boolean'];
  addToCart: Cart;
  updateCart: Scalars['Boolean'];
  createOrder: Array<OrderContent>;
  cancelOrder: Scalars['Boolean'];
  updateOrder: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpArgs = {
  user: SignUpInputType;
};


export type MutationAddToCartArgs = {
  cart: ProductInput;
};


export type MutationUpdateCartArgs = {
  cart: UpdateCartInput;
};


export type MutationCreateOrderArgs = {
  products: Array<ProductInput>;
};


export type MutationCancelOrderArgs = {
  id: Scalars['Float'];
};


export type MutationUpdateOrderArgs = {
  id: Scalars['Float'];
  nos: Scalars['Int'];
  productId: Scalars['String'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  accessToken: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
};

export type SignUpInputType = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
};

export type ProductInput = {
  productId: Scalars['String'];
  nos?: Maybe<Scalars['Int']>;
  priceForOne: Scalars['Int'];
};

export type UpdateCartInput = {
  productId: Scalars['String'];
  nos: Scalars['Int'];
};

export type ProductsQueryVariables = Exact<{
  category: Scalars['String'];
  order?: Maybe<Scalars['Int']>;
  skip: Scalars['Int'];
  take: Scalars['Int'];
  search?: Maybe<Scalars['String']>;
}>;


export type ProductsQuery = (
  { __typename?: 'Query' }
  & { products: (
    { __typename?: 'FetchProductsOutput' }
    & Pick<FetchProductsOutput, 'count'>
    & { products: Array<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'name' | 'price' | 'currency' | 'imageUrl'>
    )> }
  ) }
);

export type ProductQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ProductQuery = (
  { __typename?: 'Query' }
  & { product: (
    { __typename?: 'Product' }
    & Pick<Product, 'crawlTimeStamp' | 'id' | 'nameSource' | 'retailer' | 'category' | 'brand' | 'name' | 'price' | 'url' | 'description' | 'currency' | 'imageUrl' | 'tags' | 'contents'>
  ) }
);

export type SignUpMutationVariables = Exact<{
  user: SignUpInputType;
}>;


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { signUp: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>
  ) }
);


export const ProductsDocument = gql`
    query Products($category: String!, $order: Int, $skip: Int!, $take: Int!, $search: String) {
  products(
    category: $category
    order: $order
    skip: $skip
    take: $take
    search: $search
  ) {
    count
    products {
      id
      name
      price
      currency
      imageUrl
    }
  }
}
    `;

/**
 * __useProductsQuery__
 *
 * To run a query within a React component, call `useProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      order: // value for 'order'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useProductsQuery(baseOptions: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
        return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, baseOptions);
      }
export function useProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, baseOptions);
        }
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<typeof useProductsLazyQuery>;
export type ProductsQueryResult = Apollo.QueryResult<ProductsQuery, ProductsQueryVariables>;
export const ProductDocument = gql`
    query Product($id: String!) {
  product(id: $id) {
    crawlTimeStamp
    id
    nameSource
    retailer
    category
    brand
    name
    price
    url
    description
    currency
    imageUrl
    tags
    contents
  }
}
    `;

/**
 * __useProductQuery__
 *
 * To run a query within a React component, call `useProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductQuery(baseOptions: Apollo.QueryHookOptions<ProductQuery, ProductQueryVariables>) {
        return Apollo.useQuery<ProductQuery, ProductQueryVariables>(ProductDocument, baseOptions);
      }
export function useProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductQuery, ProductQueryVariables>) {
          return Apollo.useLazyQuery<ProductQuery, ProductQueryVariables>(ProductDocument, baseOptions);
        }
export type ProductQueryHookResult = ReturnType<typeof useProductQuery>;
export type ProductLazyQueryHookResult = ReturnType<typeof useProductLazyQuery>;
export type ProductQueryResult = Apollo.QueryResult<ProductQuery, ProductQueryVariables>;
export const SignUpDocument = gql`
    mutation SignUp($user: SignUpInputType!) {
  signUp(user: $user) {
    id
    email
    firstName
    lastName
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, baseOptions);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;