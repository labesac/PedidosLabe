using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaModelo
{
    public class Cliente
    {
        public int IdCliente { get; set; }
        public string TipoDocumento { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string NumeroDocumento { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public decimal? Latitud { get; set; }
        public decimal? Longitud { get; set; }
        public bool Activo { get; set; }
        public string Dir_Nombre { get; set; }
        public string Encargado { get; set; }
        public string EmailEncargado { get; set; }
        public bool EsPrincipal { get; set; }
    }

    public class ClienteDireccion
    {
        public int IdCliente { get; set; }
        public int IdClienteDireccion { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public decimal? Latitud { get; set; }
        public decimal? Longitud { get; set; }
        public string Encargado { get; set; }
        public string EmailEncargado { get; set; }
        public bool EsPrincipal { get; set; }

    }

}
