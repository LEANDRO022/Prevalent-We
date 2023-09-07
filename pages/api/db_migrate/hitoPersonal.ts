import prisma from 'config/prisma';
const hitosPersonales = [
  {
    cvId: 'cklitcxil02035kfftqh0frok',
    nombre: 'Grado CumLaude',
    tipoId: 2,
    descripción: '',
    fecha: '1999/12/04',
    paisId: 46,
    ciudadId: 8,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcxil02035kfftqh0frok',
    nombre: 'Creación Gente DeMente',
    tipoId: 3,
    descripción: 'Es una Banca De Talento, pensada para transformar las organizaciones y la forma como estas gestionan su Gente.',
    fecha: '2015/05/04',
    paisId: 46,
    ciudadId: 8,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcy8w03265kffqn8wi5tk',
    nombre: 'Cumbre en el Volcán Lanín',
    tipoId: 3,
    descripción: '',
    fecha: '2017/01/18',
    paisId: 10,
    ciudadId: -1,
    otroState: 'Neuquen',
    otroCity: 'San Martín De Los Andes.',
  },
  {
    cvId: 'cklitftq10206tcff2xq7now4',
    nombre: 'Nacimiento',
    tipoId: 2,
    descripción: '',
    fecha: '2009/01/01',
    paisId: 46,
    ciudadId: 94,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcxil02035kfftqh0frok',
    nombre: 'Nacimiento',
    tipoId: 1,
    descripción: '',
    fecha: '1978/01/13',
    paisId: 46,
    ciudadId: 8,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcxil02035kfftqh0frok',
    nombre: 'Inicio del Camino de Santiago desde Roma',
    tipoId: 1,
    descripción:
      'Inicié, como ha sido mi sueño desde hace tiempo, el Camino de Santiago de Compostela, desde Roma, por la Vía Francígena.',
    fecha: '2019/04/22',
    paisId: 104,
    ciudadId: -1,
    otroState: 'Roma',
    otroCity: 'Roma',
  },
  {
    cvId: 'cklitcvlj00035kffr2ene484',
    nombre: 'IronMan 70.3 Cozumel',
    tipoId: 1,
    descripción: 'Participé en la competencia Ironman 70.3 realizado en Cozumel, México, registrando un tiempo de 5:15m',
    fecha: '2019/09/29',
    paisId: 139,
    ciudadId: -1,
    otroState: 'Cozumel',
    otroCity: 'Cozumel',
  },
  {
    cvId: 'cklitcxil02035kfftqh0frok',
    nombre: 'Llegada a Lucca',
    tipoId: 1,
    descripción: 'Fin de la 1a etapa del Camino, de Roma a Lucca.',
    fecha: '2019/05/05',
    paisId: 104,
    ciudadId: -1,
    otroState: 'Lucca',
    otroCity: 'Lucca',
  },
  {
    cvId: 'cklitft5s0089tcffbqlr2yzz',
    nombre: 'Carlos Ignacio Gutierrez Mendez',
    tipoId: 1,
    descripción:
      'Pienso que lo mas importante que ha acontecido en mi vida ha sido la llegada de mis 4 hijos, pues han sido el motivo o el motor de mi crecimiento como persona todo esto recibido de la mano de mi señor Jesús.',
    fecha: '2020/01/01',
    paisId: 46,
    ciudadId: 21,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcybf03715kffnv3flflx',
    nombre: 'Caso de Estudio. La Franquicia, ¿Una oportunidad de Negocio?',
    tipoId: 2,
    descripción:
      'El caso plantea la decisión de inversión que enfrenta una persona que toma la decisión de establecer un negocio propio, optando por el modelo de franquicia.',
    fecha: '2002/07/29',
    paisId: 46,
    ciudadId: 9,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcybf03715kffnv3flflx',
    nombre: 'Matrimonio',
    tipoId: 1,
    descripción: 'Me casé con Iván Darío Mejía, a quien conocí en mi primer trabajo en BBVA',
    fecha: '2002/06/29',
    paisId: 46,
    ciudadId: 9,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcybf03715kffnv3flflx',
    nombre: 'Nacimiento de Margarita',
    tipoId: 1,
    descripción: 'Nace nuestra primera hija',
    fecha: '2005/09/26',
    paisId: 46,
    ciudadId: 8,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcybf03715kffnv3flflx',
    nombre: 'Nace Cristina',
    tipoId: 1,
    descripción: 'Nace nuestra segunda hija',
    fecha: '2008/01/21',
    paisId: 46,
    ciudadId: 8,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitfvdw0798tcffgo84dbce',
    nombre: 'Nació mi Hija',
    tipoId: 1,
    descripción: 'Nació mi hija Maria José',
    fecha: '2018/01/09',
    paisId: 46,
    ciudadId: 8,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcvvo00185kffmeluft3i',
    nombre: 'Mejor emprendimiento social en Colombia',
    tipoId: 3,
    descripción:
      'Bajo el marco del evento de la subasta de emprendimiento social que dirige la Asociación nacional de industriales de Colombia (ANDI) obtuvimos el premio como el mejor emprendimiento social del país para el año 2017.',
    fecha: '2017/08/13',
    paisId: 46,
    ciudadId: 8,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitfudf0412tcff5xjdwhhg',
    nombre: 'INDEPENDENCIA LABORAL',
    tipoId: 1,
    descripción: '',
    fecha: '2007/02/25',
    paisId: 46,
    ciudadId: 22,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcx5801495kff6ciai38v',
    nombre: 'Torneo de fútbol de mi hijo',
    tipoId: 1,
    descripción: '',
    fecha: '2019/10/07',
    paisId: 46,
    ciudadId: 22,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcxwq02715kffqbp5hl0x',
    nombre: 'Conferencista',
    tipoId: 1,
    descripción:
      'Durante tres años trabajé con adolescentes llevando a zonas rurales conferencias relacionadas con la personalidad, autoestima.',
    fecha: '2017/01/13',
    paisId: 46,
    ciudadId: 18,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitfu0n0279tcff50t19emv',
    nombre: 'Nacimiento de mi hermano menor',
    tipoId: 1,
    descripción: 'Emocionante, ya que llegó un nuevo miembro a mi familia el cual no va alegrar cada día con su presencia',
    fecha: '2019/03/27',
    paisId: 46,
    ciudadId: 22,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcz0605395kffjt7hnwmz',
    nombre: 'Serguir formandome academicamente para ser mejor cada dia poder graduarme',
    tipoId: 2,
    descripción: '',
    fecha: '2020/02/10',
    paisId: 46,
    ciudadId: 22,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcwql00905kfffqzvclz4',
    nombre: 'Mi Graduación de licenciada',
    tipoId: 2,
    descripción: '',
    fecha: '2019/12/12',
    paisId: 46,
    ciudadId: 22,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcw5k00425kff1fnl94go',
    nombre: 'necesidades educativa especiales e inclusión',
    tipoId: 2,
    descripción: 'Enseñar a leer por medio de imágenes a dos niñas con dificultades auditivas,',
    fecha: '2018/02/13',
    paisId: 46,
    ciudadId: 22,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcxwq02735kffwh8lxfwv',
    nombre: 'Prepararme para tener una mejor calidad de vida y ser cada dia mejor persona',
    tipoId: 3,
    descripción: '',
    fecha: '2017/03/13',
    paisId: 46,
    ciudadId: 22,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitczdn06865kffto5605um',
    nombre: 'Amor por los niños',
    tipoId: 3,
    descripción:
      'Cunado tenía la edad de 18 años, trabajé como niñera fue una extraordinaria quede enamorada de ese mundo, por ello decidí escoger como profesión licenciatura  para enseñar y trabajar con niños.',
    fecha: '2010/02/13',
    paisId: 46,
    ciudadId: 22,
    otroState: '',
    otroCity: '',
  },
  {
    cvId: 'cklitcxil02035kfftqh0frok',
    nombre: 'Me quedo en Casa',
    tipoId: 1,
    descripción: 'Me cuido, cuido a los míos, y agradezco a los que nos cuidan a todos.',
    fecha: '2020/03/20',
    paisId: 46,
    ciudadId: 12,
    otroState: '',
    otroCity: '',
  },
];
const DBMigrate = async (req, res) => {
  if (req.method === 'GET') {
    const errores = [];
    await hitosPersonales.forEach(async (hito) => {
      try {
        if (hito.ciudadId === -1) {
          await prisma.hitoPersonal.create({
            data: {
              descripcion: hito.descripción,
              fecha: new Date(hito.fecha),
              nombre: hito.nombre,
              ciudad: {
                create: {
                  nombre: 'otra',
                  departamento: {
                    create: {
                      nombre: 'otro',
                      pais: {
                        connect: {
                          id: hito.paisId,
                        },
                      },
                      otro: {
                        create: {
                          nombre: hito.otroState,
                        },
                      },
                    },
                  },
                  otro: {
                    create: {
                      nombre: hito.otroCity,
                    },
                  },
                },
              },
              cv: {
                connect: {
                  id: hito.cvId,
                },
              },
              tipo: {
                connect: {
                  id: hito.tipoId,
                },
              },
            },
          });
        } else {
          await prisma.hitoPersonal.create({
            data: {
              descripcion: hito.descripción,
              fecha: new Date(hito.fecha),
              nombre: hito.nombre,
              ciudad: {
                connect: {
                  id: hito.ciudadId,
                },
              },
              cv: {
                connect: {
                  id: hito.cvId,
                },
              },
              tipo: {
                connect: {
                  id: hito.tipoId,
                },
              },
            },
          });
        }
      } catch {
        errores.push(hito);
      }
    });
    return res.status(200).json({ errores });
  }
};

export default DBMigrate;
