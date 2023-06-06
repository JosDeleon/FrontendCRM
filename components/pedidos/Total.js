import React, { useContext } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

const Total = () => {
    const pedidoContext = useContext(PedidoContext);
    const { total } = pedidoContext;
    return (
        <div className=" flex items-center mt-5 justify-between bg-gray-300 p-3 border-solid border-2 border-gray-400">
            <h2 className="text-gray-800 text-lg">Total a Pagar: </h2>
            <p className="text-gray-800 mt-0" >$ {total}</p>
        </div>
    );
}

export default Total;