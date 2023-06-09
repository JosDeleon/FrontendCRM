import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import PedidoContext from "../context/pedidos/PedidoContext";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const NUEVO_PEDIDO =  gql`
    mutation NuevoPedido($input: PedidoInput) {
        nuevoPedido(input: $input) {
            id
        }
    }
`;

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      total
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      estado
      pedido {
        id
        cantidad
        nombre
        precio
      }
    }
  }
`;

const NuevoPedido = () => {
    const router = useRouter();

    const [ mensaje, setMensaje ] = useState(null);

    //Utilziar context y exraer valores 
    const pedidoContext = useContext(PedidoContext);
    const { cliente, productos, total } = pedidoContext;

    const [ nuevoPedido ] = useMutation(NUEVO_PEDIDO, {
        update(cache, {data : {nuevoPedido}}){
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS
            });

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
                }
            });
        }
    });

    const crearNuevoPedido = async () => {
        //Remover data innecesaria a productos
        const { id } = cliente;
        const pedido = productos.map( ({__typename, creado, existencia, ...producto}) => producto );

        try {
            const { data } = await nuevoPedido({
                variables:{
                    input : {
                        cliente : id,
                        total: total,
                        pedido: pedido
                    }
                }
            });
            
            router.push("/pedidos"); 

            Swal.fire(
                'Creado',
                'Se creo el pedido correctamente',
                'success'
            );

        } catch (error) {
            console.log({error})
            setMensaje(error.message.replace('GraphQL error: ', ''));
            setTimeout(() => {
                setMensaje(null);
            }, 3000);
        }
    } 

    const validarPedido = () => {
        return !productos.every( producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? "opacity-50 cursor-not-allowed" : "";
    }

    const mostrarMensaje = () => {
        return(
            <div className="text-black bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light"> Crear Nuevo Pedido </h1>

                { mensaje && mostrarMensaje() }

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <AsignarCliente/>
                        <AsignarProductos/>
                        <ResumenPedido/>
                        <Total/>
                        <button
                            type="button"
                            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${ validarPedido() }`}
                            onClick={() => crearNuevoPedido() }
                        > Registrar Pedido
                        </button>
                    </div>
                </div>
            </Layout>
            
        </div>
    );
};

export default NuevoPedido;
