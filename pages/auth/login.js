"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {useState} from 'react'

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter()
  const [error, setError] = useState(null)
  
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    const res = await signIn("credentials", {
      usuario: data.usuario,
      password: data.password,
      redirect: false,
       // Ajusta la ruta según tu configuración
    });
    console.log(res)
    if (res.error) {
      router.push('/auth/login')
    } else {
      router.push('/chats')
      
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">

        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">{error}</p>
        )}

        
        <img className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 mx-auto my-auto" src="https://1bb437.a2cdn1.secureserver.net/wp-content/uploads/2023/08/Logo-500-full-150x150.jpg" alt="Logo" />

        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          Usuario:
        </label>
        <input
          type="usuario"
          {...register("usuario", {
            required: {
              value: true,
              message: "Usuario is required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="user@email.com"
        />

        {errors.usuario && (
          <span className="text-red-500 text-xs">{errors.usuario.message}</span>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Password:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="******"
        />

        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}

        <button className="w-full bg-blue-500 text-black p-3 rounded-lg mt-2">
          Login
        </button>
      </form>
    </div>
  );
}
export default LoginPage;
