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
  cart: Array<FetchCartOutput>;
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

export type FetchCartOutput = {
  __typename?: 'FetchCartOutput';
  product: Product;
  nos: Scalars['Float'];
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

export type Order = {
  __typename?: 'Order';
  id: Scalars['Int'];
  createdAt: Scalars['Float'];
  address: Scalars['String'];
  country: Scalars['String'];
  state: Scalars['String'];
  pincode: Scalars['String'];
  city: Scalars['String'];
  products: Array<OrderContent>;
};

export type OrderContent = {
  __typename?: 'OrderContent';
  id: Scalars['ID'];
  product: Product;
  nos: Scalars['Int'];
};

export type FetchProductsOutput = {
  __typename?: 'FetchProductsOutput';
  products: Array<Product>;
  count: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginOutput;
  signUp: User;
  logout: Scalars['Boolean'];
  addToCart: Cart;
  updateCart: Scalars['Boolean'];
  createOrder: CreateOrderOutput;
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
  data: CreateOrderInput;
};


export type MutationCancelOrderArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateOrderArgs = {
  id: Scalars['Int'];
  nos: Scalars['Int'];
  product: Scalars['String'];
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

export type Cart = {
  __typename?: 'Cart';
  id: Scalars['ID'];
  email: Scalars['String'];
  product: Scalars['String'];
  nos?: Maybe<Scalars['Int']>;
};

export type ProductInput = {
  product: Scalars['String'];
  nos?: Maybe<Scalars['Int']>;
};

export type UpdateCartInput = {
  product: Scalars['String'];
  nos: Scalars['Int'];
};

export type CreateOrderOutput = {
  __typename?: 'CreateOrderOutput';
  id: Scalars['Int'];
  createdAt: Scalars['Float'];
};

export type CreateOrderInput = {
  products: Array<ProductInput>;
  checkout: Scalars['Boolean'];
  address: Scalars['String'];
  country: Scalars['String'];
  state: Scalars['String'];
  pincode: Scalars['String'];
  city: Scalars['String'];
};

export type AddToCartMutationVariables = Exact<{
  cart: ProductInput;
}>;


export type AddToCartMutation = (
  { __typename?: 'Mutation' }
  & { addToCart: (
    { __typename?: 'Cart' }
    & Pick<Cart, 'id' | 'email' | 'product' | 'nos'>
  ) }
);

export type UpdateCartMutationVariables = Exact<{
  cart: UpdateCartInput;
}>;


export type UpdateCartMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateCart'>
);

export type CartQueryVariables = Exact<{ [key: string]: never; }>;


export type CartQuery = (
  { __typename?: 'Query' }
  & { cart: Array<(
    { __typename?: 'FetchCartOutput' }
    & Pick<FetchCartOutput, 'nos'>
    & { product: (
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'name' | 'price' | 'currency' | 'imageUrl'>
    ) }
  )> }
);

export type CreateOrderMutationVariables = Exact<{
  data: CreateOrderInput;
}>;


export type CreateOrderMutation = (
  { __typename?: 'Mutation' }
  & { createOrder: (
    { __typename?: 'CreateOrderOutput' }
    & Pick<CreateOrderOutput, 'id' | 'createdAt'>
  ) }
);

export type UpdateOrderMutationVariables = Exact<{
  id: Scalars['Int'];
  nos: Scalars['Int'];
  product: Scalars['String'];
}>;


export type UpdateOrderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateOrder'>
);

export type CancelOrderMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CancelOrderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'cancelOrder'>
);

export type OrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type OrdersQuery = (
  { __typename?: 'Query' }
  & { orders: Array<(
    { __typename?: 'Order' }
    & Pick<Order, 'id' | 'createdAt' | 'country' | 'state' | 'pincode' | 'city' | 'address'>
    & { products: Array<(
      { __typename?: 'OrderContent' }
      & Pick<OrderContent, 'nos'>
      & { product: (
        { __typename?: 'Product' }
        & Pick<Product, 'id' | 'name' | 'price' | 'currency' | 'imageUrl'>
      ) }
    )> }
  )> }
);

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

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginOutput' }
    & Pick<LoginOutput, 'email' | 'firstName' | 'lastName' | 'accessToken'>
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);


export const AddToCartDocument = gql`
    mutation AddToCart($cart: ProductInput!) {
  addToCart(cart: $cart) {
    id
    email
    product
    nos
  }
}
    `;
export type AddToCartMutationFn = Apollo.MutationFunction<AddToCartMutation, AddToCartMutationVariables>;

/**
 * __useAddToCartMutation__
 *
 * To run a mutation, you first call `useAddToCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToCartMutation, { data, loading, error }] = useAddToCartMutation({
 *   variables: {
 *      cart: // value for 'cart'
 *   },
 * });
 */
export function useAddToCartMutation(baseOptions?: Apollo.MutationHookOptions<AddToCartMutation, AddToCartMutationVariables>) {
        return Apollo.useMutation<AddToCartMutation, AddToCartMutationVariables>(AddToCartDocument, baseOptions);
      }
export type AddToCartMutationHookResult = ReturnType<typeof useAddToCartMutation>;
export type AddToCartMutationResult = Apollo.MutationResult<AddToCartMutation>;
export type AddToCartMutationOptions = Apollo.BaseMutationOptions<AddToCartMutation, AddToCartMutationVariables>;
export const UpdateCartDocument = gql`
    mutation UpdateCart($cart: UpdateCartInput!) {
  updateCart(cart: $cart)
}
    `;
export type UpdateCartMutationFn = Apollo.MutationFunction<UpdateCartMutation, UpdateCartMutationVariables>;

/**
 * __useUpdateCartMutation__
 *
 * To run a mutation, you first call `useUpdateCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCartMutation, { data, loading, error }] = useUpdateCartMutation({
 *   variables: {
 *      cart: // value for 'cart'
 *   },
 * });
 */
export function useUpdateCartMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCartMutation, UpdateCartMutationVariables>) {
        return Apollo.useMutation<UpdateCartMutation, UpdateCartMutationVariables>(UpdateCartDocument, baseOptions);
      }
export type UpdateCartMutationHookResult = ReturnType<typeof useUpdateCartMutation>;
export type UpdateCartMutationResult = Apollo.MutationResult<UpdateCartMutation>;
export type UpdateCartMutationOptions = Apollo.BaseMutationOptions<UpdateCartMutation, UpdateCartMutationVariables>;
export const CartDocument = gql`
    query Cart {
  cart {
    nos
    product {
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
 * __useCartQuery__
 *
 * To run a query within a React component, call `useCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCartQuery({
 *   variables: {
 *   },
 * });
 */
export function useCartQuery(baseOptions?: Apollo.QueryHookOptions<CartQuery, CartQueryVariables>) {
        return Apollo.useQuery<CartQuery, CartQueryVariables>(CartDocument, baseOptions);
      }
export function useCartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CartQuery, CartQueryVariables>) {
          return Apollo.useLazyQuery<CartQuery, CartQueryVariables>(CartDocument, baseOptions);
        }
export type CartQueryHookResult = ReturnType<typeof useCartQuery>;
export type CartLazyQueryHookResult = ReturnType<typeof useCartLazyQuery>;
export type CartQueryResult = Apollo.QueryResult<CartQuery, CartQueryVariables>;
export const CreateOrderDocument = gql`
    mutation CreateOrder($data: CreateOrderInput!) {
  createOrder(data: $data) {
    id
    createdAt
  }
}
    `;
export type CreateOrderMutationFn = Apollo.MutationFunction<CreateOrderMutation, CreateOrderMutationVariables>;

/**
 * __useCreateOrderMutation__
 *
 * To run a mutation, you first call `useCreateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderMutation, { data, loading, error }] = useCreateOrderMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrderMutation, CreateOrderMutationVariables>) {
        return Apollo.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument, baseOptions);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = Apollo.MutationResult<CreateOrderMutation>;
export type CreateOrderMutationOptions = Apollo.BaseMutationOptions<CreateOrderMutation, CreateOrderMutationVariables>;
export const UpdateOrderDocument = gql`
    mutation UpdateOrder($id: Int!, $nos: Int!, $product: String!) {
  updateOrder(id: $id, nos: $nos, product: $product)
}
    `;
export type UpdateOrderMutationFn = Apollo.MutationFunction<UpdateOrderMutation, UpdateOrderMutationVariables>;

/**
 * __useUpdateOrderMutation__
 *
 * To run a mutation, you first call `useUpdateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderMutation, { data, loading, error }] = useUpdateOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      nos: // value for 'nos'
 *      product: // value for 'product'
 *   },
 * });
 */
export function useUpdateOrderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderMutation, UpdateOrderMutationVariables>) {
        return Apollo.useMutation<UpdateOrderMutation, UpdateOrderMutationVariables>(UpdateOrderDocument, baseOptions);
      }
export type UpdateOrderMutationHookResult = ReturnType<typeof useUpdateOrderMutation>;
export type UpdateOrderMutationResult = Apollo.MutationResult<UpdateOrderMutation>;
export type UpdateOrderMutationOptions = Apollo.BaseMutationOptions<UpdateOrderMutation, UpdateOrderMutationVariables>;
export const CancelOrderDocument = gql`
    mutation CancelOrder($id: Int!) {
  cancelOrder(id: $id)
}
    `;
export type CancelOrderMutationFn = Apollo.MutationFunction<CancelOrderMutation, CancelOrderMutationVariables>;

/**
 * __useCancelOrderMutation__
 *
 * To run a mutation, you first call `useCancelOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelOrderMutation, { data, loading, error }] = useCancelOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelOrderMutation(baseOptions?: Apollo.MutationHookOptions<CancelOrderMutation, CancelOrderMutationVariables>) {
        return Apollo.useMutation<CancelOrderMutation, CancelOrderMutationVariables>(CancelOrderDocument, baseOptions);
      }
export type CancelOrderMutationHookResult = ReturnType<typeof useCancelOrderMutation>;
export type CancelOrderMutationResult = Apollo.MutationResult<CancelOrderMutation>;
export type CancelOrderMutationOptions = Apollo.BaseMutationOptions<CancelOrderMutation, CancelOrderMutationVariables>;
export const OrdersDocument = gql`
    query Orders {
  orders {
    id
    createdAt
    country
    state
    pincode
    city
    address
    products {
      product {
        id
        name
        price
        currency
        imageUrl
      }
      nos
    }
  }
}
    `;

/**
 * __useOrdersQuery__
 *
 * To run a query within a React component, call `useOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrdersQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrdersQuery(baseOptions?: Apollo.QueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
        return Apollo.useQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, baseOptions);
      }
export function useOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
          return Apollo.useLazyQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, baseOptions);
        }
export type OrdersQueryHookResult = ReturnType<typeof useOrdersQuery>;
export type OrdersLazyQueryHookResult = ReturnType<typeof useOrdersLazyQuery>;
export type OrdersQueryResult = Apollo.QueryResult<OrdersQuery, OrdersQueryVariables>;
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
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    email
    firstName
    lastName
    accessToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;