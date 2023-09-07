import { useSession } from 'next-auth/client';
import Login from '@components/Login';
import Loading from '@components/Loading';
import * as React from 'react';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children }) => {
  const [session, loading] = useSession();
  if (loading) return <Loading />;
  return <>{session ? children : <Login />}</>;
};

const AdminRoute = ({ children }) => {
  const [session, loading] = useSession();
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (session) {
      if (session.user.roles.filter((el) => el.name === 'admin' || el.name === 'superuser').length > 0) {
        setAdmin(true);
      }
    }
  }, [session]);

  if (loading) return <Loading />;
  return (
    <PrivateRoute>
      {admin ? (
        children
      ) : (
        <div className='flex w-full h-screen text-center items-center justify-center'>
          <div>Lo sentimos, no tienes autorización para ver este sitio.</div>
        </div>
      )}
    </PrivateRoute>
  );
};

const SuperAdminRoute = ({ children }) => {
  const [session, loading] = useSession();
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (session) {
      if (session.user.roles.filter((el) => el.name === 'superuser').length > 0) {
        setAdmin(true);
      }
    }
  }, [session]);

  if (loading) return <Loading />;
  return (
    <PrivateRoute>
      {admin ? (
        children
      ) : (
        <div className='flex w-full h-screen text-center items-center justify-center'>
          <div>Lo sentimos, no tienes autorización para ver este sitio.</div>
        </div>
      )}
    </PrivateRoute>
  );
};

export { AdminRoute, SuperAdminRoute };

export default PrivateRoute;
