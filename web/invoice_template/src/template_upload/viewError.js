
import React , {useState, useEffect }from 'react';
import ImageGallery from 'react-image-gallery';

export default function ErrorViewer() {



    const images = [
      {
        original: require("./../preprocessed/errorImage.png"),
        //thumbnail: require("./../preprocessed/errorImage.png"),
      },
    ]

    return (
      <ImageGallery items={images} />
    );
  

}