import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { saveShippingAddress } from '../../features/slices/cartSlice';
import CheckoutSteps from '../../components/CheckoutSteps';

const ShippingPage = () => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [province, setProvince] = useState(shippingAddress?.province || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, province, country, postalCode }));
    navigate('/payment');
  };

  return (
    <>
      <div className='py-6'>
        <CheckoutSteps step1 step2 />
      </div>
      <div className="p-6 bg-gray-100 flex flex-col items-center justify-center mb-12">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-xl text-gray-600 mb-6">Shipping Address</h2>

            <div className="bg-white rounded shadow-lg p-4 md:p-8 mb-6">
              <div className="text-gray-500 text-xs mb-6">
                <p>Please fill out all the fields.</p>
              </div>

              <form onSubmit={submitHandler} className="grid gap-4 text-sm">
                <div>
                  <label htmlFor="address">Address / Street</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="h-10 border rounded px-4 w-full bg-gray-50"
                    placeholder="Enter street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    className="h-10 border rounded px-4 w-full bg-gray-50"
                    placeholder="Enter City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="province">State / province</label>
                  <input
                    name="province"
                    id="province"
                    placeholder="Enter State"
                    className="h-10 border rounded px-4 w-full bg-gray-50"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="country">Country / region</label>
                  <input
                    name="country"
                    id="country"
                    placeholder="Enter Country"
                    className="h-10 border rounded px-4 w-full bg-gray-50"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="postalcode">Postal code</label>
                  <input
                    type="text"
                    name="postalcode"
                    id="postalcode"
                    className="h-10 border rounded px-4 w-full bg-gray-50"
                    placeholder="Enter Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPage;
