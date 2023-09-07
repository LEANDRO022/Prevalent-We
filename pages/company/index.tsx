import Upload from '@components/custom/Upload';
import UploadDoc from '@components/custom/UploadDoc';
import React, { useState, useEffect } from 'react';
import PrivateRoute, { AdminRoute } from 'components/PrivateRoute';
import useFormData from 'hooks/useFormData';
import { useSession } from 'next-auth/client';
import { useQuery } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import uploadFile from 'utils/uploadS3';
import Loading from '@components/Loading';
import Head from 'next/head';
import {
  CVInputPageContainer,
  CVInputPageContent,
  Seccion,
  InputContainer,
} from 'components/InputPage';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import prisma from 'config/prisma';
import safeJsonStringify from 'safe-json-stringify';
import 'react-toastify/dist/ReactToastify.css';

const GET_EMPRESA = gql`
  query user($where: EmpresaWhereInput!) {
    empresas(where: $where) {
      id
      name
      legalName
      idType
      idNumber
      approved
      adminId
      approverId
      approvedDate
      datos {
        logo
        rut
        camara
        tamano
      }
    }
  }
`;

const EDITAR_EMPRESA = gql`
  mutation updateEmpresa($data2: EmpresaUpdateInput!, $where: EmpresaWhereUniqueInput!) {
    updateEmpresa(data: $data2, where: $where) {
      id
    }
  }
`;

const CREAR_EMPRESA = gql`
  mutation createEmpresa($data1: EmpresaCreateInput!) {
    createEmpresa(data: $data1) {
      id
    }
  }
`;

export async function getServerSideProps() {
  const validador = await prisma.user.findFirst({
    where: {
      roles: {
        some: {
          name: 'superuser',
        },
      },
      name: {
        contains: 'Hugo',
      },
    },
  });
  return {
    props: {
      validador: JSON.parse(safeJsonStringify(validador)),
    },
  };
}

export default function Company({ validador }) {
  const [form, getFormData] = useFormData(null);
  const [deleteLogo, setDeleteLogo] = useState(false);
  const [logo, setLogo] = useState(null);
  const [RUT, setRUT] = useState(null);
  const router = useRouter();
  const [deleteRUT, setDeleteRUT] = useState(false);
  const [CamaraComercio, setCamaraComercio] = useState(null);
  const [deleteCamaraComercio, setDeleteCamaraComercio] = useState(false);
  const [session, loading] = useSession();
  const [loadingAWS, setLoadingAWS] = useState(false);
  const [mutationEdit, { loading: mutationEditLoading, error: mutatioEditnError }] = useMutation(
    EDITAR_EMPRESA
  );
  const [mutation, { loading: mutationLoading, error: mutationError }] = useMutation(CREAR_EMPRESA);
  const { loading: qLoading, error, data, refetch } = useQuery(GET_EMPRESA, {
    variables: {
      where: {
        admin: {
          is: {
            id: {
              equals: session ? session.user.id : '',
            },
          },
        },
      },
    },
  });
  const [dataEmpresa, setDataEmpresa] = useState({} as any);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (deleteCamaraComercio) {
      setDataEmpresa({
        ...dataEmpresa,
        datos: { ...dataEmpresa.datos, camara: null },
      });
      setDeleteCamaraComercio(false);
      setCamaraComercio(null);
    }
  }, [deleteCamaraComercio]);

  useEffect(() => {
    if (deleteRUT) {
      setDataEmpresa({
        ...dataEmpresa,
        datos: { ...dataEmpresa.datos, rut: null },
      });
      setDeleteRUT(false);
      setRUT(null);
    }
  }, [deleteRUT]);

  useEffect(() => {
    if (data && data.empresas) {
      setDataEmpresa(data.empresas[0]);
    }
  }, [data]);

  useEffect(() => {
    console.log(`RUT`, RUT);
  }, [RUT]);

  const submitData = async (e) => {
    e.preventDefault();
    if (data?.empresas?.length === 0) {
      const dt = getFormData();
      var docs;
      if (logo && RUT && CamaraComercio) {
        setLoadingAWS(true);
        var filePath = await uploadFile('CompanyData', dt.idNumber, logo);
        docs = { logo: filePath };

        filePath = await uploadFile('CompanyData', dt.idNumber, RUT);
        docs = { ...docs, rut: filePath };

        filePath = await uploadFile('CompanyData', dt.idNumber, CamaraComercio);
        docs = { ...docs, camara: filePath };

        const data1 = {
          ...dt,
          approved: false,
          admin: {
            connect: { id: session.user.id },
          },
          approver: {
            connect: { id: validador.id },
          },
          datos: {
            create: {
              logo: docs?.logo ?? '',
              rut: docs?.rut ?? '',
              camara: docs?.camara ?? '',
              tamano: dt.empleados,
            },
          },
        };
        delete data1.empleados;

        mutation({
          variables: { data1 },
        })
          .then(({ data }) => {
            setLoadingAWS(false);
            toast.success(`Solicitud enviada con éxito`, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            refetch();
          })
          .catch((e) => {
            setLoadingAWS(false);
            toast.error(`Hubo un error en tu solicitud`, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            console.error(e);
          });
      } else {
        toast.error(`Debes ingresar todos los documentos`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      const where = {
        id: dataEmpresa?.id,
      };

      let data2 = {};
      let data3 = {};
      Object.keys(dataEmpresa).forEach((el) => {
        if (dataEmpresa[el] !== data.empresas[0][el]) {
          data2 = { ...data2, [el]: { set: dataEmpresa[el] } };
        }
      });
      Object.keys(dataEmpresa?.datos && dataEmpresa?.datos).forEach((el) => {
        if (dataEmpresa?.datos[el] !== data.empresas[0].datos[el]) {
          data3 = { ...data3, [el]: { set: dataEmpresa?.datos[el] } };
        }
      });

      if (deleteLogo) {
        data3 = { ...data3, logo: { set: '' } };
      } else {
        if (logo) {
          var filePath = await uploadFile('CompanyData', dataEmpresa?.idNumber, logo);
          data3 = { ...data3, logo: { set: filePath } };
        }
      }
      if (deleteRUT) {
        data3 = { ...data3, rut: { set: '' } };
      } else {
        if (RUT) {
          var filePath = await uploadFile('CompanyData', dataEmpresa?.idNumber, RUT);
          data3 = { ...data3, rut: { set: filePath } };
        }
      }
      if (deleteCamaraComercio) {
        data3 = { ...data3, camara: { set: '' } };
      } else {
        if (CamaraComercio) {
          var filePath = await uploadFile('CompanyData', dataEmpresa?.idNumber, CamaraComercio);
          data3 = { ...data3, camara: { set: filePath } };
        }
      }

      data2 = {
        ...data2,
        datos: { update: { ...data3 } },
      };
      mutationEdit({
        variables: { where, data2 },
      })
        .then(({ data }) => {
          setLoadingAWS(false);
          toast.success(`Solicitud enviada con éxito`, {
            position: toast.POSITION.BOTTOM_CENTER,
          });

          router.reload();
          refetch();
        })
        .catch((e) => {
          setLoadingAWS(false);
          toast.error(`Hubo un error en tu solicitud`, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          console.error(e);
        });
    }
  };

  if (loading || mutationEditLoading || mutationLoading || qLoading || loadingAWS) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Empresa</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      {session.user.roles.filter((el) => el.name === 'admin' || el.name === 'superuser').length >
      0 ? (
        <AdminRoute>
          <form ref={form} onSubmit={submitData}>
            {data.empresas[0] && (
              <>
                {dataEmpresa?.approved ? (
                  <div className='bg-green-500 text-lg text-center text-white p-4'>
                    Empresa Certificada por el equipo de Gente De Mente
                  </div>
                ) : (
                  <div className='bg-red-400 text-lg text-center text-white p-4'>
                    Empresa en curso de verificación por parte del equipo de Gente De Mente
                  </div>
                )}
              </>
            )}
            <CVInputPageContainer>
              <h1 className='font-bold text-gray-500 text-3xl  p-4 font-sans'>Mi Empresa</h1>
              <CVInputPageContent>
                <Seccion>
                  <div className='grid grid-cols-1 lg:grid-cols-2 mb-20'>
                    <div className='w-60 relative h-52 md:w-80 md:h-80 justify-self-center block mb-20 md:mb-10'>
                      <Upload
                        Imagen={dataEmpresa?.datos?.logo ?? ''}
                        Texto={'Selecciona un logo para la empresa'}
                        setFile={setLogo}
                        setDeletePicture={setDeleteLogo}
                      />
                    </div>
                    <div className='mt-20 grid grid-cols-1 justify-center mx-2 gap-y-1 justify-self-center'>
                      <h1 className='text-center text-black font-semibold text-4xl'>
                        {dataEmpresa?.name}
                      </h1>
                      <h2 className='text-gray-500 text-center text-md font-semibold'>
                        Número de Documento:
                        <span className='text-black text-md font-normal'>
                          {dataEmpresa?.idNumber}
                        </span>
                      </h2>
                      <h2 className='text-gray-500 text-center text-md font-semibold'>
                        Empleados:
                        <span className='text-black text-md font-normal'>
                          {dataEmpresa?.datos?.tamano}
                        </span>
                      </h2>
                    </div>
                  </div>
                </Seccion>

                <div className='grid grid-cols-1 lg:grid-cols-2 mb-12'>
                  <InputContainer>
                    <span className='my-1 font-semibold text-gray-600'>Nombre de la empresa</span>
                    <input
                      className='my-1 input bg-white'
                      type='text'
                      id='name'
                      name='name'
                      value={dataEmpresa?.name ?? ''}
                      onChange={(e) =>
                        setDataEmpresa({
                          ...dataEmpresa,
                          name: e.target.value,
                        })
                      }
                    />
                  </InputContainer>
                  <InputContainer>
                    <span className='my-1 font-semibold text-gray-600'>
                      Razón Social<span className='text-red-500'> *</span>
                    </span>
                    <input
                      className='my-1 input '
                      type='text'
                      id='legalName'
                      name='legalName'
                      required
                      value={dataEmpresa?.legalName ?? ''}
                      onChange={(e) =>
                        setDataEmpresa({
                          ...dataEmpresa,
                          legalName: e.target.value,
                        })
                      }
                    />
                  </InputContainer>
                  <InputContainer>
                    <span className='my-1 font-semibold text-gray-600'>
                      Tipo de Identificación
                      <span className='text-red-500'> *</span>
                    </span>
                    <select
                      required
                      id='idType'
                      name='idType'
                      className='my-1 input'
                      value={dataEmpresa?.idType ?? ''}
                      onChange={(e) =>
                        setDataEmpresa({
                          ...dataEmpresa,
                          idType: e.target.value,
                        })
                      }
                    >
                      <option value='' className='text-gray-500' disabled>
                        Seleccione una opción
                      </option>
                      <option value={'NIT'}>NIT</option>
                      <option value={'C.C'}>C.C</option>
                    </select>
                  </InputContainer>
                  <InputContainer>
                    <span className='my-1 font-semibold text-gray-600'>
                      Número de Identificación
                      <span className='text-red-500'> *</span>
                    </span>
                    <input
                      className='my-1 input '
                      type='text'
                      id='idNumber'
                      name='idNumber'
                      required
                      value={dataEmpresa?.idNumber ?? ''}
                      onChange={(e) =>
                        setDataEmpresa({
                          ...dataEmpresa,
                          idNumber: e.target.value,
                        })
                      }
                    />
                  </InputContainer>
                  <InputContainer>
                    <span className='my-1 font-semibold text-gray-600'>
                      # de Empleados<span className='text-red-500'> *</span>
                    </span>
                    <select
                      id='empleados'
                      name='empleados'
                      className='input my-1'
                      value={dataEmpresa?.datos?.tamano ?? ''}
                      onChange={(e) =>
                        setDataEmpresa({
                          ...dataEmpresa,
                          datos: {
                            ...dataEmpresa?.datos,
                            tamano: e.target.value,
                          },
                        })
                      }
                      required
                    >
                      <option value='' className='text-gray-500' disabled>
                        Seleccione una opción
                      </option>
                      <option value={'1-10'}>1-10</option>
                      <option value={'11-50'}>11-50</option>
                      <option value={'51-100'}>51-100</option>
                      <option value={'101-500'}>101-500</option>
                      <option value={'501-1000'}>501-1000</option>
                      <option value={'1000+'}>1000+</option>
                    </select>
                  </InputContainer>
                  <span className='text-red-500 my-4'>* Campos obligatorios</span>
                </div>
              </CVInputPageContent>
            </CVInputPageContainer>

            <CVInputPageContainer>
              <div className='flex flex-wrap text-gray-500 p-4'>
                <i className='fas fa-file text-2xl mr-4'></i>
                <h1 className='font-bold  text-3xl font-sans'>Documentación</h1>
              </div>
              <CVInputPageContent>
                <Seccion>
                  <div className='grid grid-cols-1 lg:grid-cols-2 mb-8'>
                    <div className='w-72 h-52 md:w-96 md:h-40 justify-self-center block text-center'>
                      <div className='my-1 font-semibold text-gray-600 '>
                        <span>RUT: </span>
                        <span className='text-red-500'>*</span>
                        <div className='w-full flex items-center'>
                          <p className='overflow-ellipsis overflow-hidden w-full'>
                            {dataEmpresa?.datos?.rut?.split('/')[6] ?? RUT?.name ?? ''}
                          </p>
                          {dataEmpresa?.datos?.rut && (
                            <a href={dataEmpresa?.datos?.rut} download='descarga'>
                              <i className='fas fa-file-pdf text-2xl text-red-700 hover:text-red-400 m-4'></i>
                            </a>
                          )}
                        </div>
                      </div>
                      <UploadDoc
                        Doc={dataEmpresa?.datos?.rut ?? ''}
                        Texto={'Selecciona el RUT'}
                        setFile={setRUT}
                        setDeleteDocument={setDeleteRUT}
                        inputOff={true}
                      />
                    </div>
                    <div className='w-72 h-52 md:w-96 md:h-40 justify-self-center block text-center'>
                      <div className='my-1 font-semibold text-gray-600'>
                        <span>Cámara de Comercio: </span>
                        <span className='text-red-500'>*</span>
                        <div className='w-full flex items-center'>
                          <p className='overflow-ellipsis overflow-hidden w-full'>
                            {dataEmpresa?.datos?.camara?.split('/')[6] ??
                              CamaraComercio?.name ??
                              ''}
                          </p>
                          {dataEmpresa?.datos?.camara && (
                            <a href={dataEmpresa?.datos?.camara} download='descarga'>
                              <i className='fas fa-file-pdf text-2xl text-red-700 hover:text-red-400 m-4 '></i>
                            </a>
                          )}
                        </div>
                      </div>
                      <UploadDoc
                        Doc={dataEmpresa?.datos?.camara ?? ''}
                        Texto={'Selecciona la Cámara de Comercio'}
                        setFile={setCamaraComercio}
                        setDeleteDocument={setDeleteCamaraComercio}
                        inputOff={true}
                      />
                    </div>
                  </div>
                  <div className='flex flex-row justify-end mt-32 '>
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
                <ToastContainer />
              </CVInputPageContent>
            </CVInputPageContainer>
          </form>
          <ToastContainer />
        </AdminRoute>
      ) : (
        <PrivateRoute>
          <CVInputPageContainer>
            {dataEmpresa?.approved ? (
              <>
                <div>Mi Empresa</div>
                <div>{dataEmpresa?.name}</div>
                <div>{dataEmpresa?.idNumber}</div>
              </>
            ) : (
              <>
                <div>
                  Aún no estás asociado(a) a ninguna empresa. Pídele a tu administrador que te
                  registre como empleado(a)
                </div>
              </>
            )}
          </CVInputPageContainer>
        </PrivateRoute>
      )}
    </>
  );
}
