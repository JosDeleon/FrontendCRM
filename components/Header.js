import React from "react";
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario{
            id
            nombre
            apellido
        }
    }
`;

const Header = () => {
    const router = useRouter();
    const { data, loading, error} =  useQuery(OBTENER_USUARIO);

    // console.log(loading)
    // console.log(data)
    // console.log(error)

    //Proteger acceso antes de resultados
    if(loading) return null;

    if(!data){
        router.push('/login');
    }
    
    const { nombre, apellido } = data.obtenerUsuario;

    const cerrarSesion = () =>{
        localStorage.removeItem('token');
        router.push('/login');
    }

    return (
        <div className="sm:flex sm:justify-between mb-6">
            <p className="mr-2 mb-5 lg:mb-0 text-black">Hola : {nombre} {apellido}</p>
            <button onClick={() => cerrarSesion() } type="button" className="bg-blue-900 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md">
                Cerrar Sesion
            </button>
        </div>
    );
}

export default Header;
