import React, { useState, useEffect } from 'react';

export default function DocumentUpload({ Doc, setFile, setDeleteDocument, Texto, inputOff }) {
  const [docPreviewUrl, setDocPreviewUrl] = useState(Doc ? Doc : '');
  const [fileName, setFileName] = useState('');
  const [texto, setTexto] = useState(Texto);

  useEffect(() => {
    if (Doc) {
      setFileName(Doc.split('/')[6]);
    } else {
      setFileName('');
    }
  }, [Doc]);

  const handleDocChange = (e) => {
    e.preventDefault();
    setDeleteDocument(false);
    let reader = new FileReader();
    let newFile = e.target.files[0];
    if (newFile.type.includes('application/pdf') || newFile.type.includes('image')) {
      reader.onloadend = () => {
        setFile(newFile);
        setFileName(newFile.name);
        setDocPreviewUrl(reader.result as string);
      };
      if (newFile) {
        reader.readAsDataURL(newFile);
      }
    }
  };
  return (
    <>
      {!inputOff && (
        <div className='relative cursor-pointer '>
          <div className=' bg-gray-100 border-gray-50 border-2 p-4 text-black rounded-xl m-5  hover:border-green-600'>
            <div className='truncate'>{fileName && fileName}</div>
            <input
              type='file'
              onChange={(e) => handleDocChange(e)}
              className='cursor-pointer block h-full absolute left-0 opacity-0 top-0 w-full '
              accept='.gif, .jpg, .png, .doc, .pdf'
            />
          </div>
        </div>
      )}
      {docPreviewUrl === '' ? (
        <div className='relative'>
          <input
            type='file'
            onChange={(e) => handleDocChange(e)}
            className='cursor-pointer block h-full absolute left-0 opacity-0 top-0 w-full'
            accept='.gif, .jpg, .png, .doc, .pdf'
          />
          <h6 className='cursor-pointer text-white rounded-lg py-2 font-bold mx-2 bg-green-500 shadow-xl text-center '>
            {texto}
          </h6>
        </div>
      ) : (
        <div className='flex justify-center'>
          <div className='relative cursor-pointer'>
            <input
              type='file'
              onChange={(e) => handleDocChange(e)}
              className='cursor-pointer block h-full absolute left-0 opacity-0 top-0 w-full'
              accept='.gif, .jpg, .png, .doc, .pdf'
            />
            <div className='cursor-pointer text-white rounded-lg p-2 font-bold mx-2 bg-green-500 shadow-xl text-center'>
              Cambiar
            </div>
          </div>
          <div
            className='cursor-pointer text-white rounded-lg p-2 font-bold mx-2 bg-red-500 shadow-xl text-center'
            onClick={() => {
              setDocPreviewUrl('');
              setFile(null);
              setFileName('');
              setDeleteDocument(true);
            }}
          >
            Eliminar
          </div>
        </div>
      )}
    </>
  );
}
