import React from 'react'

import { FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '../../../features/slices/productsApiSlice';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Paginate from '../../../components/Paginate';

const ProductsListPage = () => {

    const { pageNumber } = useParams();

    const { data, isLoading, error, refetch } = useGetProductsQuery({pageNumber});

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteProduct(id);
                refetch();
                toast.success('Product Deleted Successfully')
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    }

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create product?')) {
            try {
                await createProduct();
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    }

    return (
        <>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-semibold'>Products</h1>
                <button
                    type='button'
                    className='flex items-center gap-2 text-white bg-gray-900 hover:bg-gray-950 hover:shadow px-4 py-2 rounded'
                    onClick={createProductHandler}
                >
                    <FaEdit />  Create Product
                </button>
            </div>

            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}

            {isLoading
                ? <Loader />
                : error
                    ? <Message variant='bg-red-500'>{error.data.message}</Message>
                    : (
                        <table className='w-full mt-5'>
                            <thead>
                                <tr className='text-left border-b-2 border-gray-300'>
                                    <th className='py-2 pr-2'>ID</th>
                                    <th className='py-2 pr-2'>NAME</th>
                                    <th className='py-2 pr-2'>PRICE</th>
                                    <th className='py-2 pr-2'>CATEGORY</th>
                                    <th className='py-2 pr-2'>BRAND</th>
                                    <th className='py-2 pr-2'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.products.map((product) => (
                                    <tr key={product._id} className='hover:bg-gray-100'>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td className='flex items-center gap-2 py-2'>
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                            >
                                                <button
                                                    className='hover:bg-gray-300 p-2 rounded'
                                                >
                                                    <FaEdit />
                                                </button>
                                            </Link>
                                            <button
                                                className='bg-red-500 p-2 hover:bg-red-600 text-white text-sm rounded'
                                                onClick={() => deleteHandler(product._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                                <Paginate pages={data.pages} page={data.page} isAdmin="true" />
                        </table>
                    )
            }
        </>
    )
}

export default ProductsListPage;