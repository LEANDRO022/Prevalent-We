import React, { useEffect, useState } from 'react';
import PrivateRoute from 'components/PrivateRoute';
import useFormData from 'hooks/useFormData';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useRouter } from 'next/router';
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
import { useCV } from 'context/cv';
import prisma from 'config/prisma';
import { useSession } from 'next-auth/client';
import safeJsonStringify from 'safe-json-stringify';
import Loading from '@components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CREAR_HITO = gql`
  mutation createHitoAcademico($data: HitoAcademicoCreateInput!) {
    createHitoAcademico(data: $data) {
      id
    }
  }
`;

export async function getStaticProps() {
  const tiposAcademia = await prisma.tipoAcademico.findMany();
  let paises = await prisma.pais.findMany();
  const stringifiedData = safeJsonStringify(paises);
  paises = JSON.parse(stringifiedData);
  let programas = await prisma.programa.findMany();
  programas = JSON.parse(safeJsonStringify(programas));
  let instituciones = await prisma.institucion.findMany();
  instituciones = JSON.parse(safeJsonStringify(instituciones));
  prisma.$disconnect();
  return {
    props: { tiposAcademia, paises, programas, instituciones },
    revalidate: 3600,
  };
}

const CreateAcademy = ({ tiposAcademia, paises, programas, instituciones }) => {
  const [boolTitulo, setBooltitulo] = useState(true);
  const [programa, setPrograma] = useState('');
  const [boolEnCurso, setBoolEnCurso] = useState(false);
  const [boolBachiller, setBoolBachiller] = useState(true);
  const [form, getFormData] = useFormData(null);
  const { cv } = useCV();
  const [mutation, { loading: mutationLoading, error: mutationError }] = useMutation(CREAR_HITO);
  const router = useRouter();
  const [tipoA, setTipoA] = useState(-2);
  const [selectedDateSince, handleDateSinceChange] = useState(new Date());
  const [selectedDateUntil, handleDateUntilChange] = useState(new Date());
  const [pais, setPais] = useState('');
  const [instFilt, setInstFilt] = useState([]);
  const [paisesFilt, setPaisesFilt] = useState([]);
  const [session, loading] = useSession();
  const [mLoading, setMLoading] = useState(false);
  const [institucionSeleccionada, setInstitucionSeleccionada] = useState(0);

  useEffect(() => {
    if (pais !== '') {
      const InstFilter = instituciones.filter((el) => el.countryId === parseInt(pais));
      setInstFilt(InstFilter.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)));
    }
  }, [instituciones, pais]);

  useEffect(() => {
    if (paises !== '') {
      const sorList = [...paises].sort((a, b) =>
        a.nameEs > b.nameEs ? 1 : a.nameEs < b.nameEs ? -1 : 0
      );
      setPaisesFilt(sorList);
    }
  }, [paises]);

  useEffect(() => {
    if (tipoA === 1 || tipoA === 2) {
      setInstitucionSeleccionada(-1);
      setBoolBachiller(false);
    } else {
      setBoolBachiller(true);
    }
  }, [tipoA]);

  const submitData = (e) => {
    e.preventDefault();
    const dt = getFormData();
    if (tipoA !== -2) {
      if (dt.fechaFin ? dt.fechaFin : true && dt.fechaInicio) {
        var dateParts = dt.fechaInicio.split('/');
        dt.fechaInicio = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        if (dt.fechaFin === '' || !dt.fechaFin) {
          delete dt.fechaFin;
        } else {
          dateParts = dt.fechaFin.split('/');
          dt.fechaFin = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        }
        if ((dt.fechaFin ? dt.fechaInicio < dt.fechaFin : true) || boolEnCurso) {
          if (programa === 'Media Vocacional') {
            dt.programa = '4330';
          } else if (programa === 'Primaria') {
            dt.programa = '4331';
          } else if (programa === 'Diplomado') {
            dt.programa = '4332';
          }
          const data = {
            ...dt,
            cv: { connect: { id: cv?.id ?? session.user.cv.id } },
            institucion: { connect: { id: parseInt(dt.institucion) } },
            programa: { connect: { id: parseInt(dt.programa) } },
          };
          if (Object.keys(dt).includes('institucion_otra')) {
            delete data.institucion;
            data.institucion = {
              create: {
                name: 'otra',
                web_pages: 'NA',
                domains: 'NA',
                alpha_two_code: 'NA',
                country: {
                  connect: {
                    id: parseInt(data.pais),
                  },
                },
                otro: {
                  create: {
                    name: dt.institucion_otra,
                  },
                },
              },
            };
            delete data.institucion_otra;
          }
          if (Object.keys(dt).includes('programa_otro')) {
            delete data.programa;
            data.programa = {
              create: {
                name: 'otro',
                approved: 1,
                type: {
                  connect: {
                    id: parseInt(data.tipoId),
                  },
                },
                otro: {
                  create: {
                    name: dt.programa_otro,
                  },
                },
              },
            };
            delete data.programa_otro;
          }
          delete data.tipoId;
          delete data.pais;
          mutation({
            variables: { data },
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
    } else {
      toast.error(`Seleccione un tipo de estudio`, {
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
    if (mutationLoading) {
      setMLoading(true);
    }
  }, [mutationLoading]);

  if (loading || mLoading) return <Loading />;

  return (
    <PrivateRoute>
      <Head>
        <title>Académico</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      <form ref={form} onSubmit={submitData}>
        <CVInputPageContainer>
          <CVInputPageHeader
            sectionName='Crear información académica'
            buttonName='Guardar información académica'
            deleteButton={false}
          />
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
                    onChange={(e) => setTipoA(parseInt(e.target.value))}
                    value={tipoA}
                  >
                    <option value={-2} disabled>
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
                {tipoA > 1 && (
                  <CustomCheckbox
                    bool={boolTitulo}
                    setBool={setBooltitulo}
                    texto='¿Este estudio te entregó un título?'
                  />
                )}
                {boolTitulo && (
                  <TituloPrograma
                    tipoA={tipoA}
                    programas={programas}
                    programa={programa}
                    setPrograma={setPrograma}
                  />
                )}
              </div>
            </Seccion>
            <Seccion>
              <Pregunta>¿Cuándo?</Pregunta>
              <div>
                <CustomCheckbox
                  bool={boolEnCurso}
                  setBool={setBoolEnCurso}
                  texto='¿Aún estás cursándolo?'
                />
                <div className='grid grid-cols-1 md:grid-cols-2 md:grid-rows1'>
                  <InputContainer>
                    <span className='my-1'>Desde Cuándo *</span>
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
                      value={selectedDateSince}
                      onChange={handleDateSinceChange}
                    />
                  </InputContainer>
                  {!boolEnCurso && (
                    <InputContainer>
                      <span className='my-1'>Hasta Cuándo</span>
                      <KeyboardDatePicker
                        name='fechaFin'
                        format='dd/MM/yyyy'
                        autoOk
                        openTo='year'
                        animateYearScrolling
                        cancelLabel='Cancelar'
                        invalidDateMessage='Formato Invalido'
                        disableFuture
                        value={selectedDateUntil}
                        onChange={handleDateUntilChange}
                      />
                    </InputContainer>
                  )}
                </div>
              </div>
            </Seccion>
            <Seccion>
              <Pregunta>¿Dónde?</Pregunta>
              <div className='grid grid-cols-1 md:grid-cols-3 md:grid-rows-1 items-end'>
                <div className='md:col-span-1'>
                  <InputContainer>
                    <span className='my-1'>País *</span>
                    <select
                      required
                      className='my-1 input'
                      name='pais'
                      value={pais}
                      onChange={(e) => setPais(e.target.value)}
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
                    <div className='flex items-end'>
                      {boolBachiller && (
                        <select
                          required
                          value={institucionSeleccionada === 0 ? '' : institucionSeleccionada}
                          className={`my-1 input ${
                            institucionSeleccionada === -1 ? 'w-1/2' : 'w-3/4'
                          }`}
                          name='institucion'
                          onChange={(e) => setInstitucionSeleccionada(parseInt(e.target.value))}
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
                      )}
                      {institucionSeleccionada === -1 && (
                        <input
                          required
                          name='institucion_otra'
                          placeholder='Ingresa el nombre'
                          className='p-1 my-1 mx-2 input w-full'
                        />
                      )}
                    </div>
                  </InputContainer>
                </div>
              </div>
            </Seccion>
          </CVInputPageContent>
          <CVInputPageFooter buttonName='Guardar Información Académica' />
        </CVInputPageContainer>
      </form>
      <ToastContainer />
    </PrivateRoute>
  );
};

const TituloPrograma = ({ tipoA, programas, programa, setPrograma }) => {
  const [titulo, setTitulo] = useState('');
  const [progs, setProgs] = useState([]);
  const [selectedPrograma, setSelectedPrograma] = useState(0);

  useEffect(() => {
    if (tipoA === 1) {
      setTitulo('Primaria');
      setPrograma('Primaria');
    } else if (tipoA === 2) {
      setTitulo('Bachiller');
      setPrograma('Media Vocacional');
    } else if (tipoA === 9) {
      setTitulo('');
      setPrograma('Diplomado');
    } else {
      setTitulo('');
      setPrograma('');
    }
    const flt = programas.filter((el) => el.tipoId === parseInt(tipoA));
    setProgs(flt);
  }, [tipoA]);
  return (
    <>
      <InputContainer>
        <span className={`my-1 ${(tipoA === -2 || tipoA === 1) && 'hidden'}`}>Título</span>
        <input
          required
          disabled={tipoA <= 2 ? true : false}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          name='titulo'
          className={`my-1 input ${(tipoA === -2 || tipoA === 1) && 'hidden'} ${
            tipoA === 2 && 'text-gray-500'
          }`}
        />
      </InputContainer>
      {tipoA <= 2 || tipoA === 9 ? (
        <InputContainer>
          <span className={`my-1 ${(tipoA === -2 || tipoA === 1 || tipoA === 9) && 'hidden'}`}>
            Programa
          </span>
          <input
            required
            disabled={tipoA <= 2 ? true : false}
            value={programa}
            onChange={(e) => setPrograma(e.target.value)}
            type='text'
            className={`my-1 input ${(tipoA === -2 || tipoA === 1 || tipoA === 9) && 'hidden'} ${
              tipoA === 2 && 'text-gray-500'
            }`}
            name='programa'
            placeholder='Escribe el nombre de tu programa'
          />
        </InputContainer>
      ) : (
        <InputContainer>
          <span className={`my-1 ${tipoA === -2 || (tipoA === 1 && 'hidden')}`}>Programa</span>
          <div className='flex  items-center'>
            <select
              required
              className={`mt-1 input ${selectedPrograma === -1 ? 'w-1/2' : 'w-3/4'}`}
              name='programa'
              onChange={(e) => setSelectedPrograma(parseInt(e.target.value))}
            >
              <option disabled selected value=''>
                Escoja un programa
              </option>
              {progs.map((prg) => {
                return (
                  <option value={prg.id} key={`ProgramaSelect${prg.id}​​`}>
                    {prg.name}
                  </option>
                );
              })}
              <option value='-1'>Otro</option>
            </select>
            {selectedPrograma === -1 && (
              <input
                required
                name='programa_otro'
                placeholder='Ingresa el nombre'
                className='p-1 mb-2 mx-2 input w-1/2'
              />
            )}
          </div>
        </InputContainer>
      )}
    </>
  );
};

export default CreateAcademy;
