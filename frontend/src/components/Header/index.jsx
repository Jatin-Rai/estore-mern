import React, { useState } from 'react';
import { FaCaretDown, FaHome, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { useLogoutMutation } from '../../features/slices/usersApiSlice';
import { logout } from '../../features/slices/authSlice';
import { resetCart } from '../../features/slices/cartSlice';

const Header = () => {
    const { keyword: urlKeyword } = useParams();

    const [open, setOpen] = useState(false);
    const [mobileSidenavOpen, setMobileSidenavOpen] = useState(false);

    const { cartItems } = useSelector(state => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const [keyword, setKeyword] = useState(urlKeyword || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            dispatch(resetCart());
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }

    const toggleMenu = () => {
        setOpen(!open);
    }

    const toggleMobileSidenav = () => {

        setMobileSidenavOpen(prev => !prev);

    };


    const submitHandler = async (e) => {
        if (e) {
            e.preventDefault();
        }
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
        setKeyword('');
    }


    return (
        <header className="bg-gray-900 text-white">
            <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold">
                    eStore
                </Link>
                <div className="group relative md:flex items-center flex-shrink outline-none rounded-full w-1/2">
                    {/* search */}
                    <input
                        type="text"
                        name="q"
                        onChange={(e) => setKeyword(e.target.value)}
                        value={keyword}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                submitHandler(e);
                            }
                        }}
                        className="w-full py-1.5 pl-5 pr-3 text-gray-900 placeholder:text-gray-400 outline-none rounded-full"
                        placeholder="Search Products..."
                    />

                    <button
                        className="absolute text-gray-900 hover:text-white right-0 bg-gray-300 hover:bg-gray-500 py-2.5 px-5 rounded-r-full"
                        onClick={() => submitHandler()}
                    >
                        <FaSearch />
                    </button>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/cart" className="relative flex items-center hover:text-gray-200 cursor-pointer">
                        <div className='flex items-center gap-1'>
                            <FaShoppingCart size={24} />
                            {cartItems.length > 0 && (
                                <span className="flex items-center justify-center bg-green-500 rounded px-1.5 py-0.5">
                                    <span className="text-xs font-semibold text-white"
                                    >
                                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </span>
                                </span>

                            )}
                        </div>
                    </Link>
                    {userInfo ? (
                        <div
                            className={`shadow z-50 flex justify-center items-center relative ${open ? 'outline-blue-500' : 'border-transparent'
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
                                            <FaUser size={20} />
                                            <span className='flex items-center gap-1'>
                                                {userInfo.name}
                                                <FaCaretDown className='text-sm' />
                                            </span>
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
                                                            Products<span className='italic text-orange-500'>(admin)</span>
                                                        </Link>
                                                    </li>                                                <li className="font-medium">
                                                        <Link
                                                            to="/admin/userslist"
                                                            className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-blue-500"
                                                        >
                                                            Users<span className='italic text-orange-500'>(admin)</span>
                                                        </Link>
                                                    </li>
                                                    <li className="font-medium">
                                                        <Link
                                                            to="/admin/orderlist"
                                                            className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-blue-500"
                                                        >
                                                            Orders<span className='italic text-orange-500'>(admin)</span>
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

                    {userInfo || userInfo && userInfo.isAdmin ? (
                        <>
                            <div className="md:hidden">
                                <FaUser size={24} className='cursor-pointer' onClick={() => toggleMobileSidenav()} />
                                {mobileSidenavOpen && (
                                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 text-white z-50">
                                        <div className="flex flex-col justify-center items-center h-full">
                                            <div className="py-8">
                                                <Link to="/profile" className="block px-4 py-3 hover:bg-gray-800" onClick={() => toggleMobileSidenav()}>
                                                    Profile
                                                </Link>
                                                {userInfo && userInfo.isAdmin && (
                                                    <>
                                                        <Link to="/admin/productslist" className="block px-4 py-3 hover:bg-gray-800"
                                                            onClick={() => toggleMobileSidenav()}
                                                        >
                                                            Products<span className='italic text-orange-500'>(admin)</span>
                                                        </Link>
                                                        <Link to="/admin/userslist" className="block px-4 py-3 hover-bg-gray-800"
                                                            onClick={() => toggleMobileSidenav()}
                                                        >
                                                            Users<span className='italic text-orange-500'>(admin)</span>
                                                        </Link>
                                                        <Link to="/admin/orderlist" className="block px-4 py-3 hover-bg-gray-800"
                                                            onClick={() => toggleMobileSidenav()}
                                                        >
                                                            Orders<span className='italic text-orange-500'>(admin)</span>
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-auto px-4 py-3">
                                                <span className="block cursor-pointer hover:bg-gray-800" onClick={logoutHandler}>
                                                    Logout
                                                </span>
                                            </div>
                                            <div className="px-4 py-3 text-center cursor-pointer hover:bg-gray-800" onClick={toggleMobileSidenav}>
                                                Close
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>

                    ) : (
                        <Link to='/login' className="md:hidden">
                            <FaUser size={24} />
                        </Link>
                    )}

                </div>
            </div>
        </header>
    );
};

export default Header;