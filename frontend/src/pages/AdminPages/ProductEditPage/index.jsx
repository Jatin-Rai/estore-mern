import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

import { BsArrowLeft } from 'react-icons/bs';

import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import { toast } from 'react-toastify';
import {
    useUpdateProductMutation,
    useGetProductDetailsQuery,
    useUploadProductImageMutation
} from '../../../features/slices/productsApiSlice';

const ProductEditPage = () => {
    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();

        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }

        const result = await updateProduct(updatedProduct);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Product updated');
            navigate('/admin/productslist');
        }
    }

    const uploadFileHandler = async (e) => {
        const formData = new FormData();

        formData.append('image', e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
            setImage(product.image);
        }
    }


    return (
        <>
            <Link to="/admin/productslist">
                <BsArrowLeft className='text-3xl font-bold cursor-pointer' />
            </Link>
            <div className='mt-5 grid grid-cols-3'>
                <h1 className="font-semibold text-2xl">Edit Product</h1>
                {loadingUpdate && <Loader />}

                {isLoading
                    ? <Loader />
                    : error
                        ? <Message variant='bg-red-500'>{error.message}</Message>
                        : (
                            <form onSubmit={submitHandler} className='mt-5 flex flex-col'>
                                <div className='flex gap-4 my-2'>
                                    <label htmlFor="name" className='font-semibold'>Name:</label>
                                    <input
                                        type="text"
                                        value={name}
                                        className='w-full border-2 border-gray-300 py-1 px-2 rounded'
                                        placeholder='Enter product name'
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='flex gap-4 my-2'>
                                    <label htmlFor="" className='font-semibold'>Price($):</label>
                                    <input
                                        type="number"
                                        value={price}
                                        className='w-full border-2 border-gray-300 py-1 px-2 rounded'

                                        placeholder='Enter price'
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className='flex gap-4 my-2'>
                                    <label htmlFor="" className='font-semibold'>Image:</label>
                                    <div className='w-full flex flex-col gap-3'>
                                        <input
                                            type="text"
                                            className='w-full border-2 border-gray-300 py-1 px-2 rounded'
                                            value={image}
                                            placeholder='Enter image url'
                                            onChange={(e) => setImage(e.target.value)}
                                        />
                                        <input
                                            type="file"
                                            name='image'
                                            placeholder='Choose file'
                                            className='w-full border-2 border-gray-300 py-1 px-2 rounded'
                                            onChange={uploadFileHandler}
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-4 my-2'>
                                    <label htmlFor="" className='font-semibold'>Brand:</label>
                                    <input
                                        type="text"
                                        className='w-full border-2 border-gray-300 py-1 px-2 rounded'
                                        value={brand}
                                        placeholder='Enter brand'
                                        onChange={(e) => setBrand(e.target.value)}
                                    />
                                </div>
                                <div className='flex gap-4 my-2'>

                                    <label htmlFor="" className='font-semibold'>Category:</label>
                                    <input
                                        type="text"
                                        className='w-full border-2 border-gray-300 py-1 px-2 rounded'
                                        value={category}
                                        placeholder='Enter category'
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                </div>
                                <div className='flex gap-4 my-2'>

                                    <label htmlFor="" className='font-semibold'>Stocks:</label>
                                    <input
                                        type="number"
                                        className='w-full border-2 border-gray-300 py-1 px-2 rounded'
                                        value={countInStock}
                                        placeholder='Enter No. of stocks available'
                                        onChange={(e) => setCountInStock(e.target.value)}
                                    />
                                </div>
                                <div className='flex gap-4 my-2'>

                                    <label htmlFor="" className='font-semibold'>Description:</label>
                                    <textarea
                                        rows={5}
                                        type="text"
                                        className='w-full border-2 border-gray-300 py-1 px-2 rounded resize-none'
                                        value={description}
                                        placeholder='Enter description'
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className='my-2 text-end'>
                                    <button className='p-2 bg-gray-800 hover:bg-gray-900 text-white rounded'>Update</button>
                                </div>
                            </form>
                        )
                }
            </div>
        </>
    );
}

export default ProductEditPage;