import React, { useState, useEffect } from 'react';
import { SuperAdminRoute } from 'components/PrivateRoute';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Image from 'next/image';
import Modal from '@material-ui/core/Modal';
import { CVInputPageContainer, Seccion, InputContainer, AdminInputPageHeader, AdminInputPageContent } from 'components/InputPage';
import { useSession } from 'next-auth/client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Loading from '@components/Loading';
import { postComentario } from 'utils/api';
import { ToastContainer, toast } from 'react-toastify';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';

const GET_EMPRESA = gql`
  {
    empresas(where: { approved: { equals: false } }) {
      id
      name
      legalName
      idType
      idNumber
      approved
      admin {
        id
        name
        email
      }
      datos {
        logo
        rut
        camara
        tamano
      }
      createdAt
      approvedDate
    }
  }
`;

const UPDATE_EMPRESA = gql`
  mutation updateEmpresa($data: EmpresaUpdateInput!, $where: EmpresaWhereUniqueInput!) {
    updateEmpresa(data: $data, where: $where) {
      id
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius: '8px',
    },
    paperMin: {
      position: 'absolute',
      width: 300,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius: '8px',
    },
  })
);

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const SolicitudesEmpresas = () => {
  const [open, setOpen] = useState(false);
  const [openModalComentarios, setOpenModalComentarios] = useState(false);
  const [contEmpresas, setContEmpresas] = useState(0);
  const [comentariosRechazo, setComentariosRechazo] = useState('');
  const classes = useStyles();
  const [session, loading] = useSession();
  const [modalStyle] = useState(getModalStyle);
  const { loading: qLoading, error, data, refetch } = useQuery(GET_EMPRESA);
  const [mutation, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_EMPRESA);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {}, [data]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModalComentarios = () => {
    setOpenModalComentarios(false);
  };

  const approveEmpresa = () => {
    const where = {
      id: data.empresas[contEmpresas].id,
    };
    const updateData = {
      approver: {
        connect: {
          id: session.user.id,
        },
      },
      approved: {
        set: true,
      },
      approvedDate: {
        set: Date.now().toString(),
      },
    };
    mutation({
      variables: { where, data: updateData },
    })
      .then(({ data }) => {
        toast.success(`Empresa aprobada con éxito`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        refetch();
      })
      .catch((e) => {
        console.error(e);
        toast.error(`Error al enviar el mensaje`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  const rejectEmpresa = async () => {
    setOpenModalComentarios(false);
    await postComentario({
      comentariosRechazo,
      adminName: data.empresas[contEmpresas].admin.name,
      adminEmail: data.empresas[contEmpresas].admin.email,
    })
      .then((res) => {
        toast.success(`Mensaje enviado con éxito`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      })
      .catch((e) => {
        console.error(e);
        toast.error(`Error al enviar el mensaje`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
    if (contEmpresas < data.empresas.length - 1) {
      setContEmpresas(contEmpresas + 1);
    }
    setComentariosRechazo('');
  };

  if (loading || qLoading || mutationLoading) return <Loading />;

  return (
    <SuperAdminRoute>
      <Head>
        <title>Solicitudes</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      {data && (
        <CVInputPageContainer>
          <AdminInputPageHeader sectionName='Aprobación de Empresas' />
          {data.empresas.length > 0 ? (
            <>
              <SelectorEmpresas
                className='flex lg:hidden'
                actual={contEmpresas}
                total={data.empresas.length}
                setCont={setContEmpresas}
              />
              <AdminInputPageContent>
                <div className='my-6 grid md:grid-cols-2'>
                  <div className='justify-self-center md:col-span-2 w-full'>
                    <div className='w-full grid grid-cols-3 grid-rows-1'>
                      <div></div>
                      <div className='flex justify-center items-center'>
                        {data && (
                          <Image
                            src={
                              data.empresas[contEmpresas].datos.logo !== ''
                                ? data.empresas[contEmpresas].datos.logo
                                : '/img/default.jpg'
                            }
                            alt='Logo'
                            width='120'
                            height='120'
                          />
                        )}
                      </div>
                      <AprobarRechazarEmpresas
                        className='hidden lg:flex'
                        approveEmpresa={approveEmpresa}
                        rejectEmpresa={setOpenModalComentarios}
                      />
                    </div>
                  </div>
                  <InputContainer>
                    <span className='my-1 text-gray-400 font-medium'>Nombre de la empresa</span>
                    <h1 className='my-1 input text-black font-semibold uppercase'>{data.empresas[contEmpresas].name}</h1>
                  </InputContainer>
                  <InputContainer>
                    <span className='my-1 text-gray-400 font-medium'>Razón Social</span>
                    <h1 className='my-1 input text-black font-semibold uppercase'>{data.empresas[contEmpresas].legalName}</h1>
                  </InputContainer>
                  <InputContainer>
                    <span className='my-1 text-gray-400 font-medium'>Tipo de identificación</span>
                    <h1 className='my-1 input text-black font-semibold uppercase'>{data.empresas[contEmpresas].idType}</h1>
                  </InputContainer>
                  <InputContainer>
                    <span className='my-1 text-gray-400 font-medium'>Identificación</span>
                    <h1 className='my-1 input text-black font-semibold uppercase'>{data.empresas[contEmpresas].idNumber}</h1>
                  </InputContainer>
                  {data.empresas[contEmpresas].datos && (
                    <InputContainer>
                      <span className='my-1 text-gray-400 font-medium'># de empleados</span>
                      <h1 className='my-1 input text-black font-semibold uppercase'>
                        {data.empresas[contEmpresas].datos.tamano}
                      </h1>
                    </InputContainer>
                  )}
                  <div className='grid mt-10 space-y-5 md:hidden'>
                    <h1 className='font-bold text-black text-lg '>Documentos Cargados</h1>
                    <div className='flex flex-col items-start'>
                      <a
                        className='flex flex-row items-center cursor-pointer'
                        target='_blank'
                        href={data.empresas[contEmpresas].datos.rut}
                      >
                        <i className='fas fa-file-pdf text-red-500 mx-2' />
                        <h1>RUT</h1>
                      </a>
                      <a
                        className='flex flex-row items-center cursor-pointer'
                        target='_blank'
                        href={data.empresas[contEmpresas].datos.camara}
                      >
                        <i className='fas fa-file-pdf text-red-500 mx-2' />
                        <h1>CÁMARA DE COMERCIO</h1>
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleOpen}
                    className='hidden md:flex uppercase md:justify-self-center md:items-center md:self-center cursor-pointer md:flex-row shadow-md w-60 h-10 hover:shadow-lg bg-white mx-2 py-2 px-4 text-sm font-bold text-black rounded-md'
                  >
                    <i className='fas fa-paperclip m-2'></i>
                    <p>Ver archivos adjuntos</p>
                  </button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='simple-modal-title'
                    aria-describedby='simple-modal-description'
                  >
                    <div style={modalStyle} className={classes.paper}>
                      <button className='font-bold text-xl ml-80' onClick={handleClose}>
                        X
                      </button>
                      <div className='grid space-y-5'>
                        <h1 className='font-bold text-black text-lg '>Documentos Cargados</h1>
                        <a
                          className='flex flex-row items-center cursor-pointer'
                          target='_blank'
                          href={data.empresas[contEmpresas].datos.rut}
                        >
                          <i className='fas fa-file-pdf text-red-500 mx-2' />
                          <h1>RUT</h1>
                        </a>
                        <a
                          className='flex flex-row items-center cursor-pointer'
                          target='_blank'
                          href={data.empresas[contEmpresas].datos.camara}
                        >
                          <i className='fas fa-file-pdf text-red-500 mx-2' />
                          <h1>CÁMARA DE COMERCIO</h1>
                        </a>
                      </div>
                    </div>
                  </Modal>
                </div>
              </AdminInputPageContent>
              <AprobarRechazarEmpresas
                className='flex lg:hidden'
                approveEmpresa={approveEmpresa}
                rejectEmpresa={setOpenModalComentarios}
              />
              <SelectorEmpresas
                className='hidden lg:flex'
                actual={contEmpresas}
                total={data.empresas.length}
                setCont={setContEmpresas}
              />
              <Modal open={openModalComentarios} onClose={handleCloseModalComentarios}>
                <div style={modalStyle} className={classes.paperMin}>
                  <button className='font-bold text-lg ml-60' onClick={handleCloseModalComentarios}>
                    X
                  </button>
                  <div className='flex flex-col'>
                    <textarea
                      value={comentariosRechazo}
                      onChange={(e) => setComentariosRechazo(e.target.value)}
                      className='p-1'
                      placeholder='Por favor ingresa tus comentarios de rechazo'
                    />
                    <button onClick={rejectEmpresa} className='bg-bluegdm hover:bg-bluegdm_hover text-white rounded-xl p-1 my-4'>
                      Enviar Comentarios
                    </button>
                  </div>
                </div>
              </Modal>
            </>
          ) : (
            <div>¡No existen solicitudes pendientes!</div>
          )}
        </CVInputPageContainer>
      )}
      <ToastContainer />
    </SuperAdminRoute>
  );
};

const SelectorEmpresas = ({ className, actual, total, setCont }) => {
  return (
    <div className={`${className} items-center my-2`}>
      <i
        onClick={() => {
          actual > 0 && setCont(actual - 1);
        }}
        className={`fas fa-chevron-circle-left text-3xl ${actual === 0 ? 'text-gray-500' : 'cursor-pointer'}`}
      />
      <div className='mx-4'>
        {actual + 1} de {total} empresa{total > 1 && 's'} por aprobar
      </div>
      <i
        onClick={() => {
          actual < total - 1 && setCont(actual + 1);
        }}
        className={`fas fa-chevron-circle-right text-3xl ${actual === total - 1 ? 'text-gray-500' : 'cursor-pointer'}`}
      />
    </div>
  );
};

const AprobarRechazarEmpresas = ({ className, approveEmpresa, rejectEmpresa }) => {
  return (
    <div className={`${className} flex-col justify-center items-center`}>
      <button
        onClick={approveEmpresa}
        className='w-3/4 m-2 uppercase cursor-pointer shadow-lg hover:shadow-xl bg-bluegdm hover:bg-bluegdm_hover py-2 px-4 text-sm font-bold text-white rounded-md mx-2'
      >
        Aprobar Empresa
      </button>
      <button
        onClick={() => rejectEmpresa(true)}
        className='w-3/4 m-2 uppercase cursor-pointer shadow-lg hover:shadow-xl bg-red-500 hover:bg-red-400 py-2 px-4 text-sm font-bold text-white rounded-md mx-2'
      >
        Rechazar Empresa
      </button>
    </div>
  );
};

export default SolicitudesEmpresas;
