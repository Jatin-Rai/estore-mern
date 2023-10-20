import React from 'react'
import { Helmet } from 'react-helmet-async';

const Meta = ({title, description, keywords}) => {
  return (
      <Helmet>
          <title>{title}</title>
          <meta name='description' content={description} />
          <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'Welcome to eStore',
    description: 'We sell the best products for a better price',
    keywords: 'electronics, buy electronics, cheap electronics, best electronics price'
}

export default Meta;