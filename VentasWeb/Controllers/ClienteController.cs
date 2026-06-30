using CapaDatos;
using CapaModelo;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace VentasWeb.Controllers
{
    public class ClienteController : Controller
    {
        // GET: Cliente
        public ActionResult Crear()
        {
            return View();
        }

        public JsonResult Obtener()
        {
            List<Cliente> oListaCliente = CD_Cliente.Instancia.ObtenerClientes();
            return Json(new { data = oListaCliente }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerClienteDireccion(int idCliente)
        {
            List<ClienteDireccion> oListaCliente = CD_Cliente.Instancia.ObtenerClienteDirecciones(idCliente);

            return Json(new { data = oListaCliente }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GuardarClienteDireccion(ClienteDireccion objeto)
        {
            bool respuesta = false;

            respuesta = CD_Cliente.Instancia.GuardarClienteDireccion(objeto);

            return Json(new
            {
                resultado = respuesta
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Guardar(Cliente objeto)
        {
            bool respuesta = false;
            string mensaje = string.Empty;

            if (objeto.IdCliente == 0)
            {
                respuesta = CD_Cliente.Instancia.RegistrarCliente(objeto, out mensaje);
            }
            else
            {
                respuesta = CD_Cliente.Instancia.ModificarCliente(objeto);
                mensaje = respuesta
                    ? "Cliente actualizado correctamente"
                    : "No se pudo actualizar el cliente";
            }

            return Json(new
            {
                resultado = respuesta,
                mensaje = mensaje
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Eliminar(int id = 0)
        {
            bool respuesta = CD_Cliente.Instancia.EliminarCliente(id);

            return Json(new { resultado = respuesta }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ConsultarRUC(string ruc)
        {
            try
            {
                string url = "https://ww1.sunat.gob.pe/ol-ti-itfisdenreg/itfisdenreg.htm?accion=obtenerDatosRuc&nroRuc=" + ruc;

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";

                string resultado = "";

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                    {
                        resultado = reader.ReadToEnd();
                    }
                }

                resultado = resultado.Trim();

                if (resultado.StartsWith("("))
                {
                    resultado = resultado.Substring(1);
                }

                if (resultado.EndsWith(")"))
                {
                    resultado = resultado.Substring(0, resultado.Length - 1);
                }

                System.Diagnostics.Debug.WriteLine(resultado);

                dynamic json = JObject.Parse(resultado);

                var item = json.lista[0];

                return Json(new
                {
                    success = true,
                    razonSocial = item.apenomdenunciado.ToString().Trim(),
                    direccion = item.direstablecimiento.ToString().Trim()
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    mensaje = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> ConsultarDNI(string dni)
        {
            try
            {
                string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjY2LCJlbWFpbCI6Im1hcmlvbGF1cmFycEBnbWFpbC5jb20iLCJub21icmUiOiJNYXJpbyBMYXVyYSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3Nzk5MTQ0MjEsImV4cCI6MTc3OTkxODAyMX0.d9L69GvSij7PZj07sYzpqVLqHPg5iYD6F8lVUICLOMM";

                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

                    string url = $"https://api.tokenperu.com/dni/{dni}";

                    var response = await client.GetAsync(url);

                    var json = await response.Content.ReadAsStringAsync();

                    return Content(json, "application/json");
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    mensaje = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}