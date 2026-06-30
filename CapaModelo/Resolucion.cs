using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaModelo
{
    public class Resolucion
    {
        public int IdResolucion { get; set; }

        public int IdGrupoDigesa { get; set; }

        public string GrupoDigesa { get; set; }

        public string NumeroResolucion { get; set; }

        public DateTime FechaEmision { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime FechaVencimiento { get; set; }

        public string sFechaEmision { get; set; }

        public string sFechaInicio { get; set; }

        public string sFechaVencimiento { get; set; }
        public string NombreArchivo { get; set; }

        public string RutaArchivo { get; set; }

        public bool Estado { get; set; }
    }

    public class GrupoDigesa
    {
        public int IdGrupoDigesa { get; set; }

        public string Nombre { get; set; }
    }

    public class ResolucionProducto
    {
        public int IdProducto { get; set; }

        public string Producto { get; set; }

        public string GrupoDigesa { get; set; }

        public string NumeroResolucion { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaVencimiento { get; set; }

        public string sFechaInicio { get; set; }

        public string sFechaVencimiento { get; set; }

        public string EstadoResolucion { get; set; }

        public string TiempoRestante { get; set; }
    }
}
