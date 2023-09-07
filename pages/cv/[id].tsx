import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, getSession } from 'next-auth/client';
import prisma from 'config/prisma';
import { useCV } from 'context/cv';
import Timeline from '@components/Timeline';
import safeJsonStringify from 'safe-json-stringify';
import Loading from '@components/Loading';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from 'react-share';

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  console.log('session', session);
  if (session?.user?.id === context.query.id) {
    let cv = await prisma.cV.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
      include: {
        user: true,
        hitoAcademico: {
          include: {
            programa: {
              include: {
                type: true,
                otro: true,
              },
            },
            institucion: {
              include: {
                otro: true,
              },
            },
          },
        },
        hitoPersonal: {
          include: {
            tipo: true,
          },
        },
        hitoProfesional: {
          include: {
            tipo: true,
          },
        },
      },
    });
    console.log('el cv creado', cv);
    if (cv.length === 0) {
      const ncv = await prisma.cV.create({
        data: {
          user: {
            connect: {
              id: context.query.id,
            },
          },
        },
        include: {
          user: true,
          hitoAcademico: {
            include: {
              programa: {
                include: {
                  type: true,
                  otro: true,
                },
              },
              institucion: {
                include: {
                  otro: true,
                },
              },
            },
          },
          hitoPersonal: {
            include: {
              tipo: true,
            },
          },
          hitoProfesional: {
            include: {
              tipo: true,
            },
          },
        },
      });
      cv = [ncv];
    }
    cv = JSON.parse(safeJsonStringify(cv[0]));
    prisma.$disconnect();
    return {
      props: { cv }, // will be passed to the page component as props
    };
  } else {
    if (session) {
      const ncv = await prisma.cV.create({
        data: {
          user: {
            connect: {
              id: context.query.id,
            },
          },
        },
        include: {
          user: true,
          hitoAcademico: {
            include: {
              programa: {
                include: {
                  type: true,
                  otro: true,
                },
              },
              institucion: {
                include: {
                  otro: true,
                },
              },
            },
          },
          hitoPersonal: {
            include: {
              tipo: true,
            },
          },
          hitoProfesional: {
            include: {
              tipo: true,
            },
          },
        },
      });
      let cv = JSON.parse(safeJsonStringify(ncv));
      prisma.$disconnect();
      return {
        props: { cv }, // will be passed to the page component as props
      };
    } else {
      let cv = await prisma.cV.findMany({
        where: {
          user: {
            id: context.query.id,
          },
        },
        include: {
          user: true,
          hitoAcademico: {
            include: {
              programa: {
                include: {
                  type: true,
                  otro: true,
                },
              },
              institucion: {
                include: {
                  otro: true,
                },
              },
            },
          },
          hitoPersonal: {
            include: {
              tipo: true,
            },
          },
          hitoProfesional: {
            include: {
              tipo: true,
            },
          },
        },
      });
      let cvr = {};
      if (cv.length > 0) {
        cvr = JSON.parse(safeJsonStringify(cv[0]));
      }
      prisma.$disconnect();
      return {
        props: { cv: cvr }, // will be passed to the page component as props
      };
    }
  }
}

const PublicCV = ({ cv }) => {
  const [hitos, setHitos] = useState([]);
  const { setCV } = useCV();
  const [isOwner, setIsOwner] = useState(false);
  const [session, loading] = useSession();
  const [readMore, setReadMore] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (cv && Object.keys(cv).length > 0) {
      let owner;
      if (session) {
        if (session.user.id === cv.userId) {
          owner = true;
          setCV(cv);
        } else {
          owner = false;
        }
      } else {
        owner = false;
      }
      setIsOwner(owner);
      const ht = [];
      cv.hitoAcademico &&
        cv.hitoAcademico.map((el) => {
          if (el.fechaFin) {
            ht.push({
              badgeColor: 'warning',
              badgeIcon: 'fas fa-university',
              title: ``,
              titleColor: 'info',
              fecha: new Date(el.fechaInicio),
              body: (
                <div className='flex flex-col'>
                  <div className='my-2 text-xl text-gray-600 text-bold'>
                    Inició en{' '}
                    {el.institucion.name === 'otra'
                      ? el.institucion.otro.name
                      : el.institucion.name}
                  </div>
                  <div className='my-2 text-md text-gray-500 text-semibold'>
                    {el.programa.name === 'otro' ? el.programa.otro.name : el.programa.name}
                  </div>
                  <div>{new Date(el.fechaInicio).toLocaleDateString()}</div>
                  <EditHito owner={owner} tipoHito={'academy'} id={el.id} />
                </div>
              ),
            });
            ht.push({
              inverted: inverted,
              badgeColor: 'warning',
              badgeIcon: 'fas fa-university',
              title: ``,
              titleColor: 'info',
              fecha: new Date(el.fechaFin),
              body: (
                <div className='flex flex-col'>
                  <div className='my-2 text-xl text-gray-600 text-bold'>
                    Finalizó{' '}
                    {el.programa.name === 'otro' ? el.programa.otro.name : el.programa.name}
                  </div>
                  <div className='my-2 text-md text-gray-500 text-semibold'>
                    {el.institucion.name === 'otra'
                      ? el.institucion.otro.name
                      : el.institucion.name}
                  </div>
                  <div>{new Date(el.fechaFin).toLocaleDateString()}</div>
                  <EditHito owner={owner} tipoHito={'academy'} id={el.id} />
                </div>
              ),
            });
          } else {
            ht.push({
              inverted: inverted,
              badgeColor: 'warning',
              badgeIcon: 'fas fa-university',
              title: 'En Curso',
              titleColor: 'info',
              fecha: new Date(el.fechaInicio),
              body: (
                <div className='flex flex-col'>
                  <div className='my-2 text-xl text-gray-600 text-bold'>
                    Inició en{' '}
                    {el.institucion.name === 'otra'
                      ? el.institucion.otro.name
                      : el.institucion.name}
                  </div>
                  <div className='my-2 text-md text-gray-500 text-semibold'>
                    {el.programa.name === 'otro' ? el.programa.otro.name : el.programa.name}
                  </div>
                  <div>{new Date(el.fechaInicio).toLocaleDateString()}</div>
                  <EditHito owner={owner} tipoHito={'academy'} id={el.id} />
                </div>
              ),
            });
          }
        });
      cv.hitoPersonal &&
        cv.hitoPersonal.map((el) => {
          ht.push({
            badgeColor: 'danger',
            badgeIcon: 'fas fa-check-double',
            titleColor: 'info',
            fecha: new Date(el.fecha),
            body: (
              <div className='flex flex-col'>
                <div className='my-2 text-xl text-gray-600 text-bold'>{el.nombre}</div>
                <div className='my-2 text-md text-gray-500 text-semibold'>{el.tipo.nombre}</div>
                <div>{new Date(el.fecha).toLocaleDateString()}</div>
                <EditHito owner={owner} tipoHito={'milestone'} id={el.id} />
              </div>
            ),
          });
        });
      cv.hitoProfesional &&
        cv.hitoProfesional.map((el) => {
          if (el.fechaFin) {
            ht.push({
              badgeColor: 'success',
              badgeIcon: 'fas fa-suitcase',
              titleColor: 'info',
              fecha: new Date(el.fechaInicio),
              body: (
                <div className='flex flex-col'>
                  <div className='my-2 text-xl text-gray-600 text-bold'>Inició en {el.empresa}</div>
                  <div className='my-2 text-md text-gray-600 text-semibold'>
                    <span className='text-gray-400'>Cargo: </span>
                    {el.cargo}
                  </div>
                  <div className='my-2 text-md text-gray-600 text-semibold'>
                    <span className='text-gray-400'>Tipo: </span>
                    {el.tipo.nombre}
                  </div>
                  <ReadMore functions={el.funciones} />
                  <div>{new Date(el.fechaInicio).toLocaleDateString()}</div>
                  <EditHito owner={owner} tipoHito={'jobs'} id={el.id} />
                </div>
              ),
            });
            ht.push({
              badgeColor: 'success',
              badgeIcon: 'fas fa-suitcase',
              titleColor: 'info',
              fecha: new Date(el.fechaFin),
              body: (
                <div className='flex flex-col'>
                  <div className='my-2 text-xl text-gray-600 text-bold'>
                    Finalizó en {el.empresa}
                  </div>
                  <div className='my-2 text-md text-gray-600 text-semibold'>
                    <span className='text-gray-400'>Cargo: </span>
                    {el.cargo}
                  </div>
                  <div className='my-2 text-md text-gray-600 text-semibold'>
                    <span className='text-gray-400'>Tipo: </span>
                    {el.tipo.nombre}
                  </div>
                  <ReadMore functions={el.funciones} />
                  <div>{new Date(el.fechaFin).toLocaleDateString()}</div>
                  <EditHito owner={owner} tipoHito={'jobs'} id={el.id} />
                </div>
              ),
            });
          } else {
            ht.push({
              badgeColor: 'success',
              badgeIcon: 'fas fa-suitcase',
              title: 'Empleo Actual',
              titleColor: 'info',
              fecha: new Date(el.fechaInicio),
              body: (
                <div className='flex flex-col'>
                  <div className='my-2 text-xl text-gray-600 text-bold'>Inició en {el.empresa}</div>
                  <div className='my-2 text-md text-gray-600 text-semibold'>
                    <span className='text-gray-400'>Cargo: </span>
                    {el.cargo}
                  </div>
                  <div className='my-2 text-md text-gray-600 text-semibold'>
                    <span className='text-gray-400'>Tipo: </span>
                    {el.tipo.nombre}
                  </div>
                  <ReadMore functions={el.funciones} />
                  <div>{new Date(el.fechaInicio).toLocaleDateString()}</div>
                  <EditHito owner={owner} tipoHito={'jobs'} id={el.id} />
                </div>
              ),
            });
          }
        });
      ht.sort((a, b) => b.fecha - a.fecha);
      let inverted = true;
      Object.keys(ht).forEach((el) => {
        ht[el].inverted = inverted;
        inverted = !inverted;
      });
      setHitos(ht);
    }
  }, [cv, session, readMore]);

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Gente DeMente - CV</title>
      </Head>
      <div className='flex flex-col justify-center items-center px-5 md:px-10'>
        {Object.keys(cv).length > 0 ? (
          <>
            {isOwner && (
              <>
                <div className=' flex p-4 text-center font-bold text-blue-500 text-xs'>
                  {hitos.length > 0 && <LinksHitos />}
                </div>
              </>
            )}
            <div className='my-6 font-bold text-4xl text-gray-700 flex flex-col justify-items-center'>
              <Link href='/'>
                <button
                  className={`${
                    isOwner
                      ? 'hidden'
                      : ' my-10 block my-10w-3/4 m-2 uppercase justify-items-center cursor-pointer shadow-lg hover:shadow-xl bg-bluegdm hover:bg-bluegdm_hover py-2 px-4 text-sm font-bold text-white rounded-md mx-2 '
                  }`}
                >
                  Crea tu propio CV
                </button>
              </Link>
              {isOwner ? 'Mi CV' : `${cv.user.name} CV`}
            </div>
            <div className='text-gray-400'>
              Comparte {isOwner ? 'Tu CV' : `el CV de ${cv.user.name}`} en Redes Sociales
            </div>
            <div>
              <FacebookShareButton
                url={`https://test-gdm.vercel.app/cv/${cv.userId}`}
                quote={`${cv.user.name} quiere compartirte su CV`}
                hashtag={'#gentedemente'}
              >
                <i className='mx-1 cursor-pointer fab fa-facebook-square text-blue-600 hover:text-blue-400' />
              </FacebookShareButton>
              <LinkedinShareButton
                url={`https://test-gdm.vercel.app/cv/${cv.userId}`}
                title={'Gente De Mente'}
              >
                <i className='mx-1 cursor-pointer fab fa-linkedin text-blue-600 hover:text-blue-400' />
              </LinkedinShareButton>
              <TwitterShareButton
                url={`https://test-gdm.vercel.app/cv/${cv.userId}`}
                title={`${cv.user.name} quiere compartirte su CV`}
                hashtags={['#gentedemente']}
              >
                <i className='mx-1 cursor-pointer fab fa-twitter text-blue-600 hover:text-blue-400' />
              </TwitterShareButton>
              <WhatsappShareButton
                url={`https://test-gdm.vercel.app/cv/${cv.userId}`}
                title={`${cv.user.name} quiere compartirte su CV`}
              >
                <i className='mx-1 cursor-pointer fab fa-whatsapp text-blue-600 hover:text-blue-400' />
              </WhatsappShareButton>
              <TelegramShareButton
                url={`https://test-gdm.vercel.app/cv/${cv.userId}`}
                title={`${cv.user.name} quiere compartirte su CV`}
              >
                <i className='mx-1 cursor-pointer fab fa-telegram-plane text-blue-600 hover:text-blue-400' />
              </TelegramShareButton>
            </div>
            {hitos.length > 0 ? (
              <div className='w-full lg:w-3/4 mx-2 lg:mx-12'>
                <Timeline stories={hitos} />
              </div>
            ) : (
              isOwner && (
                <div className='my-4 text-center'>
                  <div className='text-gray-500'>
                    ¡Aún no tienes hitos! Ingresa tu información de vida:
                  </div>
                  <LinksHitos />
                </div>
              )
            )}
          </>
        ) : (
          <div>
            <div>Oops, no hemos encontrado el CV que buscabas.</div>
            <div className='text-center uppercase cursor-pointer justify-end shadow-xs hover:shadow-lg bg-bluegdm hover:bg-bluegdm_hover p-2 text-sm font-bold text-white rounded-sm'>
              {session?.user ? (
                <Link href='/'>Regresar a mi CV</Link>
              ) : (
                <a href='https://www.gentedemente.co'>Regresar a Gente DeMente</a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const LinksHitos = () => {
  return (
    <div className='flex p-4 text-center font-bold text-blue-500 text-xs'>
      <Link href='/academy/create'>
        <div className='flex flex-col justify-center items-center hover:text-gray-900 rounded-xl p-4 cursor-pointer'>
          <div className=' w-12 h-12 rounded-full bg-academy_yellow text-white text-2xl text-center flex items-center justify-center'>
            <i className='fas fa-university'></i>
          </div>
          <div className='cursor-pointer m-3'>AGREGAR INFORMACIÓN ACADÉMICA</div>
        </div>
      </Link>
      <Link href='/jobs/create'>
        <div className='flex flex-col justify-center items-center hover:text-gray-900 rounded-xl p-4 cursor-pointer'>
          <div className=' w-12 h-12 rounded-full bg-jobs_green text-white text-2xl text-center flex items-center justify-center'>
            <i className='fas fa-suitcase'></i>
          </div>
          <div className='cursor-pointer m-3'>AGREGAR EXPERIENCIA LABORAL</div>
        </div>
      </Link>
      <Link href='/milestone/create'>
        <div className='flex flex-col justify-center items-center hover:text-gray-900 rounded-xl p-4 cursor-pointer'>
          <div className=' w-12 h-12 rounded-full bg-mile_red text-white text-2xl text-center flex items-center justify-center'>
            <i className='fas fa-check-double'></i>
          </div>
          <div className='cursor-pointer m-3 '>CREAR HITO PERSONAL</div>
        </div>
      </Link>
    </div>
  );
};

const ReadMore = ({ functions }) => {
  const [readMore, setReadMore] = useState(false);
  return (
    <div
      className={`my-2 text-md text-gray-600 text-semibold transition ease-out duration-500  ${
        readMore ? ' ' : 'max-h-28 overflow-hidden'
      }`}
    >
      <div className='flex flex-row justify-between items-center'>
        <span className='text-gray-400'>Funciones o responsabilidades: </span>
        <div
          className='text-bluegdm hover:text-bluegdm_hover text-2xl cursor-pointer'
          onClick={(e) => {
            setReadMore(!readMore);
          }}
        >
          <i className={` ${readMore ? 'fas fa-minus' : 'fas fa-plus'}`}></i>
        </div>
      </div>
      <p>{functions}</p>
    </div>
  );
};

const EditHito = ({ owner, tipoHito, id }) => {
  return (
    <>
      {owner && (
        <Link href={`/${tipoHito}/${id}`}>
          <div className='uppercase font-bold cursor-pointer self-end text-bluegdm hover:text-bluegdm_hover'>
            Editar
          </div>
        </Link>
      )}
    </>
  );
};

export default PublicCV;
