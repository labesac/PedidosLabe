using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaModelo
{
    public class ReportePedido
    {
        public string Fecha { get; set; }
        public string NumeroDocumento { get; set; }
        public string TipoDocumento { get; set; }
        public string NombreTienda { get; set; }
        public string RucTienda { get; set; }
        public string NombreEmpleado { get; set; }
        public string CantidadUnidadesVendidas { get; set; }
        public string CantidadProductos { get; set; }
        public string Total { get; set; }
        public string DocumentoReferencia { get; set; }
    }
}
