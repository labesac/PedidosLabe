var detalleRuta = [];

$(document).ready(function () {

    activarMenu("Rutas");

    $("#txtFecha").val(new Date().toISOString().split('T')[0]);

    cargarVendedores();
});


// =========================
// ABRIR MODAL
// =========================

$("#btnAgregarCliente").on("click", function () {

    abrirClientes();

    $("#modalCliente").modal("show");

});


// =========================
// LISTAR CLIENTES
// =========================

function abrirClientes() {

    $("#contenedorClientes").html("");

    $.ajax({

        url: $.MisUrls.url._ObtenerClientes,
        type: "GET",

        success: function (response) {

            renderClientes(response.data);

            // BUSCADOR
            $("#txtBuscarCliente").off("keyup").on("keyup", function () {

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

        let existe = detalleRuta.some(x => x.IdCliente == item.IdCliente);

        html += `

        <div class="col-md-6 mb-3">

            <div class="card shadow-sm border-0 rounded-lg tarjeta-direccion
                        ${existe ? 'bg-light border-success' : ''}">

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

                        ${existe
                ?
                `
                                <button class="btn btn-success btn-sm" disabled>

                                    <i class="fas fa-check-circle"></i>
                                    Agregado

                                </button>
                            `
                :
                `
                                <button class="btn btn-primary btn-sm"
                                        onclick='clienteSelect(${JSON.stringify(item)})'>

                                    <i class="fas fa-plus"></i>

                                </button>
                            `
            }

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

// =========================
// AGREGAR CLIENTE
// =========================
function clienteSelect(json) {

    let existe = detalleRuta.some(x => x.IdCliente == json.IdCliente);

    if (existe) {

        alert("El cliente ya fue agregado");
        return;
    }

    detalleRuta.push({

        IdCliente: json.IdCliente,
        Nombre: json.Nombre,
        Direccion: json.Direccion,
        TipoDocumento: json.TipoDocumento,
        NumeroDocumento: json.NumeroDocumento,
        Telefono: json.Telefono,
        Orden: detalleRuta.length + 1

    });

    renderDetalleRuta();

    $("#modalCliente").modal("hide");
}

// =========================
// RENDER CLIENTES RUTA
// =========================
function renderDetalleRuta() {

    let html = "";

    $.each(detalleRuta, function (i, item) {

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

                        <button class="btn btn-danger btn-sm"
                                onclick="eliminarCliente(${i})">

                            <i class="fas fa-trash"></i>

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

                                Orden

                            </div>

                            <div class="small font-weight-bold">

                                ${item.Orden || '-'}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        `;
    });

    $("#contenedorDetalleRuta").html(html);
}

// =========================
// ACTUALIZAR ORDEN
// =========================
function actualizarOrden(index, valor) {

    detalleRuta[index].Orden = valor;
}

// =========================
// ELIMINAR CLIENTE
// =========================
function eliminarCliente(index) {

    detalleRuta.splice(index, 1);

    $.each(detalleRuta, function (i, item) {

        item.Orden = i + 1;

    });

    renderDetalleRuta();
}

// =========================
// GUARDAR
// =========================

$("#btnGuardarRuta").on("click", function () {

    if (detalleRuta.length == 0) {

        alert("Debe agregar clientes");
        return;
    }

    if ($("#txtNombre").val().trim() == "") {

        alert("Ingrese nombre de ruta");
        $("#txtNombre").focus();

        return;
    }

    if ($("#txtZona").val().trim() == "") {

        alert("Ingrese zona");
        $("#txtZona").focus();

        return;
    }

    if ($("#cboVendedor").val() == "") {

        alert("Seleccione vendedor");
        $("#cboVendedor").focus();

        return;
    }


    let modelo = {

        Nombre: $("#txtNombre").val(),
        Zona: $("#txtZona").val(),
        prioridad: $("#cboPrioridad").val(),
        fecha: $("#txtFecha").val(),
        vendedor: $("#cboVendedor option:selected").text(),
        idVendedor: $("#cboVendedor").val(),
        Descripcion: $("#txtDescripcion").val(),
        Estado: $("#cboEstado").val(),

        detalle: detalleRuta

    };

    console.log(modelo);

    $.ajax({

        url: $.MisUrls.url._GuardarRuta,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(modelo),

        success: function (response) {

            if (response.resultado) {

                alert("✅ Ruta guardada correctamente");

                window.location.href = '/Rutas/Consultar';

            } else {

                alert(response.mensaje);
            }
        },

        error: function () {

            alert("Error al guardar");
        }

    });

});

function cargarVendedores() {

    $("#cboVendedor").html("");

    $.ajax({

        url: $.MisUrls.url._ObtenerUsuarioVentas,
        type: "GET",
        dataType: "json",

        success: function (response) {

            $("#cboVendedor").append(
                $('<option>', {
                    value: "",
                    text: "Seleccione"
                })
            );

            $.each(response.data, function (i, item) {

                $("#cboVendedor").append(
                    $('<option>', {
                        value: item.IdUsuario,
                        text: item.Nombres
                    })
                );

            });

        },

        error: function (xhr) {

            console.log(xhr.responseText);

        }

    });

}

function retornarListado() {
    window.location.href = '/Rutas/Consultar';
}