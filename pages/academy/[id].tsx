import React, { useEffect, useState } from 'react';
import PrivateRoute from 'components/PrivateRoute';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useRouter } from 'next/router';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Head from 'next/head';
import {
  CVInputPageContainer,
  CVInputPageHeader,
  CVInputPageContent,
  Pregunta,
  Seccion,
  InputContainer,
  CustomCheckbox,
  CVInputPageFooter,
} from 'components/InputPage';
import prisma from 'config/prisma';
import safeJsonStringify from 'safe-json-stringify';
import Loading from 'components/Loading';
import { useSession } from 'next-auth/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EDITAR_HITO = gql`
  mutation updateHitoAcademico(
    $data: HitoAcademicoUpdateInput!
    $where: HitoAcademicoWhereUniqueInput!
  ) {
    updateHitoAcademico(data: $data, where: $where) {
      id
    }
  }
`;

const ELIMINAR_HITO = gql`
  mutation deleteHitoAcademico($where: HitoAcademicoWhereUniqueInput!) {
    deleteHitoAcademico(where: $where) {
      id
    }
  }
`;
//Para Prueba
export async function getServerSideProps(context) {
  let hito = await prisma.hitoAcademico.findUnique({
    where: {
      id: context.query.id,
    },
    include: {
      programa: true,
      institucion: {
        include: {
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
  const tiposAcademia = await prisma.tipoAcademico.findMany();
  let paises = await prisma.pais.findMany();
  paises = JSON.parse(safeJsonStringify(paises));
  let instituciones = await prisma.institucion.findMany();
  instituciones = JSON.parse(safeJsonStringify(instituciones));
  prisma.$disconnect();
  return {
    props: { tiposAcademia, paises, instituciones, hito }, // will be passed to the page component as props
  };
}

const EditHitoAcademico = ({ tiposAcademia, paises, instituciones, hito }) => {
  const [boolTitulo, setBooltitulo] = useState(true);
  const [boolEnCurso, setBoolEnCurso] = useState(false);
  const [paisSel, setPaisSel] = useState(hito.institucion.countryId);
  const [mutation, { loading: mutationLoading, error: mutationError }] = useMutation(EDITAR_HITO);
  const [
    deleteMutation,
    { loading: deleteMutationLoading, error: deleteMutationError },
  ] = useMutation(ELIMINAR_HITO);
  const [mutLoading, setMutLoading] = useState(false);
  const router = useRouter();
  const [session, loading] = useSession();
  const [instFilt, setInstFilt] = useState([]);
  const [fdata, setFdata] = useState(hito);
  const [paisesFilt, setPaisesFilt] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [programaFilter, setProgramaFilter] = useState();
  const [institucionSeleccionada, setInstitucionSeleccionada] = useState(0);
  const [otraInst, setOtraInst] = useState('');

  useEffect(() => {
    if (session) {
      router.prefetch(`/cv/${session.user.id}`);
    }
  }, [session]);

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
    if (fdata) {
      if (!fdata.fechaFin) {
        setBoolEnCurso(true);
      } else {
        setBoolEnCurso(false);
      }
    }
  }, []);

  useEffect(() => {
    if (paises !== '') {
      const sorList = [...paises].sort((a, b) =>
        a.nameEs > b.nameEs ? 1 : a.nameEs < b.nameEs ? -1 : 0
      );
      setPaisesFilt(sorList);
    }
  }, [paises]);

  useEffect(() => {
    if (boolEnCurso) {
      setFdata({ ...fdata, fechaFin: null });
    }
  }, [boolEnCurso]);

  useEffect(() => {
    if (paisSel !== '') {
      const InstFilter = instituciones.filter((el) => el.countryId === parseInt(paisSel));
      setInstFilt(InstFilter.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)));
    }
  }, [instituciones, paisSel]);

  const submitData = (e) => {
    e.preventDefault();

    const where = {
      id: fdata.id,
    };
    if (fdata.fechaInicio) {
      if (
        (fdata.fechaFin ? new Date(fdata.fechaInicio) < new Date(fdata.fechaFin) : true) ||
        boolEnCurso
      ) {
        let data = {} as any;
        Object.keys(fdata).forEach((el) => {
          if (fdata[el] !== hito[el]) {
            data = { ...data, [el]: { set: fdata[el] } };
          }
        });
        if (Object.keys(data).includes('institucionId')) {
          data = {
            ...data,
            institucion: {
              connect: {
                id: parseInt(data.institucionId.set),
              },
            },
          };
        }
        if (
          (fdata.institucion?.name === 'otra' || institucionSeleccionada === -1) &&
          fdata.institucion.otro?.name !== hito.institucion.otro?.name
        ) {
          data.institucion = {
            create: {
              name: 'otra',
              web_pages: 'NA',
              domains: 'NA',
              alpha_two_code: 'NA',
              country: {
                connect: {
                  id: parseInt(paisSel),
                },
              },
              otro: {
                create: {
                  name: fdata.institucion.otro.name,
                },
              },
            },
          };
        }
        delete data.institucionId;
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
        toast.error(`Fecha de fin no puede ser menor a fecha de inicio`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
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
      setMutLoading(true);
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

  if (loading || mutLoading) return <Loading />;

  return (
    <PrivateRoute>
      <Head>
        <title>Académico</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      {fdata && (
        <form onSubmit={submitData}>
          <CVInputPageContainer>
            {isOwner && (
              <CVInputPageHeader
                sectionName='Editar información académica'
                buttonName='Guardar Información Académica'
                deleteButton={true}
                deleteFunction={deleteHito}
              />
            )}
            <CVInputPageContent>
              <Seccion>
                <Pregunta>¿Qué?</Pregunta>
                <div className='grid grid-cols-1 md:grid-cols-2'>
                  <InputContainer>
                    <span className='my-1'>Tipo *</span>
                    <select
                      required
                      name='tipoId'
                      className='my-1 input'
                      disabled
                      value={fdata.programa.tipoId}
                    >
                      <option value='' disabled selected>
                        Seleccione una opción
                      </option>
                      {tiposAcademia &&
                        tiposAcademia
                          .sort((a, b) =>
                            a.prioridad > b.prioridad ? 1 : a.prioridad < b.prioridad ? -1 : 0
                          )
                          .map((tipo) => {
                            return (
                              <option value={tipo.id} key={`TipoAc${tipo.id}`}>
                                {tipo.nombre}
                              </option>
                            );
                          })}
                    </select>
                  </InputContainer>
                  {isOwner && fdata.programa.tipoId > 1 && (
                    <CustomCheckbox
                      bool={boolTitulo}
                      setBool={setBooltitulo}
                      texto='¿Este estudio te entregó un título?'
                    />
                  )}
                  {isOwner && boolTitulo && (
                    <TituloPrograma tipoA={fdata.programa.tipoId} selected={fdata} />
                  )}
                </div>
              </Seccion>
              <Seccion>
                <Pregunta>¿Cuándo?</Pregunta>
                <div>
                  {isOwner && (
                    <CustomCheckbox
                      bool={boolEnCurso}
                      setBool={setBoolEnCurso}
                      texto='¿Aún estás cursándolo?'
                    />
                  )}
                  <div className='grid grid-cols-1 md:grid-cols-2 md:grid-rows1'>
                    <InputContainer>
                      <span className='my-1'>Desde Cuándo *</span>
                      {fdata.fechaInicio !== '' && (
                        <KeyboardDatePicker
                          name='fechaInicio'
                          format='dd/MM/yyyy'
                          autoOk
                          openTo='year'
                          animateYearScrolling
                          cancelLabel='Cancelar'
                          invalidDateMessage='Formato Invalido'
                          maxDateMessage='La fecha no puede ser mayor a Hoy'
                          minDateMessage='La fecha no puede ser menor a 1900'
                          disableFuture
                          required
                          value={fdata.fechaInicio}
                          onChange={(date) => setFdata({ ...fdata, fechaInicio: date })}
                        />
                      )}
                    </InputContainer>
                    {!boolEnCurso && (
                      <InputContainer>
                        <>
                          <span className='my-1'>Hasta Cuándo</span>
                          <KeyboardDatePicker
                            name='fechaInicio'
                            format='dd/MM/yyyy'
                            autoOk
                            openTo='year'
                            animateYearScrolling
                            cancelLabel='Cancelar'
                            invalidDateMessage='Formato Invalido'
                            maxDateMessage='La fecha no puede ser mayor a Hoy'
                            minDateMessage='La fecha no puede ser menor a 1900'
                            disableFuture
                            value={fdata.fechaFin}
                            onChange={(date) => setFdata({ ...fdata, fechaFin: date })}
                          />
                        </>
                      </InputContainer>
                    )}
                  </div>
                </div>
              </Seccion>
              <Seccion>
                <Pregunta>¿Dónde?</Pregunta>
                <div className='grid grid-cols-1 md:grid-cols-3 md:grid-rows-1 lg:items-end'>
                  <div className='md:col-span-1'>
                    <InputContainer>
                      <span className='my-1'>País *</span>
                      <select
                        required
                        disabled={!isOwner ? true : false}
                        className='my-1 input'
                        name='pais'
                        value={paisSel}
                        onChange={(e) => {
                          setPaisSel(parseInt(e.target.value));
                          setFdata({
                            ...fdata,
                            institucion: {
                              ...fdata.institucion,
                              id: '',
                              name: '',
                              otro: { ...fdata.institucion.otro, name: '' },
                            },
                          });
                        }}
                      >
                        <option disabled value=''>
                          Escoja un país
                        </option>
                        {paisesFilt.map((pais) => {
                          return (
                            <option value={pais.id} key={`PaisSelect${pais.id}​​`}>
                              {pais.nameEs}
                            </option>
                          );
                        })}
                      </select>
                    </InputContainer>
                  </div>
                  <div className='md:col-span-2'>
                    <InputContainer>
                      <span className='my-1'>Institución *</span>
                      <div className='flex flex-col lg:flex-row'>
                        <select
                          required
                          disabled={!isOwner ? true : false}
                          className='my-1 input lg:w-1/2'
                          name='institucion'
                          value={fdata.institucion.name === 'otra' ? '-1' : fdata.institucion.id}
                          onChange={(e) => {
                            setFdata({
                              ...fdata,
                              institucionId: parseInt(e.target.value),
                              institucion: {
                                ...fdata.institucion,
                                name: '',
                                id: parseInt(e.target.value),
                              },
                            });
                            setInstitucionSeleccionada(parseInt(e.target.value));
                          }}
                        >
                          <option value='' disabled>
                            Seleccione la institución
                          </option>
                          {instFilt.map((el) => {
                            if (el.name !== 'otra') {
                              return (
                                <option value={el.id} key={`InstitucionSelect${el.id}​​`}>
                                  {el.name}
                                </option>
                              );
                            }
                          })}
                          <option value='-1'>Otra</option>
                        </select>
                        {(fdata.institucion.name === 'otra' || institucionSeleccionada === -1) && (
                          <input
                            required
                            className='p-1 my-1 lg:mx-2 lg:w-1/2 input'
                            placeholder='Ingrese el nombre de la institución'
                            value={fdata.institucion.otro?.name ?? ''}
                            onChange={(e) =>
                              setFdata({
                                ...fdata,
                                institucion: {
                                  ...fdata.institucion,
                                  otro: {
                                    ...fdata.institucion.otro,
                                    name: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        )}
                      </div>
                    </InputContainer>
                  </div>
                </div>
              </Seccion>
            </CVInputPageContent>
            {isOwner && <CVInputPageFooter buttonName='Guardar Información Académica' />}
          </CVInputPageContainer>
        </form>
      )}
      <ToastContainer />
    </PrivateRoute>
  );
};

const TituloPrograma = ({ tipoA, selected }) => {
  return (
    <>
      <InputContainer>
        <span className={`my-1 ${tipoA === 1 && 'hidden'}`}>Título</span>
        <input
          required
          disabled
          value={selected.titulo}
          name='titulo'
          className={`my-1 input ${tipoA === 1 && 'hidden'} ${tipoA >= 2 && 'text-gray-500'}`}
        />
      </InputContainer>
      <InputContainer>
        <span className={`my-1 ${(tipoA === 1 || tipoA === 9) && 'hidden'}`}>Programa</span>
        <input
          required
          disabled
          value={selected.programa.name}
          type='text'
          className={`my-1 input ${(tipoA === 1 || tipoA === 9) && 'hidden'} ${
            tipoA >= 2 && 'text-gray-500'
          }`}
          name='programa'
          placeholder='Escribe el nombre de tu programa'
        />
      </InputContainer>
    </>
  );
};

export default EditHitoAcademico;
