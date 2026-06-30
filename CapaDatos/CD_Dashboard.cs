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
using static CapaModelo.Dashboard;

namespace CapaDatos
{
    public class CD_Dashboard
    {
        public static CD_Dashboard _instancia = null;

        private CD_Dashboard()
        {

        }

        public static CD_Dashboard Instancia
        {
            get
            {
                if (_instancia == null)
                {
                    _instancia = new CD_Dashboard();
                }
                return _instancia;
            }
        }

        public Dashboard ObtenerDashboard()
        {
            Dashboard oDashboard = new Dashboard();

            try
            {
                using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
                {
                    SqlCommand cmd = new SqlCommand("usp_DashboardIndicadores", oConexion);
                    cmd.CommandType = CommandType.StoredProcedure;

                    SqlDataAdapter da = new SqlDataAdapter(cmd);

                    DataSet ds = new DataSet();

                    da.Fill(ds);

                    // KPI PEDIDOS

                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow row = ds.Tables[0].Rows[0];

                        oDashboard.TotalPedidosHoy = Convert.ToDecimal(row["TotalPedidosHoy"]);
                        oDashboard.TotalPedidosAyer = Convert.ToDecimal(row["TotalPedidosAyer"]);
                        oDashboard.TotalPedidosMes = Convert.ToDecimal(row["TotalPedidosMes"]);
                        oDashboard.TotalPedidosMesPasado = Convert.ToDecimal(row["TotalPedidosMesPasado"]);

                        oDashboard.PedidosPendientes = Convert.ToInt32(row["PedidosPendientes"]);
                        oDashboard.PedidosEntregados = Convert.ToInt32(row["PedidosEntregados"]);
                    }


                    // KPI VENTAS

                    if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                    {
                        DataRow row = ds.Tables[1].Rows[0];

                        oDashboard.TotalVentasHoy = Convert.ToDecimal(row["TotalVentasHoy"]);
                        oDashboard.TotalVentasAyer = Convert.ToDecimal(row["TotalVentasAyer"]);
                        oDashboard.TotalVentasMes = Convert.ToDecimal(row["TotalVentasMes"]);
                        oDashboard.TotalVentasMesPasado = Convert.ToDecimal(row["TotalVentasMesPasado"]);

                        oDashboard.CantidadVentas = Convert.ToInt32(row["CantidadVentas"]);
                    }


                    // TOP PRODUCTOS

                    oDashboard.TopProductos = new List<TopProducto>();

                    if (ds.Tables.Count > 2)
                    {
                        foreach (DataRow row in ds.Tables[2].Rows)
                        {
                            oDashboard.TopProductos.Add(new TopProducto()
                            {
                                Producto = row["Producto"].ToString(),
                                IdProducto = Convert.ToInt32(row["IdProducto"]),
                                Cantidad = Convert.ToInt32(row["Cantidad"]),
                                Total = Convert.ToDecimal(row["Total"])
                            });
                        }
                    }


                    // PEDIDOS POR MES

                    oDashboard.PedidosPorMes = new List<VentaMes>();

                    if (ds.Tables.Count > 3)
                    {
                        foreach (DataRow row in ds.Tables[3].Rows)
                        {
                            oDashboard.PedidosPorMes.Add(new VentaMes()
                            {
                                Mes = Convert.ToInt32(row["Mes"]),
                                NombreMes = row["NombreMes"].ToString(),
                                Total = Convert.ToDecimal(row["Total"])
                            });
                        }
                    }


                    // VENTAS POR MES

                    oDashboard.VentasPorMes = new List<VentaMes>();

                    if (ds.Tables.Count > 4)
                    {
                        foreach (DataRow row in ds.Tables[4].Rows)
                        {
                            oDashboard.VentasPorMes.Add(new VentaMes()
                            {
                                Mes = Convert.ToInt32(row["Mes"]),
                                NombreMes = row["NombreMes"].ToString(),
                                Total = Convert.ToDecimal(row["Total"])
                            });
                        }
                    }


                    // MAPA PEDIDOS

                    oDashboard.MapaPedidos = new List<MapaPedido>();

                    if (ds.Tables.Count > 5)
                    {
                        foreach (DataRow row in ds.Tables[5].Rows)
                        {
                            oDashboard.MapaPedidos.Add(new MapaPedido()
                            {
                                Latitud = Convert.ToDecimal(row["Latitud"]),
                                Longitud = Convert.ToDecimal(row["Longitud"]),
                                Codigo = row["Codigo"].ToString(),
                                Total = Convert.ToDecimal(row["Total"]),
                                Estado = row["Estado"].ToString()
                            });
                        }
                    }


                    // STOCK BAJO

                    oDashboard.StockBajo = new List<StockBaja>();

                    if (ds.Tables.Count > 6)
                    {
                        foreach (DataRow row in ds.Tables[6].Rows)
                        {
                            oDashboard.StockBajo.Add(new StockBaja()
                            {
                                Nombre = row["Nombre"].ToString(),
                                StockDisponible = Convert.ToInt32(row["StockDisponible"]),
                                PrecioUnidadVenta = Convert.ToDecimal(row["PrecioUnidadVenta"])
                            });
                        }
                    }


                    // PEDIDOS ESTADO

                    oDashboard.PedidosEstado = new List<PedidoEstado>();

                    if (ds.Tables.Count > 7)
                    {
                        foreach (DataRow row in ds.Tables[7].Rows)
                        {
                            oDashboard.PedidosEstado.Add(new PedidoEstado()
                            {
                                Estado = row["Estado"].ToString(),
                                Cantidad = Convert.ToInt32(row["Cantidad"])
                            });
                        }
                    }


                    // ULTIMOS PEDIDOS

                    oDashboard.UltimosPedidos = new List<UltimoPedido>();

                    if (ds.Tables.Count > 8)
                    {
                        foreach (DataRow row in ds.Tables[8].Rows)
                        {
                            oDashboard.UltimosPedidos.Add(new UltimoPedido()
                            {
                                IdPedido = Convert.ToInt32(row["IdPedido"]),
                                Codigo = row["Codigo"].ToString(),
                                Contacto = row["Contacto"].ToString(),
                                Vendedor = row["Vendedor"].ToString(),
                                Telefono = row["Telefono"].ToString(),
                                Direccion = row["Direccion"].ToString(),
                                CantidadProducto = Convert.ToInt32(row["CantidadProducto"]),
                                Total = Convert.ToDecimal(row["Total"]),
                                DescuentoImporte = Convert.ToDecimal(row["DescuentoImporte"]),
                                Estado = row["Estado"].ToString(),
                                FechaRegistro = Convert.ToDateTime(row["FechaRegistro"])
                            });
                        }
                    }

                }
            }
            catch
            {
                oDashboard = new Dashboard();
            }

            return oDashboard;
        }
    }
}
