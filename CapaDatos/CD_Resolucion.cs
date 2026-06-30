using CapaModelo;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_Resolucion
    {
        public static CD_Resolucion _instancia = null;

        private CD_Resolucion()
        {

        }

        public static CD_Resolucion Instancia
        {
            get
            {
                if (_instancia == null)
                {
                    _instancia = new CD_Resolucion();
                }
                return _instancia;
            }
        }

        public List<Resolucion> Listar()
        {
            List<Resolucion> lista = new List<Resolucion>();

            using (SqlConnection con = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerListaResolucionDigesa", con);
                cmd.CommandType = CommandType.StoredProcedure;

                con.Open();

                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    lista.Add(new Resolucion()
                    {
                        IdResolucion = Convert.ToInt32(dr["IdResolucion"]),
                        IdGrupoDigesa = Convert.ToInt32(dr["IdGrupoDigesa"]),
                        GrupoDigesa = dr["GrupoDigesa"].ToString(),
                        NumeroResolucion = dr["NumeroResolucion"].ToString(),
                        FechaEmision = Convert.ToDateTime(dr["FechaEmision"]),
                        sFechaEmision = Convert.ToDateTime(dr["FechaEmision"].ToString()).ToString("dd/MM/yyyy"),
                        FechaInicio = Convert.ToDateTime(dr["FechaInicio"]),
                        sFechaInicio = Convert.ToDateTime(dr["FechaInicio"].ToString()).ToString("dd/MM/yyyy"),
                        FechaVencimiento = Convert.ToDateTime(dr["FechaVencimiento"]),
                        sFechaVencimiento = Convert.ToDateTime(dr["FechaVencimiento"].ToString()).ToString("dd/MM/yyyy"),
                        NombreArchivo = dr["NombreArchivo"].ToString(),
                        RutaArchivo = dr["RutaArchivo"].ToString(),
                        Estado = Convert.ToBoolean(dr["Estado"])
                    });
                }
            }

            return lista;
        }

        public List<ResolucionProducto> ListarProductosDigesa()
        {
            List<ResolucionProducto> lista = new List<ResolucionProducto>();

            using (SqlConnection con = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerListaProductosDigesa", con);

                cmd.CommandType = CommandType.StoredProcedure;

                con.Open();

                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    lista.Add(new ResolucionProducto()
                    {
                        IdProducto = Convert.ToInt32(dr["IdProducto"]),

                        Producto = dr["Producto"].ToString(),

                        GrupoDigesa = dr["GrupoDigesa"] == DBNull.Value
                            ? ""
                            : dr["GrupoDigesa"].ToString(),

                        NumeroResolucion = dr["NumeroResolucion"].ToString(),
                        //FechaInicio = dr["FechaInicio"] == DBNull.Value
                        //    ? (DateTime?)null
                        //    : Convert.ToDateTime(dr["FechaInicio"]),

                        //FechaVencimiento = dr["FechaVencimiento"] == DBNull.Value
                        //    ? (DateTime?)null
                        //    : Convert.ToDateTime(dr["FechaVencimiento"]),

                        EstadoResolucion = dr["EstadoResolucion"].ToString(),
                        TiempoRestante = dr["TiempoRestante"] == DBNull.Value ? "" : dr["TiempoRestante"].ToString(),
                        sFechaInicio = dr["FechaInicio"].ToString(),
                        sFechaVencimiento = dr["FechaVencimiento"].ToString(),

                    });
                }
            }

            return lista;
        }

        public bool Guardar(Resolucion o)
        {
            bool rpt = false;

            using (SqlConnection con = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_RegistrarResolucionDigesa", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdGrupoDigesa", o.IdGrupoDigesa);
                cmd.Parameters.AddWithValue("@NumeroResolucion", o.NumeroResolucion);
                cmd.Parameters.AddWithValue("@FechaEmision", o.FechaEmision);
                cmd.Parameters.AddWithValue("@FechaInicio", o.FechaInicio);
                cmd.Parameters.AddWithValue("@FechaVencimiento", o.FechaVencimiento);
                cmd.Parameters.AddWithValue("@NombreArchivo", (object)o.NombreArchivo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@RutaArchivo", (object)o.RutaArchivo ?? DBNull.Value);

                con.Open();

                rpt = cmd.ExecuteNonQuery() > 0;
            }

            return rpt;
        }
    }
}
