import React, { useState, useEffect } from 'react';
import PrivateRoute from 'components/PrivateRoute';
import useFormData from 'hooks/useFormData';
import safeJsonStringify from 'safe-json-stringify';
import { DatePicker } from '@material-ui/pickers';
import { useQuery } from '@apollo/react-hooks';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Loading from '@components/Loading';
import uploadFile from 'utils/uploadS3';
import Upload from '@components/custom/Upload';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

import {
  CVInputPageContainer,
  CVInputPageHeader,
  CVInputPageFooter,
  CVInputPageContent,
  Pregunta,
  Seccion,
  InputContainer,
  CustomCheckbox,
} from 'components/InputPage';
const GET_USER = gql`
  query user($where: UserWhereUniqueInput!) {
    user(where: $where) {
      name
      email
      image
      Perfil {
        gender
        fechaNacimiento
        typeDocument
        name
        document
        id
        userId
        image
      }
    }
  }
`;
const EDITAR_PERFIL = gql`
  mutation updatePerfil($data2: PerfilUpdateInput!, $where: PerfilWhereUniqueInput!) {
    updatePerfil(data: $data2, where: $where) {
      id
    }
  }
`;

const CREAR_PERFIL = gql`
  mutation createPerfil($dataPerfilcrear: PerfilCreateInput!) {
    createPerfil(data: $dataPerfilcrear) {
      id
    }
  }
`;

export default function Account() {
  const [form, getFormData] = useFormData(null);
  const [deletePicture, setDeletePicture] = useState(false);
  const [file, setFile] = useState(null);
  const [session, loading] = useSession();
  const router = useRouter();
  const [mutationEdit, { loading: mutationEditLoading, error: mutationEditError }] = useMutation(
    EDITAR_PERFIL
  );
  const [mutation, { loading: mutationLoading, error: mutationError }] = useMutation(CREAR_PERFIL);
  const { loading: qLoading, error, data, refetch } = useQuery(GET_USER, {
    variables: { where: { id: session ? session.user.id : '' } },
  });
  const [dataPerfilModificada, setDataPerfilModificada] = useState(data);
  const [age, setAge] = useState(0);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data && data.user) {
      setDataPerfilModificada(data);
    }
  }, [data]);

  useEffect(() => {
    function calculate_age(dob) {
      var diff_ms = Date.now() - dob.getTime();
      var age_dt = new Date(diff_ms);
      return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    if (dataPerfilModificada?.user.Perfil?.fechaNacimiento) {
      if (new Date(dataPerfilModificada.user.Perfil.fechaNacimiento) < new Date(Date.now())) {
        var FechaNa = new Date(
          dataPerfilModificada.user.Perfil ? dataPerfilModificada.user.Perfil.fechaNacimiento : ''
        );

        const año = FechaNa.getFullYear();
        const mes = FechaNa.getMonth();
        const dia = FechaNa.getDay();

        if (año > 0) {
          setAge(calculate_age(new Date(año, mes - 1, dia)));
        } else {
          setAge(-1);
        }
      }
    }
  }, [dataPerfilModificada]);
  //funcion para creación de perfil
  const submitData = async (e) => {
    e.preventDefault();
    var filePath = '';
    if (new Date(dataPerfilModificada.user.Perfil.fechaNacimiento) < new Date(Date.now())) {
      if (
        new Date(dataPerfilModificada.user.Perfil.fechaNacimiento).getFullYear() + 10 <
        new Date(Date.now()).getFullYear()
      ) {
        if (data.user.Perfil === null) {
          if (file) {
            const filePath2 = await uploadFile('UserImages', session.user.email, file);
            filePath = filePath2;
          }
          //Mutación de creación de perfil
          const dataPerfilcrear = {
            user: {
              connect: {
                id: session.user.id,
              },
            },
            gender: dataPerfilModificada.user.Perfil.gender,
            typeDocument: dataPerfilModificada.user.Perfil.typeDocument,
            document: dataPerfilModificada.user.Perfil.document,
            name: dataPerfilModificada.user.perfil.name,
            fechaNacimiento: new Date(dataPerfilModificada.user.Perfil.fechaNacimiento),
            image: filePath,
          };
          mutation({
            variables: { dataPerfilcrear },
          }).then((res) => {
            router.reload();
            router.push('/');
          });
        } else {
          //Mutación de actualización de perfil
          const where = {
            id: data.user.Perfil.id,
          };
          let data2 = {};
          Object.keys(dataPerfilModificada.user.Perfil).forEach((el) => {
            if (dataPerfilModificada.user.Perfil[el] !== data.user.Perfil[el]) {
              data2 = {
                ...data2,
                [el]: { set: dataPerfilModificada.user.Perfil[el] },
              };
            }
          });
          if (deletePicture) {
            data2 = { ...data2, image: { set: '' } };
          } else {
            if (file) {
              const filePath = await uploadFile('UserImages', session.user.email, file);
              data2 = {
                ...data2,
                image: { set: filePath },
              };
            }
          }
          mutationEdit({
            variables: { where, data2 },
          })
            .then(({ data }) => {
              router.reload();
              router.push(`/`);
            })
            .catch((e) => {
              console.error(e);
            });
        }
      } else {
        toast.error(`Debes tener más de 10 años`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      toast.error(`La fecha de nacimiento no puede ser mayor a hoy`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  if (loading || mutationEditLoading || mutationLoading || qLoading) return <Loading />;

  return (
    <>
      <PrivateRoute>
        <Head>
          <title>Mi Cuenta</title>
          <link rel='icon' href='/img/Favicon.png' />
        </Head>
        {dataPerfilModificada && (
          <form ref={form} onSubmit={submitData}>
            <CVInputPageContainer>
              <h1 className='font-bold text-gray-500 text-3xl  p-4 font-sans'>Mi Cuenta</h1>
              <CVInputPageContent>
                <Seccion>
                  <div className='grid grid-cols-1 lg:grid-cols-2 mb-20'>
                    <div className='w-52 h-52 p-1 relative md:w-80 md:h-80 justify-self-center block'>
                      <Upload
                        Imagen={
                          dataPerfilModificada.user.Perfil
                            ? dataPerfilModificada.user.Perfil.image !== ''
                              ? dataPerfilModificada.user.Perfil.image
                              : dataPerfilModificada.user.image
                            : ''
                        }
                        setFile={setFile}
                        setDeletePicture={setDeletePicture}
                        Texto={'Seleccione Foto de Perfil'}
                      />
                    </div>
                    <div className='mt-20 grid grid-cols-1 justify-center mx-2 gap-y-1 justify-self-center'>
                      <h1 className='text-center text-black font-semibold text-4xl mb-4'>
                        {dataPerfilModificada.user.Perfil?.name
                          ? dataPerfilModificada.user.Perfil.name
                          : dataPerfilModificada.user.name}
                      </h1>
                      <h2 className='text-gray-500 text-center text-sm font-semibold'>
                        Correo electrónico:
                        <span className='text-black text-sm font-normal'>
                          {dataPerfilModificada.user.email}
                        </span>
                      </h2>
                      {age > 0 && (
                        <h2 className='text-gray-500 text-center text-sm font-semibold'>
                          Edad:
                          <span className='text-black text-sm font-normal'>
                            {dataPerfilModificada.user.Perfil ? age : ''} Años
                          </span>
                        </h2>
                      )}
                      <h2 className='text-gray-500 text-center text-sm font-semibold'>
                        Género:
                        <span className='text-black text-sm font-normal'>
                          {dataPerfilModificada.user.Perfil
                            ? dataPerfilModificada.user.Perfil.gender
                            : ''}
                        </span>
                      </h2>
                      <h2 className='text-gray-500 text-center text-sm font-semibold'>
                        Documento:
                        <span className='text-black text-sm font-normal'>
                          {dataPerfilModificada.user.Perfil
                            ? dataPerfilModificada.user.Perfil.document
                            : ''}
                        </span>
                      </h2>
                    </div>
                  </div>
                </Seccion>
                <Seccion>
                  <div className='grid grid-cols-1 lg:grid-cols-2'>
                    <InputContainer>
                      <span className='my-1 font-semibold text-gray-600'>Correo electrónico</span>
                      <input
                        className='my-1 input bg-white text-gray-500'
                        type='email'
                        id='email'
                        name='email'
                        disabled
                        value={dataPerfilModificada.user.email}
                      />
                    </InputContainer>
                    <InputContainer>
                      <span className='my-1 font-semibold text-gray-600'>
                        Nombre<span className='text-red-500'> *</span>
                      </span>
                      <input
                        className='my-1 input '
                        type='text'
                        id='name'
                        name='name'
                        required
                        value={
                          dataPerfilModificada.user.Perfil?.name
                            ? dataPerfilModificada.user.Perfil.name
                            : dataPerfilModificada.user.name
                        }
                        onChange={(e) =>
                          setDataPerfilModificada({
                            ...dataPerfilModificada,
                            user: {
                              ...dataPerfilModificada.user,
                              name: e.target.value,
                              Perfil: {
                                ...dataPerfilModificada.user.Perfil,
                                name: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </InputContainer>

                    <InputContainer>
                      <span className='my-1 font-semibold text-gray-600'>
                        Cumpleaños<span className='text-red-500'> *</span>
                      </span>
                      <KeyboardDatePicker
                        name='fechaNacimiento'
                        format='dd/MM/yyyy'
                        autoOk
                        cancelLabel='Cancelar'
                        invalidDateMessage='Formato Invalido'
                        maxDateMessage='La fecha no puede ser mayor a Hoy'
                        minDateMessage='La fecha no puede ser menor a 1900'
                        disableFuture
                        openTo='year'
                        animateYearScrolling
                        allowKeyboardControl
                        value={
                          dataPerfilModificada.user.Perfil
                            ? dataPerfilModificada.user.Perfil.fechaNacimiento
                            : ''
                        }
                        onChange={(date) => {
                          setDataPerfilModificada({
                            ...dataPerfilModificada,
                            user: {
                              ...dataPerfilModificada.user,
                              Perfil: {
                                ...dataPerfilModificada.user.Perfil,
                                fechaNacimiento: date,
                              },
                            },
                          });
                        }}
                      />
                    </InputContainer>
                    <InputContainer>
                      <span className='my-1 font-semibold text-gray-600'>
                        Género<span className='text-red-500'> *</span>
                      </span>
                      <select
                        id='gender'
                        name='gender'
                        className='input my-1'
                        value={dataPerfilModificada?.user?.Perfil?.gender ?? ''}
                        onChange={(e) =>
                          setDataPerfilModificada({
                            ...dataPerfilModificada,
                            user: {
                              ...dataPerfilModificada.user,
                              Perfil: {
                                ...dataPerfilModificada.user.Perfil,
                                gender: e.target.value,
                              },
                            },
                          })
                        }
                        required
                      >
                        <option value='' disabled className='text-gray-500'>
                          Seleccione una opción
                        </option>
                        <option className=''>Masculino</option>
                        <option className=''>Femenino</option>
                      </select>
                    </InputContainer>
                    <InputContainer>
                      <span className='my-1 font-semibold text-gray-600'>
                        Tipo de documento
                        <span className='text-red-500'> *</span>
                      </span>
                      <select
                        id='idType'
                        name='typeDocument'
                        className='input my-1'
                        value={dataPerfilModificada.user?.Perfil?.typeDocument ?? ''}
                        onChange={(e) =>
                          setDataPerfilModificada({
                            ...dataPerfilModificada,
                            user: {
                              ...data.user,
                              Perfil: {
                                ...dataPerfilModificada.user.Perfil,
                                typeDocument: e.target.value,
                              },
                            },
                          })
                        }
                        required
                      >
                        <option value='' disabled className='text-gray-500'>
                          Seleccione una opción
                        </option>
                        <option className=''>Cédula de Ciudadanía</option>
                        <option className=''>Cédula de Extranjería</option>
                        <option className=' '>Tarjeta de Identidad</option>
                        <option className=''>Pasaporte</option>
                        <option className=''>Registro Civil de Nacimiento</option>
                      </select>
                    </InputContainer>
                    <InputContainer>
                      <span className='my-1 font-semibold text-gray-600'>
                        Número de documento
                        <span className='text-red-500'> *</span>
                      </span>
                      <input
                        className='my-1 input '
                        type='text'
                        id='idNumber'
                        name='document'
                        value={
                          dataPerfilModificada.user.Perfil
                            ? dataPerfilModificada.user.Perfil.document
                            : ''
                        }
                        onChange={(e) =>
                          setDataPerfilModificada({
                            ...dataPerfilModificada,
                            user: {
                              ...dataPerfilModificada.user,
                              Perfil: {
                                ...dataPerfilModificada.user.Perfil,
                                document: e.target.value,
                              },
                            },
                          })
                        }
                        required
                      />
                    </InputContainer>
                    <span className='text-red-500 my-4'>* Campos obligatorios</span>
                  </div>
                  <div className='flex flex-row justify-end'>
                    <button
                      type='submit'
                      className='uppercase cursor-pointer shadow-lg hover:shadow-xl bg-bluegdm hover:bg-bluegdm_hover py-2 px-4 text-sm font-bold text-white rounded-sm'
                    >
                      Guardar
                    </button>
                    <button className='uppercase cursor-pointer shadow-lg hover:shadow-xl bg-white mx-2 py-2 px-4 text-sm font-bold text-black rounded-sm'>
                      Cancelar
                    </button>
                  </div>
                </Seccion>
              </CVInputPageContent>
            </CVInputPageContainer>
          </form>
        )}
        <ToastContainer />
      </PrivateRoute>
    </>
  );
}
