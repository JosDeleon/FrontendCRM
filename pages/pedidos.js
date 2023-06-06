import React from 'react';
import Layout from '../components/Layout'
import Link from 'next/link';
import Pedido from '../components/pedidos/Pedido';
import { gql, useQuery } from '@apollo/client';

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

const Pedidos = () => {
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS);
  
  const { obtenerPedidosVendedor } = data || [];
  
  if(loading  ) return 'Cargando...';

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>
        <Link legacyBehavior href="/nuevopedido">
          <a className='bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase'>Nuevo Pedido</a>
        </Link>
          { obtenerPedidosVendedor.length === 0 ? (
              <p className="mt-5 text-center text-2xl">No hay pedidos</p>
            ) : (
              <>
                {
                  obtenerPedidosVendedor.map( pedido => (
                    <Pedido
                      key={pedido.id}
                      pedido={pedido}
                    />
                  ))
                }
              </>
            )
          }
      </Layout>
    </div>    
  )
}

export default Pedidos;