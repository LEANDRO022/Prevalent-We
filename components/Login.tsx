import { signIn, useSession } from "next-auth/client";
import Loading from "@components/Loading";
import { useState } from "react";
import Image from "next/image";

const Login = () => {
  const [session, loading] = useSession();
  const [email, setEmail] = useState("");
  if (loading) return <Loading />;
  return (
    <div>
      {!session && (
        <div className="max-h-screen overflow-y-hidden">
          <div className="hidden md:relative h-screen md:block md:w-1/2 xl:w-4/6">
            {/* <Image src='/img/Login.jpg' height={1266} width={1900} /> */}
            <Image
              src="/img/Login.jpg"
              className="max-w-full"
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          </div>
          <div className="absolute top-0 left-0 h-full w-full">
            <div className="flex justify-center w-full h-full">
              <div className="hidden md:w-1/2 xl:w-4/6  bg-gray-900 bg-opacity-40 py-12 md:flex flex-col items-start justify-center">
                <h1 className="text-white text-6xl ml-4 font-black">
                  Gente <br /> DeMente
                </h1>
                <span className="text-white text-3xl ml-4">¡Bienvenidos!</span>
              </div>
              <div className="py-2 px-4 md:w-1/2 xl:w-2/6 md:px-12 md:py-1 grid grid-cols-1 gap-1 justify-center items-center">
                <div className="flex justify-center">
                  <Image src="/img/Logo.png" height={100} width={100} />
                </div>
                <div className="text-center">
                  <span>Inicia Sesión en Gente DeMente</span>
                </div>
                <Separador />
                <div className="my-4">
                  <form
                    className="flex flex-col items-center"
                    onSubmit={(e) => {
                      e.preventDefault();
                      signIn("email", { email });
                    }}
                  >
                    <label>
                      <span className="font-bold text-xs">
                        Correo Electrónico
                      </span>
                      <input
                        required
                        className="w-full outline-none border-0 border-b-2 focus:border-bluegdm mt-2 mb-4 p-2 shadow-md"
                        type="email"
                        placeholder="Ingresa tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    <button
                      type="submit"
                      className="bg-bluegdm rounded-md p-2 text-white shadow-lg hover:bg-bluegdm_hover"
                    >
                      Ingresa con tu Correo Electrónico
                    </button>
                  </form>
                </div>
                <Separador />
                <div className="flex flex-col justify-self-center">
                  <SocialButton
                    network="linkedin"
                    color="#0e76a8"
                    onClick={() => signIn("linkedin")}
                  />
                  <SocialButton
                    network="facebook"
                    color="#3b5998"
                    onClick={() => signIn("facebook")}
                  />
                  <SocialButton
                    network="google"
                    color="#de5246"
                    onClick={() => signIn("google")}
                  />
                </div>
                <Separador />
                <div className="justify-self-center">
                  <SocialButton
                    network="usuario y contraseña"
                    color="#26B4FF"
                    onClick={() => signIn("auth0")}
                  />
                </div>
                <Separador />
                <div className="flex justify-center items-center justify-self-center">
                  <span className="text-xs font-semibold text-center">
                    Al ingresar, confirmas que estás de acuerdo con la{" "}
                    <a
                      className="text-blue-400"
                      href="https://www.gentedemente.co/politica-de-privacidad/"
                      target="_blank"
                    >
                      política de privacidad
                    </a>
                  </span>
                </div>
                <Separador />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Separador = () => {
  return <div className="border-0 border-b-2 -mx-6 border-gray-200" />;
};

export default Login;

const SocialButton = ({ network, color, onClick }) => {
  return (
    <>
      <button
        type="submit"
        className="text-white max-w-md  m-4 p-2 rounded-md shadow-lg text-center flex-row flex justify-start "
        onClick={onClick}
      >
        <div className="flex flex-row justify-items-stretch items-center ml-2">
          <i
            className={`${
              network === "usuario y contraseña"
                ? "fas fa-unlock-alt mx-4 justify-start"
                : `fab fa-${network} mx-4 justify-start`
            }`}
          ></i>
          <span className="text-sm mx-2">
            Ingresa con{" "}
            <span
              className={network === "usuario y contraseña" ? "" : "capitalize"}
            >
              {network}
            </span>
          </span>
        </div>
      </button>
      <style jsx>{`
        background-color: ${color};
      `}</style>
    </>
  );
};
