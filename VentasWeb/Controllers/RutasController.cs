using CapaDatos;
using CapaModelo;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace VentasWeb.Controllers
{
    public class RutasController : Controller
    {
        // GET: Cliente
        public ActionResult Crear()
        {
            return View();
        }

        public ActionResult Consultar()
        {
            return View();
        }

        // GET: Pedido
        public ActionResult ConsultarMapa()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ObtenerRutas()
        {
            Usuario ousuario =
                (Usuario)Session["Usuario"];

            List<Rutas> oLista =
                CD_Ruta.Instancia.ObtenerRutas(
                    ousuario.IdUsuario
                );

            return Json(new
            {
                data = oLista
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ObtenerDetalleRuta(int idRuta)
        {
            List<DetalleRuta> oLista =
                CD_Ruta.Instancia.ObtenerDetalleRuta(
                    idRuta
                );

            return Json(new
            {
                data = oLista
            }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Obtener()
        {
            List<Cliente> oListaCliente = CD_Cliente.Instancia.ObtenerClientes();
            return Json(new { data = oListaCliente }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ObtenerUsuarioVentas()
        {
            Usuario ousuario = (Usuario)Session["Usuario"];

            List<Usuario> oListaUsuario =
                CD_Usuario.Instancia.ObtenerUsuariosVentas(ousuario.IdUsuario);

            return Json(new { data = oListaUsuario },
                JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GuardarRuta(Rutas obj)
        {
            object resultado;
            string mensaje = string.Empty;

            Usuario ousuario =
                (Usuario)Session["Usuario"];

            obj.idUsuario = ousuario.IdUsuario;


            bool respuesta =
                CD_Ruta.Instancia.RegistrarRuta(
                    obj,
                    out resultado,
                    out mensaje
                );

            return Json(new
            {
                resultado = respuesta,
                mensaje = mensaje
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AnularRuta(int idRuta)
        {
            bool respuesta = false;
            string mensaje = string.Empty;

            respuesta = CD_Ruta.Instancia.AnularRuta(
                idRuta,
                out mensaje
            );

            return Json(new
            {
                resultado = respuesta,
                mensaje = mensaje
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ObtenerMapaPedidos(string fecha, int idvendedor)
        {
            List<object> lista = new List<object>();

            using (SqlConnection cn = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand("usp_ObtenerMapaPedidoVendedor", cn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Fecha", fecha);
                cmd.Parameters.AddWithValue("@IdVendedor", idvendedor);

                cn.Open();

                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    lista.Add(new
                    {
                        idRuta = dr["idRuta"],
                        codigo = dr["Codigo"].ToString(),
                        fecha = Convert.ToDateTime(dr["fecha"]).ToString("dd/MM/yyyy"),
                        orden = dr["ordenVisita"],
                        estado = dr["Estado"].ToString(),
                        cliente = dr["Nombre"].ToString(),
                        latitud = dr["Latitud"].ToString(),
                        longitud = dr["Longitud"].ToString(),
                        color = dr["ColorMarcador"].ToString()
                    });
                }
            }

            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }
    }
}