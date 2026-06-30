using CapaDatos;
using CapaModelo;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VentasWeb.Controllers
{
    public class ProductoController : Controller
    {
        // GET: Producto
        public ActionResult Crear()
        {
            return View();
        }

        // GET: Producto
        public ActionResult Asignar()
        {
            return View();
        }

        // GET: Producto
        public ActionResult Catalogo()
        {
            return View();
        }

        // GET: Producto
        public ActionResult Stocks()
        {
            return View();
        }

        // GET: Producto
        public ActionResult Kardex()
        {
            return View();
        }

        // GET: Producto
        public ActionResult Resolucion()
        {
            return View();
        }
        // GET: Producto
        public ActionResult Digesa()
        {
            return View();
        }
        // GET: Producto
        public ActionResult ActualizaPrecio()
        {
            return View();
        }
        public JsonResult Obtener()
        {
            List<Producto> lista = CD_Producto.Instancia.ObtenerProducto();
            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerPorAsignar(int IdTienda)
        {
            List<Producto> lista = CD_Producto.Instancia.ObtenerProductoPorAsignar(IdTienda);
            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerPorTienda(int IdTienda)
        {

            List<Producto> oListaProducto = CD_Producto.Instancia.ObtenerProducto();
            List<ProductoTienda> oListaProductoTienda = CD_ProductoTienda.Instancia.ObtenerProductoTienda();

            oListaProducto = oListaProducto.Where(x => x.Activo == true).ToList();
            if (IdTienda != 0)
            {
                oListaProductoTienda = oListaProductoTienda.Where(x => x.oTienda.IdTienda == IdTienda).ToList();
                oListaProducto = (from producto in oListaProducto
                                  join productotienda in oListaProductoTienda on producto.IdProducto equals productotienda.oProducto.IdProducto
                                  where productotienda.oTienda.IdTienda == IdTienda
                                  select producto).ToList();
            }

            return Json(new { data = oListaProducto }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerStockPorTienda(int IdTienda)
        {
            var lista = CD_ProductoTienda.Instancia.ObtenerProductoTienda();

            if (IdTienda != 0)
            {
                lista = lista.Where(x => x.oTienda.IdTienda == IdTienda).ToList();
            }

            var resultado = lista.Select(x => new {
                IdProductoTienda = x.IdProductoTienda,
                Stock = x.Stock,
                PrecioUnidadVenta = x.PrecioUnidadVenta,
                PrecioPaqueteVenta = x.PrecioPaqueteVenta,
                oProducto = new
                {
                    x.oProducto.IdProducto,
                    x.oProducto.Codigo,
                    x.oProducto.Nombre,
                    x.oProducto.Descripcion
                }
            }).ToList();

            return Json(new { data = resultado }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerStockPorTiendaCatalogo(int IdTienda, int usarPaquete)
        {
            var lista = CD_ProductoTienda.Instancia.ObtenerProductoTienda();

            if (IdTienda != 0)
            {
                lista = lista.Where(x => x.oTienda.IdTienda == IdTienda).ToList();
            }

            if (usarPaquete == 1)
            {
                lista = lista.Where(x => x.PrecioPaqueteVenta > 0).ToList();
            }

            var resultado = lista.Select(x => new {
                IdProductoTienda = x.IdProductoTienda,
                Stock = x.Stock,
                PrecioUnidadVenta = x.PrecioUnidadVenta,
                PrecioPaqueteVenta = x.PrecioPaqueteVenta,
                oProducto = new
                {
                    x.oProducto.IdProducto,
                    x.oProducto.Codigo,
                    x.oProducto.Nombre,
                    x.oProducto.Descripcion
                }
            }).ToList();

            return Json(new { data = resultado }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerStockPorTiendaCodigo(int IdTienda, string CodigoProducto = "")
        {

            List<ProductoTienda> lista = CD_ProductoTienda.Instancia.ObtenerStockPorTiendaCodigo(IdTienda);

            // FILTRAR POR CÓDIGO
            if (!string.IsNullOrWhiteSpace(CodigoProducto))
            {
                CodigoProducto = CodigoProducto.Trim().ToUpper();

                lista = lista.Where(x =>
                    x.oProducto.Codigo != null &&
                    x.oProducto.Codigo.ToUpper().Contains(CodigoProducto)
                ).ToList();
            }

            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObtenerReporteKardex(int IdTienda, string Codigo, string fechainicio, string fechafin)
        {
            string[] inicio = fechainicio.Split('/');
            fechainicio = inicio[2] + "-" + inicio[1] + "-" + inicio[0];

            string[] fin = fechafin.Split('/');
            fechafin = fin[2] + "-" + fin[1] + "-" + fin[0];

            List<Kardex> lista = CD_ProductoTienda.Instancia.ObtenerReporteKardex(IdTienda, Codigo, fechainicio, fechafin);

            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Guardar(Producto objeto)
        {
            bool respuesta = false;

            if (objeto.IdProducto == 0)
            {

                respuesta = CD_Producto.Instancia.RegistrarProducto(objeto);
            }
            else
            {
                respuesta = CD_Producto.Instancia.ModificarProducto(objeto);
            }


            return Json(new { resultado = respuesta }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Eliminar(int id = 0)
        {
            bool respuesta = CD_Producto.Instancia.EliminarProducto(id);

            return Json(new { resultado = respuesta }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult RegistrarProductoTienda(ProductoTienda objeto)
        {
            bool respuesta = CD_ProductoTienda.Instancia.RegistrarProductoTienda(objeto);
            return Json(new { resultado = respuesta }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ModificarProductoTienda(ProductoTienda objeto)
        {
            bool respuesta = CD_ProductoTienda.Instancia.ModificarProductoTienda(objeto);
            return Json(new { resultado = respuesta }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult EliminarProductoTienda(int id)
        {
            bool respuesta = CD_ProductoTienda.Instancia.EliminarProductoTienda(id);
            return Json(new { resultado = respuesta }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ObtenerAsignaciones()
        {
            List<ProductoTienda> lista = CD_ProductoTienda.Instancia.ObtenerProductoTienda();
            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ActualizarPrecioCatalogo(ProductoTienda oModelo)
        {
            bool resultado = false;
            string mensaje = "";

            resultado =  CD_ProductoTienda.Instancia.ModificarPrecioCatalogo(
                oModelo.IdProductoTienda,
                oModelo.PrecioPaqueteVenta,
                out mensaje
            );

            return Json(new
            {
                resultado = resultado,
                mensaje = mensaje
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ActualizarPrecioGeneral(ProductoTienda oModelo)
        {
            bool resultado = false;
            string mensaje = "";

            resultado = CD_ProductoTienda.Instancia.ModificarPrecioGeneral(
                oModelo.IdProductoTienda,
                oModelo.PrecioUnidadVenta,
                out mensaje
            );

            return Json(new
            {
                resultado = resultado,
                mensaje = mensaje
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult obtenerResolucion()
        {
            return Json(new { data = CD_Resolucion.Instancia.Listar() }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ObtenerGrupoDigesa()
        {
            List<GrupoDigesa> lista = new List<GrupoDigesa>();

            using (SqlConnection con = new SqlConnection(Conexion.CN))
            {
                SqlCommand cmd = new SqlCommand(
                    "SELECT IdGrupoDigesa, Nombre FROM GRUPO_DIGESA",
                    con);

                cmd.CommandType = CommandType.Text;

                con.Open();

                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    lista.Add(new GrupoDigesa()
                    {
                        IdGrupoDigesa = Convert.ToInt32(dr["IdGrupoDigesa"]),
                        Nombre = dr["Nombre"].ToString()
                    });
                }
            }

            return Json(new
            {
                data = lista
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GuardarResolucion(Resolucion o, HttpPostedFileBase Archivo)
        {
            try
            {
                if (Archivo != null)
                {
                    string carpeta = Server.MapPath("~/Imagenes/Digesa/");

                    if (!Directory.Exists(carpeta))
                    {
                        Directory.CreateDirectory(carpeta);
                    }

                    string nombreArchivo = Path.GetFileName(Archivo.FileName);

                    string ruta = Path.Combine(carpeta, nombreArchivo);

                    Archivo.SaveAs(ruta);

                    o.NombreArchivo = nombreArchivo;
                    o.RutaArchivo = "/Imagenes/Digesa/" + nombreArchivo;
                }

                bool rpt = CD_Resolucion.Instancia.Guardar(o);

                return Json(new
                {
                    success = rpt
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet]
        public JsonResult obtenerResolucionProductos()
        {
            return Json(new { data = CD_Resolucion.Instancia.ListarProductosDigesa() }, JsonRequestBehavior.AllowGet);
        }
    }
}
