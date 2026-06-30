using CapaDatos;
using CapaModelo;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VentasWeb.Controllers
{
    public class ReporteController : Controller
    {
        // GET: Reporte
        public ActionResult Producto()
        {
            return View();
        }

        // GET: Reporte
        public ActionResult Ventas()
        {
            return View();
        }

        // GET: Reporte
        public ActionResult Pedidos()
        {
            return View();
        }

        public JsonResult ObtenerProducto(int idtienda, string codigoproducto)
        {
            List<ReporteProducto> lista = CD_Reportes.Instancia.ReporteProductoTienda(idtienda, codigoproducto);

            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerVenta(string fechainicio, string fechafin, int idtienda)
        {
            string[] inicio = fechainicio.Split('/');
            fechainicio = inicio[2] + "-" + inicio[1] + "-" + inicio[0];

            string[] fin = fechafin.Split('/');
            fechafin = fin[2] + "-" + fin[1] + "-" + fin[0];

            List<ReporteVenta> lista = CD_Reportes.Instancia.ReporteVenta(fechainicio, fechafin, idtienda);
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerPedido(string fechainicio, string fechafin, int idtienda)
        {
            string[] inicio = fechainicio.Split('/');
            fechainicio = inicio[2] + "-" + inicio[1] + "-" + inicio[0];

            string[] fin = fechafin.Split('/');
            fechafin = fin[2] + "-" + fin[1] + "-" + fin[0];

            List<ReportePedido> lista = CD_Reportes.Instancia.ReportePedido(fechainicio, fechafin, idtienda);
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
    }
}