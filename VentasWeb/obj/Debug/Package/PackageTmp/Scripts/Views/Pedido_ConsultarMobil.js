var tabladata;

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

    $("#txtFechaInicio").datepicker();
    $("#txtFechaFin").datepicker();

    $("#txtFechaInicio").val(ObtenerFecha());
    $("#txtFechaFin").val(ObtenerFecha());

    cargarVentas();

});


// =========================================
// CARGAR VENTAS
// =========================================

function cargarVentas() {

    $("#contenedorVentas").html(`

        <div class="col-12 text-center py-5">

            <div class="spinner-border text-primary"></div>

            <div class="mt-2 text-muted">
                Cargando pedidos...
            </div>

        </div>

    `);

    $.ajax({

        url: $.MisUrls.url._ObtenerPedidos + "?" +
            "codigo=" + $("#txtCodigoVenta").val().trim() +
            "&fechainicio=" + $("#txtFechaInicio").val().trim() +
            "&fechafin=" + $("#txtFechaFin").val().trim() +
            "&numerodocumento=" + $("#txtDocumentoCliente").val().trim() +
            "&nombres=" + $("#txtNombreCliente").val().trim(),

        type: "GET",
        datatype: "json",

        success: function (response) {

            renderVentas(response.data);

        },

        error: function (xhr) {

            console.log(xhr.responseText);

            $("#contenedorVentas").html(`

                <div class="col-12">

                    <div class="alert alert-danger text-center">

                        Error al cargar pedidos

                    </div>

                </div>

            `);

        }

    });

}


// =========================================
// RENDER TARJETAS
// =========================================

/*
function renderVentas(lista) {

    let html = "";

    if (lista == null || lista.length == 0) {

        html = `

        <div class="col-12">

            <div class="card shadow-sm border-0">

                <div class="card-body text-center py-4">

                    <i class="fas fa-inbox fa-2x text-muted mb-2"></i>

                    <div class="font-weight-bold">
                        No se encontraron pedidos
                    </div>

                </div>

            </div>

        </div>

        `;

        $("#contenedorVentas").html(html);

        return;
    }

    $.each(lista, function (i, item) {

        let estadoClass = "estado-entregado";

        if (item.Estado == "Pendiente") {
            estadoClass = "estado-pendiente";
        }
        else if (item.Estado == "Facturado") {
            estadoClass = "estado-facturado";
        }
        else if (item.Estado == "Anulado") {
            estadoClass = "estado-anulado";
        }

        html += `

        <div class="col-md-6 col-lg-4 mb-3">

            <div class="card pedido-card h-100">

                <div class="card-body p-3">

                    <div class="d-flex justify-content-between align-items-start">

                        <div>

                            <div class="pedido-codigo">

                                ${item.Codigo}

                            </div>

                            <div class="pedido-fecha">

                                ${item.FechaRegistro}

                            </div>

                        </div>

                        <span class="pedido-estado ${estadoClass}">

                            ${item.Estado}

                        </span>

                    </div>

                    <div class="pedido-cliente mt-3">

                        <div class="cliente-nombre text-truncate">

                            ${item.oCliente.Nombre}

                        </div>

                        <div class="cliente-documento text-truncate">

                            ${item.oCliente.NumeroDocumento}

                        </div>

                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3">

                        <div>

                            <div class="pedido-label">

                                Total

                            </div>

                            <div class="pedido-total">

                                S./ ${parseFloat(item.TotalCosto).toFixed(2)}

                            </div>

                        </div>

                        <button class="btn btn-sm btn-detalle"
                                onclick="Imprimir(${item.IdPedido})">

                            <i class="fas fa-eye mr-1"></i>
                            Ver

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;
    });

    $("#contenedorVentas").html(html);
}
*/
function renderVentas(lista) {

    let html = "";

    if (lista == null || lista.length == 0) {

        html = `

        <div class="col-12">

            <div class="card shadow-sm border-0">

                <div class="card-body text-center py-4">

                    <i class="fas fa-inbox fa-2x text-muted mb-2"></i>

                    <div class="font-weight-bold">
                        No se encontraron pedidos
                    </div>

                </div>

            </div>

        </div>

        `;

        $("#contenedorVentas").html(html);

        return;
    }

    $.each(lista, function (i, item) {

        let estadoClass = "estado-entregado";

        if (item.Estado == "Pendiente") {
            estadoClass = "estado-pendiente";
        }
        else if (item.Estado == "Facturado") {
            estadoClass = "estado-facturado";
        }
        else if (item.Estado == "Anulado") {
            estadoClass = "estado-anulado";
        }

        html += `

        <div class="col-md-6 col-lg-4 mb-3">

            <div class="card pedido-card h-100">

                <div class="card-body p-3">

                    <div class="d-flex justify-content-between align-items-start">

                        <div>

                            <div class="pedido-codigo">

                                ${item.Codigo}

                            </div>

                            <div class="pedido-fecha">

                                ${item.FechaRegistro}

                            </div>

                        </div>

                        <span class="pedido-estado ${estadoClass}">

                            ${item.Estado}

                        </span>

                    </div>

                    <div class="pedido-cliente mt-3">

                        <div class="cliente-nombre text-truncate">

                            ${item.oCliente.Nombre}

                        </div>

                        <div class="cliente-documento text-truncate">

                            ${item.oCliente.NumeroDocumento}

                        </div>

                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3">

                        <div>

                            <div class="pedido-label">

                                Total

                            </div>

                            <div class="pedido-total">

                                S./ ${parseFloat(item.TotalCosto).toFixed(2)}

                            </div>

                        </div>

                        <div class="d-flex gap-2">

                            <button class="btn btn-sm btn-detalle"
                                    onclick="Imprimir(${item.IdPedido})">

                                <i class="fas fa-eye mr-1"></i>
                                Ver

                            </button>

                            <button class="btn btn-sm btn-success"
                                    onclick='AbrirModalVenta(${JSON.stringify(item)})'
                                    ${item.Estado == "Pendiente" ? "" : "disabled"}>

                                <i class="fas fa-file-alt mr-1"></i>
                                Generar

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        `;
    });

    $("#contenedorVentas").html(html);
}

// =========================================
// BUSCAR
// =========================================

function buscar() {

    if ($("#txtFechaInicio").val().trim() == "" ||
        $("#txtFechaFin").val().trim() == "") {

        swal("Mensaje", "Debe ingresar fechas", "warning");
        return;
    }

    cargarVentas();
}


// =========================================
// NUEVO PEDIDO
// =========================================

function nuevoPedido() {

    window.location.href = '/Pedido/CrearMobil';

}


// =========================================
// OBTENER FECHA
// =========================================

function ObtenerFecha() {

    var d = new Date();

    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output =
        (('' + day).length < 2 ? '0' : '') + day + '/' +
        (('' + month).length < 2 ? '0' : '') + month + '/' +
        d.getFullYear();

    return output;

}


// =========================================
// IMPRIMIR
// =========================================

function Imprimir(id) {

    var url = $.MisUrls.url._DocumentoPedido + "?IdPedido=" + id;

    window.open(url);

}

function AbrirModalVenta(item) {

    $("#txtIdPedidoVenta").val(item.IdPedido);
    $("#lblTipoDocumento").text(item.TipoDocumento);
    $("#lblCodigoPedido").text(item.Codigo);

    $("#lblClientePedido").text(
        item.oCliente.NumeroDocumento + " - " + item.oCliente.Nombre
    );

    $("#lblSubtotalPedido").text("S./ " + item.Total);
    $("#lblDescuentoPedido").text("S./ " + item.Descuento);
    $("#lblTotalPedido").text("S./ " + item.TotalCosto);
    $("#modalGenerarVenta").modal("show");
}

function GenerarVentaPedido() {

    let request = {
        TipoDocumento: $("#cboTipoDocumentoVenta").val(),
        MetodoPago: $("#cboMetodoPago").val(),
        IdPedido: $("#txtIdPedidoVenta").val()
    };

    $.ajax({
        url: $.MisUrls.url._GenerarVentaPedido,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(request),
        success: function (response) {

            if (response.resultado > 0) {

                swal("Venta Generada", "Venta se registró correctamente.", "success");
                setTimeout(function () {
                    location.reload();
                }, 500);
                var url = $.MisUrls.url._DocumentoVenta + "?IdVenta=" + response.resultado;
                window.open(url);

                $("#modalGenerarVenta").modal("hide");
                buscar();
            }
            else {

                swal(
                    "Mensaje",
                    response.mensaje,
                    "warning"
                );
            }
        },
        error: function () {

            swal(
                "Mensaje",
                "Error al generar venta",
                "error"
            );
        }
    });

}