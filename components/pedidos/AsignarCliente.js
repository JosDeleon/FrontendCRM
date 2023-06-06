import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor{
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;


const AsignarCliente = () => {
    const [ cliente, setCliente] = useState([]);

    //context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarCliente } = pedidoContext;

    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

    useEffect(() =>{
        agregarCliente(cliente);
    },[cliente]);

    const SeleccionarCliente = cliente => {
        setCliente(cliente);
    }

    if (loading) return null;

    const { obtenerClientesVendedor } = data;
    return(
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-700 text-gray-700 p-2 text-sm font-bold"> 
                1.- Asigna un cliente al pedido
            </p>
            <Select 
                className="text-black mt-3"
                options={ obtenerClientesVendedor }
                onChange={(opcion) => { SeleccionarCliente(opcion)}}
                getOptionValue={({ id }) => id}
                getOptionLabel={({ nombre }) => nombre}
                placeholder="Seleccione el cliente..."
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
    );
}

export default AsignarCliente;