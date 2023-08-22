import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-dt';
import { useNavigate } from 'react-router-dom';
import { useDeleteMenuItemMutation, useGetMenuItemsQuery } from '../../Apis/menuItemApi';
import { menuItemModel } from '../../Interfaces';
import { MainLoader } from '../../Components/Page/Common';
import { toast } from 'react-toastify';
import "./MenuItemList.css";

function MenuItemList() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMenuItemsQuery(null);
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const tableRef = useRef(null);

  useEffect(() => {
    if (!isLoading && data && tableRef.current) {
      const dataTableOptions = {
        pageLength: 25,
        searching: true,
        paging: true,
        responsive: true,
      };

      $(tableRef.current).DataTable(dataTableOptions);
    }
  }, [data, isLoading]);

  const handleMenuItemDelete = async (id: number) => {
    toast.promise(
      deleteMenuItem(id),
      {
        pending: 'Processing your request...',
        success: 'Menu Item Deleted Successfully',
        error: 'Error encountered',
      },
      {
        autoClose: 1000,
        theme: 'light',
        progress: undefined,
      }
    );
  };

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table main" >
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Menu</h1>

            <button className="btn btn-success" onClick={() => navigate('/menuitem/menuitemupsert')}>
              Add New Menu Item
            </button>
          </div>
          <div className="p-2">
            <table className="table table-hover table-bordered" ref={tableRef}>
              <thead className ="table-primary">
                <tr>
                  <th className='imag'>Image</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Special Tag</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((menuItem: menuItemModel) => (
                  <tr key={menuItem.id} >
                    <td className='imag'>
                      <img src={menuItem.image} alt="no content" style={{ width: '100%', maxWidth: '120px' }} />
                    </td>
                    <td>{menuItem.id}</td>
                    <td>{menuItem.name}</td>
                    <td>{menuItem.category}</td>
                    <td>${menuItem.price}</td>
                    <td>{menuItem.specialTag}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => navigate('/menuitem/menuitemupsert/' + menuItem.id)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button className="btn btn-danger mx-2" onClick={() => handleMenuItemDelete(menuItem.id)}>
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuItemList;
