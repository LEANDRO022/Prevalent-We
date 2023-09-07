import React, { useEffect, useState } from 'react';
import PrivateRoute from 'components/PrivateRoute';
import useFormData from 'hooks/useFormData';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useRouter } from 'next/router';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Loading from 'components/Loading';
import Head from 'next/head';
import { useSession } from 'next-auth/client';
import {
  CVInputPageContainer,
  CVInputPageHeader,
  CVInputPageContent,
  Pregunta,
  Seccion,
  InputContainer,
  CVInputPageFooter,
} from 'components/InputPage';
import prisma from 'config/prisma';
import safeJsonStringify from 'safe-json-stringify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EDITAR_HITO = gql`
  mutation updateHitoPersonal(
    $data: HitoPersonalUpdateInput!
    $where: HitoPersonalWhereUniqueInput!
  ) {
    updateHitoPersonal(data: $data, where: $where) {
      id
    }
  }
`;

const ELIMINAR_HITO = gql`
  mutation deleteHitoPersonal($where: HitoPersonalWhereUniqueInput!) {
    deleteHitoPersonal(where: $where) {
      id
    }
  }
`;

export async function getServerSideProps(context) {
  let hito = await prisma.hitoPersonal.findUnique({
    where: {
      id: context.query.id,
    },
    include: {
      ciudad: {
        include: {
          departamento: {
            include: {
              otro: true,
            },
          },
          otro: true,
        },
      },
      cv: {
        include: {
          user: true,
        },
      },
    },
  });
  hito = JSON.parse(safeJsonStringify(hito));
  const tiposPersonal = await prisma.tipoPersonal.findMany();
  let paises = await prisma.pais.findMany();
  let departamentos = await prisma.departamento.findMany();
  let ciudades = await prisma.ciudad.findMany();
  const stringifiedDatapaises = safeJsonStringify(paises);
  const stringifiedDatadepartamentos = safeJsonStringify(departamentos);
  const stringifiedDataciudades = safeJsonStringify(ciudades);
  paises = JSON.parse(stringifiedDatapaises);
  departamentos = JSON.parse(stringifiedDatadepartamentos);
  ciudades = JSON.parse(stringifiedDataciudades);
  prisma.$disconnect();
  return {
    props: { tiposPersonal, paises, departamentos, ciudades, hito }, // will be passed to the page component as props
  };
}

const createMilestone = ({ tiposPersonal, paises, departamentos, ciudades, hito }) => {
  const [departamento, setDepartamento] = useState(hito.ciudad.departamentoId);
  const [selecCiudad, setSelecCiudad] = useState(ciudades);
  const [mutation, { loading: mutationLoading, error: mutationError }] = useMutation(EDITAR_HITO);
  const [
    deleteMutation,
    { loading: deleteMutationLoading, error: deleteMutationError },
  ] = useMutation(ELIMINAR_HITO);
  const [mLoading, setMloading] = useState(false);
  const [session, loading] = useSession();
  const [fdata, setFdata] = useState(hito);
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [paisesFilt, setPaisesFilt] = useState([]);

  useEffect(() => {
    if (paises !== '') {
      const sorList = [...paises].sort((a, b) =>
        a.nameEs > b.nameEs ? 1 : a.nameEs < b.nameEs ? -1 : 0
      );
      setPaisesFilt(sorList);
    }
  }, [paises]);

  useEffect(() => {
    if (session && hito) {
      if (session.user.id === hito.cv.userId) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } else {
      setIsOwner(false);
    }
  }, [session, hito]);

  useEffect(() => {
    var ciudadesfilter = ciudades.filter(function (ciudad) {
      return ciudad.departamentoId === departamento;
    });
    setSelecCiudad(ciudadesfilter);
  }, [departamento]);

  const submitData = (e) => {
    e.preventDefault();
    const dataSubmit = { ...fdata };
    if (dataSubmit.fecha) {
      const where = {
        id: dataSubmit.id,
      };
      if (!dataSubmit.ciudadId) {
        delete dataSubmit.ciudadId;
        delete dataSubmit.ciudad.departamentoId;
      }
      let data;
      Object.keys(dataSubmit).forEach((el) => {
        if (dataSubmit[el] !== hito[el]) {
          data = { ...data, [el]: { set: dataSubmit[el] } };
        }
      });

      if (
        (dataSubmit.ciudad.departamento.nombre === 'otro' &&
          hito.ciudad.departamento.otro?.nombre !== dataSubmit.ciudad.departamento.nombre) ||
        (dataSubmit.ciudad.nombre === 'otro' &&
          hito.ciudad.otro?.nombre !== dataSubmit.ciudad.nombre)
      ) {
        data = {
          ...data,
          ciudad: {
            create: {
              nombre: 'otra',
              departamento: {
                create: {
                  nombre: 'otro',
                  pais: {
                    connect: {
                      id: parseInt(dataSubmit.ciudad.departamento.paisId),
                    },
                  },
                  otro: {
                    create: {
                      nombre: dataSubmit.ciudad.departamento.otro.nombre,
                    },
                  },
                },
              },
              otro: {
                create: {
                  nombre: dataSubmit.ciudad.otro.nombre,
                },
              },
            },
          },
        };
      } else {
        delete data.ciudad;
      }
      if (Object.keys(data).includes('ciudadId')) {
        data.ciudad = {
          connect: {
            id: data.ciudadId.set,
          },
        };
        delete data.ciudadId;
      }
      mutation({
        variables: { where, data },
      })
        .then(({ data }) => {
          router.push(`/cv/${session.user.id}`);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      toast.error(`Ingrese una fecha`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  useEffect(() => {
    if (session) {
      router.prefetch(`/cv/${session.user.id}`);
    }
  }, [session]);

  useEffect(() => {
    if (mutationLoading || deleteMutationLoading) {
      setMloading(true);
    }
  }, [mutationLoading, deleteMutationLoading]);

  const deleteHito = () => {
    const where = {
      id: fdata.id,
    };
    deleteMutation({
      variables: { where },
    })
      .then(({ data }) => {
        router.push(`/cv/${session.user.id}`);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (loading || mLoading) return <Loading />;

  return (
    <PrivateRoute>
      <Head>
        <title>Hito</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      <form onSubmit={submitData}>
        <CVInputPageContainer>
          {isOwner && (
            <CVInputPageHeader
              sectionName='Crear Hito'
              buttonName='GUARDAR HITO'
              deleteButton={true}
              deleteFunction={deleteHito}
            />
          )}
          <CVInputPageContent>
            {isOwner && (
              <>
                <p className='text-bluegdm m-4'>
                  En nuestra vida pasan muchas cosas, y ocurren de dimensiones que han quedado fuera
                  del esquema tradicional de los CV. Sin embargo, esos eventos hacen parte de
                  nuestra historia y ayudan a definirnos.
                </p>
                <p className='text-bluegdm m-4'>
                  {' '}
                  A esos eventos los llamamos <span className='font-semibold'>"HITOS"</span>.
                </p>
                <p className='text-bluegdm m-4'>
                  {' '}
                  ¿Qué quieres contarnos? Cuéntanos por ejemplo cuando ganaste una competencia
                  deportiva como aficionado <span className='font-semibold'>
                    (Hito Deportivo)
                  </span>{' '}
                  ;
                </p>
                <p className='text-bluegdm m-4'>
                  {' '}
                  O cuéntanos cuando creaste tu primera página web y si es de contenido{' '}
                  <span className='font-semibold'>académico, profesional,</span> o de otro tipo.
                  Cuéntale al mundo sobre esos momentos que también hacen parte de tu historia y de
                  lo que eres actualmente.
                </p>
              </>
            )}
            <Seccion>
              <Pregunta>¿Qué?</Pregunta>
              <div className=' my-4 grid grid-cols-1 gap-y-4 md:grid-cols-2'>
                <InputContainer>
                  <span className='my-1'>Nombre *</span>
                  <input
                    required
                    disabled={!isOwner ? true : false}
                    className='my-1 input'
                    type='text'
                    value={fdata.nombre}
                    onChange={(e) => setFdata({ ...fdata, nombre: e.target.value })}
                    placeholder='Ej. Nacimiento de tu hijo, Distinción laboral, Premio académico'
                    name='nombre'
                  />
                </InputContainer>
                <InputContainer>
                  <span className='my-1'>Tipo *</span>
                  <select
                    disabled={!isOwner ? true : false}
                    required
                    name='tipoId'
                    value={fdata.tipoId ?? ''}
                    onChange={(e) => setFdata({ ...fdata, tipoId: e.target.value })}
                    className='my-1 input'
                  >
                    <option value='' disabled>
                      Seleccione una opción
                    </option>
                    {tiposPersonal &&
                      tiposPersonal
                        .sort((a, b) =>
                          a.prioridad > b.prioridad ? 1 : a.prioridad < b.prioridad ? -1 : 0
                        )
                        .map((tipo) => {
                          return (
                            <option value={tipo.id} key={`TipoPer${tipo.id}`}>
                              {tipo.nombre}
                            </option>
                          );
                        })}
                  </select>
                </InputContainer>
                <div className='md:col-span-2'>
                  <InputContainer className='col-span-2'>
                    <label className='my-1'>
                      Descripción <span className='font-normal text-gray-400'>Opcional</span>
                    </label>
                    <textarea
                      disabled={!isOwner ? true : false}
                      name='descripcion'
                      value={fdata.descripcion}
                      onChange={(e) => setFdata({ ...fdata, descripcion: e.target.value })}
                      cols={30}
                      rows={3}
                      className='my-1 input'
                    />
                  </InputContainer>
                </div>
              </div>
            </Seccion>
            <Seccion>
              <Pregunta>¿Cuándo?</Pregunta>
              <div className='my-4 max-w-sm'>
                <InputContainer>
                  <span className='my-1'>Fecha *</span>
                  <KeyboardDatePicker
                    name='fecha'
                    format='dd/MM/yyyy'
                    autoOk
                    openTo='year'
                    animateYearScrolling
                    cancelLabel='Cancelar'
                    invalidDateMessage='Formato Invalido'
                    maxDateMessage='La fecha no puede ser mayor a Hoy'
                    minDateMessage='La fecha no puede ser menor a 1900'
                    disableFuture
                    value={fdata.fecha}
                    onChange={(date) => setFdata({ ...fdata, fecha: date })}
                  />
                </InputContainer>
              </div>
            </Seccion>
            <Seccion>
              <Pregunta>¿Dónde?</Pregunta>
              <div className='grid grid-cols-1 lg:grid-cols-3'>
                <InputContainer>
                  <span className='my-1'>País *</span>
                  <select
                    disabled={!isOwner ? true : false}
                    required
                    id='pais'
                    name='pais'
                    className='my-1 input'
                    value={fdata.ciudad.departamento.paisId}
                    onChange={(e) => {
                      setFdata({
                        ...fdata,
                        ciudad: {
                          ...fdata.ciudad,
                          departamento: {
                            ...fdata.ciudad.departamento,
                            paisId: parseInt(e.target.value),
                            otro: { nombre: '' },
                          },
                          otro: { nombre: '' },
                          departamentoId: null,
                        },
                        ciudadId: null,
                      });
                      setDepartamento(1);
                    }}
                  >
                    {paisesFilt &&
                      paisesFilt.map((pais) => {
                        return (
                          <option
                            selected={pais.id == '46' ? true : false}
                            value={pais.id}
                            key={`Pais${pais.id}`}
                          >
                            {pais.nameEs}
                          </option>
                        );
                      })}
                  </select>
                </InputContainer>
                <InputContainer>
                  <span className='my-1'>Departamento/Estado *</span>
                  {fdata.ciudad.departamento.paisId === 46 ? (
                    <select
                      disabled={!isOwner ? true : false}
                      required
                      id='departamento-select'
                      name='departamento'
                      className='my-1 input'
                      value={
                        fdata?.ciudad?.departamentoId ? parseInt(fdata.ciudad.departamentoId) : -1
                      }
                      onChange={(e) => {
                        setDepartamento(parseInt(e.target.value));
                        setFdata({
                          ...fdata,
                          ciudad: {
                            ...fdata.ciudad,
                            departamentoId: parseInt(e.target.value),
                            departamento: {
                              ...fdata.ciudad.departamento,
                              nombre: e.target.selectedOptions[0].innerText,
                            },
                          },
                          ciudadId: null,
                        });
                      }}
                    >
                      <option value={-1} disabled className='text-gray-500'>
                        Seleccione una opción
                      </option>
                      {departamentos &&
                        departamentos.map((departamento) => {
                          if (departamento.nombre !== 'otro') {
                            return (
                              <option
                                value={departamento.id}
                                key={`Departamento${departamento.id}`}
                              >
                                {departamento.nombre}
                              </option>
                            );
                          }
                        })}
                    </select>
                  ) : (
                    <input
                      required
                      disabled={!isOwner ? true : false}
                      className='my-1 input'
                      type='text'
                      placeholder='Ej. Florida, Texas,...'
                      name='departamento_otro'
                      value={fdata?.ciudad?.departamento?.otro?.nombre ?? ''}
                      onChange={(e) => {
                        setFdata({
                          ...fdata,
                          ciudad: {
                            ...fdata.ciudad,
                            departamento: {
                              ...fdata.ciudad.departamento,
                              nombre: 'otro',
                              otro: {
                                ...fdata.ciudad.departamento.otro,
                                nombre: e.target.value,
                              },
                            },
                          },
                        });
                      }}
                    />
                  )}
                </InputContainer>
                <InputContainer>
                  <span className='my-1'>Ciudad/Provincia *</span>
                  {fdata.ciudad.departamento.paisId === 46 ? (
                    <select
                      disabled={!isOwner ? true : false}
                      required
                      id='ciudad-select'
                      name='ciudad'
                      className='my-1 input'
                      value={fdata.ciudadId ? parseInt(fdata.ciudadId) : -1}
                      onChange={(e) => {
                        setFdata({
                          ...fdata,
                          ciudadId: parseInt(e.target.value),
                          ciudad: {
                            ...fdata.ciudad,
                            nombre: e.target.selectedOptions[0].innerText,
                          },
                        });
                      }}
                    >
                      <option value={-1} disabled className='text-gray-500'>
                        Seleccione una opción
                      </option>
                      {selecCiudad &&
                        selecCiudad.map((ciudad) => {
                          if (ciudad.nombre !== 'otra') {
                            return (
                              <option
                                label={ciudad.nombre}
                                value={ciudad.id}
                                key={`Ciudad${ciudad.id}`}
                              >
                                {ciudad.nombre}
                              </option>
                            );
                          }
                        })}
                    </select>
                  ) : (
                    <input
                      required
                      disabled={!isOwner ? true : false}
                      className='my-1 input'
                      type='text'
                      placeholder='Ej. Miami, Austin '
                      name='ciudad_otro'
                      value={fdata.ciudad.otro ? fdata.ciudad.otro.nombre : ''}
                      onChange={(e) => {
                        setFdata({
                          ...fdata,
                          ciudad: {
                            ...fdata.ciudad,
                            nombre: 'otro',
                            otro: {
                              ...fdata.ciudad.otro,
                              nombre: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  )}
                </InputContainer>
              </div>
            </Seccion>
          </CVInputPageContent>
          {isOwner && <CVInputPageFooter buttonName='Guardar Hito' />}
        </CVInputPageContainer>
      </form>
      <ToastContainer />
    </PrivateRoute>
  );
};

export default createMilestone;
