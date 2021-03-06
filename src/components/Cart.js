import React from 'react';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Container, Button, Form } from 'semantic-ui-react';
import { fetchUserSuccess } from '../actions/user';
import { fetchOrderSuccess} from '../actions/order_items';
import CartScores from './CartScores';
import { orderSubmitSuccess } from '../actions/order';
import { clearCartSuccess } from '../actions/order_items';
import { currentUser } from '../actions/user';
import { removeItemSuccess } from '../actions/order_items'

import "./styling.css";
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';



const CardField = ({onChange}) => (
    <div >
      <CardElement  onChange={onChange} />
    </div>
  );

const Field = ({
    label,
    id,
    type,
    placeholder,
    required,
    autoComplete,
    value,
    onChange,
  }) => (
    <div className="FormRow">
      <label htmlFor={id} className="FormRowLabel">
        {label}
      </label>
      <input
      style={{marginBottom:"10px"}}
        
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
      />
    </div>
  );

const Cart = ({user, currentUser, history, order_items, orderSubmitSuccess, clearCartSuccess, fetchUserSuccess, fetchOrderSuccess, score, removeItemSuccess}) => {

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [ setCardComplete] = useState(false);
    const [processing] = useState(false); //setProcessing
    // const [paymentMethod, setPaymentMethod] = useState(null);
    const [billingDetails, setBillingDetails] = useState({
        email: 'abcdefg@gmail.com',
        phone: '123-456-7890',
        name: 'abcdefg',
      });
        


      // let idArr = order_items.filter(obj => obj.score_id === score.id)
      // let id = idArr[0].id
      
      
      
      
          const removeItems = () => {
              const reqObj = {
                  method: 'DELETE', 
                }
                
                fetch (`http://localhost:3000/order_items/user_id=${user.id}`, reqObj)
                .then(resp => resp.json())
                .then(data => {
                    console.log(data)
                  removeItemSuccess(score.id)
                  
              })
          }






  const SubmitButton = ({processing, error, children, disabled}) => (
    <Button  
     
      className={`SubmitButton ${error ? 'SubmitButton--error' : ''}`}
      type="submit"
      disabled={processing || disabled}
    >
      {processing ? 'Processing...' : children}
    </Button>
  );

      const ErrorMessage = ({children}) => (
        <div className="ErrorMessage" role="alert">
          <svg width="16" height="16" viewBox="0 0 17 17">
            <path
              fill="#FFF"
              d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
            />
            <path
              fill="#6772e5"
              d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
            />
          </svg>
          {children}
        </div>
      );




      useEffect(() => {
          const token = localStorage.getItem('app_token')
          console.log(token)
          if (!token){
            history.push('/login')
          } else {
            const reqObj = {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              },
            }
            fetch('http://localhost:3000/current_session', reqObj)
        .then(resp => resp.json())
        .then(data => {
          if (data.user) {
            currentUser(data.user)


            fetch(`http://localhost:3000/order_items`)
            .then(resp => resp.json())
            .then(orderObj => {
                fetchOrderSuccess(orderObj)
                console.log(data.user)
                console.log(fetchOrderSuccess(orderObj))
            })
          }}
        )
          }
        }, [])
            


//old way
    const renderOrder = () => {
      let scorArr = order_items.map(scor => scor.score)
        return scorArr.map((score) => (
            <CartScores key={score.name} score={score} />
            
        ))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!stripe || !elements) {
          // Stripe.js has not loaded yet it needs to be used through HTTPS
          return;
        }
    
 
        const cardElement = elements.getElement(CardElement);
    
        const {error, paymentMethod} = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: billingDetails
        });
    
        if (error) {
          console.log('[error]', error);
        } else {
          console.log('[PaymentMethod]', paymentMethod);
          createLog()
          history.push('/order')
        }
      };

      const createLog = () => {
        
        const reqObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.id,
                total: (order_items.length * 10).toFixed(2),
                items: (order_items.map(order => order.score.name)).join(', ')
            })
        }
        fetch('http://localhost:3000/orders/', reqObj)
        .then(resp => resp.json())
        .then(order => {
            console.log(order)
            orderSubmitSuccess(order)
            alert(`Your order has been placed!`, {
                duration: 2000
              })              
            clearCartSuccess()
        })
    }

    return (
        <>
        <h1 >My Cart</h1>
        <Grid divided="vertically">
            <Grid.Row>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={6}>
                    <Container >
                        <h2 >Order Summary</h2>
                         {renderOrder()}
                    </Container>
                </Grid.Column>
                <Grid.Column width={1}></Grid.Column>
                <Grid.Column width={5}>
                    <Container >
                         <h2 >Payment</h2>
                         <Form className="Form" onSubmit={handleSubmit}>
                            <Field
                                label="Name"
                                id="name"
                                type="text"
                                placeholder="Jane Doe"
                                required
                                autoComplete="name"
                                value={billingDetails.name}
                                onChange={(e) => {
                                setBillingDetails({...billingDetails, name: e.target.value});
                                }}
                            />
                            <Field
                                label="Phone"
                                id="phone"
                                type="tel"
                                placeholder="(123) 456-7890"
                                required
                                autoComplete="tel"
                                value={billingDetails.phone}
                                onChange={(e) => {
                                    setBillingDetails({...billingDetails, phone: e.target.value});
                                }}
                            />
                            <Field
                                label="Email"
                                id="email"
                                type="email"
                                placeholder="abcdefgh@gmail.com"
                                required
                                autoComplete="email"
                                value={billingDetails.email}
                                onChange={(e) => {
                                setBillingDetails({...billingDetails, email: e.target.value});
                                }}
                            />
                             <CardField
                                onChange={(e) => {
                                setError(e.error);
                                setCardComplete(e.complete);
                                }}
                                />
                          
                         <h2 >Total: <a >${(order_items.length * 10).toFixed(2)}</a></h2>
                            {error && <ErrorMessage>{error.message}</ErrorMessage>}
                            <SubmitButton processing={processing} error={error} disabled={!stripe} onClick={removeItems} >
                                Place Order
                            </SubmitButton>
                            {/* <SubmitButton    //stop propagation//    
                            >
                                Clear Cart
                            </SubmitButton> */}
                        </Form>
                    </Container>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        order_items: state.order_items,
        order: state.order,
        user: state.user
    }
}

const mapDispatchToProps = {
  orderSubmitSuccess,
    clearCartSuccess,
    fetchUserSuccess,
    fetchOrderSuccess,
    currentUser,
    removeItemSuccess
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)