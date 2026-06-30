using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaModelo
{
    public class Kardex
    {
        public int IdKardex { get; set; }

        public Producto oProducto { get; set; }

        public Tienda oTienda { get; set; }

        public string TipoMovimiento { get; set; }

        public string Documento { get; set; }

        public int IdDocumento { get; set; }

        public decimal Entrada { get; set; }

        public decimal Salida { get; set; }

        public decimal SaldoAnterior { get; set; }

        public decimal SaldoActual { get; set; }

        public decimal Precio { get; set; }
        public string Fecha { get; set; }
        public DateTime FechaRegistro { get; set; }
    }
}
