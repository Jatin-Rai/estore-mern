import React, { useState } from 'react';
import { FaHome, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';

import { useLogoutMutation } from '../../features/slices/usersApiSlice';
import { logout } from '../../features/slices/authSlice';

const Header = () => {
    const [open, setOpen] = useState(false);
    const { cartItems } = useSelector(state => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }

    const toggleMenu = () => {
        setOpen(!open);
    }

    return (
        <header className="bg-gray-900 text-white">
            <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold">
                    eStore
                </Link>
                <div className="group relative md:flex items-center flex-shrink outline-none rounded-full w-1/2">
                    <input
                        type="text"
                        className="w-full py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 outline-none rounded-full"
                        placeholder="Search..."
                    />
                    <div className="absolute text-gray-400 left-3 top-3">
                        <FaSearch />
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/cart" className="relative flex items-center hover:text-gray-200 cursor-pointer">
                        <div className='flex items-center gap-4'>
                            <FaShoppingCart size={30} />
                            {cartItems.length > 0 && (
                                <span className="absolute w-5 h-5 rounded-full bg-blue-500 -top-1 left-4 flex items-center justify-center">
                                    <span className="text-xs text-white"
                                    >
                                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </span>
                                </span>

                            )}
                        </div>
                    </Link>
                    {userInfo ? (
                        <div
                            className={`shadow flex justify-center items-center relative ${open ? 'outline-blue-500' : 'border-transparent'
                                }`}
                            onClick={toggleMenu}
                        >
                            <div
                                className={`relative border-b-4 border-transparent py-3 transform transition duration-300 ${open ? 'border-blue-500' : ''
                                    }`}
                            >
                                <div className="flex justify-center items-center space-x-3 cursor-pointer">
                                    <div className="text-white text-lg"
                                    >
                                        <div className="flex items-center gap-2 cursor-pointer capitalize">
                                            <FaUser size={28} />
                                            {userInfo.name}
                                        </div>
                                    </div>
                                </div>
                                {open && (
                                    <div
                                        className="absolute right-0 w-60 px-5 py-3 bg-gray-800 rounded-lg shadow border border-transparent mt-5 z-50"
                                    >
                                        <ul className="space-y-3 text-white">
                                            <li className="font-medium">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-blue-500"
                                                >
                                                    Profile
                                                </Link>
                                            </li>
                                            <hr className="border-gray-600" />
                                            {userInfo && userInfo.isAdmin && (
                                                <>
                                                    <li className="font-medium">
                                                        <Link
                                                            to="/admin/productslist"
                                                            className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-blue-500"
                                                        >
                                                            Products
                                                        </Link>
                                                    </li>                                                <li className="font-medium">
                                                        <Link
                                                            to="/admin/userslist"
                                                            className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-blue-500"
                                                        >
                                                            Users
                                                        </Link>
                                                    </li>
                                                    <li className="font-medium">
                                                        <Link
                                                            to="/admin/orderlist"
                                                            className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-blue-500"
                                                        >
                                                            Orders
                                                        </Link>
                                                    </li>
                                                </>
                                            )}
                                            <li className="font-medium">
                                                <span
                                                    className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-red-600 cursor-pointer"
                                                    onClick={logoutHandler}
                                                >
                                                    Logout
                                                </span>
                                            </li>

                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (

                        <Link to='/login' className="flex items-center hover:text-gray-200 gap-2" >
                            <FaUser size={28} />
                            Sign In
                        </Link>
                    )}
                </div>
                <div className='md:hidden fixed bottom-0 left-0 right-0 flex justify-evenly items-center bg-slate-600 py-4 w-full z-10'>
                    <div className="relative flex items-center outline-none rounded-full">
                        <Link to="/">
                            <FaHome size={28} />
                        </Link>
                    </div>
                    <button className="md:hidden relative">
                        <Link to="/cart">
                            <FaShoppingCart size={28} />
                            {cartItems.length > 0 && (
                                <span className="absolute w-6 h-6 rounded-full bg-blue-500 -top-2 left-4 flex items-center justify-center">
                                    <span className="text-xs text-white"
                                    >
                                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </span>
                                </span>

                            )}
                        </Link>
                    </button>

                    <Link to='/login' className="md:hidden">
                        <FaUser size={24} />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;