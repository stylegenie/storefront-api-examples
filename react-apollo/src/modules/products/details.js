import React, { Component } from 'react';
import { Query, compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Product from '../../components/Product';
import Cart from '../../components/Cart';
import {
    createCheckout,
    checkoutLineItemsAdd,
    checkoutLineItemsUpdate,
    checkoutLineItemsRemove,
    checkoutCustomerAssociate,
    addVariantToCart,
    updateLineItemInCart,
    removeLineItemInCart,
    associateCustomerCheckout
  } from '../../checkout';

class details extends Component {
constructor(props){
    super(props);
    
    const retrieved = this.props.match.params.handle;
    this.state = {
        isCartOpen: false,
        handle: retrieved,
        checkout: { lineItems: { edges: [] } }
      };
  
this.handleCartClose = this.handleCartClose.bind(this);
      this.handleCartOpen = this.handleCartOpen.bind(this);
      this.addVariantToCart = addVariantToCart.bind(this);
      this.updateLineItemInCart = updateLineItemInCart.bind(this);
      this.removeLineItemInCart = removeLineItemInCart.bind(this);
      this.associateCustomerCheckout = associateCustomerCheckout.bind(this);
}

componentWillMount() {
    this.props.createCheckout({
      variables: {
        input: {}
      }}).then((res) => {
      this.setState({
        checkout: res.data.checkoutCreate.checkout
      });
    });
  }

handleCartOpen() {
    this.setState({
      isCartOpen: true,
    });
  }

  handleCartClose() {
    this.setState({
      isCartOpen: false,
    });
  }
  
render(){
const handle = this.state.handle;
    const query = gql`
query productByHandle($handle: String!){
productByHandle(handle: $handle){
    id
    title
    handle
    description
    options {
      id
      name
      values
    }
    variants(first: 250) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          title
          selectedOptions {
            name
            value
          }
          image {
            src
          }
          price
        }
      }
    }
    images(first: 250) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          src
        }
      }
    }
  }
}`;

    return (<Query query={query}  variables={{handle: handle}}>
    {({ data, loading, error, refetch }) => {
      if (loading) {
        return (
          <div className="flex w-100 h-100 items-center justify-center pt7">
            <div>Loading ...</div>
          </div>
        )
      }

      if (error) {
        return (
          <div className="flex w-100 h-100 items-center justify-center pt7">
            <div>An unexpected error occured.</div>
          </div>
        )
      }

return(<div>
    {!this.state.isCartOpen &&
        <div className="App__view-cart-wrapper">
          <button className="App__view-cart" onClick={()=> this.setState({isCartOpen: true})}>Cart</button>
        </div>
      }

<Product addVariantToCart={this.addVariantToCart} checkout={this.state.checkout} key={data.productByHandle.id.toString()} product={data.productByHandle} />

{this.state.isCartOpen &&
<Cart
          removeLineItemInCart={this.removeLineItemInCart}
          updateLineItemInCart={this.updateLineItemInCart}
          checkout={this.state.checkout}
          isCartOpen={this.state.isCartOpen}
          handleCartClose={this.handleCartClose}
          customerAccessToken={this.state.customerAccessToken}
/> }
</div>);
}}
</Query>
    );

}
}

const DetailsWithMutation = compose(
    graphql(createCheckout, {name: "createCheckout"}),
    graphql(checkoutLineItemsAdd, {name: "checkoutLineItemsAdd"}),
    graphql(checkoutLineItemsUpdate, {name: "checkoutLineItemsUpdate"}),
    graphql(checkoutLineItemsRemove, {name: "checkoutLineItemsRemove"}),
    graphql(checkoutCustomerAssociate, {name: "checkoutCustomerAssociate"})
  )(details);

export default DetailsWithMutation;
