import React, { useState } from "react";
import Layout from "../components/Layout";
import { useRouter } from 'next/router';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput){
        autenticarUsuario(input: $input) {
            token
        }
    }
`;

const Login = () => {
    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

    const [ mensaje, guardarMensaje ] = useState(null);

    const router = useRouter();

    const formik = useFormik({
        initialValues : {
            email : '',
            password : ''
        },
        validationSchema : Yup.object({
            email : Yup.string().email('El email no es valido').required('El email es obligatorio'),
            password : Yup.string().required('El password es obligatorio')
        }),
        onSubmit : async valores => {
            const { email, password } = valores;

            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });
                console.log(data)
                
                guardarMensaje('Autenticando...')
                const { token } = data.autenticarUsuario;
                console.log(token);
                localStorage.setItem('token', token);

                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/');
                }, 3000);

            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''))
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
            }

        }
    });

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
                <h1 className="text-center text-2xl text-white font-light">Login</h1>
                
                { mensaje && mostrarMensaje() }
                
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm"> 
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                            <div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input 
                                        className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" 
                                        id="email"
                                        type="email"
                                        placeholder="Email Usuario"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
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
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
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
                                        value="Iniciar Sesion"
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

export default Login;