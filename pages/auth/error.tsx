import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/client";

const error = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [session] = useSession();

  useEffect(() => {
    setError((router.query.error as string) ?? "");
  }, [router]);

  if (error === "OAuthAccountNotLinked") {
    return (
      <Error error="Por razones de seguridad, es necesario que ingreses con el mismo método que usaste la primera vez que te registraste en Gente DeMente" />
    );
  } else {
    return (
      <Error error="Ocurrió un error con el inicio de sesión. Por favor inténtalo de nuevo más tarde." />
    );
  }
};

const Error = ({ error }) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center text-center">
      <div className="w-96 flex flex-col items-center">
        <Image src="/img/Logo-GDM.png" width={196} height={87} />
        <div>{error}</div>
        <Link href="/">
          <div className="cursor-pointer my-6 w-56 bg-bluegdm rounded-md p-2 text-white shadow-lg hover:bg-bluegdm_hover">
            Regresar a Gente DeMente
          </div>
        </Link>
      </div>
    </div>
  );
};

export default error;
