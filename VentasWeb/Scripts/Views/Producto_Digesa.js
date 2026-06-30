var tabla;

$(document).ready(function () {
    activarMenu("Producto");
    //tabladata = $('#tbdata').DataTable({
    //    "ajax": {
    //        "url": $.MisUrls.url._ObtenerResolucionProductosDigesa,
    //        "type": "GET",
    //        "datatype": "json"
    //    },
    //    "order": [[1, "asc"]],
    //    "columns": [

    //         PRODUCTO
    //        {
    //            "data": "Producto"
    //        },

    //         GRUPO DIGESA
    //        {
    //            "data": "GrupoDigesa"
    //        },

    //         RESOLUCION
    //        {
    //            "data": "NumeroResolucion",
    //            render: function (data) {

    //                if (data == null || data == "")
    //                    return '<span class="badge bg-secondary">SIN RESOLUCION</span>';

    //                return data;
    //            }
    //        },

    //         FECHA INICIO
    //        {
    //            "data": "sFechaInicio"
    //        },

    //         FECHA VENCIMIENTO
    //        {
    //            "data": "sFechaVencimiento"
    //        },

    //         ESTADO
    //        {
    //            "data": "EstadoResolucion",
    //            render: function (data) {

    //                if (data == "VIGENTE") {

    //                    return '<span class="badge bg-success">VIGENTE</span>';
    //                }

    //                if (data == "VENCIDO") {

    //                    return '<span class="badge bg-danger">VENCIDO</span>';
    //                }

    //                if (data == "POR VENCER") {

    //                    return '<span class="badge bg-warning text-dark">POR VENCER</span>';
    //                }

    //                return '<span class="badge bg-secondary">SIN RESOLUCION</span>';
    //            }
    //        },

    //         TIEMPO RESTANTE
    //        {
    //            "data": "TiempoRestante",
    //            render: function (data, type, row) {

    //                if (row.EstadoResolucion == "SIN RESOLUCION")
    //                    return '';

    //                if (row.EstadoResolucion == "VENCIDO") {

    //                    return '<span class="text-danger fw-bold">' + data + '</span>';
    //                }

    //                return '<span class="text-success fw-bold">' + data + '</span>';
    //            }
    //        }

    //    ],
    //    "language": {
    //        "url": $.MisUrls.url.Url_datatable_spanish
    //    },
    //    responsive: true
    //});

    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerResolucionProductosDigesa,
            "type": "GET",
            "datatype": "json"
        },

        "order": [[0, "asc"]],

        "columns": [
            {
                "data": null,
                render: function (data, type, row) {

                    let badgeEstado = '<span class="badge bg-secondary">SIN RESOLUCIÓN</span>';

                    if (row.EstadoResolucion == "VIGENTE") {
                        badgeEstado = '<span class="badge bg-success">VIGENTE</span>';
                    }

                    if (row.EstadoResolucion == "VENCIDO") {
                        badgeEstado = '<span class="badge bg-danger">VENCIDO</span>';
                    }

                    if (row.EstadoResolucion == "POR VENCER") {
                        badgeEstado = '<span class="badge bg-warning text-dark">POR VENCER</span>';
                    }

                    let resolucion = row.NumeroResolucion;

                    if (!resolucion) {
                        resolucion = '<span class="badge bg-secondary">SIN RESOLUCIÓN</span>';
                    }

                    let tiempo = '-';

                    if (row.EstadoResolucion != "SIN RESOLUCION") {

                        if (row.EstadoResolucion == "VENCIDO") {

                            tiempo = `
                            <span class="text-danger fw-bold">
                                ${row.TiempoRestante}
                            </span>
                        `;
                        }
                        else {

                            tiempo = `
                            <span class="text-success fw-bold">
                                ${row.TiempoRestante}
                            </span>
                        `;
                        }
                    }

                    return `
                    <div class="card shadow-sm border-0">

                        <div class="card-body p-2">

                            <div class="d-flex justify-content-between align-items-start">

                                <div style="max-width:75%;">
                                    
                                    <div class="fw-bold text-primary">
                                        ${row.Producto}
                                    </div>

                                    <small class="text-muted">
                                        ${row.GrupoDigesa}
                                    </small>

                                </div>

                                <div>
                                    ${badgeEstado}
                                </div>

                            </div>

                            <hr class="my-1">

                            <div class="row g-1 small">

                                <div class="col-md-4">
                                    <div class="text-muted">Resolución</div>
                                    ${resolucion}
                                </div>

                                <div class="col-md-3">
                                    <div class="text-muted">Inicio</div>
                                    ${row.sFechaInicio || '-'}
                                </div>

                                <div class="col-md-3">
                                    <div class="text-muted">Vence</div>
                                    ${row.sFechaVencimiento || '-'}
                                </div>

                                <div class="col-md-2">
                                    <div class="text-muted">Tiempo</div>
                                    ${tiempo}
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

        responsive: true,

        "pageLength": 10
    });

});
