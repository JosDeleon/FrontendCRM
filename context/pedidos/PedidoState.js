import React, { useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from './PedidoReducer'

import {
    SELECIONAR_CLIENTE,
    SELECIONAR_PRODUCTO,
    CANTIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL
} from '../../types';

const PedidoState = ({children}) =>{
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }; 

    const [ state, dispatch ] = useReducer(PedidoReducer, initialState);

    //modifica el cliente
    const agregarCliente = cliente =>{
        dispatch({
            type: SELECIONAR_CLIENTE,
            payload: cliente
        });
    }

    const agregarProducto = productosSeleccionados => {
        let nuevoState;
        if (state.productos.length > 0){
            nuevoState = productosSeleccionados.map( producto => {
                const nuevoObjeto = state.productos.find( productoState => productoState.id === producto.id);
                return {...producto, ...nuevoObjeto }
            });
        } else {
            nuevoState = productosSeleccionados;
        }

        dispatch({
            type: SELECIONAR_PRODUCTO,
            payload: nuevoState
        });
    }

    //modifica cantidad productos 
    const cantidadProductos = nuevoProducto => {
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto
        });
    }

    const actualizarTotal = () => {
        dispatch({
            type:ACTUALIZAR_TOTAL
        });
    }

    return (
        <PedidoContext.Provider
            value={{
                total: state.total,
                cliente: state.cliente,
                productos: state.productos,
                agregarCliente,
                actualizarTotal,
                agregarProducto,
                cantidadProductos
            }}
        >{children}
        </PedidoContext.Provider>
    );
}

export default PedidoState;