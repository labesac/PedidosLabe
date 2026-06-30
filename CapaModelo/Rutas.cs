using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CapaModelo
{
    public class Rutas
    {
        public int idRuta { get; set; }
        public string Nombre { get; set; }
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public string prioridad { get; set; }
        public string zona { get; set; }
        public string fechaTexto { get; set; }
        public DateTime fecha { get; set; }
        public int idVendedor { get; set; }
        public string vendedor { get; set; }
        public bool Estado { get; set; }
        public DateTime FechaRegistro { get; set; }
        public int UsuarioRegistro { get; set; }
        public int idUsuario { get; set; }
        public List<DetalleRuta> detalle { get; set; }

    }

    public class DetalleRuta
    {
        public int idDetalleRuta { get; set; }
        public int idRuta { get; set; }
        public int IdCliente { get; set; }
        public int Orden { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string TipoDocumento { get; set; }
        public string NumeroDocumento { get; set; }
        public string Estado { get; set; }
        public string Telefono { get; set; }
    }
}