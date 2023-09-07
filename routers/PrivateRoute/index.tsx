import { useSession, signIn } from 'next-auth/react';

// Importacion de componentes customizados
import Loading from '@components/atoms/Loading';
import LayoutPrivate from '@components/Templates/LayoutPrivate';

function PrivateRoute({ children, rejected }: any) {
  const { data: session, status } = useSession();
  if (status === 'loading') return <Loading open />;

  // if (!session) {
  //   signIn('auth0');
  //   return <Loading open />;
  // }

  // if (isPublic) return children;
  if (!rejected) return <LayoutPrivate>{children}</LayoutPrivate>;

  return <div>You are not authorized to view this site.</div>;
  /*  return <LayoutPrivate>{children}</LayoutPrivate> */
}

export default PrivateRoute;
