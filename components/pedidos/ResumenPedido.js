import React, { useState, useEffect, useContext } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";
import ProductoResumen from "./ProductoResumen";

const ResumenPedido = () => {
    const pedidoContext = useContext(PedidoContext);
    const { productos  } = pedidoContext;

    return (
        <>
            <p className="mt-5 my-2 bg-white border-l-4 border-gray-700 text-gray-700 p-2 text-sm font-bold"> 
                3.- Ajusta las cantidades del producto
            </p>
                
            { productos.length > 0 ? (
                <>
                    { 
                        productos.map( producto => (
                            <ProductoResumen
                                key={producto.id}
                                producto={producto}
                            ></ProductoResumen>
                        ))
                        
                    }
                </>
            ) : (
                <p className="mt-5 text-sm text-black">No hay productos</p>
            )}
            
        </>
    );
}

export default ResumenPedido;