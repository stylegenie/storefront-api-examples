import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import './app.css';
import CustomerAuthWithMutation from './components/CustomerAuth';
import {
  NavLink,
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

const httpLink = createHttpLink({ uri: 'https://stylegenie-test-ph.myshopify.com/api/graphql' })

const middlewareLink = setContext(() => ({
  headers: {
    'X-Shopify-Storefront-Access-Token': 'a5703a74020193f3087b63be04658ca1'
  }
}))

const client = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache(),
})

ReactDOM.render((
  <ApolloProvider client={client}>
      <Router>
      <Fragment>
        <nav className="pa3 pa4-ns">
          <Link
            className="link dim black b f6 f5-ns dib mr3"
            to="/"
            title="Home"
          >
            Home
          </Link>
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/login"
            title="Login"
            >
            Login
          </NavLink>
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/register"
            title="register"
          >
            Register
          </NavLink>
        </nav>
        <div className="fl w-100 pl4 pr4">
          <Switch>
          <Route exact path="/" component={App} />
            <Route exact path="/login" component={CustomerAuthWithMutation} />
            { /* 
            <Route path="/drafts" component={CustomerAuthWithMutation} />
            <Route path="/create" component={CreatePage} />
            <Route path="/post/:id" component={DetailPage} />
*/ }
          </Switch>
        </div>
      </Fragment>
    </Router>
  
  </ApolloProvider>
  ),
  document.getElementById('root')
);
