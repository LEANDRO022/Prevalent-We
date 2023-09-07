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
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
  mutation createHitoPersonal($data: HitoPersonalCreateInput!) {
    createHitoPersonal(data: $data) {
      id
    }
  }
`;

export async function getStaticProps(context) {
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
    props: { tiposPersonal, paises, departamentos, ciudades }, // will be passed to the page component as props
  };
}

const createMilestone = (props) => {
  const { tiposPersonal, paises, departamentos, ciudades } = props;
  const [selecTipo, setSelecTipo] = useState(0);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selecPais, setSelecPais] = useState(paises);
  const [pais, setPais] = useState(null);
  const [selecDepartamento, setSelecDepartamento] = useState(departamentos);
  const [departamento, setDepartamento] = useState(null);
  const [selecCiudad, setSelecCiudad] = useState(ciudades);
  const [ciudad, setCiudad] = useState(null);
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

  useEffect(() => {}, [cv]);

  useEffect(() => {
    if (session) {
      router.prefetch(`/cv/${session.user.id}`);
    }
  }, [session]);

  const submitData = (e) => {
    e.preventDefault();
    const dt = getFormData();
    if (dt.fecha) {
      var dateParts = dt.fecha.split('/');
      dt.fecha = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      let data;
      if (Object.keys(dt).includes('ciudad_otro')) {
        data = {
          ...dt,
          cv: { connect: { id: cv?.id ?? session.user.cv.id } },
          tipo: { connect: { id: parseInt(dt.tipoId) } },
          ciudad: {
            create: {
              nombre: 'otra',
              departamento: {
                create: {
                  nombre: 'otro',
                  pais: {
                    connect: {
                      id: parseInt(dt.pais),
                    },
                  },
                  otro: {
                    create: {
                      nombre: dt.departamento_otro,
                    },
                  },
                },
              },
              otro: {
                create: {
                  nombre: dt.ciudad_otro,
                },
              },
            },
          },
        };
        delete data.ciudad_otro;
        delete data.departamento_otro;
      } else {
        data = {
          ...dt,
          cv: { connect: { id: cv?.id ?? session.user.cv.id } },
          tipo: { connect: { id: parseInt(dt.tipoId) } },
          ciudad: { connect: { id: parseInt(dt.ciudad) } },
        };
      }
      delete data.tipoId;
      delete data.departamento;
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
      toast.error(`Ingrese una fecha`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  useEffect(() => {
    var departamentosfilter = departamentos.filter(function (departamento) {
      return departamento.paisId === pais && departamento.nombre !== 'otro';
    });
    setDepartamento('');
    // departamentosfilter.length > 0 ? setDepartamento(departamentosfilter[0].id) : setDepartamento(undefined);
    setSelecDepartamento(departamentosfilter);
  }, [pais]);

  useEffect(() => {
    var ciudadesfilter = ciudades.filter(function (ciudad) {
      return ciudad.departamentoId === departamento;
    });
    setSelecCiudad(ciudadesfilter);
  }, [departamento]);

  useEffect(() => {
    if (mutationLoading) {
      setMloading(true);
    }
  }, [mutationLoading]);

  if (loading || mLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>Hito</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      <PrivateRoute>
        <form ref={form} onSubmit={submitData}>
          <CVInputPageContainer>
            <CVInputPageHeader
              sectionName='Crear Hito'
              buttonName='GUARDAR HITO'
              deleteButton={false}
            />
            <CVInputPageContent>
              <p className='text-bluegdm m-4'>
                En nuestra vida pasan muchas cosas, y ocurren de dimensiones que han quedado fuera
                del esquema tradicional de los CV. Sin embargo, esos eventos hacen parte de nuestra
                historia y ayudan a definirnos.
              </p>
              <p className='text-bluegdm m-4'>
                {' '}
                A esos eventos los llamamos <span className='font-semibold'>"HITOS"</span>.
              </p>
              <p className='text-bluegdm m-4'>
                {' '}
                ¿Qué quieres contarnos? Cuéntanos por ejemplo cuando ganaste una competencia
                deportiva como aficionado <span className='font-semibold'>(Hito Deportivo)</span> ;
              </p>
              <p className='text-bluegdm m-4'>
                {' '}
                O cuéntanos cuando creaste tu primera página web y si es de contenido{' '}
                <span className='font-semibold'>académico, profesional,</span> o de otro tipo.
                Cuéntale al mundo sobre esos momentos que también hacen parte de tu historia y de lo
                que eres actualmente.
              </p>
              <Seccion>
                <Pregunta>¿Qué?</Pregunta>
                <div className=' my-4 grid grid-cols-1 gap-y-4 md:grid-cols-2'>
                  <InputContainer>
                    <span className='my-1'>Nombre *</span>
                    <input
                      required
                      className='my-1 input'
                      type='text'
                      id='nombre'
                      placeholder='Ej. Nacimiento de tu hijo, Distinción laboral, Premio académico'
                      name='nombre'
                    />
                  </InputContainer>
                  <InputContainer>
                    <span className='my-1'>Tipo *</span>
                    <select required id='tipo' name='tipoId' className='my-1 input' defaultValue=''>
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
                <Pregunta>¿Cuándo?</Pregunta>
                <div className='my-4 max-w-sm'>
                  <InputContainer>
                    <span className='my-1'>Fecha *</span>
                    <KeyboardDatePicker
                      name='fecha'
                      format='dd/MM/yyyy'
                      autoOk
                      required
                      openTo='year'
                      animateYearScrolling
                      cancelLabel='Cancelar'
                      invalidDateMessage='Formato Invalido'
                      maxDateMessage='La fecha no puede ser mayor a Hoy'
                      minDateMessage='La fecha no puede ser menor a 1900'
                      disableFuture
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </InputContainer>
                </div>
              </Seccion>
              <Seccion>
                <Pregunta>¿Dónde?</Pregunta>
                <div className='grid grid-cols-1 lg:grid-cols-3'>
                  <InputContainer>
                    <span className='my-1'>País *</span>
                    {/* <Autocomplete
                    id='combo-box-demo'
                    options={selecPais}
                    getOptionLabel={(option: any) => option.nameES}
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                    renderInput={(params) => <TextField {...params} />}
                  /> */}

                    <select
                      required
                      id='pais'
                      name='pais'
                      className='my-1 input'
                      value={pais ?? ''}
                      onChange={(e) => setPais(parseInt(e.currentTarget.value))}
                    >
                      <option value='' className='text-gray-500'>
                        Seleccione una opción
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
                  <InputContainer>
                    <span className='my-1'>Departamento/Estado *</span>
                    {(selecDepartamento as string).length > 0 ? (
                      <select
                        required
                        id='departamento-select'
                        name='departamento'
                        className='my-1 input'
                        value={departamento ?? ''}
                        onChange={(e) => setDepartamento(parseInt(e.currentTarget.value))}
                      >
                        <option value='' className='text-gray-500'>
                          Seleccione una opción
                        </option>
                        {selecDepartamento &&
                          selecDepartamento.map((departamento) => {
                            return (
                              <option
                                value={departamento.id}
                                key={`Departamento${departamento.id}`}
                              >
                                {departamento.nombre}
                              </option>
                            );
                          })}
                      </select>
                    ) : (
                      <input
                        required
                        className='my-1 input'
                        type='text'
                        placeholder='Ej. Florida, Texas,...'
                        name='departamento_otro'
                      />
                    )}
                  </InputContainer>
                  <InputContainer>
                    <span className='my-1'>Ciudad/Provincia *</span>
                    {(selecCiudad as string).length > 0 ? (
                      <select
                        required
                        id='ciudad-select'
                        name='ciudad'
                        className='my-1 input'
                        value={ciudad ?? ''}
                        onChange={(e) => setCiudad(parseInt(e.currentTarget.value))}
                      >
                        <option value='' className='text-gray-500'>
                          Seleccione una opción
                        </option>
                        {selecCiudad &&
                          selecCiudad.map((ciudad) => {
                            return (
                              <option value={ciudad.id} key={`Ciudad${ciudad.id}`}>
                                {ciudad.nombre}
                              </option>
                            );
                          })}
                      </select>
                    ) : (
                      <input
                        required
                        className='my-1 input'
                        type='text'
                        placeholder='Ej. Miami, Austin '
                        name='ciudad_otro'
                      />
                    )}
                  </InputContainer>
                </div>
              </Seccion>
            </CVInputPageContent>
            <CVInputPageFooter buttonName='Guardar Hito' />
          </CVInputPageContainer>
        </form>
      </PrivateRoute>
    </>
  );
};

export default createMilestone;
