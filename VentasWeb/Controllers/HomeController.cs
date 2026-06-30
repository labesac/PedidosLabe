using CapaDatos;
using CapaModelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VentasWeb.Controllers
{
    public class HomeController : Controller
    {
        private static Usuario SesionUsuario;
        public ActionResult Index()
        {
            if (Session["Usuario"] != null)
                SesionUsuario = (Usuario)Session["Usuario"];
            else {
                SesionUsuario = new Usuario();
            }
            try
            {
                ViewBag.NombreUsuario = SesionUsuario.Nombres + " " + SesionUsuario.Apellidos;
                ViewBag.RolUsuario = SesionUsuario.oRol.Descripcion;

            }
            catch {

            }

           
            return View();
        }

        public ActionResult Dashboard()
        {
            return View();
        }

        public ActionResult Salir()
        {
            Session["Usuario"] = null;
            return RedirectToAction("Index", "Login");
        }

        [HttpGet]
        public JsonResult DashboardPanel()
        {
            try
            {
                Dashboard oDashboard = CD_Dashboard.Instancia.ObtenerDashboard();

                if (oDashboard == null)
                {
                    oDashboard = new Dashboard();
                }

                return Json(new
                {
                    data = oDashboard
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    data = new Dashboard(),
                    error = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}