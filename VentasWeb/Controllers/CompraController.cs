using CapaDatos;
using CapaModelo;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VentasWeb.Controllers
{
    public class CompraController : Controller
    {
        private static Usuario SesionUsuario;
        // GET: Compra
        public ActionResult Crear()
        {
            SesionUsuario = (Usuario)Session["Usuario"];
            return View();
        }
        // GET: Compra
        public ActionResult Consultar()
        {
            return View();
        }

        public ActionResult Documento(int idcompra = 0) {
            
            Compra oCompra = CD_Compra.Instancia.ObtenerDetalleCompra(idcompra);

            if (oCompra == null) {
                oCompra = new Compra();
            }


            return View(oCompra);
        }


        public JsonResult Obtener(string fechainicio, string fechafin, int idproveedor, int idtienda)
        {
            string[] inicio = fechainicio.Split('/');
            fechainicio = inicio[2] + "-" + inicio[1] + "-" + inicio[0];

            string[] fin = fechafin.Split('/');
            fechafin = fin[2] + "-" + fin[1] + "-" + fin[0];

            List<Compra> lista = CD_Compra.Instancia.ObtenerListaCompra(fechainicio, fechafin, idproveedor, idtienda);
            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult Guardar(string xml)
        {
            xml = xml.Replace("!idusuario¡", SesionUsuario.IdUsuario.ToString());

            bool respuesta  = CD_Compra.Instancia.RegistrarCompra(xml);

            return Json(new { resultado = respuesta }, JsonRequestBehavior.AllowGet);
        }



    }
}