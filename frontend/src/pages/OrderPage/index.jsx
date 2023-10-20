import React, { useEffect } from 'react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useDeliveredOrderMutation } from '../../features/slices/ordersApiSlice';
import { Link, useParams } from 'react-router-dom';
import { MdError } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const OrderPage = () => {
    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [deliverOrder, { isLoading: deliveredLoading }
    ] = useDeliveredOrderMutation();

    const [payorder, { isLoading: paymentLoading }] = usePayOrderMutation();

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const { data: paypal, isLoading: paypalLoading, error: paypalError } = useGetPayPalClientIdQuery();

    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        if (!paypalError && !paypalLoading && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'clientId': paypal.clientId,
                        currency: 'USD'
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [order, paypal, paypalDispatch, paypalError, paypalLoading]);

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payorder({ orderId, details }).unwrap();
                refetch();
                toast.success('Payment Successful');
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        });
    }
    // async function onApproveTest() {
    //     await payorder({ orderId, details: { payer: {} } });
    //     refetch();
    //     toast.success('Payment Successful');
    // }
    function onError(error) {
        toast.error(error.message);
    }
    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        }).then((orderId) => {
            return orderId;
        });
    }

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Order Delivered');

        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    }

    console.log(order)

    return isLoading
        ? (
            <Loader />
        )
        : error ? (
            <Message variant={`bg-red-500`}>
                {error?.data?.message || error.error}
            </Message>
        )
            : (
                <>
                    <h1 className="text-2xl lg:text-4xl font-semibold">Order ID: {order._id}</h1>
                    <div
                        className="lg:grid lg:grid-cols-4 gap-10"
                    >
                        <div className="lg:col-span-3">
                            <br />
                            <h2 className='font-semibold text-2xl'>Shipping</h2>
                            <p>
                                <strong>Name: </strong>{order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>{order.user.email}
                            </p>
                            <p className='mb-5'>
                                <strong>Address: </strong>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.province} - {order.shippingAddress.postalCode} {order.shippingAddress.country}
                            </p>
                            {order.isDelivered
                                ? (
                                    <Message variant="bg-green-600">
                                        Delivered on {order.deliveredAt}
                                    </Message>
                                )
                                : (
                                    <Message variant="bg-red-500">
                                        Not Delivered
                                    </Message>
                                )
                            }
                            <br />
                            <h2 className='font-semibold text-2xl mb-2'>Payment Method</h2>
                            <p>
                                <strong>Method: </strong> {order.paymentMethod}
                            </p>
                            <br />
                            {order.isPaid
                                ? (
                                    <Message variant="bg-green-600">
                                        Paid on {order.paidAt}
                                    </Message>
                                )
                                : (
                                    <Message variant="bg-red-500">
                                        Not Paid
                                    </Message>
                                )
                            }
                            <br />
                            <h2 className='font-semibold text-2xl'>Order Items</h2>
                            <br />
                            <ul>
                                {order.orderItems.map((item, index) => (
                                    <li key={index} className='flex items-center gap-5'>
                                        <img src={item.image} alt={item.name} className='h-10 rounded' />
                                        <Link to={`/product/${item._id}`}
                                            className='text-sm'
                                        >
                                            {item.name}
                                        </Link>
                                        <p className='italic text-sm'>{item.qty} x {item.price} = ${item.qty * item.price}</p>
                                    </li>
                                ))}
                            </ul>
                            <br />
                        </div>
                        <div className="lg:col-span-1">
                            <div className='shadow p-2 rounded'>
                                <h2 className='font-bold text-lg text-center'>Order Summary</h2>
                                <hr />
                                <table className='w-full'>
                                    <tr>
                                        <td>Items:</td>
                                        <td className='text-end'>${order.itemsPrice}</td>
                                    </tr>
                                    <tr>
                                        <td>Shipping:</td>
                                        <td className='text-end'>${order.shippingPrice}</td>
                                    </tr>
                                    <tr>
                                        <td>Tax:</td>
                                        <td className='text-end'>${order.taxPrice}</td>
                                    </tr>

                                    <tr className='border-t-2 font-bold'>
                                        <td>Total:</td>
                                        <td className='text-end'>${order.totalPrice}</td>
                                    </tr>
                                    {/* <tr className='border-t-2'>
                                        <td className='pt-2'>
                                            <button
                                                className={`${order.orderItems.length === 0 ? "bg-gray-400" : "bg-gray-900"} text-white py-2 px-4 rounded`}
                                                disabled={order.orderItems.length === 0}
                                            // onClick={placeOrderHandler}
                                            >
                                                Pay
                                            </button>
                                        </td>
                                    </tr> */}
                                    <tr>
                                        <td>
                                            {isLoading && <Loader /> || error && <Message
                                                icon={<MdError />}
                                                variant={`bg-red-500`}
                                            >
                                                {error?.data?.message || error.error}
                                            </Message>}
                                        </td>
                                    </tr>
                                </table>
                                <div className='mt-10'>
                                    {!order.isPaid && (
                                        <div>
                                            {paymentLoading && <Loader />}

                                            {isPending ? <Loader /> : (
                                                <div className='flex flex-col gap-10'>
                                                    {/* <button
                                                        className='text-white bg-blue-500 p-2'
                                                        onClick={onApproveTest}>Test Pay Order</button> */}
                                                    <PayPalButtons
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}
                                                        className='z-0'
                                                    />
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </div>
                                {deliveredLoading && <Loader />}
                                {userInfo
                                    && userInfo.isAdmin
                                    && order.isPaid
                                    && !order.isDelivered
                                    && (
                                        <button
                                            type='button'
                                            className={`bg-green-500 hover:bg-green-600 text-white px-2 py-3 rounded`}
                                            onClick={deliverOrderHandler}
                                        >
                                            Mark as Delivered
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </>
            )
}

export default OrderPage;