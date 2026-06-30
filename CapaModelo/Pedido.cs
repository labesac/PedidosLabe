using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaModelo
{
    public class Pedido
    {
        public int IdPedido { get; set; }
        public string TipoDocumento { get; set; }
        public string Codigo { get; set; }
        public string Vendedor { get; set; }
        public float TotalCosto { get; set; }
        public float Total { get; set; }
        public float Descuento { get; set; }
        public string TextoTotalCosto { get; set; }
        public float ImporteRecibido { get; set; }
        public string TextoImporteRecibido { get; set; }
        public float ImporteCambio { get; set; }
        public string TextoImporteCambio { get; set; }
        public string FechaRegistro { get; set; }
        public string Estado { get; set; }
        public string Observacion { get; set; }
        public string Situacion { get; set; }
        public DateTime VFechaRegistro { get; set; }
        public Usuario oUsuario { get; set; }
        public Tienda oTienda { get; set; }
        public Cliente oCliente { get; set; }
        public List<DetallePedido> oListaDetallePedido { get; set; } = new List<DetallePedido>();

    }
}
