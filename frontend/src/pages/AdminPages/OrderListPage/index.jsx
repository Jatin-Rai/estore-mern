import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import { useGetOrdersQuery } from '../../../features/slices/ordersApiSlice';
import { Link } from 'react-router-dom';


const OrderListPage = () => {

  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1 className='font-semibold text-3xl pb-5'>Orders</h1>
      {isLoading
        ? (
          <Loader />
        )
        : error ? (
          <Message variant='bg-red-500'>
            {error}
          </Message>
        )
          : (
            <table className='w-full'>
              <thead>
                <tr className='border-b-2 border-gray-300 text-left'>
                  <th className='py-2'>ID</th>
                  <th className='py-2'>USER</th>
                  <th className='py-2'>DATE</th>
                  <th className='py-2'>TOTAL</th>
                  <th className='py-2'>PAID</th>
                  <th className='py-2'>DELIVERED</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className='border-b-2 border-gray-300 hover:bg-gray-200'>
                    <td className='py-1 pr-10'>{order._id}</td>
                    <td className='py-1 pr-10'>{order.user && order.user.name}</td>
                    <td className='py-1 pr-10'>{order.createdAt.substring(0, 10)}</td>
                    <td className='py-1 pr-10'>${order.totalPrice}</td>
                    <td className='py-1 pr-10'>
                      {order.isPaid
                        ? (
                          order.paidAt.substring(0, 10)
                        )
                        : (
                          <FaTimes className='text-red-500' />
                        )
                      }
                    </td>
                    <td className='py-1 pr-10'>
                      {order.isDelivered
                        ? (
                          order.deliveredAt.substring(0, 10)
                        )
                        : (
                          <FaTimes className='text-red-500' />
                        )
                      }
                    </td>
                    <td>
                      <Link to={`/order/${order._id}`} className='underline text-blue-500'>
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )

      }
    </>
  )
}

export default OrderListPage;