using CapaModelo;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace CapaDatos
{
    public class CD_Pedido
    {

        public static CD_Pedido _instancia = null;

        private CD_Pedido()
        {

        }

        public static CD_Pedido Instancia
        {
            get
            {
                if (_instancia == null)
                {
                    _instancia = new CD_Pedido();
                }
                return _instancia;
            }
        }

        public int RegistrarPedido(string Detalle)
        {
            int respuesta = 0;
            string errormsg = "";
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_RegistrarPedido", oConexion);
                    cmd.Parameters.Add("Detalle", SqlDbType.Xml).Value = Detalle;
                    cmd.Parameters.Add("Resultado", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("ErrorMensaje", SqlDbType.VarChar,500).Direction = ParameterDirection.Output;
                    cmd.CommandType = CommandType.StoredProcedure;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToInt32(cmd.Parameters["Resultado"].Value);
                    errormsg = Convert.ToString(cmd.Parameters["ErrorMensaje"].Value);

                }
                catch (Exception ex)
                {
                    respuesta = 0;
                }
            }
            return respuesta;
        }

        public Pedido ObtenerDetallePedido(int IdPedido)
        {
            Pedido rptDetallePedido = new Pedido();
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerDetallePedido", oConexion);
                cmd.Parameters.AddWithValue("@IdPedido", IdPedido);
                cmd.CommandType = CommandType.StoredProcedure;

                var NuevaCultura = CultureInfo.GetCultureInfo("es-PE");
                try
                {
                    oConexion.Open();
                    using (XmlReader dr = cmd.ExecuteXmlReader())
                    {
                        while (dr.Read())
                        {
                            XDocument doc = XDocument.Load(dr);
                            if (doc.Element("DETALLE_PEDIDO") != null)
                            {
                                rptDetallePedido = (from dato in doc.Elements("DETALLE_PEDIDO")
                                                   select new Pedido()
                                                   {
                                                       TipoDocumento = dato.Element("TipoDocumento").Value,
                                                       Codigo = dato.Element("Codigo").Value,
                                                       TotalCosto = float.Parse(dato.Element("TotalCosto").Value, NuevaCultura),
                                                       ImporteRecibido = float.Parse(dato.Element("ImporteRecibido").Value, NuevaCultura),
                                                       ImporteCambio = float.Parse(dato.Element("ImporteCambio").Value, NuevaCultura),
                                                       FechaRegistro = dato.Element("FechaRegistro").Value,
                                                       Observacion = dato.Element("Observacion").Value,
                                                       Situacion = dato.Element("Situacion").Value
                                                   }).FirstOrDefault();
                                rptDetallePedido.oUsuario = (from dato in doc.Element("DETALLE_PEDIDO").Elements("DETALLE_USUARIO")
                                                            select new Usuario()
                                                            {
                                                                Nombres = dato.Element("Nombres").Value,
                                                                Apellidos = dato.Element("Apellidos").Value,
                                                            }).FirstOrDefault();
                                rptDetallePedido.oTienda = (from dato in doc.Element("DETALLE_PEDIDO").Elements("DETALLE_TIENDA")
                                                           select new Tienda()
                                                           {
                                                               RUC = dato.Element("RUC").Value,
                                                               Nombre = dato.Element("Nombre").Value,
                                                               Direccion = dato.Element("Direccion").Value
                                                           }).FirstOrDefault();
                                rptDetallePedido.oCliente = (from dato in doc.Element("DETALLE_PEDIDO").Elements("DETALLE_CLIENTE")
                                                            select new Cliente()
                                                            {
                                                                Nombre = dato.Element("Nombre").Value,
                                                                Direccion = dato.Element("Direccion").Value,
                                                                NumeroDocumento = dato.Element("NumeroDocumento").Value,
                                                                Telefono = dato.Element("Telefono").Value
                                                            }).FirstOrDefault();
                                rptDetallePedido.oListaDetallePedido = (from producto in doc.Element("DETALLE_PEDIDO").Element("DETALLE_PRODUCTO").Elements("PRODUCTO")
                                                                      select new DetallePedido()
                                                                      {
                                                                          Cantidad = int.Parse(producto.Element("Cantidad").Value),
                                                                          NombreProducto = producto.Element("NombreProducto").Value,
                                                                          PrecioUnidad = float.Parse(producto.Element("PrecioUnidad").Value, NuevaCultura),
                                                                          ImporteTotal = float.Parse(producto.Element("ImporteTotal").Value, NuevaCultura)
                                                                      }).ToList();
                            }
                            else
                            {
                                rptDetallePedido = null;
                            }
                        }

                        dr.Close();

                    }

                    return rptDetallePedido;
                }
                catch (Exception ex)
                {
                    rptDetallePedido = null;
                    return rptDetallePedido;
                }
            }
        }

        public List<Pedido> ObtenerListaPedido(string Codigo, string FechaInicio, string FechaFin, string NumeroDocumento, string Nombre)
        {
            List<Pedido> rptListaPedido = new List<Pedido>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerListaPedido", oConexion);
                cmd.Parameters.AddWithValue("@Codigo", Codigo);
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                cmd.Parameters.AddWithValue("@NumeroDocumento", NumeroDocumento);
                cmd.Parameters.AddWithValue("@Nombre", Nombre);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    oConexion.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        rptListaPedido.Add(new Pedido()
                        {
                            IdPedido = Convert.ToInt32(dr["IdPedido"].ToString()),
                            TipoDocumento = dr["TipoDocumento"].ToString(),
                            Codigo = dr["Codigo"].ToString(),
                            Vendedor = dr["Vendedor"].ToString(),
                            Estado = dr["Estado"].ToString(),
                            FechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()).ToString("dd/MM/yyyy"),
                            VFechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()),
                            oCliente = new Cliente() { NumeroDocumento = dr["NumeroDocumento"].ToString(), Nombre = dr["Nombre"].ToString() },
                            TotalCosto = float.Parse(dr["TotalCosto"].ToString()),
                            Total = float.Parse(dr["Total"].ToString()),
                            Descuento = float.Parse(dr["DescuentoImporte"].ToString())
                        });
                    }
                    dr.Close();

                    return rptListaPedido;

                }
                catch (Exception ex)
                {
                    rptListaPedido = null;
                    return rptListaPedido;
                }
            }
        }

        public List<Pedido> ObtenerListaPedidosVenta(int idUsuario ,string Codigo, string FechaInicio, string FechaFin, string NumeroDocumento, string Nombre)
        {
            List<Pedido> rptListaPedido = new List<Pedido>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerListaPedidoVenta", oConexion);
                cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@Codigo", Codigo);
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                cmd.Parameters.AddWithValue("@NumeroDocumento", NumeroDocumento);
                cmd.Parameters.AddWithValue("@Nombre", Nombre);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    oConexion.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        rptListaPedido.Add(new Pedido()
                        {
                            IdPedido = Convert.ToInt32(dr["IdPedido"].ToString()),
                            TipoDocumento = dr["TipoDocumento"].ToString(),
                            Codigo = dr["Codigo"].ToString(),
                            Vendedor = dr["Vendedor"].ToString(),
                            Estado = dr["Estado"].ToString(),
                            FechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()).ToString("dd/MM/yyyy"),
                            VFechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()),
                            oCliente = new Cliente() { NumeroDocumento = dr["NumeroDocumento"].ToString(), Nombre = dr["Nombre"].ToString() },
                            TotalCosto = float.Parse(dr["TotalCosto"].ToString()),
                            Total = float.Parse(dr["Total"].ToString()),
                            Descuento = float.Parse(dr["DescuentoImporte"].ToString())
                        });
                    }
                    dr.Close();

                    return rptListaPedido;

                }
                catch (Exception ex)
                {
                    rptListaPedido = null;
                    return rptListaPedido;
                }
            }
        }

        public int RegistrarVentaPedido(string TipoDocumento, string MetodoPago, int IdUsuario, int IdPedido, out string Mensaje)
        {
            int respuesta = 0;
            Mensaje = string.Empty;

            try
            {
                using (SqlConnection oconexion = new SqlConnection(Conexion.CN))
                {
                    SqlCommand cmd = new SqlCommand("usp_RegistrarVentaPedido", oconexion);

                    cmd.Parameters.AddWithValue("@TipoDocumento", TipoDocumento);
                    cmd.Parameters.AddWithValue("@MetodoPago", MetodoPago);
                    cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                    cmd.Parameters.AddWithValue("@IdPedido", IdPedido);

                    cmd.Parameters.Add("@Resultado", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@ErrorMensaje", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;

                    cmd.CommandType = CommandType.StoredProcedure;

                    oconexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToInt32(cmd.Parameters["@Resultado"].Value);
                    Mensaje = cmd.Parameters["@ErrorMensaje"].Value.ToString();
                }
            }
            catch (Exception ex)
            {
                respuesta = 0;
                Mensaje = ex.Message;
            }

            return respuesta;
        }

        public bool DespacharPedido(int IdPedido, int IdUsuario)
        {
            bool respuesta = true;
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_DespacharPedido", oConexion);
                    cmd.Parameters.AddWithValue("IdPedido", IdPedido);
                    cmd.Parameters.AddWithValue("IdUsuario", IdUsuario);
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
        public bool AnularPedido(int IdPedido, int IdUsuario)
        {
            bool respuesta = true;
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_AnularPedido", oConexion);
                    cmd.Parameters.AddWithValue("IdPedido", IdPedido);
                    cmd.Parameters.AddWithValue("IdUsuario", IdUsuario);
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
    }
}
