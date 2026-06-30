var tablaproducto;
var tablacliente;


$(document).ready(function () {

    activarMenu("Ventas");
    $("#txtproductocantidad").val("0");
    $("#txtfechaventa").val(ObtenerFecha());


    //OBTENER PROVEEDORES
    jQuery.ajax({
        url: $.MisUrls.url._ObtenerUsuarioVenta,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            //TIENDA
            $("#txtIdTienda").val(data.oTienda.IdTienda);
            $("#lbltiendanombre").text(data.oTienda.Nombre);
            $("#lbltiendaruc").text(data.oTienda.RUC);
            $("#lbltiendadireccion").text(data.oTienda.Direccion);

            //USUARIO
            $("#txtIdUsuario").val(data.IdUsuario);
            $("#lblempleadonombre").text(data.Nombres);
            $("#lblempleadoapellido").text(data.Apellidos);
            $("#lblempleadocorreo").text(data.Correo);
        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
            $("#cboProveedor").LoadingOverlay("show");
        },
    });

    //OBTENER PRODUCTOS
    initTabla();

    //tablacliente = $('#tbcliente').DataTable({
    //    "ajax": {
    //        "url": $.MisUrls.url._ObtenerClientes,
    //        "type": "GET",
    //        "datatype": "json"
    //    },
    //    "columns": [
    //        {
    //            "data": "IdCliente", "render": function (data, type, row, meta) {
    //                return "<button class='btn btn-sm btn-primary ml-2' type='button' onclick='clienteSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>"
    //            },
    //            "orderable": false,
    //            "searchable": false,
    //            "width": "90px"
    //        },
    //        { "data": "TipoDocumento" },
    //        { "data": "NumeroDocumento" },
    //        { "data": "Nombre" },
    //        { "data": "Direccion" }
    //    ],
    //    "language": {
    //        "url": $.MisUrls.url.Url_datatable_spanish
    //    },
    //    responsive: true
    //});
    abrirClientes();

})

function abrirClientes() {

    $("#contenedorClientes").html("");

    $.ajax({

        url: $.MisUrls.url._ObtenerClientes,
        type: "GET",

        success: function (response) {

            renderClientes(response.data);

            // BUSCADOR
            $("#txtBuscarCliente")
                .off("keyup")
                .on("keyup", function () {

                    let texto = $(this).val().toLowerCase();

                    let filtrados = response.data.filter(x =>

                        (x.Nombre || '').toLowerCase().includes(texto) ||
                        (x.NumeroDocumento || '').toLowerCase().includes(texto) ||
                        (x.Direccion || '').toLowerCase().includes(texto)

                    );

                    renderClientes(filtrados);

                });

        },

        error: function (xhr) {

            console.log(xhr.responseText);

        }

    });

}
function renderClientes(lista) {

    let html = "";

    $.each(lista, function (i, item) {

        html += `

        <div class="col-md-6 mb-3">

            <div class="card shadow-sm border-0 rounded-lg tarjeta-direccion">

                <div class="card-body p-3">

                    <div class="d-flex justify-content-between align-items-start">

                        <div>

                            <div class="font-weight-bold text-dark">

                                <i class="fas fa-user text-primary mr-1"></i>

                                ${item.Nombre}

                            </div>

                            <div class="text-muted small mt-1">

                                ${item.Direccion || '-'}

                            </div>

                        </div>

                        <button class="btn btn-primary btn-sm"
                                onclick='clienteSelect(${JSON.stringify(item)})'>

                            <i class="fas fa-check"></i>

                        </button>

                    </div>

                    <hr class="my-2"/>

                    <div class="row text-center">

                        <div class="col-4">

                            <div class="text-muted"
                                 style="font-size:11px">

                                Documento

                            </div>

                            <div class="small font-weight-bold">

                                ${item.NumeroDocumento || '-'}

                            </div>

                        </div>

                        <div class="col-4">

                            <div class="text-muted"
                                 style="font-size:11px">

                                Tipo

                            </div>

                            <div class="small font-weight-bold">

                                ${item.TipoDocumento || '-'}

                            </div>

                        </div>

                        <div class="col-4">

                            <div class="text-muted"
                                 style="font-size:11px">

                                Teléfono

                            </div>

                            <div class="small font-weight-bold">

                                ${item.Telefono || '-'}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        `;
    });

    $("#contenedorClientes").html(html);

}

var tablaproducto;
function initTabla() {

    tablaproducto = $('#tbProducto').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerProductoStockPorTiendaCatalogo,
            "type": "GET",
            "datatype": "json",
            "data": function (d) {
                d.IdTienda = 0;
                d.usarPaquete = $('#chkpreciopaquete').is(':checked') ? 1 : 0;
            }
        },
        "columns": [
            {
                "data": "IdProductoTienda",
                "render": function (data, type, row) {
                    return "<button class='btn btn-sm btn-primary ml-2' type='button' onclick='productoSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>";
                },
                "orderable": false,
                "searchable": false,
                "width": "90px"
            },
            {
                "data": "oProducto",
                "render": d => d.Codigo
            },
            {
                "data": "oProducto",
                "render": d => d.Nombre
            },
            {
                "data": "Stock"
            },
            {
                "data": null,
                "render": function (data, type, row) {
                    var usarPaquete = $('#chkpreciopaquete').is(':checked');
                    return usarPaquete
                        ? row.PrecioPaqueteVenta
                        : row.PrecioUnidadVenta;
                }
            }
        ],
        "responsive": true,
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        }
    });
}

function cargarProductos() {
    tablaproducto.ajax.reload(null, false);
}

$('#chkpreciopaquete').on('change', function () {
    cargarProductos();
});

function ObtenerFecha() {

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (('' + day).length < 2 ? '0' : '') + day + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + d.getFullYear();

    return output;
}


$.fn.inputFilter = function (inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
        if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
            this.value = "";
        }
    });
};

$("#txtproductocantidad").inputFilter(function (value) {
    return /^-?\d*$/.test(value);
});

$("#txtmontopago").inputFilter(function (value) {
    return /^-?\d*[.]?\d{0,2}$/.test(value);
});

$('#btnBuscarProducto').on('click', function () {

  
    tablaproducto.ajax.url($.MisUrls.url._ObtenerProductoStockPorTienda + "?IdTienda=" + parseInt($("#txtIdTienda").val()) ).load();

    $('#modalProducto').modal('show');
})

$('#btnBuscarCliente').on('click', function () {

    //tablacliente.ajax.reload();
    //$('#modalCliente').modal('show');

    abrirClientes();
    $('#modalCliente').modal('show');

})

function productoSelect(json) {
    $("#txtIdProducto").val(json.oProducto.IdProducto);
    $("#txtproductocodigo").val(json.oProducto.Codigo);
    $("#txtproductonombre").val(json.oProducto.Nombre);
    $("#txtproductodescripcion").val(json.oProducto.Descripcion);
    $("#txtproductostock").val(json.Stock);
    /*$("#txtproductoprecio").val(json.PrecioUnidadVenta);*/
    var usarPaquete = $('#chkpreciopaquete').is(':checked');
    $("#txtproductoprecio").val(
        usarPaquete ? json.PrecioPaqueteVenta : json.PrecioUnidadVenta
    );
    $("#txtproductocantidad").val("0");
    $('#modalProducto').modal('hide');
}

function clienteSelect(json) {

    $("#cboclientetipodocumento").val(json.TipoDocumento);
    $("#txtclientedocumento").val(json.NumeroDocumento);
    $("#txtclientenombres").val(json.Nombre);
    $("#txtclientedireccion").val(json.Direccion);
    $("#txtclientetelefono").val(json.Telefono);
    $('#modalCliente').modal('hide');
}

$("#txtproductocodigo").on('keypress', function (e) {


    if (e.which == 13) {

        var request = { IdTienda: parseInt($("#txtIdTienda").val()) }


        //OBTENER PROVEEDORES
        jQuery.ajax({
            url: $.MisUrls.url._ObtenerProductoStockPorTienda + "?IdTienda=" + parseInt($("#txtIdTienda").val()),
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                var encontrado = false;
                if (data.data != null) {
                    $.each(data.data, function (i, item) {
                        if (item.oProducto.Codigo == $("#txtproductocodigo").val()) {

                            $("#txtIdProducto").val(item.oProducto.IdProducto);
                            $("#txtproductocodigo").val(item.oProducto.Codigo);
                            $("#txtproductonombre").val(item.oProducto.Nombre);
                            $("#txtproductodescripcion").val(item.oProducto.Descripcion);
                            $("#txtproductostock").val(item.Stock);
                            $("#txtproductoprecio").val(item.PrecioUnidadVenta);
                            encontrado = true;
                            return false;
                        }
                    })

                    if (!encontrado) {

                        $("#txtIdProducto").val("0");
                        $("#txtproductocodigo").val("");
                        $("#txtproductonombre").val("");
                        $("#txtproductodescripcion").val("");
                        $("#txtproductostock").val("");
                        $("#txtproductoprecio").val("");
                        $("#txtproductocantidad").val("0");

                    }
                }

            },
            error: function (error) {
                console.log(error)
            },
            beforeSend: function () {
                $("#cboProveedor").LoadingOverlay("show");
            },
        });



    }
});


$('#btnAgregar').on('click', function () {

    $("#txtproductocantidad").val($("#txtproductocantidad").val() == "" ? "0" : $("#txtproductocantidad").val());

    var existe_codigo = false;
    if (
        parseInt($("#txtIdProducto").val()) == 0 ||
        parseFloat($("#txtproductocantidad").val()) == 0
    ) {
        swal("Mensaje", "Debe completar todos los campos del producto", "warning")
        return;
    }

    $('#tbVenta > tbody  > tr').each(function (index, tr) {
        var fila = tr;
        var idproducto = $(fila).find("td.producto").data("idproducto");

        if (idproducto == $("#txtIdProducto").val()) {
            existe_codigo = true;
            return false;
        }

    });

    if (!existe_codigo) {

        var importetotal =
            parseFloat($("#txtproductoprecio").val()) *
            parseFloat($("#txtproductocantidad").val());

        $("<tr>").append(

            $("<td>")
                .attr("data-label", "Acción")
                .append(
                    $("<button>")
                        .addClass("btn btn-danger btn-sm btn-eliminar")
                        .html('<i class="fa fa-trash"></i>')
                        .data("idproducto", parseInt($("#txtIdProducto").val()))
                        .data("cantidadproducto", parseInt($("#txtproductocantidad").val()))
                ),

            $("<td>")
                .attr("data-label", "Cantidad")
                .append(
                    $("<input>")
                        .attr({
                            type: "number",
                            min: "1"
                        })
                        .addClass("form-control form-control-sm txtcantidad")
                        .css({
                            width: "80px",
                            "text-align": "center"
                        })
                        .val($("#txtproductocantidad").val())
                ),

            $("<td>")
                .attr("data-label", "Producto")
                .addClass("producto")
                .data("idproducto", $("#txtIdProducto").val())
                .text($("#txtproductonombre").val()),

            $("<td>")
                .attr("data-label", "Precio")
                .addClass("precio-unitario")
                .text($("#txtproductoprecio").val()),

            $("<td>")
                .attr("data-label", "Importe")
                .addClass("importetotal")
                .text(importetotal.toFixed(2))

        ).appendTo("#tbVenta tbody");

        $("#txtIdProducto").val("0");
        $("#txtproductocodigo").val("");
        $("#txtproductonombre").val("");
        $("#txtproductodescripcion").val("");
        $("#txtproductostock").val("");
        $("#txtproductoprecio").val("");
        $("#txtproductocantidad").val("0");

        $("#txtproductocodigo").focus();
    } else {
        swal("Mensaje", "El producto ya existe en la Venta", "warning")
    }
})

$('#tbVenta tbody').on('click', 'button[class="btn btn-danger btn-sm"]', function () {
    var idproducto = $(this).data("idproducto");
    var cantidadproducto = $(this).data("cantidadproducto");

    controlarStock(idproducto, parseInt($("#txtIdTienda").val()), cantidadproducto, false);
    $(this).parents("tr").remove();
})

$('#btnTerminarGuardarVenta').on('click', function () {

    //VALIDACIONES DE CLIENTE
    if ($("#txtclientedocumento").val().trim() == "" || $("#txtclientenombres").val().trim() == "") {
        swal("Mensaje", "Complete los datos del cliente", "warning");
        return;
    }
    //VALIDACIONES DE PRODUCTOS
    if ($('#tbVenta tbody tr').length == 0) {
        swal("Mensaje", "Debe registrar minimo un producto en la venta", "warning");
        return;
    }

    //VALIDACIONES DE MONTO PAGO
    if ($("#txtmontopago").val().trim() == "") {
        swal("Mensaje", "Ingrese el monto de pago", "warning");
        return;
    }

    var montoPago =
        parseFloat($("#txtmontopago").val()) || 0;

    var totalVenta =
        parseFloat($("#txttotal").val()) || 0;

    if (montoPago < totalVenta) {

        swal("Mensaje", "El monto de pago no puede ser menor al total de la venta", "warning");
        $("#txtmontopago").focus();
        return;
    }

    var $totalproductos = 0;
    var $totalimportes = 0;

    var DETALLE = "";
    var VENTA = "";
    var DETALLE_CLIENTE = "";
    var DETALLE_VENTA = "";
    var DATOS_VENTA = "";

    $('#tbVenta > tbody  > tr').each(function (index, tr) {
        var fila = tr;
        //var productocantidad = parseInt($(fila).find("td.productocantidad").text());
        //var idproducto = $(fila).find("td.producto").data("idproducto");
        //var productoprecio = parseFloat($(fila).find("td.productoprecio").text());
        //var importetotal = parseFloat($(fila).find("td.importetotal").text());
        var productocantidad = parseInt($(fila).find("td .txtcantidad").val()) || 0;
        var idproducto = $(fila).find("td.producto").data("idproducto");
        var productoprecio = parseFloat($(fila).find("td.precio-unitario").text());
        var importetotal = parseFloat($(fila).find("td.importetotal").text());

        $totalproductos = $totalproductos + productocantidad;
        $totalimportes = $totalimportes + importetotal;

        DATOS_VENTA = DATOS_VENTA + "<DATOS>" +
            "<IdVenta>0</IdVenta >" +
            "<IdProducto>" + idproducto + "</IdProducto>" +
            "<Cantidad>" + productocantidad + "</Cantidad>" +
            "<PrecioUnidad>" + productoprecio + "</PrecioUnidad>" +
            "<ImporteTotal>" + importetotal + "</ImporteTotal>" +
            "</DATOS>"
    });


    VENTA = "<VENTA>" +
        "<IdTienda>" + $("#txtIdTienda").val() + "</IdTienda>" +
        "<IdUsuario>" + $("#txtIdUsuario").val() + "</IdUsuario>" +
        "<IdCliente>0</IdCliente>" +
        "<TipoDocumento>" + $("#cboventatipodocumento").val() + "</TipoDocumento>" +
        "<CantidadProducto>" + $('#tbVenta tbody tr').length + "</CantidadProducto>" +
        "<CantidadTotal>" + $totalproductos + "</CantidadTotal>" +
        "<TotalCosto>" + $totalimportes + "</TotalCosto>" +
        "<ImporteRecibido>" + $("#txtmontopago").val() + "</ImporteRecibido>" +
        "<ImporteCambio>" + $("#txtcambio").val() + "</ImporteCambio>" +
        "<Descuentoporcentaje>" + $("#txtdescuentoporcentaje").val() + "</Descuentoporcentaje>" +
        "<Descuentomonto>" + $("#txtdescuentomonto").val() + "</Descuentomonto>" +
        "<MetodoPago>" + $("#cboMetodoPago").val() + "</MetodoPago>" +
        "</VENTA >";

    DETALLE_CLIENTE = "<DETALLE_CLIENTE><DATOS>" +
        "<TipoDocumento>" + $("#cboclientetipodocumento").val() + "</TipoDocumento>" +
        "<NumeroDocumento>" + $("#txtclientedocumento").val() + "</NumeroDocumento>" +
        "<Nombre>" + $("#txtclientenombres").val() + "</Nombre>" +
        "<Direccion>" + $("#txtclientedireccion").val() + "</Direccion>" +
        "<Telefono>" + $("#txtclientetelefono").val() + "</Telefono>" +
        "</DATOS></DETALLE_CLIENTE>";

    DETALLE_VENTA = "<DETALLE_VENTA>" + DATOS_VENTA + "</DETALLE_VENTA>";

    DETALLE = "<DETALLE>" + VENTA + DETALLE_CLIENTE + DETALLE_VENTA + "</DETALLE>"


    var request = { xml: DETALLE };

    jQuery.ajax({
        url: $.MisUrls.url._RegistrarVenta,
        type: "POST",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            $(".card-venta").LoadingOverlay("hide");

            if (data.estado) {
                //DOCUMENTO
                $("#cboventatipodocumento").val("Nota de Venta");

                //CLIENTE
                $("#cboclientetipodocumento").val("DNI");
                $("#txtclientedocumento").val("");
                $("#txtclientenombres").val("");
                $("#txtclientedireccion").val("");
                $("#txtclientetelefono").val("");


                //PRODUCTO
                $("#txtIdProducto").val("0");
                $("#txtproductocodigo").val("");
                $("#txtproductonombre").val("");
                $("#txtproductodescripcion").val("");
                $("#txtproductostock").val("");
                $("#txtproductoprecio").val("");
                $("#txtproductocantidad").val("0");

                //PRECIOS
                $("#txtsubtotal").val("0");
                $("#txtigv").val("0");
                $("#txttotal").val("0");
                $("#txtmontopago").val("");
                $("#txtcambio").val("");
                $("#tbVenta tbody").html("");

                swal("Venta Generada", "Venta se registró correctamente.", "success");
                var url = $.MisUrls.url._DocumentoVenta + "?IdVenta=" + data.valor; window.open(url);
                setTimeout(function () { location.reload(); }, 500);

            } else {
                swal("Mensaje", "No se pudo registrar la venta", "warning")
            }
        },
        error: function (error) {
            console.log(error)
            $(".card-venta").LoadingOverlay("hide");
        },
        beforeSend: function () {
            $(".card-venta").LoadingOverlay("show");
        }
    });

   

})
function controlarStock($idproducto, $idtienda, $cantidad, $restar) {
    var request = {
        idproducto: $idproducto,
        idtienda: $idtienda,
        cantidad: $cantidad,
        restar: $restar
    }


    jQuery.ajax({
        url: $.MisUrls.url._ControlarStockProducto,
        type: "POST",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
           
        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
        },
    });

  
}

window.onbeforeunload = function () {
    if ($('#tbVenta tbody tr').length > 0) {

        $('#tbVenta > tbody  > tr').each(function (index, tr) {
            var fila = tr;
            var productocantidad = parseInt($(fila).find("td.productocantidad").text());
            var idproducto = $(fila).find("td.producto").data("idproducto");

            controlarStock(parseInt(idproducto), parseInt($("#txtIdTienda").val()), parseInt(productocantidad), false);
        });
    }
};
