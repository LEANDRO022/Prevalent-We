import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Fade from "react-reveal/Fade";
import { signOut, useSession } from "next-auth/client";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import UserModal from "@components/UserModal";
import { Transition } from "@tailwindui/react";
import useUserImage from "hooks/useUserImage";
import useWindowSize from "../hooks/useWindowSize";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [opene, setOpene] = useState(false);
  const [openp, setOpenp] = useState(false);
  const [session, loading] = useSession();
  const [admin, setAdmin] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [show, setShow] = useState(false);
  const container = useRef(null);
  const windowSize = useWindowSize();

  const ref = useRef(null);

  useEffect(() => {
    if (session) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (!container.current.contains(event.target)) {
          if (!show) return;
          setShow(false);
        }
      };
      window.addEventListener("click", handleOutsideClick);
      return () => window.removeEventListener("click", handleOutsideClick);
    }
  }, [show, container]);

  useEffect(() => {
    if (session) {
      const handleEscape = (event: KeyboardEvent) => {
        if (!show) return;

        if (event.key === "Escape") {
          setShow(false);
        }
      };

      document.addEventListener("keyup", handleEscape);
      return () => document.removeEventListener("keyup", handleEscape);
    }
  }, [show]);

  useEffect(() => {
    if (session) {
      if (
        session.user.roles.filter((el) => el.name === "superuser").length > 0
      ) {
        setAdmin(true);
      }
      setUserImage(useUserImage(session.user));
    }
  }, [session]);

  const handleEmpleo = () => {
    setOpene(!opene);
    setOpenp(false);
  };
  const handlePerfil = () => {
    setOpenp(!openp);
    setOpene(false);
    setShow(!show);
  };
  const handleClose = () => {
    setOpen(false);
    setOpene(false);
    setOpenp(false);
    setShow(false);
  };
  const handleMenu = () => {
    setOpen(!open);
    setOpene(false);
    setOpenp(false);
  };

  useEffect(() => {
    setOpen(false);
  }, [windowSize]);

  return (
    <>
      {session && session.user.name === null && (
        <UserModal userId={session.user.id} />
      )}
      {session && (
        <nav
          ref={ref}
          className={`grid grid-cols-6 items-center bg-primary1 w-full h-auto z-50 relative p-2 lg:grid-cols-6 ${
            open
              ? "fixed inset-y-0 right-0 w-full"
              : "w-full flex justify-between"
          }`}
        >
          <Link href="/">
            <div className="flex cursor-pointer col-span-3 md:justify-self-start">
              <div className="justify-self-end self-center h-auto w-10 mt-2">
                <Image
                  className="cursor-pointer"
                  src={"/img/Logo.png"}
                  alt="Logo"
                  width="300"
                  height="300"
                />
              </div>
              <div className="self-center">
                <h1 className="font-Roboto font-normal text-base text-left  text-white">
                  {" "}
                  Gente DeMente
                </h1>
              </div>
            </div>
          </Link>

          <div className="text-white col-start-6 text-xl justify-self-end self-center mr-4 lg:hidden">
            <button className="h-10 w-10" onClick={handleMenu}>
              <span className="text-white text-4xl">&#x2263;</span>
            </button>
          </div>
          {/* <div
            className={`bg-primary1 invisible w-2/3 col-span-3 flex flex-row ${open ? 'py-2' : 'hidden lg:flex lg:mx-4 lg:justify-self-start'
              }`}
          >
            <div className="text-white text-bases px-2 self-center">
              <i className="fas fa-search"></i>
            </div>
            <input
              type="text"
              autoComplete="on"
              className="w-full bg-primary1 text-white font-Roboto"
              placeholder="Buscar..."
              name="Search Bar"
              id="2"
            />
          </div> */}
          <div
            className={`${
              open
                ? "col-span-4 flex py-2"
                : "hidden lg:flex lg:justify-self-center"
            }`}
          >
            {admin && (
              <Link href={`/admin`}>
                <div
                  className="cursor-pointer flex flex-row text-gray-300 hover:text-white focus:text-white relative"
                  onClick={handleClose}
                >
                  <div className="text-bases px-2 self-center">
                    <i className="fas fa-cogs"></i>
                  </div>
                  <h1 className="text-bases px-2 self-center">
                    Administración
                  </h1>
                  {/* <div className='rounded-full bg-red-600 text-center text-white font-semibold w-4 h-4 absolute top-0 text-xs left-40'>
                    3
                  </div> */}
                </div>
              </Link>
            )}
          </div>
          {/* <div
            className={`${
              open
                ? "col-span-4"
                : "hidden lg:block lg:col-span-1 lg:justify-self-center"
            }`}
          >
            <div
              onClick={handleEmpleo}
              className="flex flex-row py-2 items-center text-gray-300 hover:text-white focus:text-white"
            >
              <div className="text-bases px-2 self-center">
                <i className="fas fa-briefcase"></i>
              </div>
              <h1 className="text-bases px-2 self-center"> Empleo</h1>
              <div className="text-base px-2 self-center">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
            <div className={`md:absolute md:z-60 ${opene && "hidden"}`}>
              <Fade right duration={200} when={opene}>
                <div className="bg-white py-2 w-full flex flex-row rounded-lg shadow-xl">
                  <div className=" text-primary1 font-Roboto text-bases px-2 self-center">
                    <i className="fas fa-search"></i>
                  </div>
                  <input
                    type="text"
                    autoComplete="on"
                    className="w-full bg-white  text-primary1 font-Roboto"
                    placeholder="Buscar Empleo..."
                    name="Search Bar"
                    id="2"
                  />
                </div>
              </Fade>
            </div>
          </div> */}
          <div
            className={`${
              open
                ? "col-span-4 flex py-2"
                : "hidden lg:flex lg:col-span-1 lg:justify-self-center"
            }`}
          >
            <Link href={`/cv/${session.user.id}`}>
              <div
                className=" cursor-pointer flex flex-row text-gray-300 hover:text-white focus:text-white"
                onClick={handleClose}
              >
                <div className="text-bases px-2 self-center">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <h1 className="text-bases px-2 self-center"> Mi CV</h1>
              </div>
            </Link>
          </div>
          <div
            className={`cursor-pointer ${
              open
                ? "col-span-4"
                : "hidden lg:block lg:col-span-1 lg:justify-self-center"
            }`}
          >
            <div
              onClick={handlePerfil}
              ref={container}
              className="flex flex-row py-2  text-gray-300 hover:text-white focus:text-white"
            >
              {userImage && (
                <Image
                  className="cursor-pointer rounded-full"
                  src={userImage}
                  alt="Logo"
                  width="30"
                  height="30"
                />
              )}

              <h1 className="text-bases px-2 self-center">
                {" "}
                {(session.user.Perfil?.name
                  ? session.user.Perfil.name
                  : session.user.name
                )?.split(" ")[0] ?? ""}
              </h1>
              <div className="text-base px-2 self-center">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
            <Transition
              show={show}
              enter="transition ease-out duration-100 transform"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75 transform"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`md:absolute md:z-60 ${
                  show ? "bg-white mx-1" : "hidden"
                }`}
              >
                <div className="shadow-xl rounded-lg">
                  <Link href="/account">
                    <div className="cursor-pointer flex flex-row py-2 hover:bg-gray-200">
                      <div className=" text-primary1 font-Roboto text-bases px-2 self-center">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      <div className="lg:whitespace-nowrap text-primary1 font-Roboto text-bases px-2 self-center">
                        Mi Cuenta
                      </div>
                    </div>
                  </Link>
                  <Link href="/company">
                    <div className="cursor-pointer flex flex-row py-2 hover:bg-gray-200">
                      <div className=" text-primary1 font-Roboto text-bases px-2 self-center">
                        <i className="fas fa-building"></i>
                      </div>
                      <div className="lg:whitespace-nowrap text-primary1 font-Roboto text-bases px-2 self-center">
                        Mi Empresa
                      </div>
                    </div>
                  </Link>
                  <div
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer flex flex-row py-2 hover:bg-gray-200"
                  >
                    <div className=" text-red-600 font-Roboto text-bases px-2 self-center">
                      <i className="fas fa-sign-out-alt"></i>
                    </div>
                    <div className="lg:whitespace-nowrap text-primary1 font-Roboto text-bases px-2 self-center">
                      Cerrar Sesión
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
