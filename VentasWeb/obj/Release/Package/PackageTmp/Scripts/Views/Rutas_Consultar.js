$(document).ready(function () {

    activarMenu("Rutas");

    listarRutas();

});


// ==========================================
// LISTAR RUTAS
// ==========================================

function listarRutas() {

    $("#contenedorRutas").html("");

    $.ajax({

        url: $.MisUrls.url._ObtenerRutas,
        type: "GET",

        success: function (response) {

            let html = "";

            $.each(response.data, function (i, item) {

                let clasePrioridad = "badge-light";
                let iconPrioridad = "fa-layer-group";

                if (item.prioridad == "Alta") {
                    clasePrioridad = "badge-danger";
                    iconPrioridad = "fa-arrow-up";
                }

                if (item.prioridad == "Media") {
                    clasePrioridad = "badge-warning";
                    iconPrioridad = "fa-minus";
                }

                if (item.prioridad == "Baja") {
                    clasePrioridad = "badge-success";
                    iconPrioridad = "fa-arrow-down";
                }

                html += `

                <div class="col-md-6 col-lg-4 mb-3">

                    <div class="card border-0 shadow-sm rounded-lg ruta-card">

                        <div class="card-body p-3">

                            <!-- HEADER -->

                            <div class="d-flex justify-content-between align-items-start">

                                <div>

                                    <div class="font-weight-bold text-dark"
                                         style="font-size:15px;">

                                        ${item.Nombre}

                                    </div>

                                    <div class="small text-muted mt-1">

                                        ${item.Codigo}
                                        &nbsp;•&nbsp;
                                        ${item.fechaTexto}

                                    </div>

                                </div>

                                <span class="badge badge-pill 
                                             ${item.Estado ? 'badge-success' : 'badge-secondary'}">

                                    ${item.Estado ? 'Activo' : 'Inactivo'}

                                </span>

                            </div>

                            <!-- INFO -->

                            <div class="mt-3 small">

                                <div class="mb-2">

                                    <i class="fas fa-user text-primary mr-1"></i>

                                    ${item.vendedor}

                                </div>

                                <div>

                                    <i class="fas fa-map-marker-alt text-danger mr-1"></i>

                                    ${item.zona}

                                </div>

                            </div>

                            <!-- FOOTER -->

                            <div class="mt-3 d-flex justify-content-between align-items-center">

                                <span class="badge ${clasePrioridad} px-2 py-1">

                                    <i class="fas ${iconPrioridad} mr-1"></i>

                                    ${item.prioridad}

                                </span>

                                <div class="btn-group btn-group-sm">

                                    <button class="btn btn-outline-primary"
                                            onclick="verDetalleRuta(${item.idRuta})">

                                        <i class="fas fa-eye"></i>
                                        Ver
                                    </button>

                                    <button class="btn btn-outline-danger"
                                            onclick="anularRuta(${item.idRuta})">

                                        <i class="fas fa-times"></i>
                                        Anular
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                `;
            });

            $("#contenedorRutas").html(html);

        }

    });

}

// ==========================================
// VER DETALLE
// ==========================================
function verDetalleRuta(idRuta) {

    $("#contenedorDetalleRuta").html("");

    $.ajax({

        url: $.MisUrls.url._ObtenerDetalleRuta,
        type: "GET",
        data: {
            idRuta: idRuta
        },

        success: function (response) {

            let html = "";

            $.each(response.data, function (i, item) {

                let colorEstado = "secondary";

                if (item.Estado == "Programado") {
                    colorEstado = "primary";
                }

                if (item.Estado == "Visitado") {
                    colorEstado = "success";
                }

                if (item.Estado == "Pendiente") {
                    colorEstado = "warning";
                }

                if (item.Estado == "Cancelado" ||
                    item.Estado == "Anulado") {

                    colorEstado = "danger";
                }

                html += `

                <div class="col-md-12 mb-3">

                    <div class="card border-0 shadow-sm rounded-lg">

                        <div class="card-body p-3">

                            <!-- HEADER -->

                            <div class="d-flex justify-content-between align-items-start">

                                <div class="d-flex">

                                    <div class="mr-3">

                                        <div class="bg-primary text-white rounded-circle 
                                                    d-flex align-items-center justify-content-center"
                                             style="width:45px;height:45px;font-weight:bold;">

                                            ${item.Orden}

                                        </div>

                                    </div>

                                    <div>

                                        <div class="font-weight-bold text-dark">

                                            ${item.Nombre}

                                        </div>

                                        <div class="small text-muted mt-1">

                                            <i class="fas fa-map-marker-alt text-danger mr-1"></i>

                                            ${item.Direccion || '-'}

                                        </div>

                                    </div>

                                </div>

                                <span class="badge badge-${colorEstado} px-3 py-2">

                                    ${item.Estado}

                                </span>

                            </div>

                            <hr class="my-3"/>

                            <!-- INFO -->

                            <div class="row mt-2">

                                <div class="col-md-8">

                                    <div class="d-flex flex-wrap align-items-center small">

                                        <div class="mr-3 mb-1">

                                            <span class="text-muted">Doc:</span>

                                            <span class="font-weight-bold">

                                                ${item.TipoDocumento}
                                                -
                                                ${item.NumeroDocumento}

                                            </span>

                                        </div>

                                        <div class="mr-3 mb-1">

                                            <span class="text-muted">Tel:</span>

                                            <span class="font-weight-bold">

                                                ${item.Telefono || '-'}

                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <!-- BOTÓN SOLO SI PROGRAMADO -->

                                <div class="col-md-4 text-right">

                                    ${item.Estado == "Programado"
                        ? `
                                            <button class="btn btn-success btn-sm rounded-pill"
                                                    onclick="generarPedido(${item.IdCliente})">

                                                <i class="fas fa-cart-plus mr-1"></i>

                                                Pedido

                                            </button>
                                        `
                        : ''
                    }

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                `;
            });

            $("#contenedorDetalleRuta").html(html);

            $("#modalDetalleRuta").modal("show");

        }

    });

}

// ==========================================
// ANULAR RUTA
// ==========================================
function anularRuta(idRuta) {

    if (!confirm("¿Desea anular la ruta?")) {
        return;
    }

    $.ajax({

        url: $.MisUrls.url._AnularRuta,
        type: "POST",

        data: {
            idRuta: idRuta
        },

        success: function (response) {

            if (response.resultado) {

                alert("✅ Ruta anulada");

                listarRutas();

            } else {

                alert(response.mensaje);

            }

        }

    });

}

function generarPedido(idCliente) {

    window.location.href =
        $.MisUrls.url._PedidoCrearMobil + "?idCliente=" + idCliente;

}