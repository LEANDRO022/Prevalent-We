import Link from 'next/link';
import { useSession } from 'next-auth/client';
import Loading from 'components/Loading';
import Tooltip from '@material-ui/core/Tooltip';

export const CVInputPageContainer = ({ children }) => {
  return <div className='flex flex-col p-8 items-center h-full'>{children}</div>;
};

interface CVInputPageHeaderProps {
  sectionName: string;
  buttonName: string;
  deleteButton?: boolean;
  deleteFunction?: any;
}

interface AdminInputPageHeaderProps {
  sectionName: string;
}

export const CVInputPageHeader = ({ sectionName, buttonName, deleteButton, deleteFunction }: CVInputPageHeaderProps) => {
  const [session, loading] = useSession();
  if (loading) return <Loading />;
  return (
    <div className='m-4 flex flex-col items-center md:flex-row md:w-3/4 md:justify-between md:items-center uppercase'>
      <div className='py-2 text-lg'>
        <Link href={`/cv/${session.user.id}`}>
          <span className='text-blue-500 cursor-pointer'>CV</span>
        </Link>
        <span className='text-gray-400'> / </span>
        <span className='text-gray-600 capitalize font-semibold'>{sectionName}</span>
      </div>
      <div className='flex'>
        {deleteButton && (
          <Tooltip title='Eliminar hito' arrow placement='top'>
            <div
              onClick={deleteFunction}
              className='cursor-pointer shadow-sm flex justify-center items-center text-white bg-red-700 hover:bg-red-600 hover:shadow-md p-2 mx-2 rounded-sm'
            >
              <i className='fas fa-trash-alt' />
            </div>
          </Tooltip>
        )}
        <button
          type='submit'
          className='uppercase cursor-pointer shadow-xs hover:shadow-lg bg-bluegdm hover:bg-bluegdm_hover p-2 text-sm font-bold text-white rounded-sm'
        >
          <span>{buttonName}</span>
        </button>
      </div>
    </div>
  );
};

export const AdminInputPageHeader = ({ sectionName }: AdminInputPageHeaderProps) => {
  const [session, loading] = useSession();
  if (loading) return <Loading />;
  return (
    <div className='my-2 mx-4 flex flex-col items-center md:flex-row md:w-3/4 md:justify-between md:items-center'>
      <div className='py-2 text-lg'>
        <Link href={'/admin'}>
          <span className='text-blue-500 cursor-pointer'>Administración</span>
        </Link>
        <span className='text-gray-400'> / </span>
        <span className='text-gray-600 font-semibold'>{sectionName}</span>
      </div>
    </div>
  );
};

interface AdminInputPageSRHeaderProps {
  sectionName: string;
  sectionRoute: string;
  subSectionName: string;
}

export const AdminInputPageHeaderSubRoute = ({ sectionName, sectionRoute, subSectionName }: AdminInputPageSRHeaderProps) => {
  const [session, loading] = useSession();
  if (loading) return <Loading />;
  return (
    <div className='my-2 mx-4 flex flex-col items-center md:flex-row md:w-3/4 md:justify-between md:items-center'>
      <div className='py-2 text-lg'>
        <Link href={'/admin'}>
          <span className='text-blue-500 cursor-pointer'>Administración</span>
        </Link>
        <span className='text-gray-400'> / </span>
        <Link href={`/admin/${sectionRoute}`}>
          <span className='text-blue-500 cursor-pointer'>{sectionName}</span>
        </Link>
        <span className='text-gray-400'> / </span>
        <span className='text-gray-600 font-semibold uppercase'>{subSectionName}</span>
      </div>
    </div>
  );
};

export const CVInputPageContent = ({ children }) => {
  return <div className='bg-white px-6 w-full md:w-3/4 h-full'>{children}</div>;
};

export const AdminInputPageContent = ({ children }) => {
  return <div className='bg-white px-6 mb-6 rounded-lg w-full md:w-3/4 h-full'>{children}</div>;
};

export const Pregunta = ({ children }) => {
  return <span className='text-3xl font-light text-gray-400'>{children}</span>;
};

export const Seccion = ({ children }) => {
  return <section className='border-gray-100 border-b-2 my-4 py-4'>{children}</section>;
};

interface InputContainerProps {
  children: any;
  className?: string;
}

export const InputContainer = ({ children, className = '' }: InputContainerProps) => {
  return <div className={`p-2 flex flex-col justify-center ${className}`}>{children}</div>;
};

export const InputContainer2 = ({ children }) => {
  return <div className='p-2  justify-self-auto'>{children}</div>;
};

export const CustomCheckbox = ({ bool, setBool, texto }) => {
  return (
    <div className='m-2 flex justify-start items-center'>
      <input
        className='m-2 form-checkbox text-bluegdm border-2 rounded-sm h-4 w-4'
        type='checkbox'
        checked={bool}
        onChange={() => setBool(!bool)}
      />
      <span className='m-2'>{texto}</span>
    </div>
  );
};

export const TipoDescription = ({ int, setint, texto }) => {
  return (
    <div className='m-2 flex justify-start items-center'>
      <p></p>
    </div>
  );
};

interface FooterProps {
  buttonName: string;
  deleteButton?: string;
}

export const CVInputPageFooter = ({ buttonName, deleteButton }: FooterProps) => {
  return (
    <div className='m-4 flex flex-col items-center  md:flex-row md:w-3/4 md:justify-end md:items-center uppercase'>
      <div className='flex'>
        {deleteButton && (
          <div className='cursor-pointer shadow-sm flex justify-center items-center text-white bg-red-700 hover:bg-red-600 hover:shadow-md p-2 mx-2 rounded-sm'>
            <i className='fas fa-trash-alt' />
          </div>
        )}
        <button
          type='submit'
          className='uppercase cursor-pointer justify-end shadow-xs hover:shadow-lg bg-bluegdm hover:bg-bluegdm_hover p-2 text-sm font-bold text-white rounded-sm'
        >
          <span>{buttonName}</span>
        </button>
      </div>
    </div>
  );
};
