import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { useRegisterMutation } from '../../features/slices/usersApiSlice';
import { setCredentials } from '../../features/slices/authSlice';
import { toast } from 'react-toastify';


const RegisterPage = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const { userInfo } = useSelector(state => state.auth);

    const { search } = useLocation();

    const searchParams = new URLSearchParams(search);

    const redirect = searchParams.get('redirect') || '/';


    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password do not match');
            return;
        } else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    }

    return (
        <div className='flex items-center justify-center min-w-screen min-h-full pb-48 sm:pb-5'>
            <div className='md:sm:w-1/2 w-full flex flex-col shadow-2xl rounded p-10'>
                <h1 className='text-2xl font-semibold capitalize text-center'>sign up</h1>
                <form
                    onSubmit={submitHandler}
                    className='flex flex-col pt-3 gap-3'
                >
                    <div className='flex flex-col pt-3 gap-3'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            placeholder='Enter name'
                            className='outline outline-gray-300 p-2 rounded'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col pt-1 gap-3'>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            placeholder='Enter email'
                            className='outline outline-gray-300 p-2 rounded'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col pt-1 gap-3'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder='Enter password'
                            className='outline outline-gray-300 p-2 rounded'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col pt-1 pb-4 gap-3'>
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input
                            type="password"
                            placeholder='Confirm password'
                            className='outline outline-gray-300 p-2 rounded'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type='submit'
                        className='bg-blue-500 hover:bg-blue-700 w-full rounded text-white py-2 shadow'
                        disabled={isLoading}
                    >
                        Register
                    </button>
                    {isLoading && <Loader />}
                </form>
                <div className='pt-4 text-center'>
                    <p>Already a Customer?{" "}
                        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className='text-blue-500 cursor-pointer'>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;
