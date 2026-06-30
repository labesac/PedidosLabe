
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


    tabladata = $('#tbVentas').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerPedidos + "?codigo=&fechainicio=" + ObtenerFecha() + "&fechafin=" + ObtenerFecha() + "&numerodocumento=&nombres=",
            "type": "GET",
            "datatype": "json"
        },
        "order": [],
        "columns": [

            { "data": "Codigo" },
            {
                "data": "Estado",
                render: function (data, type, row) {

                    let badge = '';
                    if (data == "Pendiente") {

                        badge = `<span class="badge-pendiente">
                                        Pendiente
                                    </span>`;
                    }
                    else if (data == "Facturado") {
                        badge = `<span class="badge-facturado">
                                        Facturado
                                    </span>`;
                    }
                    else if (data == "Anulado") {
                        badge = `<span class="badge-anulado">
                                    Anulado
                                </span>`;
                    }
                    else if (data == "Despachado") {
                        badge = `<span class="badge-despachado">
                                    Despachado
                                </span>`;
                    }
                    else {
                        badge = `<span class="badge-entregado">
                                        Entregado
                                    </span>`;
                    }

                    return badge;
                }
            },
            {
                "data": "oCliente", render: function (data) {
                    return data.NumeroDocumento
                }
            },
            {
                "data": "oCliente", render: function (data) {
                    return data.Nombre
                }
            },
            { "data": "FechaRegistro" },
            {
                "data": "TotalCosto", render: function (data) {

                    return "S./ " + (data).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                }
            },

            {
                "data": null,
                render: function (data) {

                    let btnGenerarVenta = '';
                    let btnAnular = '';
                    let btnDespachar = '';

                    if (data.Estado == "Pendiente") {

                        btnGenerarVenta = `
                <button class='btn btn-primary btn-sm ml-1'
                        type='button'
                        onclick='AbrirModalVenta(${JSON.stringify(data)})'>

                    <i class='fas fa-cash-register'></i> Generar
                </button>
            `;

                        btnAnular = `
                <button class='btn btn-danger btn-sm ml-1'
                        type='button'
                        onclick='AnularPedido(${data.IdPedido})'>

                    <i class='fas fa-times-circle'></i> Anular
                </button>
            `;
                        btnDespachar = `
                <button class='btn btn-secondary btn-sm ml-1'
                        type='button'
                        disabled>

                    <i class='fas fa-times-circle'></i> Despachar
                </button>
            `;
                    }
                    else if (data.Estado == "Despachado" || data.Estado == "Anulado") {

                        btnGenerarVenta = `
                <button class='btn btn-secondary btn-sm ml-1'
                        type='button'
                        disabled>

                    <i class='fas fa-lock'></i> Generar
                </button>
            `;

                        btnAnular = `
                <button class='btn btn-secondary btn-sm ml-1'
                        type='button'
                        disabled>

                    <i class='fas fa-ban'></i> Anular
                </button>
            `;
                        btnDespachar = `
                <button class='btn btn-secondary btn-sm ml-1'
                        type='button'
                        disabled>

                    <i class='fas fa-times-circle'></i> Despachar
                </button>
            `;
                    }
                    else {

                        btnGenerarVenta = `
                <button class='btn btn-secondary btn-sm ml-1'
                        type='button'
                        disabled>

                    <i class='fas fa-lock'></i> Generar
                </button>
            `;

                        btnAnular = `
                <button class='btn btn-secondary btn-sm ml-1'
                        type='button'
                        disabled>

                    <i class='fas fa-ban'></i> Anular
                </button>
            `;
                        btnDespachar = `
                <button class='btn btn-warning btn-sm ml-1'
                        type='button'
                        onclick='DespacharPedido(${data.IdPedido})'>

                    <i class='fas fa-times-circle'></i> Despachar
                </button>
            `;
                    }

                    return `

            <button class='btn btn-success btn-sm ml-1'
                    type='button'
                    onclick='Imprimir(${data.IdPedido})'>

                <i class='far fa-clipboard'></i> Ver
            </button>

            ${btnGenerarVenta}
            ${btnAnular}
            ${btnDespachar}
        `;
                }
            }

        ],
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        },
        responsive: true,
    });

});

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
function buscar() {

    if ($("#txtFechaInicio").val().trim() == "" || $("#txtFechaFin").val().trim() == "") {
        swal("Mensaje", "Debe ingresar fechas", "warning")
        return;
    }

    tabladata.ajax.url($.MisUrls.url._ObtenerPedidos + "?" +
        "codigo=" + $("#txtCodigoVenta").val().trim() +
        "&fechainicio=" + $("#txtFechaInicio").val().trim() +
        "&fechafin=" + $("#txtFechaFin").val().trim() +
        "&numerodocumento=" + $("#txtDocumentoCliente").val() +
        "&nombres=" + $("#txtNombreCliente").val()).load();
}
function ObtenerFecha() {

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (('' + day).length < 2 ? '0' : '') + day + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + d.getFullYear();

    return output;
}
function Imprimir(id) {

    var url = $.MisUrls.url._DocumentoPedido + "?IdPedido=" + id;
    window.open(url);

}
function DespacharPedido($id) {

    swal({
        title: "Mensaje",
        text: "¿Desea Despachar el Pedido Seleccionado?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        confirmButtonColor: "#DD6B55",
        cancelButtonText: "No",
        closeOnConfirm: true
    },

        function () {
            jQuery.ajax({
                url: $.MisUrls.url._DespacharPedido + "?id=" + $id,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    if (data.resultado) {
                        tabladata.ajax.reload();
                    } else {
                        swal("Mensaje", "No se pudo procesar Pedido", "warning")
                    }
                },
                error: function (error) {
                    console.log(error)
                },
                beforeSend: function () {

                },
            });
        });

}
function AnularPedido($id) {

    swal({
        title: "Mensaje",
        text: "¿Desea Anular el Pedido Seleccionado?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        confirmButtonColor: "#DD6B55",
        cancelButtonText: "No",
        closeOnConfirm: true
    },

        function () {
            jQuery.ajax({
                url: $.MisUrls.url._AnularPedido + "?id=" + $id,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    if (data.resultado) {
                        tabladata.ajax.reload();
                    } else {
                        swal("Mensaje", "No se pudo Anular", "warning")
                    }
                },
                error: function (error) {
                    console.log(error)
                },
                beforeSend: function () {

                },
            });
        });

}