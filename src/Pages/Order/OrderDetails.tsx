import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../Apis/orderApi";
import { OrderSummary } from "../../Components/Page/Order";

function OrderDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderDetailsQuery(id);
  let userInput, orderDetails;
  
  if (!isLoading && data?.data) {
    console.log(data.data);
    userInput = {
      name: data.data.pickupName,
      email: data.data.pickupEmail,
      phoneNumber: data.data.pickupPhoneNumber,
    };
    orderDetails = {
      id: data.data.id,
      cartItems: data.data.orderDetails,
      cartTotal: data.data.orderTotal,
      stripePaymentIntentId: data.data.stripePaymentIntentID,
      status: data.data.status,
    };
  }

  return (
    <div
      className="container my-5 mx-auto p-5 w-100"
      style={{ maxWidth: "750px" }}
    >
      {!isLoading && orderDetails && userInput && (
        <OrderSummary data={orderDetails} userInput={userInput} />
      )}
    </div>
  );
}

export default OrderDetails;