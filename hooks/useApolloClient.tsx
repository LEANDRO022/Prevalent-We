import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';
import { useSession } from 'next-auth/react';

const useApolloClient = () => {
  const { data: session } = useSession();

  // const url = 'http://localhost:4000/';

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/',
    // uri: 'http://localhost:4000/',
    headers: {
      'next-auth.session-token': session?.sessionToken ?? '',
    },
  });

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(
    new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    })
  );

  const [persistor, setPersistor] = useState<
    CachePersistor<NormalizedCacheObject>
  >();

  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache();
      const newPersistor = new CachePersistor({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
        trigger: 'write',
        maxSize: 1048576 * 50, // 50MB
      });
      await newPersistor.restore();
      setPersistor(newPersistor);
      setClient(
        new ApolloClient({
          link: httpLink,
          cache,
        })
      );
    }

    if (session) {
      // eslint-disable-next-line no-console
      init().catch(console.error);
    }
  }, [session]);

  const clearCache = useCallback(() => {
    if (!persistor) {
      return;
    }
    persistor.purge();
  }, [persistor]);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  return { client, clearCache, reload };
};

export default useApolloClient;
