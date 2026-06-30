var tablaproducto;
var tablacliente;


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

    activarMenu("Pedidos");
    $("#txtproductocantidad").val("0");
    $("#txtfechaPedido").val(ObtenerFecha());
    $("#txtfechaEntrega").datepicker({ minDate: 0 });
    $("#txtfechaEntrega").val(ObtenerFecha());

    //OBTENER PROVEEDORES
    jQuery.ajax({
        url: $.MisUrls.url._ObtenerUsuarioPedido,
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
    initTablaProductos();

    tablacliente = $('#tbcliente').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerClientes,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            {
                "data": "IdCliente", "render": function (data, type, row, meta) {
                    return "<button class='btn btn-sm btn-primary ml-2' type='button' onclick='clienteSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>"
                },
                "orderable": false,
                "searchable": false,
                "width": "90px"
            },
            { "data": "Nombre" },
            { "data": "TipoDocumento" },
            { "data": "NumeroDocumento" },
            { "data": "Direccion" }
        ],
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        },
        responsive: true
    });

    //DESDE RUTA
    let params = new URLSearchParams(window.location.search);
    let idCliente = params.get("idCliente");

    if (idCliente !== null && idCliente !== "") {

        cargarClienteDesdeRuta(idCliente);
        abrirDataDirecciones(idCliente);
    }

})

function cargarClienteDesdeRuta(idCliente) {

    $.ajax({

        url: $.MisUrls.url._ObtenerClientes,
        type: "GET",

        success: function (response) {

            let cliente = response.data.find(x => x.IdCliente == idCliente);

            if (cliente != null) {

                $("#txtclientedocumento").val(cliente.NumeroDocumento);
                $("#txtclientenombres").val(cliente.Nombre);

                // si usas estos campos ocultos
                $("#cboclientetipodocumento").val(cliente.TipoDocumento);

                // 👉 IMPORTANTE: guardar ID cliente
                $("#txtCliente").val(cliente.Nombre);
                $("#txtIdCliente").val(cliente.IdCliente);

            }

        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }

    });   

}

function abrirDataDirecciones(id) {

    $.ajax({
        url: $.MisUrls.url._ObtenerClienteDireccion,
        type: "GET",
        data: {
            idCliente: id
        },
        success: function (response) {

            let options = '';

            $.each(response.data, function (i, item) {

                options += `
                    <option 
                        value="${item.IdClienteDireccion}"
                        data-direccion="${item.Direccion}"
                        data-encargado="${item.Encargado || ''}"
                        data-telefono="${item.Telefono || ''}"
                        data-email="${item.Email || ''}"
                        data-latitud="${item.Latitud || ''}"
                        data-longitud="${item.Longitud || ''}"
                    >
                        ${item.Nombre} - ${item.Direccion}
                    </option>
                `;
            });

            $("#cboDireccion").html(options);

            if (response.data.length > 0) {
                $("#cboDireccion").val(response.data[0].IdClienteDireccion);
            }

        },
        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

$("#cboDireccion").change(function () {

    let option = $(this).find("option:selected");

    let direccion = option.data("direccion");
    let encargado = option.data("encargado");
    let telefono = option.data("telefono");
    let email = option.data("email");
    let latitud = option.data("latitud");
    let longitud = option.data("longitud");

    console.log(direccion);
});

var tablaproducto;
function initTablaProductos() {

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
                    return "<button class='btn btn-sm btn-primary ml-2' type='button' onclick='productoSelect(" + JSON.stringify(row).replace(/\"/g, "&quot;") + ")'><i class='fas fa-check'></i></button>";
                },
                "orderable": false,
                "searchable": false,
                "width": "90px"
            },
            {
                "data": "oProducto",
                "render": d => d.Nombre
            },
            {
                "data": null,
                "render": function (data, type, row) {

                    var usarPaquete = $('#chkpreciopaquete').is(':checked');

                    return usarPaquete
                        ? row.PrecioPaqueteVenta
                        : row.PrecioUnidadVenta;
                }
            },
            {
                "data": "oProducto",
                "render": d => d.Codigo
            },
            {
                "data": "Stock"
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

$('#btnBuscarProducto').on('click', function () {

  
    tablaproducto.ajax.url($.MisUrls.url._ObtenerProductoStockPorTienda + "?IdTienda=" + parseInt($("#txtIdTienda").val()) ).load();

    $('#modalProducto').modal('show');
})

$('#btnBuscarCliente').on('click', function () {

    tablacliente.ajax.reload();

    $('#modalCliente').modal('show');
})

$("#chkpreciopaquete").on("change", function () {

    if ($("#txtIdProducto").val() == "0")
        return;

    $("#txtproductocodigo").trigger($.Event("keypress", {
        which: 13
    }));

});

function productoSelect(json) {
    $("#txtIdProducto").val(json.oProducto.IdProducto);
    $("#txtproductocodigo").val(json.oProducto.Codigo);
    $("#txtproductonombre").val(json.oProducto.Nombre);
    $("#txtproductodescripcion").val(json.oProducto.Descripcion);
    $("#txtproductostock").val(json.Stock);
    /*$("#txtproductoprecio").val(json.PrecioUnidadVenta);*/
    let precio = $("#chkpreciopaquete").is(":checked")
        ? json.PrecioPaqueteVenta
        : json.PrecioUnidadVenta;
    $("#txtproductoprecio").val(precio);
    $("#txtproductocantidad").val("0");
    $('#modalProducto').modal('hide');
}

function clienteSelect(json) {

    $("#cboclientetipodocumento").val(json.TipoDocumento);
    $("#txtclientedocumento").val(json.NumeroDocumento);
    $("#txtclientenombres").val(json.Nombre);
    $("#txtclientedireccion").val(json.Direccion);
    $("#txtclientetelefono").val(json.Telefono);

    abrirDataDirecciones(json.IdCliente);

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
                            //$("#txtproductoprecio").val(item.PrecioUnidadVenta);
                            let precio = $("#chkpreciopaquete").is(":checked")
                                ? item.PrecioPaqueteVenta
                                : item.PrecioUnidadVenta;
                            $("#txtproductoprecio").val(precio);
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

    $('#tbPedido > tbody  > tr').each(function (index, tr) {
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
                .addClass("productoprecio")
                .text($("#txtproductoprecio").val()),

            $("<td>")
                .attr("data-label", "Importe")
                .addClass("importetotal")
                .text(importetotal.toFixed(2))

        ).appendTo("#tbPedido tbody");

        $("#txtIdProducto").val("0");
        $("#txtproductocodigo").val("");
        $("#txtproductonombre").val("");
        $("#txtproductodescripcion").val("");
        $("#txtproductostock").val("");
        $("#txtproductoprecio").val("");
        $("#txtproductocantidad").val("0");

        $("#txtproductocodigo").focus();
    } else {
        swal("Mensaje", "El producto ya existe en el Pedido", "warning")
    }
})

$('#tbPedido tbody').on('click', 'button[class="btn btn-danger btn-sm"]', function () {
    var idproducto = $(this).data("idproducto");
    var cantidadproducto = $(this).data("cantidadproducto");
    $(this).parents("tr").remove();

})
function retornarListado() {
    window.location.href = '/Pedido/ConsultarMobil';
}

// =========================================
// GEOLOCALIZA INICIO
// =========================================

let map;
let marker;
let latitudSeleccionada = 0;
let longitudSeleccionada = 0;

// =========================================
// GEOLOCALIZA FIN
// =========================================

$("#btnTerminarGuardarPedido").on("click", function (e) {
    //VALIDACIONES DE CLIENTE
    if ($("#txtclientedocumento").val().trim() == "" || $("#txtclientenombres").val().trim() == "") {
        swal("Mensaje", "Complete los datos del cliente", "warning");
        return;
    }
    //VALIDACIONES DE PRODUCTOS
    if ($('#tbPedido tbody tr').length == 0) {
        swal("Mensaje", "Debe registrar minimo un producto en el Pedido", "warning");
        return;
    }

    $("#txtCliente").val($("#txtclientenombres").val());
    $("#txtContacto").val($("#txtclientenombres").val());
    $("#txtTelefono").val($("#txtclientetelefono").val());
    //$("#cboDireccion").val($("#txtclientedireccion").val());
    $("#txtObservacion").val("");
    $("#mdprocesopedido").modal("show");
})

$('#btnConfirmarPedido').on('click', function () {

    //VALIDACIONES DE CLIENTE
    if ($("#txtclientedocumento").val().trim() == "" || $("#txtclientenombres").val().trim() == "") {
        swal("Mensaje", "Complete los datos del cliente", "warning");
        return;
    }
    //VALIDACIONES DE PRODUCTOS
    if ($('#tbPedido tbody tr').length == 0) {
        swal("Mensaje", "Debe registrar minimo un producto en el Pedido", "warning");
        return;
    }

    var $totalproductos = 0;
    var $totalimportes = 0;

    var DETALLE = "";
    var PEDIDO = "";
    var DETALLE_CLIENTE = "";
    var DETALLE_PEDIDO = "";
    var DATOS_PEDIDO = "";

    let txt_fechaEntrega = $("#txtfechaEntrega").val().split('/');
    let txt_fechaEntrega_sql = txt_fechaEntrega[2] + '-' + txt_fechaEntrega[1] + '-' + txt_fechaEntrega[0];


    $('#tbPedido > tbody  > tr').each(function (index, tr) {
        var fila = tr;
        var productocantidad = parseInt($(fila).find("td .txtcantidad").val()) || 0;
        var idproducto = $(fila).find("td.producto").data("idproducto");
        var productoprecio = parseFloat($(fila).find("td.productoprecio").text());
        var importetotal = parseFloat($(fila).find("td.importetotal").text());

        $totalproductos = $totalproductos + productocantidad;
        $totalimportes = $totalimportes + importetotal;

        DATOS_PEDIDO = DATOS_PEDIDO + "<DATOS>" +
            "<IdPedido>0</IdPedido >" +
            "<IdProducto>" + idproducto + "</IdProducto>" +
            "<Cantidad>" + productocantidad + "</Cantidad>" +
            "<PrecioUnidad>" + productoprecio + "</PrecioUnidad>" +
            "<ImporteTotal>" + importetotal + "</ImporteTotal>" +
            "</DATOS>"
    });

    let optionDireccion = $("#cboDireccion option:selected");
    let direccionSeleccionada = optionDireccion.data("direccion");
    let idDireccion = optionDireccion.val();

    PEDIDO = "<PEDIDO>" +
        "<IdTienda>" + $("#txtIdTienda").val() + "</IdTienda>" +
        "<IdUsuario>" + $("#txtIdUsuario").val() + "</IdUsuario>" +
        "<IdCliente>0</IdCliente>" +
        "<TipoDocumento>" + $("#cboPedidotipodocumento").val() + "</TipoDocumento>" +
        "<CantidadProducto>" + $('#tbPedido tbody tr').length + "</CantidadProducto>" +
        "<CantidadTotal>" + $totalproductos + "</CantidadTotal>" +
        "<TotalCosto>" + $totalimportes + "</TotalCosto>" +
        "<ImporteRecibido>" + 0 + "</ImporteRecibido>" +
        "<ImporteCambio>" + 0 + "</ImporteCambio>" +
        "<Descuentoporcentaje>" + $("#txtdescuentoporcentaje").val() + "</Descuentoporcentaje>" +
        "<Descuentoimporte>" + $("#txtdescuentoimporte").val() + "</Descuentoimporte>" +
        "<Latitud>" + latitudSeleccionada + "</Latitud>" +
        "<Longitud>" + longitudSeleccionada + "</Longitud>" +
        "<FechaEntrega>" + txt_fechaEntrega_sql + "</FechaEntrega>" +
        "<Contacto>" + $("#txtContacto").val() + "</Contacto>" +
        "<Telefono>" + $("#txtTelefono").val() + "</Telefono>" +
        "<Direccion>" + direccionSeleccionada + "</Direccion>" +
        "<IdDireccion>" + idDireccion + "</IdDireccion>" +
        "<Observacion>" + $("#txtObservacion").val() + "</Observacion>" +
        "</PEDIDO >";

    DETALLE_CLIENTE = "<DETALLE_CLIENTE><DATOS>" +
        "<TipoDocumento>" + $("#cboclientetipodocumento").val() + "</TipoDocumento>" +
        "<NumeroDocumento>" + $("#txtclientedocumento").val() + "</NumeroDocumento>" +
        "<Nombre>" + $("#txtclientenombres").val() + "</Nombre>" +
        "<Direccion>" + $("#txtclientedireccion").val() + "</Direccion>" +
        "<Telefono>" + $("#txtclientetelefono").val() + "</Telefono>" +
        "</DATOS></DETALLE_CLIENTE>";

    DETALLE_PEDIDO = "<DETALLE_PEDIDO>" + DATOS_PEDIDO + "</DETALLE_PEDIDO>";

    DETALLE = "<DETALLE>" + PEDIDO + DETALLE_CLIENTE + DETALLE_PEDIDO + "</DETALLE>"


    var request = { xml: DETALLE };

    jQuery.ajax({
        url: $.MisUrls.url._GuardarPedido,
        type: "POST",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            $(".card-pedido").LoadingOverlay("hide");

            if (data.estado) {
                //DOCUMENTO
                $("#cboPedidotipodocumento").val("Pedido");

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
                $("#lbltotal").text("0.00");
                $("#txttotal").val("0");
                $("#txtdescuentoporcentaje").val("0");
                $("#txtdescuentoimporte").val("0");
                $("#tbPedido tbody").html("");
           
                alert("✅ Pedido registrado correctamente.");
                var url = $.MisUrls.url._DocumentoPedido + "?IdPedido=" + data.valor; window.open(url);

                window.location.href = '/Pedido/ConsultarMobil';

            } else {
                swal("Mensaje", "No se pudo registrar el Pedido", "warning")
            }
        },
        error: function (error) {
            console.log(error)
            $(".card-pedido").LoadingOverlay("hide");
        },
        beforeSend: function () {
            $(".card-pedido").LoadingOverlay("show");
        }
    });

   

})

window.onbeforeunload = function () {
    if ($('#tbPedido tbody tr').length > 0) {

        $('#tbPedido > tbody  > tr').each(function (index, tr) {
            var fila = tr;
            var productocantidad = parseInt($(fila).find("td.productocantidad").text());
            var idproducto = $(fila).find("td.producto").data("idproducto");

        });
    }
};
