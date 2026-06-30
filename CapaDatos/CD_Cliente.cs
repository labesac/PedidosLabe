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
    public class CD_Cliente
    {
        public static CD_Cliente _instancia = null;

        private CD_Cliente()
        {

        }

        public static CD_Cliente Instancia
        {
            get
            {
                if (_instancia == null)
                {
                    _instancia = new CD_Cliente();
                }
                return _instancia;
            }
        }


        public List<Cliente> ObtenerClientes()
        {
            List<Cliente> rptListaCliente = new List<Cliente>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerCliente", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    oConexion.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        rptListaCliente.Add(new Cliente()
                        {
                            IdCliente = Convert.ToInt32(dr["IdCliente"].ToString()),
                            TipoDocumento = dr["TipoDocumento"].ToString(),
                            NumeroDocumento = dr["NumeroDocumento"].ToString(),
                            Nombre = dr["Nombre"].ToString(),
                            Direccion = dr["Direccion"].ToString(),
                            Telefono = dr["Telefono"].ToString(),
                            Email = dr["Email"].ToString(),
                            Activo = Convert.ToBoolean(dr["Activo"]),
                            Latitud = Convert.ToDecimal(dr["Latitud"]),
                            Longitud = Convert.ToDecimal(dr["Longitud"]),
                            Dir_Nombre = dr["Dir_Nombre"].ToString(),
                            Encargado = dr["Encargado"].ToString(),
                            EmailEncargado = dr["EmailEncargado"].ToString(),
                            EsPrincipal = Convert.ToBoolean(dr["EsPrincipal"]),
                        });
                    }
                    dr.Close();

                    return rptListaCliente;

                }
                catch (Exception ex)
                {
                    rptListaCliente = null;
                    return rptListaCliente;
                }
            }
        }

        public List<ClienteDireccion> ObtenerClienteDirecciones(int idCliente)
        {
            List<ClienteDireccion> rptListaCliente = new List<ClienteDireccion>();

            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerClienteDireccion", oConexion);
                cmd.Parameters.AddWithValue("@IdCliente", idCliente);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    oConexion.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        rptListaCliente.Add(new ClienteDireccion()
                        {
                            IdClienteDireccion = Convert.ToInt32(dr["IdClienteDirecciones"].ToString()),
                            Nombre = dr["Nombre"].ToString(),
                            Direccion = dr["Direccion"].ToString(),
                            Encargado = dr["Encargado"].ToString(),
                            Telefono = dr["Telefono"].ToString(),
                            Email = dr["Email"].ToString()
                        });
                    }

                    dr.Close();

                    return rptListaCliente;
                }
                catch (Exception ex)
                {
                    rptListaCliente = null;
                    return rptListaCliente;
                }
            }
        }

        public bool GuardarClienteDireccion(ClienteDireccion oDireccion)
        {
            bool respuesta = true;

            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_RegistrarClienteDireccion", oConexion);

                    cmd.Parameters.AddWithValue("IdCliente", oDireccion.IdCliente);
                    cmd.Parameters.AddWithValue("Nombre", oDireccion.Nombre);
                    cmd.Parameters.AddWithValue("Direccion", oDireccion.Direccion);
                    cmd.Parameters.AddWithValue("Latitud", oDireccion.Latitud);
                    cmd.Parameters.AddWithValue("Longitud", oDireccion.Longitud);
                    cmd.Parameters.AddWithValue("Telefono", string.IsNullOrWhiteSpace(oDireccion.Telefono) ? (object)DBNull.Value : oDireccion.Telefono);
                    cmd.Parameters.AddWithValue("Encargado", string.IsNullOrWhiteSpace(oDireccion.Encargado) ? (object)DBNull.Value : oDireccion.Encargado);
                    cmd.Parameters.AddWithValue("EmailEncargado", string.IsNullOrWhiteSpace(oDireccion.EmailEncargado) ? (object)DBNull.Value : oDireccion.EmailEncargado);
                    cmd.Parameters.AddWithValue("EsPrincipal", oDireccion.EsPrincipal);

                    cmd.CommandType = CommandType.StoredProcedure;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                }
                catch (Exception ex)
                {
                    respuesta = false;
                }
            }

            return respuesta;
        }

        public bool RegistrarCliente(Cliente oCliente, out string mensaje)
        {
            bool respuesta = true;
            mensaje = string.Empty;

            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_RegistrarCliente", oConexion);

                    cmd.Parameters.AddWithValue("@TipoDocumento", oCliente.TipoDocumento);
                    cmd.Parameters.AddWithValue("@NumeroDocumento", oCliente.NumeroDocumento);
                    cmd.Parameters.AddWithValue("@Nombre", oCliente.Nombre);
                    cmd.Parameters.AddWithValue("@Direccion", oCliente.Direccion);
                    cmd.Parameters.AddWithValue("@Telefono", oCliente.Telefono);
                    cmd.Parameters.AddWithValue("@Email", (object)oCliente.Email ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Latitud", (object)oCliente.Latitud ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Longitud", (object)oCliente.Longitud ?? DBNull.Value);

                    cmd.Parameters.Add("@Resultado", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@Mensaje", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;

                    cmd.CommandType = CommandType.StoredProcedure;

                    oConexion.Open();

                    cmd.ExecuteNonQuery();

                    respuesta = Convert.ToBoolean(cmd.Parameters["@Resultado"].Value);
                    mensaje = cmd.Parameters["@Mensaje"].Value.ToString();
                }
                catch (Exception ex)
                {
                    respuesta = false;
                    mensaje = ex.Message;
                }
            }

            return respuesta;
        }

        public bool ModificarCliente(Cliente oCliente)
        {
            bool respuesta = true;
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_ModificarCliente", oConexion);
                    cmd.Parameters.AddWithValue("IdCliente", oCliente.IdCliente);
                    cmd.Parameters.AddWithValue("TipoDocumento", oCliente.TipoDocumento);
                    cmd.Parameters.AddWithValue("NumeroDocumento", oCliente.NumeroDocumento);
                    cmd.Parameters.AddWithValue("Nombre", oCliente.Nombre);
                    cmd.Parameters.AddWithValue("Direccion", oCliente.Direccion);
                    cmd.Parameters.AddWithValue("Telefono", oCliente.Telefono);
                    cmd.Parameters.AddWithValue("Email", oCliente.Email);
                    cmd.Parameters.AddWithValue("Latitud ", oCliente.Latitud);
                    cmd.Parameters.AddWithValue("Longitud ", oCliente.Longitud);
                    cmd.Parameters.AddWithValue("Activo", oCliente.Activo);
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

        public bool EliminarCliente(int id)
        {
            bool respuesta = true;
            using (SqlConnection oConexion = new SqlConnection(Conexion.CN))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_EliminarCliente", oConexion);
                    cmd.Parameters.AddWithValue("IdCliente", id);
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
