/*eslint-disable*/
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

var fileTypes = ['jpg', 'jpeg', 'png'];

export default function PictureUpload({ Imagen, setFile, setDeletePicture, Texto, required = false }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(Imagen ? Imagen : '/img/default.jpg');
  const [texto, setTexto] = useState(Texto);
  const [newImage, setNewImage] = useState(false);
  const [clicked, setClicked] = useState(false);
  const fileUpload = useRef(null);
  const handleImageChange = (e) => {
    e.preventDefault();
    setDeletePicture(false);
    let reader = new FileReader();
    let newFile = e.target.files[0];
    if (newFile.type.includes('image')) {
      reader.onloadend = () => {
        setFile(newFile);
        setImagePreviewUrl(reader.result as string);
      };
      if (newFile) {
        reader.readAsDataURL(newFile);
      }
    }
  };
  useEffect(() => {
    if (clicked && newImage) {
      fileUpload.current.click();
      setClicked(false);
    }
    if (clicked && !newImage) {
      setNewImage(true);
    }
  }, [clicked, newImage]);

  useEffect(() => {
    if (Imagen) {
      setImagePreviewUrl(Imagen);
    }
  }, [Imagen]);
  return (
    <>
      <div className=' relative cursor-pointer'>
        {!newImage ? (
          <input
            hidden
            required={required}
            type='text'
            value={imagePreviewUrl}
            onChange={(e) => {
              setImagePreviewUrl(e.target.value);
            }}
          />
        ) : (
          <input
            ref={fileUpload}
            type='file'
            required={required}
            onChange={(e) => handleImageChange(e)}
            className='hidden'
            accept='image/x-png,image/gif,image/jpeg'
          />
        )}
        <div
          onClick={() => setClicked(true)}
          className=' bg-gray-100 border-gray-50 border-8  h-52 w-52 md:w-80 md:h-80  text-black rounded-2xl mb-5 overflow-hidden hover:border-green-600'
        >
          <Image
            className='cursor-pointer rounded-2xl'
            layout='fill'
            src={imagePreviewUrl}
            alt='UserImage'
            objectFit='cover'
            quality={100}
          />
        </div>
      </div>
      {imagePreviewUrl === '/img/default.jpg' ? (
        <div
          onClick={() => setClicked(true)}
          className='cursor-pointer text-white rounded-lg py-2 font-bold mx-2 bg-green-500 shadow-xl text-center '
        >
          {texto}
        </div>
      ) : (
        <div className='flex justify-center'>
          <div
            onClick={() => setClicked(true)}
            className='cursor-pointer text-white rounded-lg p-2 font-bold mx-2 bg-green-500 shadow-xl text-center'
          >
            Cambiar
          </div>
          <div
            className='cursor-pointer text-white rounded-lg p-2 font-bold mx-2 bg-red-500 shadow-xl text-center'
            onClick={() => {
              setImagePreviewUrl('/img/default.jpg');
              setDeletePicture(true);
            }}
          >
            Eliminar
          </div>
        </div>
      )}
    </>
  );
}
