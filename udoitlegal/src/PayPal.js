import React, { Component } from 'react';
import PayPalBtn from './PayPalBtn'

export default class PayPal extends Component {
    paymentHandler = (details, data) => {
        /** Here you can call your backend API
            endpoint and update the database */

        console.log(details, data);

        return fetch('http://localhost:4242/create', { method: 'GET' });

        
    }
    render() {
        return ( 
            <div>
                <PayPalBtn
                    amount = {200}
                    currency = {'USD'}
                    onSuccess={this.paymentHandler}/>
            </div>
        )
    }
}