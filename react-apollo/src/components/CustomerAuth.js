import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

class CustomerAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      nonFieldErrorMessage: null,
      firstNameErrorMessage: null,
      lastNameErrorMessage: null,
      emailErrorMessage: null,
      passwordErrorMessage: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.createCustomerAccount = this.createCustomerAccount.bind(this);
    this.resetErrorMessages = this.resetErrorMessages.bind(this);
    this.resetInputFields = this.resetInputFields.bind(this);
  }

  static propTypes = {
    customerCreate: PropTypes.func.isRequired,
    customerAccessTokenCreate: PropTypes.func.isRequired,
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  resetErrorMessages(){
    this.setState({
      nonFieldErrorMessage: null,
      emailErrorMessage: null,
      passwordErrorMessage: null
    });
  }

  resetInputFields(){
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
  }

  handleSubmit(email, password, firstName=null, lastName = null){
    this.resetErrorMessages();
    if (this.props.newCustomer) {
      this.createCustomerAccount(firstName, lastName, email, password)
    } else {
      this.loginCustomerAccount(email, password)
    }
  }

  createCustomerAccount(firstName, lastName, email, password){
    const input = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }
    this.props.customerCreate(
      { variables: { input }
      }).then((res) => {
        if (res.data.customerCreate.customer){
           //this.props.closeCustomerAuth();
           //this.props.showAccountVerificationMessage();
        } else {
          res.data.customerCreate.userErrors.forEach(function (error) {
            if (error.field) {
              this.setState({
                [error.field + "ErrorMessage"]: error.message
              });
            } else {
              this.setState({
                nonFieldErrorMessage: error.message
              });
            }
          }.bind(this));
        }
    });
  }

  loginCustomerAccount(email, password){
    const input = {
      email: email,
      password: password
    }
    this.props.customerAccessTokenCreate(
      { variables: { input }
      }).then((res) => {
      if (res.data.customerAccessTokenCreate.customerAccessToken) {
        //this.props.associateCustomerCheckout(res.data.customerAccessTokenCreate.customerAccessToken.accessToken);
      } else {
        res.data.customerAccessTokenCreate.userErrors.forEach(function (error) {
          if (error.field != null) {
            this.setState({
              [error.field + "ErrorMessage"]: error.message
            });
          } else {
            this.setState({
              nonFieldErrorMessage: error.message
            });
          }
        }.bind(this));
      }
    });
  }

  render() {
    return (<div>
        <div className="CustomerAuth__body">
          <h2 className="CustomerAuth__heading">{this.props.newCustomer ? 'Create your Account' : 'Log in to your account'}</h2>
          {this.state.nonFieldErrorMessage &&
            <div className="error">{this.state.nonFieldErrorMessage}</div>
          }
                    
                    {this.props.newCustomer && <div>
          <div>
          <label className="CustomerAuth__credential">First Name: </label>
            <input className="CustomerAuth__input" type="text" placeholder="John" name={"firstName"} value={this.state.firstName} onChange={this.handleInputChange}></input>
            {this.state.firstNameErrorMessage &&
              <div className="error">{this.state.firstNameErrorMessage}</div>
            }
          </div>

<div>
<label className="CustomerAuth__credential">Last Name: </label>
  <input className="CustomerAuth__input" type="text" placeholder="Doe" name={"lastName"} value={this.state.lastName} onChange={this.handleInputChange}></input>
  {this.state.lastNameErrorMessage &&
    <div className="error">{this.state.lastNameErrorMessage}</div>
  }
</div>
</div>}

          <div>
          <label className="CustomerAuth__credential">E-mail: </label>
            <input className="CustomerAuth__input" type="email" placeholder="john.doe@example.com" name={"email"} value={this.state.email} onChange={this.handleInputChange}></input>
            {this.state.emailErrorMessage &&
              <div className="error">{this.state.emailErrorMessage}</div>
            }
          </div>
          <div>
          <label className="CustomerAuth__credential">Password: </label>
            <input className="CustomerAuth__input" type="password" placeholder="********" name={"password"} value={this.state.password} onChange={this.handleInputChange}></input>
            {this.state.passwordErrorMessage &&
              <div className="error">{this.state.passwordErrorMessage}</div>
            }
          </div>
          <button className="CustomerAuth__submit button" type="submit" onClick={() => this.handleSubmit(this.state.email, this.state.password)}>{this.props.newCustomer ? 'Create Account' : 'Log in'}</button>
        </div>
      </div>
          )
  }
}

const customerCreate = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      userErrors {
        field
        message
      }
      customer {
        id
      }
    }
  }
`;

const customerAccessTokenCreate = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      userErrors {
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;

const CustomerAuthWithMutation = compose(
  graphql(customerCreate, {name: "customerCreate"}),
  graphql(customerAccessTokenCreate, {name: "customerAccessTokenCreate"})
)(CustomerAuth);

export default CustomerAuthWithMutation;
