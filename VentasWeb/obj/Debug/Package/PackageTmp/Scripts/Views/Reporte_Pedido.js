
var table;
var dataReporte = [];

$(document).ready(function () {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '< Ant',
        nextText: 'Sig >',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };


    $.datepicker.setDefaults($.datepicker.regional['es']);
    activarMenu("Reportes");

    $("#txtFechaInicio").datepicker();
    $("#txtFechaFin").datepicker();
    $("#txtFechaInicio").val(ObtenerFecha());
    $("#txtFechaFin").val(ObtenerFecha());


    //OBTENER TIENDAS
    jQuery.ajax({
        url: $.MisUrls.url._ObtenerTiendas,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            $("#cboTienda").LoadingOverlay("hide");
            $("#cboTienda").html("");

            $("<option>").attr({ "value": 0 }).text("-- Seleccionar todas--").appendTo("#cboTienda");
            if (data.data != null)
                $.each(data.data, function (i, item) {

                    if (item.Activo == true) {
                        $("<option>").attr({ "value": item.IdTienda }).text(item.Nombre).appendTo("#cboTienda");
                    }
                })
        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
            $("#cboTienda").LoadingOverlay("show");
        },
    });

});

$('#btnBuscar').on('click', function () {

    jQuery.ajax({
        url: $.MisUrls.url._ObtenerReportePedido + "?fechainicio=" + $("#txtFechaInicio").val() + "&fechafin=" + $("#txtFechaFin").val() + "&idtienda=" + $("#cboTienda").val() ,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            if (data != undefined && data != null) {

                dataReporte = data;

                $("#tbReporte tbody").html("");

                $.each(data, function (i, row) {

                    $("<tr>").append(
                        $("<td>").text(row["Fecha"]),
                        $("<td>").text(row["NumeroDocumento"]),
                        $("<td>").text(row["TipoDocumento"]),
                        $("<td>").text(row["NombreTienda"]),
                        $("<td>").text(row["RucTienda"]),
                        $("<td>").text(row["NombreEmpleado"]),
                        $("<td>").text(row["CantidadUnidadesVendidas"]),
                        $("<td>").text(row["CantidadProductos"]),
                        $("<td>").text(row["Total"]),
                        $("<td>").text(row["DocumentoReferencia"]),

                    ).appendTo("#tbReporte tbody");

                })

            }

        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
        },
    });
})

function ObtenerFecha() {

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (('' + day).length < 2 ? '0' : '') + day + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + d.getFullYear();

    return output;
}

function printData() {

    if ($('#tbReporte tbody tr').length == 0) {
        swal("Mensaje", "No existen datos para imprimir", "warning")
        return;
    }

    var divToPrint = document.getElementById("tbReporte");

    var style = "<style>";
    style = style + "table {width: 100%;font: 17px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";

    newWin = window.open("");


    newWin.document.write(style);
    newWin.document.write("<h3>Reporte de Pedidos</h3>");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
}

function toNumber(v) {
    if (v == null || v === "") return 0;
    var n = parseFloat(v.toString().replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
}

function exportData() {

    if (!dataReporte || dataReporte.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    var grupos = {};

    dataReporte.forEach(x => {

        var vendedor = x.Usuario || x.NombreEmpleado || "SIN VENDEDOR";

        if (!grupos[vendedor]) {
            grupos[vendedor] = {
                vendedor,
                pedidos: 0,
                unidades: 0,
                productos: 0,
                total: 0,
                detalle: []
            };
        }

        grupos[vendedor].pedidos++;

        grupos[vendedor].unidades += toNumber(x.CantidadUnidadesVendidas);
        grupos[vendedor].productos += toNumber(x.CantidadProductos); // ✔ FIX NaN
        grupos[vendedor].total += toNumber(x.Total || x.TotalVenta || x["Total Venta"]);

        grupos[vendedor].detalle.push(x);
    });

    // =========================
    // RESUMEN
    // =========================
    var resumen = [];
    var totalPedidos = 0, totalUnidades = 0, totalProductos = 0, totalVenta = 0;

    Object.values(grupos).forEach(g => {

        resumen.push({
            "Vendedor": g.vendedor,
            "Pedidos": g.pedidos,
            "Unidades": g.unidades,
            "Productos": g.productos,
            "Total Venta": g.total
        });

        totalPedidos += g.pedidos;
        totalUnidades += g.unidades;
        totalProductos += g.productos;
        totalVenta += g.total;
    });

    resumen.push({
        "Vendedor": "TOTAL GENERAL",
        "Pedidos": totalPedidos,
        "Unidades": totalUnidades,
        "Productos": totalProductos,
        "Total Venta": totalVenta
    });

    // =========================
    // DETALLE
    // =========================
    var detalle = [];

    Object.values(grupos).forEach(g => {

        detalle.push({
            "Vendedor": ">>> " + g.vendedor,
            "Fecha": "",
            "Documento": "",
            "Cliente": "",
            "Unidades": "",
            "Productos": "",
            "Total": "",
            "Referencia": ""
        });

        g.detalle.forEach(x => {

            detalle.push({
                "Vendedor": g.vendedor,
                "Fecha": x.Fecha,
                "Documento": x.NumeroDocumento,
                "Cliente": x.NombreTienda,
                "Unidades": toNumber(x.CantidadUnidadesVendidas),
                "Productos": toNumber(x.CantidadProductos),
                "Total": toNumber(x.Total || x.TotalVenta),
                "Referencia": x.DocumentoReferencia || ""
            });
        });

        detalle.push({
            "Vendedor": "TOTAL " + g.vendedor,
            "Fecha": "",
            "Documento": "",
            "Cliente": "",
            "Unidades": g.unidades,
            "Productos": g.productos,
            "Total": g.total,
            "Referencia": ""
        });

        detalle.push({});
    });

    // =========================
    // EXCEL
    // =========================
    var wb = XLSX.utils.book_new();

    var wsResumen = XLSX.utils.json_to_sheet(resumen);
    var wsDetalle = XLSX.utils.json_to_sheet(detalle);

    // =========================
    // 🎨 ESTILO RESUMEN (COLORES)
    // =========================
    var range = XLSX.utils.decode_range(wsResumen['!ref']);

    for (var R = 0; R <= range.e.r; R++) {

        for (var C = 0; C <= range.e.c; C++) {

            var cell = wsResumen[XLSX.utils.encode_cell({ r: R, c: C })];
            if (!cell) continue;

            // HEADER
            if (R === 0) {
                cell.s = {
                    fill: { fgColor: { rgb: "1F4E79" } },
                    font: { color: { rgb: "FFFFFF" }, bold: true },
                    alignment: { horizontal: "center" }
                };
            }

            // TOTAL GENERAL
            if (cell.v && cell.v.toString().includes("TOTAL GENERAL")) {
                cell.s = {
                    fill: { fgColor: { rgb: "FFD966" } },
                    font: { bold: true }
                };
            }
        }
    }

    // =========================
    // COLUMNAS
    // =========================
    wsResumen['!cols'] = [
        { wch: 25 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 }
    ];

    wsDetalle['!cols'] = [
        { wch: 18 },
        { wch: 12 },
        { wch: 18 },
        { wch: 25 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");
    XLSX.utils.book_append_sheet(wb, wsDetalle, "Detalle");

    XLSX.writeFile(wb, "Reporte_Pedidos_Pro.xlsx");
}