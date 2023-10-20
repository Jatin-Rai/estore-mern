import React, { useState, useEffect } from 'react';
import { useGetTopProductsQuery } from '../../features/slices/productsApiSlice';
import Message from '../Message';
import { Link } from 'react-router-dom';

import { MdArrowLeft, MdArrowRight } from 'react-icons/md';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Auto slide to the next item
      setCurrentSlide((currentSlide + 1) % products.length);
    }, 5000); // Change slide every 5 seconds

    return () => {
      clearInterval(timer);
    };
  }, [currentSlide, products]);

  return isLoading ? "" : error ? <Message variant='bg-red-500' /> : (
    <div className="max-w-full mx-auto relative">
      <div id="default-carousel" className="relative" data-carousel="static">
        {/* Carousel wrapper */}
        <div className="overflow-hidden relative h-56 sm:h-64 xl:h-96 2xl:h-96">
          {products.map((product, index) => (
            <div
              key={product._id}
              className={`duration-700 ease-in-out ${index === currentSlide ? 'block' : 'hidden'
                }`}
              data-carousel-item="true"
            >
              <Link to={`/product/${product._id}`} className='flex'>
                <img src={product.image} className="w-full h-96 bg-blue-950" alt={product.name} />
                <div className='w-1/2 bg-blue-950'></div>
              </Link>
              <div className="absolute bottom-0 left-0 right-0 bg-gray-800/50 p-2">
                <p className="text-lg text-white text-center font-semibold">{product.name} (${product.price})</p>
              </div>
            </div>
          ))}
        </div>
        {/* Slider controls */}
        <button
          type="button"
          className="flex absolute top-0 -left-4 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
          data-carousel-prev="true"
          onClick={() =>
            setCurrentSlide((currentSlide - 1 + products.length) % products.length)
          }
        >
          <span className="inline-flex flex-col h-full justify-center hover:border hover:border-gray-800/50">
            <MdArrowLeft className='text-5xl text-gray-900' />
            <span className="hidden">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="flex absolute top-0 -right-4 z-30 justify-center items-center px-4 h-full cursor-pointer"
          data-carousel-next="true"
          onClick={() => setCurrentSlide((currentSlide + 1) % products.length)}
        >
          <span className="inline-flex flex-col h-full justify-center hover:border hover:border-white">
            <MdArrowRight className='text-5xl text-white' />
            <span className="hidden">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProductCarousel;
