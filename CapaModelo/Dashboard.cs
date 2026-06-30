using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaModelo
{
    public class Dashboard
    {
        // =========================
        // KPI PEDIDOS
        // =========================

        public decimal TotalPedidosHoy { get; set; }
        public decimal TotalPedidosAyer { get; set; }
        public decimal TotalPedidosMes { get; set; }
        public decimal TotalPedidosMesPasado { get; set; }

        public int PedidosPendientes { get; set; }
        public int PedidosEntregados { get; set; }


        // =========================
        // KPI VENTAS
        // =========================

        public decimal TotalVentasHoy { get; set; }
        public decimal TotalVentasAyer { get; set; }
        public decimal TotalVentasMes { get; set; }
        public decimal TotalVentasMesPasado { get; set; }

        public int CantidadVentas { get; set; }


        // =========================
        // LISTAS
        // =========================

        public List<TopProducto> TopProductos { get; set; }

        public List<VentaMes> PedidosPorMes { get; set; }

        public List<VentaMes> VentasPorMes { get; set; }

        public List<MapaPedido> MapaPedidos { get; set; }

        public List<StockBaja> StockBajo { get; set; }

        public List<PedidoEstado> PedidosEstado { get; set; }

        public List<UltimoPedido> UltimosPedidos { get; set; }

        public class TopProducto
        {
            public string Producto { get; set; }
            public int IdProducto { get; set; }
            public int Cantidad { get; set; }
            public decimal Total { get; set; }
        }

        public class VentaMes
        {
            public int Mes { get; set; }
            public string NombreMes { get; set; }
            public decimal Total { get; set; }
        }

        public class MapaPedido
        {
            public decimal Latitud { get; set; }
            public decimal Longitud { get; set; }
            public string Codigo { get; set; }
            public decimal Total { get; set; }
            public string Estado { get; set; }
        }

        public class StockBaja
        {
            public string Nombre { get; set; }
            public int StockDisponible { get; set; }
            public decimal PrecioUnidadVenta { get; set; }
        }

        public class PedidoEstado
        {
            public string Estado { get; set; }
            public int Cantidad { get; set; }
        }

        public class UltimoPedido
        {
            public int IdPedido { get; set; }
            public string Codigo { get; set; }
            public string Contacto { get; set; }
            public string Vendedor { get; set; }
            public string Telefono { get; set; }

            public string Direccion { get; set; }

            public int CantidadProducto { get; set; }

            public decimal Total { get; set; }

            public decimal DescuentoImporte { get; set; }

            public string Estado { get; set; }

            public DateTime FechaRegistro { get; set; }

            public string FechaRegistroTexto
            {
                get
                {
                    return FechaRegistro.ToString("dd/MM/yyyy HH:mm");
                }
            }
        }
    }
}
