import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Select from "react-select";

const options = [
    { id: "chocolate", nombre: "Chocolate" },
    { id: "strawberry", nombre: "Strawberry" },
    { id: "vanilla", nombre: "Vanilla" },
];

const NuevoPedido = () => {
    const [ sabores, setSabores] = useState([]);

    useEffect(() =>{
        console.log(sabores);
    },[sabores]);

    const seleccionarSabor = sabores => {
        setSabores(sabores);
    }

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light"> Crear Nuevo Pedido </h1>
                <Select className="text-black"
                    options={options}  
                    isMulti={true}
                    onChange={(opcion) => { seleccionarSabor(opcion)}}
                    getOptionValue={({ id }) => id}
                    getOptionLabel={({ nombre }) => nombre}
                    placeholder="Seleccione el sabor..."
                    noOptionsMessage={() => "No hay resultados"}
                />
            </Layout>
            
        </div>
    );
};

export default NuevoPedido;
