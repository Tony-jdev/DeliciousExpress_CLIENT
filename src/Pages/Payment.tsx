import React from "react";
import { useLocation } from "react-router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "../Components/Page/Payment";
import { OrderSummary } from "../Components/Page/Order";

function Payment() {
    const {
        state: { apiResult, userInput },
    } = useLocation();

    const stripePromise = loadStripe(
        "pk_test_51NVILuB2DKMcokuNtsKkUOMJtv6gPMFtdt9bYygsUJc7kaFIof1GbNUrJbiB1i8tHJntXLgujnk0pxKBdUKMVQyP003ADfcd3U"
    );
    const options = {
        clientSecret: apiResult.clientSecret,
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <div className="container m-5 p-5">
                <div className="row">
                    <div className="col-md-7">
                        <OrderSummary data={apiResult} userInput={userInput}/>
                    </div>
                    <div className="col-md-4 offset-md-1">
                        <h3 className="text-success">Payment</h3>
                        <div className="mt-5">
                            <PaymentForm data={apiResult} userInput={userInput}/>
                        </div>
                    </div>
                </div>
            </div>
        </Elements>
    );
}

export default Payment;