import React, { useEffect, useState } from 'react';
import PrivateRoute from 'components/PrivateRoute';
import useFormData from 'hooks/useFormData';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import Loading from 'components/Loading';
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
import safeJsonStringify from 'safe-json-stringify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CREAR_HITO = gql`
  mutation createHitoProfesional($data: HitoProfesionalCreateInput!) {
    createHitoProfesional(data: $data) {
      id
    }
  }
`;

export async function getStaticProps(context) {
  const tiposProfesion = await prisma.tipoProfesional.findMany();
  let paises = await prisma.pais.findMany();
  const stringifiedDatapaises = safeJsonStringify(paises);
  paises = JSON.parse(stringifiedDatapaises);
  prisma.$disconnect();
  return {
    props: { tiposProfesion, paises }, // will be passed to the page component as props
  };
}

const Createjobs = (props) => {
  const { tiposProfesion, paises } = props;
  const [selecPais, setSelecPais] = useState(paises);
  const [pais, setPais] = useState(null);
  const [selectedDateSince, handleDateSinceChange] = useState(new Date());
  const [selectedDateUntil, handleDateUntilChange] = useState(new Date());
  const [boolEnCurso, setBoolEnCurso] = useState(false);
  const [selecTipo, setSelecTipo] = useState(0);
  const [form, getFormData] = useFormData(null);
  const { cv } = useCV();
  const [mutation, { loading: mutationLoading, error: mutationError }] = useMutation(CREAR_HITO);
  const [mLoading, setMloading] = useState(false);
  const [session, loading] = useSession();
  const router = useRouter();
  const [paisesFilt, setPaisesFilt] = useState([]);

  useEffect(() => {
    if (selecPais !== '') {
      const sorList = [...selecPais].sort((a, b) =>
        a.nameEs > b.nameEs ? 1 : a.nameEs < b.nameEs ? -1 : 0
      );
      setPaisesFilt(sorList);
    }
  }, [selecPais]);

  useEffect(() => {
    if (session) {
      router.prefetch(`/cv/${session.user.id}`);
    }
  }, [session]);

  const submitData = (e) => {
    e.preventDefault();
    const dt = getFormData();
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
        const data = {
          ...dt,
          cv: { connect: { id: cv?.id ?? session.user.cv.id } },
          tipo: { connect: { id: parseInt(dt.tipoId) } },
          pais: { connect: { id: parseInt(dt.paisId) } },
        };
        delete data.tipoId;
        delete data.paisId;
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
  };

  const handleChange = (ev) => {
    setSelecTipo(ev.target.value);
  };

  useEffect(() => {
    if (mutationLoading) {
      setMloading(true);
    }
  }, [mutationLoading]);

  if (loading || mLoading) return <Loading />;

  return (
    <PrivateRoute>
      <Head>
        <title>Hito Laboral</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      <form ref={form} onSubmit={submitData}>
        <CVInputPageContainer>
          <CVInputPageHeader
            sectionName='Crear Experiencia laboral'
            buttonName='Guardar Experiencia Laboral'
            deleteButton={false}
          />
          <CVInputPageContent>
            <Seccion>
              <Pregunta>¿Que?</Pregunta>
              <div className='grid grid-cols-1 gap-y-4 lg:grid-cols-2'>
                <InputContainer>
                  <span className='my-1'>Empresa *</span>
                  <input
                    required
                    className='my-1 input'
                    type='text'
                    id='empresa'
                    placeholder='Ej. IBM, Ecopetrol, Hermanos Rodriguez'
                    name='empresa'
                  />
                </InputContainer>
                <InputContainer>
                  <span className='my-1'>Cargo *</span>
                  <input
                    required
                    className='my-1 input'
                    type='text'
                    placeholder='Ej. Jefe de Cartera, Auxiliar de planta, etc...'
                    id='cargo'
                    name='cargo'
                  />
                </InputContainer>
                <InputContainer>
                  <div>
                    <span className='my-1'>Tipo *</span>
                    <select required name='tipoId' className='my-1 input' onChange={handleChange}>
                      <option selected value='' disabled>
                        Seleccione una opción
                      </option>
                      {tiposProfesion &&
                        tiposProfesion
                          .sort((a, b) =>
                            a.prioridad > b.prioridad ? 1 : a.prioridad < b.prioridad ? -1 : 0
                          )
                          .map((tipo) => {
                            return (
                              <option value={tipo.id} key={`TipoPro${tipo.id}`}>
                                {tipo.nombre}
                              </option>
                            );
                          })}
                    </select>
                  </div>
                </InputContainer>
                <InputContainer>
                  <p className='mt-4 text-sm text-blue-500'>
                    {selecTipo === 0
                      ? ''
                      : tiposProfesion.filter((el) => el.id === parseInt(selecTipo.toString()))[0]
                          .descripcion}
                  </p>
                </InputContainer>
                <div className='lg:col-span-2'>
                  <InputContainer>
                    <span className='my-1'>Funciones/Responsabilidades *</span>
                    <textarea
                      required
                      name='funciones'
                      id='funciones'
                      cols={30}
                      rows={3}
                      placeholder='¿Cuáles eran tus funciones y responsabilidades principales para este cargo?'
                      className='my-1 input'
                    />
                  </InputContainer>
                </div>
                <div className='lg:col-span-2'>
                  <InputContainer className='col-span-2'>
                    <span className='my-1'>Logros *</span>
                    <textarea
                      required
                      name='logros'
                      id='logros'
                      cols={30}
                      rows={3}
                      placeholder='¿Cuáles fueron tus principales logros en este cargo?'
                      className='my-1 input'
                    />
                  </InputContainer>
                </div>
                <div className='lg:col-span-2'>
                  <InputContainer className='col-span-2'>
                    <label className='my-1'>
                      Descripción <span className='font-normal text-gray-400'>Opcional</span>
                    </label>
                    <textarea
                      name='descripcion'
                      id='descripcion'
                      cols={30}
                      rows={3}
                      className='my-1 input'
                    />
                  </InputContainer>
                </div>
              </div>
            </Seccion>
            <Seccion>
              <Pregunta>¿Cuando?</Pregunta>
              <div className='my-4'>
                <CustomCheckbox
                  bool={boolEnCurso}
                  setBool={setBoolEnCurso}
                  texto='¿Es tu empleo actual?'
                />
                <div className='grid grid-cols-1 lg:grid-cols-2 lg:grid-rows1'>
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
                        maxDateMessage='La fecha no puede ser mayor a Hoy'
                        minDateMessage='La fecha no puede ser menor a 1900'
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
              <div className='grid grid-cols-1 max-w-sm'>
                <InputContainer>
                  <span className='my-1'>País *</span>
                  <select
                    required
                    id='paisId'
                    name='paisId'
                    className='my-1 input'
                    value={pais ?? ''}
                    onChange={(e) => setPais(parseInt(e.currentTarget.value))}
                  >
                    <option value='' className='text-gray-500' disabled>
                      Selecciona una opción
                    </option>
                    {paisesFilt &&
                      paisesFilt.map((pais) => {
                        return (
                          <option value={pais.id} key={`Pais${pais.id}`}>
                            {pais.nameEs}
                          </option>
                        );
                      })}
                  </select>
                </InputContainer>
              </div>
            </Seccion>
          </CVInputPageContent>
          <CVInputPageFooter buttonName='Guardar Experiencia Laboral' />
        </CVInputPageContainer>
      </form>
      <ToastContainer />
    </PrivateRoute>
  );
};

export default Createjobs;
