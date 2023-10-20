import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 &&
    <nav>
      <ul className="flex items-center -space-x-px h-8 text-sm">
        {[...Array(pages).keys()].map((x) => (
          <li key={x + 1}>
            <NavLink
              to={!isAdmin
                ? keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`
                : `/admin/productslist/${x + 1}`}
              className={({ isActive }) =>
                `flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded ${isActive ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'text-gray-900 hover:text-white bg-white hover:bg-gray-900'}`
              }
            >
              {x + 1}
            </NavLink>

          </li>
        ))}

      </ul>
    </nav>

  )
}

export default Paginate