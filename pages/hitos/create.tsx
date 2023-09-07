import Head from 'next/head';
import React, { useState } from 'react';
import { countries } from '../pais/countries';

export default function Hitos() {
    const [empleoActual, setEmpleoActual] = useState(false);

    const [formIsValid, setFormIsValid] = useState(false);

    const checkFormValidity = () => {
        const requiredInputs = document.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
            }
        });

        setFormIsValid(isValid);
    };

    return (
        <div className='grid justify-center'>
            <Head>
                <title>Hitos Laborales</title>
                <link rel="icon" href="/public/img/icons/favicon.ico" />
            </Head>

            <div className='grid justify-center mt-5'>
                <h1 className='text-3xl text-gray-400'>
                    HITOS LABORALES
                </h1>
            </div>

            <div className='mt-10 font-bold'>
                <form action="" className='grid md:grid-cols-2 gap-4'>

                    <div className='col-span-1 ml-10 grid'>

                        <span className='text-3xl text-gray-400'>Que?</span>

                        <div className=''>
                            <label htmlFor="" className='block mb-1'>Nombre  <span className=' text-blue-500 '>*</span> </label>
                            <input
                                type="text"
                                className=" w-11/12 p-2 border-2 border-black rounded focus:outline-none focus:border-blue-500 lg:w-full"
                                placeholder='Ej. Nacimiento de tu hijo, Distinción laboral, Premio académico'
                                required
                                onChange={checkFormValidity}
                            />
                        </div>

                        <div>
                            <label htmlFor="" className='block mb-1' >Cargo  <span className=' text-blue-500 '>*</span> </label>
                            <input
                                type="text"
                                className="w-11/12 p-2 border-2 border-black rounded focus:outline-none focus:border-blue-500 lg:w-full"
                                placeholder='Ej. Jefe de Cartera, Auxiliar de planta, etc...'
                                required
                                onChange={checkFormValidity}
                            />
                        </div>

                        <div>
                            <label htmlFor="" className='block mb-1' >Tipo  <span className=' text-blue-500 '>*</span> </label>
                            <select
                                name=""
                                id=""
                                className='w-11/12 p-2 border-2 border-black rounded focus:outline-none focus:border-blue-500 lg:w-full' required
                                onChange={checkFormValidity}
                            >
                                <option value="">Seleccione una opcion</option>
                                <option value="Operativo">Operativo</option>
                                <option value="Funcional">Funcional</option>
                                <option value="Táctico">Táctico</option>
                                <option value="Estratégico">Estratégico</option>
                            </select>
                        </div>

                        <div className=''>
                            <label htmlFor="" className='block mb-1' >Funciones/Responsabilidades  <span className=' text-blue-500 '>*</span> </label>
                            <textarea
                                name=""
                                id=""
                                cols="30"
                                rows="5"
                                placeholder='¿Cuáles eran tus funciones y responsabilidades principales para este cargo?'
                                className='w-11/12 p-2 border-2 border-black rounded focus:outline-none focus:border-blue-500 lg:w-full' required
                                onChange={checkFormValidity}
                            ></textarea>
                        </div>

                        <div className=''>
                            <label htmlFor="" className='block mb-1' >Logros  <span className=' text-blue-500 '>*</span> </label>
                            <textarea
                                name=""
                                id=""
                                cols="30"
                                rows="5"
                                placeholder='¿Cuáles fueron tus principales logros en este cargo?'
                                className='w-11/12 p-2 border-2 border-black rounded focus:outline-none focus:border-blue-500 lg:w-full' required
                                onChange={checkFormValidity}
                            ></textarea>
                        </div>
                    </div>

                    <div className='col-span-1 ml-10 grid'>

                        <div className=''>
                            <label htmlFor="" className=' mb-1' >Descripcion</label> <span className='text-gray-400'>Opcional</span>
                            <textarea
                                name="" id="" cols="30" rows="5"
                                className='w-11/12 p-2 border-2 border-black rounded focus:outline-none focus:border-blue-500 lg:w-full'
                            ></textarea>
                        </div>

                        <div className=''>
                            <span className='text-3xl text-gray-400' >Cuando?</span>
                        </div>

                        <div className=''>
                            <input
                                type="checkbox"
                                className='m-2 form-checkbox text-bluegdm border-2 rounded focus:outline-none focus:border-blue-500 h-4 w-4'
                                onChange={() => {
                                    setEmpleoActual(!empleoActual);
                                    checkFormValidity();
                                }} 
                            />
                            <label htmlFor="" className=''>¿Es tu empleo actual?</label>
                        </div>

                        <div className=''>
                            <label htmlFor="" className='block mb-1' >Desde Cuando?</label>
                            <input
                                type="date"
                                className="w-11/12 p-2 border-2 border-black rounded focus:outline-none focus:border-blue-500 lg:w-full" 
                                
                            />
                        </div>

                        <div className={` ${empleoActual ? 'hidden' : ''}`}>
                            <label htmlFor="" className='block mb-1'>Hasta Cuando?</label>
                            <input
                                type="date"
                                className="w-11/12 p-2 border-2 border-black rounded focus:outline-none focus:border-blue-500 lg:w-full" required
                                onChange={checkFormValidity}
                            />
                        </div>

                        <div className=''>
                            <span className='text-3xl text-gray-400'>Donde?</span>
                        </div>

                        <div>
                            <label htmlFor="" className='block mb-1' >Pais  <span className=' text-blue-500 '>*</span> </label>
                            <select
                                name=""
                                id=""
                                className="w-11/12 p-2 border-2 border-black rounded focus:outline-none focus:border-blue-500 lg:w-full"
                                required
                                onChange={checkFormValidity}
                            >
                                <option value="">Seleccione una opcion</option>
                                {countries.map((country) => (
                                    <option key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-center items-center mt-5">
                        <button
                            type="submit"
                            className={`button ${formIsValid ? '' : 'button__disabled'}`}
                            disabled={!formIsValid}
                        >
                            GUARDAR HITO
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}
