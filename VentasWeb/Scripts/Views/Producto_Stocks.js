var tabladata;

$(document).ready(function () {

    activarMenu("Inventario");

    // OBTENER TIENDAS
    jQuery.ajax({
        url: $.MisUrls.url._ObtenerTiendas,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            $("#cboTienda").LoadingOverlay("hide");
            $("#cboTienda").html("");

            //$("<option>").attr({ "value": 0 })
            //    .text("-- Seleccionar todas --")
            //    .appendTo("#cboTienda");

            if (data.data != null) {

                $.each(data.data, function (i, item) {

                    if (item.Activo == true) {

                        $("<option>")
                            .attr({ "value": item.IdTienda })
                            .text(item.Nombre)
                            .appendTo("#cboTienda");
                    }
                });
            }
        },
        error: function (error) {
            console.log(error);
        },
        beforeSend: function () {
            $("#cboTienda").LoadingOverlay("show");
        }
    });

    // DATATABLE
    //tabladata = $('#tbdata').DataTable({
    //    "ajax": {
    //        "url": $.MisUrls.url._ObtenerProductoStockPorTiendaCodigo,
    //        "type": "GET",
    //        "datatype": "json",
    //        "data": function (d) {
    //            d.idtienda = $("#cboTienda").val() || 0;
    //            d.codigoproducto = $("#txtCodigoProducto").val() || "";
    //        }
    //    },
    //    "columns": [
    //        {
    //            "data": "oTienda",
    //            render: function (data) {
    //                return data.Nombre;
    //            }
    //        },
    //        {
    //            "data": "oProducto",
    //            render: function (data) {
    //                return data.Codigo;
    //            }
    //        },
    //        {
    //            "data": "oProducto",
    //            render: function (data) {
    //                return data.Nombre;
    //            }
    //        },
    //        { "data": "Stock" }
    //    ],
    //    "language": {
    //        "url": $.MisUrls.url.Url_datatable_spanish
    //    },
    //    responsive: true
    //});

    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerProductoStockPorTiendaCodigo,
            "type": "GET",
            "datatype": "json",
            "data": function (d) {

                d.idtienda = $("#cboTienda").val() || 0;
                d.codigoproducto = $("#txtCodigoProducto").val() || "";

            }
        },
        "columns": [
            {
                "data": null,
                "render": function (data) {

                    let badgeStock = data.Stock > 0
                        ? `<span class="badge bg-success">Stock: ${data.Stock}</span>`
                        : `<span class="badge bg-danger">Sin Stock</span>`;

                    return `
                    <div class="card border-0 shadow-sm mb-2 rounded-3">
                        <div class="card-body p-2">

                            <div class="d-flex justify-content-between align-items-start">

                                <div>

                                    <div class="fw-bold text-primary small">
                                        ${data.oProducto.Codigo}
                                    </div>

                                    <div class="fw-semibold">
                                        ${data.oProducto.Nombre}
                                    </div>

                                    <div class="text-muted small">
                                        <i class="fas fa-store"></i>
                                        ${data.oTienda.Nombre}
                                    </div>

                                </div>

                                <div class="text-end">
                                    ${badgeStock}
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
        "paging": false,
        "info": false,
        "searching": false,
        "ordering": false,
        "responsive": true
    });

});

$("#btnBuscar").on("click", function () {

    tabladata.ajax.reload();

});