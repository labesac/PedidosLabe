
var tabladata;

$(document).ready(function () {
    activarMenu("Producto");

    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerAsignaciones,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "oTienda", render: function (data) { return data.Nombre   } },
            { "data": "oProducto", render: function (data) { return data.Codigo } },
            { "data": "oProducto", render: function (data) { return data.Nombre } },
            { "data": "Stock" },
            { "data": "PrecioUnidadVenta" },
            {
                "data": null,
                "render": function (data) {

                    return `
                            <button class='btn btn-info btn-sm ml-2'
                                    type='button'
                                    onclick='editar(${JSON.stringify(data)})'>

                                <i class='fa fa-edit'></i>
                            </button>
                        `;
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

function editar(data) {
    $("#txtIdProductoTienda").val(data.IdProductoTienda);
    $("#txtNombreProducto").val(data.oProducto.Nombre);
    $("#txtPrecioUnidadVenta").val(data.PrecioUnidadVenta);

    $("#modalEditarPrecio").modal("show");
}

function GuardarPrecio() {

    let request = {
        IdProductoTienda: $("#txtIdProductoTienda").val(),
        PrecioUnidadVenta: $("#txtPrecioUnidadVenta").val()
    };

    $.ajax({
        url: $.MisUrls.url._ActualizarPrecioGeneral,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(request),
        success: function (response) {

            if (response.resultado) {

                $("#modalEditarPrecio").modal("hide");

                tabladata.ajax.reload();

                swal("Mensaje", "Precio actualizado", "success");
            }
            else {

                swal("Mensaje", response.mensaje, "warning");
            }
        }
    });
}
