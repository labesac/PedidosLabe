
var tabladata;
var tablatienda;
var tablaproducto;


$(document).ready(function () {
    activarMenu("Compras");

    ////validamos el formulario
    $("#form").validate({
        rules: {
            Nombre: "required",
            Descripcion: "required"
        },
        messages: {
            Nombre: "(*)",
            Descripcion: "(*)"

        },
        errorElement: 'span'
    });


    tablatienda = $('#tbTienda').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerTiendas,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            {
                "data": "IdTienda", "render": function (data, type, row, meta) {
                    return "<button class='btn btn-sm btn-primary ml-2' type='button' onclick='tiendaSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>" 
                },
                "orderable": false,
                "searchable": false,
                "width": "90px"
            },
            { "data": "RUC" },
            { "data": "Nombre" },
            { "data": "Direccion" }

        ],
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        },
        responsive: true
    });

    //tablaproducto = $('#tbProducto').DataTable({
    //    "ajax": {
    //        "url": $.MisUrls.url._ObtenerProductosPorAsignar,
    //        "type": "GET",
    //        "datatype": "json",
    //        "data": function (d) {
    //            d.IdTienda = parseInt($("#txtIdTienda").val()) || 0;
    //        }
    //    },
    //    "columns": [
    //        {
    //            "data": "IdProducto", "render": function (data, type, row, meta) {
    //                return "<button class='btn btn-sm btn-primary ml-2' type='button' onclick='productoSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>"
    //            },
    //            "orderable": false,
    //            "searchable": false,
    //            "width": "90px"
    //        },
    //        { "data": "Codigo" },
    //        { "data": "Nombre" },
    //        { "data": "Descripcion" },
    //        {
    //            "data": "oCategoria", render: function (data) {
    //                return data.Descripcion
    //            }
    //        }
    //    ],
    //    "language": {
    //        "url": $.MisUrls.url.Url_datatable_spanish
    //    },
    //    responsive: true
    //});

    tablaproducto = $('#tbProducto').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerProductosPorAsignar,
            "type": "GET",
            "datatype": "json",
            "data": function (d) {
                d.IdTienda = parseInt($("#txtIdTienda").val()) || 0;
            }
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row) {

                    return `
                    <div class="card border-0 shadow-sm mb-2 rounded-3">
                        <div class="card-body p-3">

                            <div class="d-flex justify-content-between">

                                <!-- IZQUIERDA -->
                                <div class="flex-grow-1 pe-3">

                                    <div class="fw-bold text-primary mb-1">
                                        ${data.Codigo}
                                    </div>

                                    <div class="fw-semibold mb-1">
                                        ${data.Nombre}
                                    </div>

                                    <div class="text-muted small mb-1">
                                        <i class="fas fa-align-left"></i>
                                        ${data.Descripcion || '-'}
                                    </div>

                                    <div class="text-muted small">
                                        <i class="fas fa-tags"></i>
                                        ${data.oCategoria?.Descripcion || '-'}
                                    </div>

                                </div>

                                <!-- DERECHA -->
                                <div class="d-flex flex-column align-items-end justify-content-center">

                                    <button class='btn btn-primary btn-sm'
                                            type='button'
                                            onclick='productoSelect(${JSON.stringify(row)})'>
                                        <i class='fas fa-check'></i>
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>
                `;
                }
            }
        ],
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        },
        "paging": true,
        "pageLength": 10,
        "lengthChange": false,
        "info": true,
        "searching": true,
        "ordering": false,
        "responsive": true
    });

    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerAsignaciones, 
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "oTienda", render: function (data) { return data.Nombre   } },
            { "data": "oTienda", render: function (data) { return data.RUC   } },
            { "data": "oProducto", render: function (data) { return data.Codigo   } },
            { "data": "oProducto", render: function (data) { return data.Nombre   } },
            { "data": "Stock" },
            {
                "data": "IdProductoTienda", "render": function (data, type, row, meta) {
                    return  "<button class='btn btn-danger btn-sm ml-2' type='button' onclick='eliminar(" + data + ")'><i class='fa fa-trash'></i></button>"
                },
                "orderable": false,
                "searchable": false,
                "width": "80px"
            }

        ],
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        },
        responsive: true
    });

})

$("#form").validate({
    rules: {

        Cantidad: {
            required: true,
            digits: true, // solo enteros
            min: 1
        },

        Precio: {
            required: true,
            number: true, // permite decimales
            min: 0.01
        }
    },

    messages: {

        Cantidad: {
            required: "(*)",
            digits: "Solo números enteros",
            min: "Debe ser mayor a 0"
        },

        Precio: {
            required: "(*)",
            number: "Ingrese un precio válido",
            min: "El precio debe ser mayor a 0"
        }
    },

    errorElement: 'span'
});

$("#txtCodigo").on('keypress', function (e) {

    if (e.which == 13) {
        
        //OBTENER PRODUCTOS
        jQuery.ajax({
            url: $.MisUrls.url._ObtenerProductos,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $("#txtCodigo").LoadingOverlay("hide");
                var encontrado = false;
                if (data.data != null) {
                    $.each(data.data, function (i, item) {
                        if (item.Activo == true && item.Codigo == $("#txtCodigo").val()) {

                            $("#txtIdProducto").val(item.IdProducto);
                            $("#txtCodigo").val(item.Codigo);
                            $("#txtNombre").val(item.Nombre);
                            $("#txtDescripcion").val(item.Descripcion);

                            encontrado = true;
                            return false;
                        }
                    })

                    if (!encontrado) {
                        $("#txtIdProducto").val("0");
                        $("#txtNombre").val("");
                        $("#txtDescripcion").val("");
                    }
                }

            },
            error: function (error) {
                console.log(error)
            },
            beforeSend: function () {
                $("#txtCodigo").LoadingOverlay("show");
            },
        });


    }
});

function buscarTienda() {
    tablatienda.ajax.reload();
    $('#modalTienda').modal('show');
}

function buscarProducto(){
    tablaproducto.ajax.reload();
    $('#modalProducto').modal('show');
}

function tiendaSelect(json) {
    $("#txtIdTienda").val(json.IdTienda);
    $("#txtRuc").val(json.RUC);
    $("#txtRazonSocial").val(json.Nombre);
    $("#txtDireccion").val(json.Direccion);

    $('#modalTienda').modal('hide');
}

function productoSelect(json) {
    $("#txtIdProducto").val(json.IdProducto);
    $("#txtCodigo").val(json.Codigo);
    $("#txtNombre").val(json.Nombre);
    $("#txtDescripcion").val(json.Descripcion);

    $('#modalProducto').modal('hide');
}

function asignarProducto() {

    var camposvacios = false;

    if ($("#txtIdTienda").val() == "0" || $("#txtIdProducto").val() == "0")
        camposvacios = true;

    if (!camposvacios) {

        var request = {
            objeto: {
                oProducto: { IdProducto: parseInt($("#txtIdProducto").val()) },
                oTienda: { IdTienda: parseInt($("#txtIdTienda").val()) },
                Stock: parseInt($("#txtCantidad").val()),
                PrecioUnidadVenta: parseFloat($("#txtPrecio").val()),
            }
        }

        jQuery.ajax({
            url: $.MisUrls.url._RegistrarProductoTienda,
            type: "POST",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                if (data.resultado) {
                    tabladata.ajax.reload();
                    $("#txtIdProducto").val("0");
                    $("#txtCodigo").val("");
                    $("#txtNombre").val("");
                    $("#txtDescripcion").val("");
                    $("#txtCantidad").val("0");
                    $("#txtPrecio").val("0");
                } else {

                    swal("Mensaje", "No se pudo registrar la asignación", "warning")
                }
            },
            error: function (error) {
                console.log(error)
            },
            beforeSend: function () {

            },
        });

    } else {
        swal("Mensaje!", "Es necesario completar todos los campos", "warning")
    }


}

function eliminar($id) {

    swal({
        title: "Mensaje",
        text: "¿Desea eliminar la asignación?",
        type: "warning",
        showCancelButton: true,

        confirmButtonText: "Si",
        confirmButtonColor: "#DD6B55",

        cancelButtonText: "No",

        closeOnConfirm: true
    },

        function () {
            jQuery.ajax({
                url: $.MisUrls.url._EliminarProductoTienda + "?id=" + $id,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    if (data.resultado) {
                        tabladata.ajax.reload();
                    } else {
                        swal("Mensaje", "No se pudo eliminar la asignación?", "warning")
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