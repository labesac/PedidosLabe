var tabladata;

$(document).ready(function () {

    activarMenu("Inventario");

    // FECHAS
    $("#txtFechaInicio").datepicker({
        dateFormat: 'dd/mm/yy'
    }).datepicker('setDate', new Date());

    $("#txtFechaFin").datepicker({
        dateFormat: 'dd/mm/yy'
    }).datepicker('setDate', new Date());

    // OBTENER TIENDAS
    jQuery.ajax({
        url: $.MisUrls.url._ObtenerTiendas,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            $("#cboTienda").LoadingOverlay("hide");
            $("#cboTienda").html("");

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
    tabladata = $("#tbdata").DataTable({
        responsive: true,
        ordering: false,
        destroy: true,
        searching: false,
        paging: true,
        info: true,
        columns: [
            {
                "data": "oProducto", render: function (data) {
                    return data.Nombre
                }
            },
            { data: "TipoMovimiento" },
            { data: "Documento" },
            {
                data: "Entrada",
                render: function (data) {
                    return parseFloat(data).toFixed(2);
                }
            },
            {
                data: "Salida",
                render: function (data) {
                    return parseFloat(data).toFixed(2);
                }
            },
            {
                data: "SaldoAnterior",
                render: function (data) {
                    return parseFloat(data).toFixed(2);
                }
            },
            {
                data: "SaldoActual",
                render: function (data) {
                    return parseFloat(data).toFixed(2);
                }
            },
            {
                data: "Precio",
                render: function (data) {
                    return "S/ " + parseFloat(data).toFixed(2);
                }
            },
            {data: "Fecha"}
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        }
    });

});

$("#btnBuscar").on("click", function () {

    let request = {
        IdTienda: $("#cboTienda").val(),
        Codigo: $("#txtCodigoProducto").val(),
        fechainicio: $("#txtFechaInicio").val(),
        fechafin: $("#txtFechaFin").val()
    };

    $.ajax({
        url: $.MisUrls.url._ObtenerProductoKardex,
        type: "GET",
        data: request,
        dataType: "json",
        success: function (response) {

            tabladata.clear().draw();

            if (response.data != null) {

                tabladata.rows.add(response.data).draw();
            }
        },
        error: function (error) {
            console.log(error);
        },
        beforeSend: function () {
            $("#card-lista").LoadingOverlay("show");
        },
        complete: function () {
            $("#card-lista").LoadingOverlay("hide");
        }
    });

});