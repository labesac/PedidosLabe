using CapaModelo;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_ProductoTienda
    {
        public static CD_ProductoTienda _instancia = null;

        private CD_ProductoTienda()
        {

        }

        public static CD_ProductoTienda Instancia
        {
            get
            {
                if (_instancia == null)
                {
                    _instancia = new CD_ProductoTienda();
                }
                return _instancia;
            }
        }

        public List<ProductoTienda> ObtenerProductoTienda()
        {
            List<ProductoTienda> rptListaProductoTienda = new List<ProductoTienda>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerProductoStockTienda", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    oConexion.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        rptListaProductoTienda.Add(new ProductoTienda()
                        {
                            IdProductoTienda = Convert.ToInt32(dr["IdProductoTienda"].ToString()),
                            oProducto = new Producto()
                            {
                                IdProducto = Convert.ToInt32(dr["IdProducto"].ToString()),
                                Codigo = dr["CodigoProducto"].ToString(),
                                Nombre = dr["NombreProducto"].ToString(),
                                Descripcion = dr["DescripcionProducto"].ToString(),
                            },
                            oTienda = new Tienda()
                            {
                                IdTienda = Convert.ToInt32(dr["IdTienda"].ToString()),
                                RUC = dr["RUC"].ToString(),
                                Nombre = dr["NombreTienda"].ToString(),
                                Direccion = dr["DireccionTienda"].ToString(),
                            },
                            PrecioUnidadCompra = Convert.ToDecimal(dr["PrecioUnidadCompra"].ToString(), new CultureInfo("es-PE")),
                            PrecioUnidadVenta = Convert.ToDecimal(dr["PrecioUnidadVenta"].ToString(), new CultureInfo("es-PE")),
                            PrecioPaqueteVenta = Convert.ToDecimal(dr["PrecioPaqueteVenta"].ToString(), new CultureInfo("es-PE")),
                            Stock = Convert.ToInt32(dr["Stock"].ToString()),
                            Iniciado = Convert.ToBoolean(dr["Iniciado"].ToString())
                        });
                    }
                    dr.Close();

                    return rptListaProductoTienda;

                }
                catch (Exception ex)
                {
                    rptListaProductoTienda = null;
                    return rptListaProductoTienda;
                }
            }
        }

        public List<ProductoTienda> ObtenerStockPorTiendaCodigo(int IdTienda)
        {
            List<ProductoTienda> rptListaProducto = new List<ProductoTienda>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerStockTienda", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("IdTienda", IdTienda);
                try
                {
                    oConexion.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        rptListaProducto.Add(new ProductoTienda()
                        {
                            IdProductoTienda = Convert.ToInt32(dr["IdProductoTienda"].ToString()),
                            oProducto = new Producto()
                            {
                                IdProducto = Convert.ToInt32(dr["IdProducto"].ToString()),
                                Nombre = dr["NombreProducto"].ToString(),
                                Codigo = dr["Codigo"].ToString(),
                            },
                            oTienda = new Tienda()
                            {
                                IdTienda = Convert.ToInt32(dr["IdTienda"].ToString()),
                                Nombre = dr["NombreTienda"].ToString(),
                            },
                            Stock = Convert.ToInt32(dr["Stock"].ToString()),
                        });
                    }
                    dr.Close();

                    return rptListaProducto;

                }
                catch (Exception ex)
                {
                    rptListaProducto = null;
                    return rptListaProducto;
                }
            }
        }

        public List<ProductoTienda> ObtenerKardex(int IdTienda)
        {
            List<ProductoTienda> rptListaProducto = new List<ProductoTienda>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerStockTienda", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("IdTienda", IdTienda);
                try
                {
                    oConexion.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        rptListaProducto.Add(new ProductoTienda()
                        {
                            IdProductoTienda = Convert.ToInt32(dr["IdProductoTienda"].ToString()),
                            oProducto = new Producto()
                            {
                                IdProducto = Convert.ToInt32(dr["IdProducto"].ToString()),
                                Nombre = dr["NombreProducto"].ToString(),
                                Codigo = dr["Codigo"].ToString(),
                            },
                            oTienda = new Tienda()
                            {
                                IdTienda = Convert.ToInt32(dr["IdTienda"].ToString()),
                                Nombre = dr["NombreTienda"].ToString(),
                            },
                            Stock = Convert.ToInt32(dr["Stock"].ToString()),
                        });
                    }
                    dr.Close();

                    return rptListaProducto;

                }
                catch (Exception ex)
                {
                    rptListaProducto = null;
                    return rptListaProducto;
                }
            }
        }

        public List<Kardex> ObtenerReporteKardex(int IdTienda, string Codigo, string fechainicio, string fechafin)
        {
            List<Kardex> lista = new List<Kardex>();

            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_ObtenerKardex", oConexion);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("IdTienda", IdTienda);
                    cmd.Parameters.AddWithValue("Codigo", Codigo);
                    cmd.Parameters.AddWithValue("FechaIni", fechainicio);
                    cmd.Parameters.AddWithValue("FechaFin", fechafin);

                    oConexion.Open();

                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        lista.Add(new Kardex()
                        {
                            IdKardex = Convert.ToInt32(dr["IdKardex"]),
                            oProducto = new Producto()
                            {
                                IdProducto = Convert.ToInt32(dr["IdProducto"]),
                                Nombre = dr["Nombre"].ToString(),
                            },
                            oTienda = new Tienda()
                            {
                                IdTienda = Convert.ToInt32(dr["IdTienda"])
                            },
                            TipoMovimiento = dr["TipoMovimiento"].ToString(),
                            Documento = dr["Documento"].ToString(),
                            IdDocumento = dr["IdDocumento"] == DBNull.Value ? 0 : Convert.ToInt32(dr["IdDocumento"]),
                            Entrada = Convert.ToDecimal(dr["Entrada"]),
                            Salida = Convert.ToDecimal(dr["Salida"]),
                            SaldoAnterior = Convert.ToDecimal(dr["SaldoAnterior"]),
                            SaldoActual = Convert.ToDecimal(dr["SaldoActual"]),
                            Precio = Convert.ToDecimal(dr["Precio"]),
                            Fecha = dr["Fecha"].ToString()
                        });
                    }

                    dr.Close();
                }
                catch (Exception ex)
                {
                    lista = new List<Kardex>();
                }
            }

            return lista;
        }

        public bool RegistrarProductoTienda(ProductoTienda oProductoTienda)
        {
            bool respuesta = true;
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_RegistrarProductoTienda", oConexion);
                    cmd.Parameters.AddWithValue("IdProducto", oProductoTienda.oProducto.IdProducto);
                    cmd.Parameters.AddWithValue("IdTienda", oProductoTienda.oTienda.IdTienda);
                    cmd.Parameters.AddWithValue("Stock", oProductoTienda.Stock);
                    cmd.Parameters.AddWithValue("PrecioUnidadVenta", oProductoTienda.PrecioUnidadVenta);
                    cmd.Parameters.Add("Resultado", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.CommandType = CommandType.StoredProcedure;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToBoolean(cmd.Parameters["Resultado"].Value);

                }
                catch (Exception ex)
                {
                    respuesta = false;
                }
            }
            return respuesta;
        }

        public bool ModificarProductoTienda(ProductoTienda oProductoTienda)
        {
            bool respuesta = true;
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_ModificarProductoTienda", oConexion);
                    cmd.Parameters.AddWithValue("IdProductoTienda", oProductoTienda.IdProductoTienda);
                    cmd.Parameters.AddWithValue("IdProducto", oProductoTienda.oProducto.IdProducto);
                    cmd.Parameters.AddWithValue("IdTienda", oProductoTienda.oTienda.IdTienda);
                    cmd.Parameters.Add("Resultado", SqlDbType.Bit).Direction = ParameterDirection.Output;

                    cmd.CommandType = CommandType.StoredProcedure;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToBoolean(cmd.Parameters["Resultado"].Value);

                }
                catch (Exception ex)
                {
                    respuesta = false;
                }

            }

            return respuesta;

        }

        public bool EliminarProductoTienda(int IdProductoTienda)
        {
            bool respuesta = true;
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_EliminarProductoTienda", oConexion);
                    cmd.Parameters.AddWithValue("IdProductoTienda", IdProductoTienda);
                    cmd.Parameters.Add("Resultado", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.CommandType = CommandType.StoredProcedure;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToBoolean(cmd.Parameters["Resultado"].Value);

                }
                catch (Exception ex)
                {
                    respuesta = false;
                }

            }

            return respuesta;

        }

        public bool ControlarStock(int IdProducto, int IdTienda, int Cantidad, bool Restar)
        {
            bool respuesta = true;
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_ControlarStock", oConexion);
                    cmd.Parameters.AddWithValue("IdProducto", IdProducto);
                    cmd.Parameters.AddWithValue("IdTienda", IdTienda);
                    cmd.Parameters.AddWithValue("Cantidad", Cantidad);
                    cmd.Parameters.AddWithValue("Restar", Restar);
                    cmd.Parameters.Add("Resultado", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.CommandType = CommandType.StoredProcedure;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToBoolean(cmd.Parameters["Resultado"].Value);

                }
                catch (Exception ex)
                {
                    respuesta = false;
                }
            }
            return respuesta;
        }

        public bool ModificarPrecioCatalogo(int IdProductoTienda, decimal PrecioPaqueteVenta,  out string Mensaje)
        {
            bool respuesta = true;
            Mensaje = string.Empty;

            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_ActualizarPrecioCatalogo", oConexion);

                    cmd.Parameters.AddWithValue("@IdProductoTienda", IdProductoTienda);
                    cmd.Parameters.AddWithValue("@PrecioPaqueteVenta", PrecioPaqueteVenta);

                    cmd.Parameters.Add("@Resultado", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@Mensaje", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;

                    cmd.CommandType = CommandType.StoredProcedure;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToBoolean(cmd.Parameters["@Resultado"].Value);
                    Mensaje = cmd.Parameters["@Mensaje"].Value.ToString();
                }
                catch (Exception ex)
                {
                    respuesta = false;
                    Mensaje = ex.Message;
                }
            }

            return respuesta;
        }
        public bool ModificarPrecioGeneral(int IdProductoTienda, decimal PrecioUnidadVenta, out string Mensaje)
        {
            bool respuesta = true;
            Mensaje = string.Empty;

            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_ActualizarPrecioGeneral", oConexion);

                    cmd.Parameters.AddWithValue("@IdProductoTienda", IdProductoTienda);
                    cmd.Parameters.AddWithValue("@PrecioUnidadVenta", PrecioUnidadVenta);

                    cmd.Parameters.Add("@Resultado", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@Mensaje", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;

                    cmd.CommandType = CommandType.StoredProcedure;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToBoolean(cmd.Parameters["@Resultado"].Value);
                    Mensaje = cmd.Parameters["@Mensaje"].Value.ToString();
                }
                catch (Exception ex)
                {
                    respuesta = false;
                    Mensaje = ex.Message;
                }
            }

            return respuesta;
        }
    }
}
