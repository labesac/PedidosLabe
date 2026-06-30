using CapaModelo;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace CapaDatos
{
    public class CD_Ruta
    {
        public static CD_Ruta _instancia = null;

        private CD_Ruta()
        {

        }

        public static CD_Ruta Instancia
        {
            get
            {
                if (_instancia == null)
                {
                    _instancia = new CD_Ruta();
                }

                return _instancia;
            }
        }


        // ==========================================
        // REGISTRAR RUTA
        // ==========================================

        public bool RegistrarRuta(Rutas obj, out object resultado, out string mensaje)
        {
            bool respuesta = true;

            resultado = null;
            mensaje = string.Empty;

            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    oConexion.Open();

                    SqlTransaction transaccion = oConexion.BeginTransaction();

                    try
                    {
                        // ==========================================
                        // CABECERA
                        // ==========================================

                        SqlCommand cmdRuta =
                            new SqlCommand(
                                "usp_RegistrarRuta",
                                oConexion,
                                transaccion
                            );

                        cmdRuta.CommandType =
                            CommandType.StoredProcedure;

                        cmdRuta.Parameters.AddWithValue(
                            "Nombre",
                            obj.Nombre
                        );

                        cmdRuta.Parameters.AddWithValue(
                            "Descripcion",
                            obj.Descripcion
                        );

                        cmdRuta.Parameters.AddWithValue(
                            "prioridad",
                            obj.prioridad
                        );

                        cmdRuta.Parameters.AddWithValue(
                            "zona",
                            obj.zona
                        );

                        cmdRuta.Parameters.AddWithValue(
                            "fecha",
                            obj.fecha
                        );

                        cmdRuta.Parameters.AddWithValue(
                            "vendedor",
                            obj.vendedor
                        );

                        cmdRuta.Parameters.AddWithValue(
                            "idVendedor",
                            obj.idVendedor
                        );

                        cmdRuta.Parameters.AddWithValue(
                            "Estado",
                            obj.Estado
                        );

                        cmdRuta.Parameters.AddWithValue(
                            "UsuarioRegistro",
                            obj.idUsuario
                        );

                        cmdRuta.Parameters.Add(
                            "Resultado",
                            SqlDbType.Int
                        ).Direction = ParameterDirection.Output;

                        cmdRuta.Parameters.Add(
                            "Mensaje",
                            SqlDbType.VarChar,
                            500
                        ).Direction = ParameterDirection.Output;

                        cmdRuta.ExecuteNonQuery();

                        int idRutaGenerado = Convert.ToInt32(
                            cmdRuta.Parameters["Resultado"].Value
                        );

                        mensaje = cmdRuta.Parameters["Mensaje"]
                            .Value
                            .ToString();


                        // ==========================================
                        // VALIDAR ERROR SP
                        // ==========================================

                        if (idRutaGenerado == 0)
                        {
                            transaccion.Rollback();

                            respuesta = false;

                            return respuesta;
                        }


                        // ==========================================
                        // DETALLE
                        // ==========================================

                        foreach (DetalleRuta item in obj.detalle)
                        {
                            SqlCommand cmdDetalle =
                                new SqlCommand(
                                    "usp_RegistrarDetalleRuta",
                                    oConexion,
                                    transaccion
                                );

                            cmdDetalle.CommandType =
                                CommandType.StoredProcedure;

                            cmdDetalle.Parameters.AddWithValue(
                                "idRuta",
                                idRutaGenerado
                            );

                            cmdDetalle.Parameters.AddWithValue(
                                "idCliente",
                                item.IdCliente
                            );

                            cmdDetalle.Parameters.AddWithValue(
                                "ordenVisita",
                                item.Orden
                            );

                            cmdDetalle.ExecuteNonQuery();
                        }

                        transaccion.Commit();

                        resultado = idRutaGenerado;
                    }
                    catch (Exception ex)
                    {
                        transaccion.Rollback();

                        respuesta = false;
                        mensaje = ex.Message;
                    }

                }
                catch (Exception ex)
                {
                    respuesta = false;
                    mensaje = ex.Message;
                }
            }

            return respuesta;
        }


        // ==========================================
        // LISTAR RUTAS
        // ==========================================

        public List<Rutas> ObtenerRutas(int idUsuario)
        {
            List<Rutas> rptLista =
                new List<Rutas>();

            using (SqlConnection oConexion =
                new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd =
                    new SqlCommand(
                        "usp_ObtenerRutas",
                        oConexion
                    );

                cmd.CommandType =
                    CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue(
                    "@idUsuario",
                    idUsuario
                );

                try
                {
                    oConexion.Open();

                    SqlDataReader dr =
                        cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        rptLista.Add(new Rutas()
                        {
                            idRuta = Convert.ToInt32(
                                dr["idRuta"]
                            ),

                            Codigo =
                                dr["Codigo"].ToString(),

                            Nombre =
                                dr["Nombre"].ToString(),

                            Descripcion =
                                dr["Descripcion"].ToString(),

                            prioridad =
                                dr["prioridad"].ToString(),

                            zona =
                                dr["zona"].ToString(),

                            vendedor =
                                dr["vendedor"].ToString(),

                            fechaTexto = Convert
                                .ToDateTime(dr["fecha"])
                                .ToString("dd/MM/yyyy"),

                            Estado = Convert.ToBoolean(
                                dr["Estado"]
                            )
                        });
                    }

                    dr.Close();

                    return rptLista;
                }
                catch (Exception ex)
                {
                    rptLista = null;

                    return rptLista;
                }
            }
        }

        public List<DetalleRuta> ObtenerDetalleRuta(int idRuta)
        {
            List<DetalleRuta> rptLista =
                new List<DetalleRuta>();

            using (SqlConnection oConexion =
                new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd =
                    new SqlCommand(
                        "usp_ObtenerDetalleRutas",
                        oConexion
                    );

                cmd.CommandType =
                    CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue(
                    "@idRuta",
                    idRuta
                );

                try
                {
                    oConexion.Open();

                    SqlDataReader dr =
                        cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        rptLista.Add(new DetalleRuta()
                        {
                            IdCliente = Convert.ToInt32(
                                dr["IdCliente"]
                            ),

                            Nombre =
                                dr["Nombre"].ToString(),

                            Direccion =
                                dr["Direccion"].ToString(),

                            TipoDocumento =
                                dr["TipoDocumento"].ToString(),

                            NumeroDocumento =
                                dr["NumeroDocumento"].ToString(),

                            Telefono =
                                dr["Telefono"].ToString(),

                            Estado =
                                dr["Estado"].ToString(),

                            Orden = Convert.ToInt32(
                                dr["ordenVisita"]
                            )
                        });
                    }

                    dr.Close();

                    return rptLista;
                }
                catch (Exception ex)
                {
                    rptLista = null;

                    return rptLista;
                }
            }
        }

        public bool AnularRuta(int idRuta, out string mensaje)
        {
            bool respuesta = true;

            mensaje = string.Empty;

            using (SqlConnection oConexion =
                new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd =
                        new SqlCommand(
                            "usp_AnularRuta",
                            oConexion
                        );

                    cmd.CommandType =
                        CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue(
                        "@idRuta",
                        idRuta
                    );

                    cmd.Parameters.Add(
                        "Resultado",
                        SqlDbType.Bit
                    ).Direction =
                        ParameterDirection.Output;

                    cmd.Parameters.Add(
                        "Mensaje",
                        SqlDbType.VarChar,
                        500
                    ).Direction =
                        ParameterDirection.Output;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToBoolean(
                        cmd.Parameters["Resultado"].Value
                    );

                    mensaje = cmd.Parameters["Mensaje"]
                        .Value.ToString();
                }
                catch (Exception ex)
                {
                    respuesta = false;
                    mensaje = ex.Message;
                }
            }

            return respuesta;
        }
    }
}