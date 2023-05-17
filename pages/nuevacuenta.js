import React, { useState } from "react";
import { useRouter } from 'next/router';
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
//import { useQuery, gql } from '@apollo/client';

// const QUERY = gql`
//     query obtenerProductos{
//         obtenerProductos {
//             id
//             nombre
//             precio
//             existencia
//         }
//     }
// `;

const NUEVA_CUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput){
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
        }
    }
`;


const NuevaCuenta = () => {
    //Obtener productos de graphql
    // const { data, loading, error } = useQuery(QUERY);
    // console.log(data)
    // console.log(loading)
    // console.log(error)

    //State para el mensaje
    const [ mensaje, guardarMensaje ] = useState(null);

    //Mutation para usuario 
    const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA);

    //Routing
    const router = useRouter();

    //validacion formulario
    const formik = useFormik({
        initialValues : {
            nombre : '',
            apellido : '',
            email : '',
            password : ''
        },
        validationSchema : Yup.object({
            nombre : Yup.string().required('El nombre es obligatorio'),
            apellido : Yup.string().required('El apellido es obligatorio'),
            email : Yup.string().required('El email es obligatorio').email('El email no es válido'),
            password : Yup.string().required('El password es obligatorio').min(6, 'El password debe tener minimo 6 caracteres'),
        }),
        onSubmit : async valores => {
            console.log(valores);
            const { nombre, apellido, email, password } = valores;
            try {
                const { data } = await nuevoUsuario({
                    variables : {
                        input : {
                            nombre : nombre,
                            apellido : apellido,
                            email : email, 
                            password : password
                        }
                    }
                });

                guardarMensaje(`Se creo correctamente el Usuario: ${data.nuevoUsuario.nombre}`);
                console.log(data);
                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/login');
                }, 3000);
                //Usuario Creado Correctamente
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''))
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
            }

        }
    });

    //if (loading) return 'Cargando...';
    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 text-black max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        );
    }

    return(
        <>
            <Layout>
                { mensaje && mostrarMensaje() }
                <h1 className="text-center text-2xl text-white font-light">Crear Nueva Cuenta</h1>
                
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm"> 
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                            <div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                        Nombre
                                    </label>
                                    <input 
                                        className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" 
                                        id="nombre"
                                        type="text"
                                        placeholder="Nombre Usuario"
                                        value={formik.values.nombre}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    { formik.touched.nombre && formik.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{formik.errors.nombre}</p>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                        Apellido
                                    </label>
                                    <input 
                                        className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" 
                                        id="apellido"
                                        type="text"
                                        placeholder="Apellido Usuario"
                                        value={formik.values.apellido}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    { formik.touched.apellido && formik.errors.apellido ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{formik.errors.apellido}</p>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input 
                                        className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" 
                                        id="email"
                                        type="email"
                                        placeholder="Email Usuario"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    { formik.touched.email && formik.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{formik.errors.email}</p>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input 
                                        className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" 
                                        id="password"
                                        type="password"
                                        placeholder="Password Usuario"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    { formik.touched.password && formik.errors.password ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{formik.errors.password}</p>
                                        </div>
                                    ) : null}
                                </div>
                                <div>
                                    <input
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-blue-900"
                                        value="Crear Cuenta"
                                        type="submit"
                                    >
                                </input>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NuevaCuenta;