import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authService } from "../service/authService";

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Solo envía los campos requeridos
      const payload = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
      };
      const res = await authService.register(payload);

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: res?.message || "Usuario registrado exitosamente",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/auth/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de registro",
        text: error?.message || "No se pudo registrar el usuario.",
      });
      setError("root", { message: error?.message || "No se pudo registrar el usuario." });
    }
  };

  return (
    <>
      <div style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4))`
      }}>
        <section className="flex items-center justify-center min-h-screen">
          <section className="flex flex-col-reverse md:flex-row md:w-[85%] lg:w-[60%] md:gap-5 ">
            <div className="px-5 md:px-12 py-8 mx-auto w-[95%] md:w-[60%] bg-white/20 rounded-md shadow-lg mt-8 md:mt-0 ">
              <h2 className="text-3xl md:text-5xl font-semibold text-center">Nueva Cuenta</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-3 mx-auto ">
                {/* Nombre */}
                <div className="mb-4">
                  <p className="text-gray-300">Nombre</p>
                  <input
                    type="text"
                    placeholder="Ingrese su Nombre"
                    {...register("nombre", {
                      required: "El Nombre es obligatorio",
                    })}
                    className="font-mplus-bold text-gray-500 rounded-xl w-full p-2 bg-white outline-none border-2 border-gray-200"
                  />
                  {errors.nombre && <p className="text-red-950 text-xl font-bold">{errors.nombre.message}</p>}
                </div>
                {/* Email */}
                <div className="mb-4 ">
                  <p className="text-gray-300">Correo Electrónico</p>
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
                    className="font-mplus-bold text-gray-500 rounded-xl w-full p-2 bg-white outline-none border-2 border-gray-200"
                  />
                  {errors.email && <p className="text-red-950 text-xl font-bold">{errors.email.message}</p>}
                </div>
                {/* Password */}
                <div className="mb-4 ">
                  <p className="text-gray-300">Contraseña</p>
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
                  <input
                    type="submit"
                    className="font-mplus-bold bg-green-700 text-white py-2 px-4 rounded-xl hover:bg-green-800 w-full cursor-pointer"
                    value="Registrarse"
                  />
                </div>
              </form>
            </div>
          </section>
        </section>
      </div>
    </>
  );
};

export default RegisterPage;