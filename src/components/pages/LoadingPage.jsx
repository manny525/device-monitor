import React from 'react';

export default function LoadingPage() {
  return (
    <div className='img'>
      <img src={require('../../public/loader.gif')} />
    </div>
  )
}