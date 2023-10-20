import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import { FaArrowLeft, FaBell, FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../../features/slices/cartSlice';
import CheckoutSteps from '../../components/CheckoutSteps';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  }

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  }

  return (
    <div className="container mx-auto p-4 h-screen">
      <CheckoutSteps step1 />
      <div className="flex flex-row items-center pb-4 gap-4">
        <Link to="/">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-2xl font-semibold">Shopping Cart</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {cartItems.length === 0 ? (
          <div className="w-full md:w-3/4">
            <Message icon={<FaBell />} variant="bg-blue-400">
              Your cart is empty
            </Message>
          </div>
        ) : (
          <table className="table-auto w-full md:w-3/4 shadow">
            <thead className="text-left">
              <tr>
                <th className="px-1">Product</th>
                <th className="px-1">Price</th>
                <th className="px-1">Qty</th>
                <th className="px-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="shadow">
                  <td className="flex items-center gap-4 px-1 py-2">
                    <img src={item.image} alt={item.name} className="h-28 w-28" />
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </td>
                  <td className="px-1 py-2">$ {item.price}</td>
                  <td className="px-1 py-2">
                    <select
                      className="outline outline-1 px-1"
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1} className="bg-gray-300">
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-1 py-2">
                    <FaTrash
                      className="text-red-500 hover:text-red-600 text-xl cursor-pointer"
                      onClick={() => removeFromCartHandler(item._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="w-full md:w-1/4 shadow p-4">
          <strong className="text-lg md:text-xl">
            Subtotal {cartItems.reduce((acc, item) => acc + item.qty, 0)} items
          </strong>
          <p className="py-3 font-semibold">
            $ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
          </p>
          <button
            type="button"
            className={`w-full ${cartItems.length === 0 ? "bg-gray-400" : "bg-gray-700 hover:bg-gray-900"} text-white p-2 rounded`}
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
