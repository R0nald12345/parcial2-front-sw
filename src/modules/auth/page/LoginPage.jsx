import React from "react";
import { useForm } from "react-hook-form";
import imagenLogin from "../img/imagenLogin.png";

// import logoUAGRM from "../img/logo_escudo_uagrm.png";
// import uagrm_logo from "../img/uagrm_logo.png";
// import logo_facebook from "../img/logo_facebook.png";
// import logo_whatApps from "../img/logo_whatApps.png";
// import imgenFondo from "../img/imagenFondo.png";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data); // Tu contexto espera un objeto { email, password }

      navigate("/dashboard"); // Redirige al dashboard si el login es exitoso
    } catch (error) {
      // El error ya es mostrado por SweetAlert, pero puedes mostrar un error general si quieres
      setError("root", { message: "Credenciales incorrectas o error de red." });
    }
  };

  return (
    <>
      <div
          style={{
             backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4))`
            }}
      >
        

        <section className="flex items-center justify-center min-h-screen">
          <section className="flex flex-col-reverse md:flex-row md:w-[85%] lg:w-[60%] md:gap-5 ">
    

            {/* Contenido del formulario */}
            <div className="px-5 md:px-12 p-8 mx-auto w-[95%] md:w-[60%] bg-white/20 rounded-md shadow-lg mt-8 md:mt-0">
              <h2 className="text-3xl md:text-5xl text-center">Inicia Sesión</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-1 mx-auto ">
                {/* Email */}
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Ingrese su correo"
                    {...register("email", {
                      required: "El correo es obligatorio",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Ingrese un correo válido",
                      },
                    })}
                    className="font-mplus-bold text-gray-500 rounded-xl w-full p-2 mt-5 bg-white outline-none border-2 border-gray-200"
                  />
                  {errors.email && <p className="text-red-950 text-xl font-bold">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Contraseña"
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "La contraseña debe tener al menos 6 caracteres",
                      },
                    })}
                    className="font-mplus-bold text-gray-500 rounded-xl w-full p-2 bg-white outline-none border-2 border-gray-200"
                  />
                  {errors.password && <p className="text-red-950 text-xl font-bold">{errors.password.message}</p>}
                </div>

                {/* Mensaje de error general */}
                {errors.root && <p className="text-red-500 text-sm mb-4">{errors.root.message}</p>}
                <div className="flex justify-between mt-10 gap-8">
                  {/* Botón de envío */}
                  <button
                    type="submit"
                    className="font-mplus-bold bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 w-full cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cargando...' : 'Ingresar'}
                  </button>
                  {/* Puedes implementar el registro en otro formulario o modal */}
                  <button
                    type="button"
                    className="font-mplus-bold bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 w-full cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Registrarse
                  </button>
                </div>
                {/* <div className=" font-mplus-bold w-full text-center mt-5 text-white hover:text-red-600 cursor-pointer">
                  <h4>¿Te olvidaste tu contraseña?</h4>
                </div> */}
              </form>
            </div>

          </section>
        </section>
      </div>
    </>
  );
};

export default LoginPage;