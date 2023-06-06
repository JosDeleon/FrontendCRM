import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos{
        obtenerProductos {
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;

const AsignarProductos = () => {
    const [ productos, setProductos ] = useState([]);
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    //context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;

    useEffect(() =>{
        agregarProducto(productos);
    },[productos]);

    const seleccionarProducto = producto => {
        setProductos(producto);
    }


    if (loading) return 'Cargando ...';

    const { obtenerProductos } = data;
    return(
        <>
            <p className="mt-5 my-2 bg-white border-l-4 border-gray-700 text-gray-700 p-2 text-sm font-bold"> 
                2.- Selecciona los productos
            </p>
            <Select 
                className="text-black mt-3"
                options={ obtenerProductos }
                isMulti={true}
                onChange={(opcion) => { seleccionarProducto(opcion)}}
                getOptionValue={({ id }) => id}
                getOptionLabel={({ nombre, existencia }) => `${nombre} - ${existencia} disponibles`}
                placeholder="Seleccione el producto..."
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
    );
}

export default AsignarProductos;