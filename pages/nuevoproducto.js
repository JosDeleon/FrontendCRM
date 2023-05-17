import { React, useState } from 'react';
import Layout from '../components/Layout';
import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Swal from "sweetalert2";

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput){
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio   
            creado
        }
    }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos{
    obtenerProductos {
      id
      nombre
      existencia
      precio
    }
  }
`;

const NuevoProducto = () => {
    const router = useRouter();
    const [ nuevoProducto ] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto } }){
            const { obtenerProductos } = cache.readQuery({ query : OBTENER_PRODUCTOS});
            cache.writeQuery({ 
                query : OBTENER_PRODUCTOS , 
                data : { 
                    obtenerProductos: [...obtenerProductos, nuevoProducto ] 
                }
            });
        }
    });

    const [ mensaje, guardarMensaje ] = useState(null);

    const formik = useFormik({
        initialValues : {
            nombre: '',
            existencia: '',
            precio: ''
        },
        validationSchema: Yup.object({
            nombre : Yup.string().required('El nombre del producto es obligatorio'),
            existencia: Yup.number().required('La cantida del producto es obligatoria').positive('No se aceptan numero negativos').integer('La existencia deben ser cantidades enteras'),
            precio: Yup.number().required('El precio del producto es obligatorio').positive('No se aceptan precio negativos'),
        }),
        onSubmit: async valores =>{
            const { nombre, existencia, precio } = valores;
            try {
                const { data } = await nuevoProducto({
                    variables : {
                        input : {
                            nombre,
                            existencia,
                            precio
                        }
                    }
                });
                console.log(data.nuevoProducto)
                Swal.fire(
                    'Creado',
                    'Se creo el producto correctamente',
                    'success'
                );
                router.push("/productos"); //redirecciona index
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
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Producto</h1>

            { mensaje && mostrarMensaje() }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <input 
                                    className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" 
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nombre}
                                />
                                { formik.touched.nombre && formik.errors.nombre ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.nombre}</p>
                                    </div>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                    Cantidad Disponible
                                </label>
                                <input 
                                    className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" 
                                    id="existencia"
                                    type="number"
                                    placeholder="Cantidad Disponible"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.existencia}
                                />
                                { formik.touched.existencia && formik.errors.existencia ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.existencia}</p>
                                    </div>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Precio
                                </label>
                                <input 
                                    className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" 
                                    id="precio"
                                    type="number"
                                    placeholder="Precio Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.precio}
                                />
                                { formik.touched.precio && formik.errors.precio ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.precio}</p>
                                    </div>
                                ) : null}
                            </div>
                            <div>
                                <input
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-blue-900"
                                    value="Registrar Producto"
                                    type="submit"
                                >
                                </input>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoProducto;