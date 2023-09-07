import React, { useEffect, useState } from 'react';
import PrivateRoute from 'components/PrivateRoute';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Head from 'next/head';
import Loading from 'components/Loading';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EDITAR_HITO = gql`
  mutation updateHitoProfesional(
    $data: HitoProfesionalUpdateInput!
    $where: HitoProfesionalWhereUniqueInput!
  ) {
    updateHitoProfesional(data: $data, where: $where) {
      id
    }
  }
`;

const ELIMINAR_HITO = gql`
  mutation deleteHitoProfesional($where: HitoProfesionalWhereUniqueInput!) {
    deleteHitoProfesional(where: $where) {
      id
    }
  }
`;

export async function getServerSideProps(context) {
  let hito = await prisma.hitoProfesional.findUnique({
    where: {
      id: context.query.id,
    },
    include: {
      cv: {
        include: {
          user: true,
        },
      },
    },
  });
  hito = JSON.parse(safeJsonStringify(hito));
  const tiposProfesion = await prisma.tipoProfesional.findMany();
  let paises = await prisma.pais.findMany();
  const stringifiedDatapaises = safeJsonStringify(paises);
  paises = JSON.parse(stringifiedDatapaises);
  prisma.$disconnect();
  return {
    props: { tiposProfesion, paises, hito }, // will be passed to the page component as props
  };
}

const Createjobs = ({ tiposProfesion, paises, hito }) => {
  const [boolEnCurso, setBoolEnCurso] = useState(true);
  const [fdata, setFdata] = useState(hito);
  const [mutation, { loading: mutationLoading, error: mutationError }] = useMutation(EDITAR_HITO);
  const [
    deleteMutation,
    { loading: deleteMutationLoading, error: deleteMutationError },
  ] = useMutation(ELIMINAR_HITO);
  const [mLoading, setMloading] = useState(false);
  const router = useRouter();
  const [session, loading] = useSession();
  const [isOwner, setIsOwner] = useState(false);
  const [paisesFilt, setPaisesFilt] = useState([]);

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
    if (session) {
      router.prefetch(`/cv/${session.user.id}`);
    }
  }, [session]);

  useEffect(() => {
    if (!fdata.fechaFin) {
      setBoolEnCurso(true);
    } else {
      setBoolEnCurso(false);
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
    if (!boolEnCurso) {
      if (!fdata.fechaFin) {
        setFdata({ ...fdata, fechaFin: fdata.fechaInicio });
      }
    }
  }, [boolEnCurso]);

  const submitData = (e) => {
    e.preventDefault();
    const where = {
      id: fdata.id,
    };
    if (fdata.fechaFin) {
      if (new Date(fdata.fechaInicio) < new Date(fdata.fechaFin) || boolEnCurso) {
        let data = {} as any;
        Object.keys(fdata).forEach((el) => {
          if (fdata[el] !== hito[el]) {
            data = { ...data, [el]: { set: fdata[el] } };
          }
        });
        if (Object.keys(data).includes('paisId')) {
          data = { ...data, pais: { connect: { id: parseInt(data.paisId.set) } } };
          delete data.paisId;
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
        toast.error(`Fecha de fin no puede ser menor a fecha de inicio`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      toast.error(`Ingrese una fecha de inicio`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

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
        <title>Hito Laboral</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      <form onSubmit={submitData}>
        <CVInputPageContainer>
          {isOwner && (
            <CVInputPageHeader
              sectionName='Editar Experiencia laboral'
              buttonName='Guardar Experiencia Laboral'
              deleteButton={true}
              deleteFunction={deleteHito}
            />
          )}
          <CVInputPageContent>
            <Seccion>
              <Pregunta>¿Que?</Pregunta>
              <div className='grid grid-cols-1 gap-y-4 lg:grid-cols-2'>
                <InputContainer>
                  <span className='my-1'>Empresa *</span>
                  <input
                    required
                    disabled={!isOwner ? true : false}
                    className='my-1 input'
                    type='text'
                    placeholder='Ej. IBM, Ecopetrol, Hermanos Rodriguez'
                    value={fdata.empresa}
                    onChange={(e) => setFdata({ ...fdata, empresa: e.target.value })}
                    name='empresa'
                  />
                </InputContainer>
                <InputContainer>
                  <span className='my-1'>Cargo *</span>
                  <input
                    required
                    disabled={!isOwner ? true : false}
                    className='my-1 input'
                    type='text'
                    placeholder='Ej. Jefe de Cartera, Auxiliar de planta, etc...'
                    value={fdata.cargo}
                    onChange={(e) => setFdata({ ...fdata, cargo: e.target.value })}
                    name='cargo'
                  />
                </InputContainer>
                <InputContainer>
                  <div>
                    <span className='my-1'>Tipo *</span>
                    <select
                      disabled={!isOwner ? true : false}
                      required
                      name='tipoId'
                      className='my-1 input'
                      value={fdata.tipoId ?? ''}
                      onChange={(e) => setFdata({ ...fdata, tipoId: e.target.value })}
                    >
                      <option value='' disabled>
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
                {isOwner && (
                  <InputContainer>
                    <p className='mt-4 text-sm text-blue-500'>
                      {fdata.tipoId === 0
                        ? ''
                        : tiposProfesion.filter(
                            (el) => el.id === parseInt(fdata.tipoId.toString())
                          )[0].descripcion}
                    </p>
                  </InputContainer>
                )}
                <></>
                <div className='lg:col-span-2'>
                  <InputContainer>
                    <span className='my-1'>Funciones/Responsabilidades</span>
                    <textarea
                      disabled={!isOwner ? true : false}
                      name='funciones'
                      value={fdata.funciones}
                      onChange={(e) => setFdata({ ...fdata, funciones: e.target.value })}
                      cols={30}
                      rows={3}
                      placeholder='¿Cuáles eran tus funciones y responsabilidades principales para este cargo?'
                      className='my-1 input'
                    />
                  </InputContainer>
                </div>
                <div className='lg:col-span-2'>
                  <InputContainer className='col-span-2'>
                    <span className='my-1'>Logros</span>
                    <textarea
                      disabled={!isOwner ? true : false}
                      name='logros'
                      value={fdata.logros}
                      onChange={(e) => setFdata({ ...fdata, logros: e.target.value })}
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
              <Pregunta>¿Cuando?</Pregunta>
              <div className='my-4'>
                {isOwner && (
                  <CustomCheckbox
                    bool={boolEnCurso}
                    setBool={setBoolEnCurso}
                    texto='¿Es tu empleo actual?'
                  />
                )}
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
                      value={fdata.fechaInicio}
                      onChange={(date) => setFdata({ ...fdata, fechaInicio: date })}
                    />
                  </InputContainer>
                  {!boolEnCurso && (
                    <InputContainer>
                      {fdata.fechaFin && (
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
                      )}
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
                    disabled={!isOwner ? true : false}
                    required
                    id='paisId'
                    name='paisId'
                    className='my-1 input'
                    value={fdata.paisId}
                    onChange={(e) => setFdata({ ...fdata, paisId: e.target.value })}
                  >
                    {paisesFilt.map((pais) => {
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
          {isOwner && <CVInputPageFooter buttonName='Guardar Experiencia Laboral' />}
        </CVInputPageContainer>
      </form>
      <ToastContainer />
    </PrivateRoute>
  );
};

export default Createjobs;
