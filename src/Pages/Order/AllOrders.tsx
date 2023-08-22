import React, { useState, useEffect } from "react";
import { withAdminAuth, withAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import OrderList from "../../Components/Page/Order/OrderList";
import { MainLoader } from "../../Components/Page/Common";
import { inputHelper } from "../../Helper";
import { SD_Status } from "../../Utility/SD";
import { orderHeaderModel } from "../../Interfaces";

const filterOptions = [
  "All",
  SD_Status.CONFIRMED,
  SD_Status.BEING_COOKED,
  SD_Status.READY_FOR_PICKUP,
  SD_Status.CANCELLED,
];

function AllOrders() {
    const { data, isLoading } = useGetAllOrdersQuery("");
    return (
      <>
        {isLoading && <MainLoader />}
        {!isLoading && (
          <>
            <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
              <h1 className="text-success">Orders</h1>
            </div>
            {data?.apiResponse.data.length > 0 && (
              <OrderList
                isLoading={isLoading}
                orderData={data?.apiResponse.data}
              />
            )}
            {!(data?.apiResponse.data.length > 0) && (
              <div className="px-5 py-3">
                You do not have any previous orders.
              </div>
            )}
          </>
        )}
      </>
    );
}

export default withAdminAuth(AllOrders);