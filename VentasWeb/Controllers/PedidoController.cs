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
    public class PedidoController : Controller
    {
        private static Usuario SesionUsuario;
        // GET: Pedido
        public ActionResult Crear()
        {
            SesionUsuario = (Usuario)Session["Usuario"];
            return View();
        }

        // GET: Pedido
        public ActionResult CrearMobil()
        {
            SesionUsuario = (Usuario)Session["Usuario"];
            return View();
        }

        // GET: Pedido
        public ActionResult Consultar()
        {
            return View();
        }

        // GET: Pedido
        public ActionResult ConsultarMobil()
        {
            return View();
        }

        // GET: Pedido
        public ActionResult Gestionar()
        {
            return View();
        }

        public ActionResult Documento(int IdPedido = 0)
        {

            Pedido oPedido = CD_Pedido.Instancia.ObtenerDetallePedido(IdPedido);

            NumberFormatInfo formato = new CultureInfo("es-PE").NumberFormat;
            formato.CurrencyGroupSeparator = ".";

            if (oPedido == null)
                oPedido = new Pedido();
            else {

                oPedido.oListaDetallePedido = (from dv in oPedido.oListaDetallePedido
                                             select new DetallePedido()
                                             {
                                                 Cantidad = dv.Cantidad,
                                                 NombreProducto = dv.NombreProducto,
                                                 PrecioUnidad = dv.PrecioUnidad,
                                                 TextoPrecioUnidad = dv.PrecioUnidad.ToString("N", formato), //numero.ToString("C", formato)
                                                 ImporteTotal = dv.ImporteTotal,
                                                 TextoImporteTotal = dv.ImporteTotal.ToString("N", formato)
                                             }).ToList();

                oPedido.TextoImporteRecibido = oPedido.ImporteRecibido.ToString("N", formato);
                oPedido.TextoImporteCambio = oPedido.ImporteCambio.ToString("N", formato);
                oPedido.TextoTotalCosto = oPedido.TotalCosto.ToString("N", formato);
            }
               

            return View(oPedido);
        }

        public JsonResult Obtener(string codigo, string fechainicio, string fechafin, string numerodocumento, string nombres)
        {
            string[] inicio = fechainicio.Split('/');
            fechainicio = inicio[2] + "-" + inicio[1] + "-" + inicio[0];

            string[] fin = fechafin.Split('/');
            fechafin = fin[2] + "-" + fin[1] + "-" + fin[0];

            List<Pedido> lista = CD_Pedido.Instancia.ObtenerListaPedido(codigo, fechainicio, fechafin, numerodocumento, nombres);
            if (lista == null)
                lista = new List<Pedido>();

            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerPedidosVenta(string codigo, string fechainicio, string fechafin, string numerodocumento, string nombres)
        {
            string[] inicio = fechainicio.Split('/');
            fechainicio = inicio[2] + "-" + inicio[1] + "-" + inicio[0];

            string[] fin = fechafin.Split('/');
            fechafin = fin[2] + "-" + fin[1] + "-" + fin[0];

            Usuario oUsuario = (Usuario)Session["Usuario"];
            int Id_Usuario = oUsuario.IdUsuario;
            List<Pedido> lista = CD_Pedido.Instancia.ObtenerListaPedidosVenta(Id_Usuario,codigo, fechainicio, fechafin, numerodocumento, nombres);

            if (lista == null)
                lista = new List<Pedido>();

            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerUsuario()
        {
            Usuario rptUsuario = CD_Usuario.Instancia.ObtenerDetalleUsuario(SesionUsuario.IdUsuario);
            return Json(rptUsuario, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerProductoPorTienda(int IdTienda)
        {

            List<ProductoTienda> oListaProductoTienda = CD_ProductoTienda.Instancia.ObtenerProductoTienda();
            oListaProductoTienda = oListaProductoTienda.Where(x => x.oTienda.IdTienda == IdTienda && x.Stock > 0).ToList();


            return Json(new { data = oListaProductoTienda }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Guardar(string xml)
        {
            xml = xml.Replace("!idusuario¡", SesionUsuario.IdUsuario.ToString());
            int Respuesta = 0;
            Respuesta = CD_Pedido.Instancia.RegistrarPedido(xml);
            if (Respuesta != 0)
                return Json(new { estado = true, valor = Respuesta.ToString() }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { estado = false, valor = "" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GenerarVentaPedido(Venta request)
        {
            int Respuesta = 0;
            string mensaje = string.Empty;
            Usuario oUsuario = (Usuario)Session["Usuario"];
            int Id_Usuario = oUsuario.IdUsuario;

            try
            {
                Respuesta = CD_Pedido.Instancia.RegistrarVentaPedido(
                    request.TipoDocumento,
                    request.MetodoPago,
                    Id_Usuario,
                    request.IdPedido,
                    out mensaje
                );

                return Json(new
                {
                    resultado = Respuesta,
                    mensaje = mensaje
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    Respuesta = 0,
                    mensaje = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult Despachar(int id = 0)
        {
            Usuario oUsuario = (Usuario)Session["Usuario"];
            int Id_Usuario = oUsuario.IdUsuario;
            bool respuesta = CD_Pedido.Instancia.DespacharPedido(id, Id_Usuario);
            return Json(new { resultado = respuesta }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult Anular(int id = 0)
        {
            Usuario oUsuario = (Usuario)Session["Usuario"];
            int Id_Usuario = oUsuario.IdUsuario;
            bool respuesta = CD_Pedido.Instancia.AnularPedido(id, Id_Usuario);
            return Json(new { resultado = respuesta }, JsonRequestBehavior.AllowGet);
        }
    }
}