
var tabladata;
$(document).ready(function () {
    activarMenu("Clientes");

    ////validamos el formulario
    $("#form").validate({
        rules: {
            numerodocumento: "required",
            nombres: "required",
            direccion: "required",
            telefono: "required"
        },
        messages: {
            numerodocumento: "(*)",
            nombres: "(*)",
            direccion: "(*)",
            telefono: "(*)"
        },
        errorElement: 'span'
    });

    /*
    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerClientes,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "TipoDocumento" },
            { "data": "NumeroDocumento" },
            { "data": "Nombre" },
            { "data": "Direccion" },
            { "data": "Telefono" },
            {
                "data": "Activo", "render": function (data) {
                    if (data) {
                        return '<span class="badge badge-success">Activo</span>'
                    } else {
                        return '<span class="badge badge-danger">No Activo</span>'
                    }
                }
            },
            {
                "data": "IdCliente", "render": function (data, type, row, meta) {
                    return "<button class='btn btn-primary btn-sm' type='button' onclick='abrirPopUpForm(" + JSON.stringify(row) + ")'><i class='fas fa-pen'></i></button>" +
                        "<button class='btn btn-danger btn-sm ml-2' type='button' onclick='eliminar(" + data + ")'><i class='fa fa-trash'></i></button>"
                },
                "orderable": false,
                "searchable": false,
                "width": "90px"
            }
        ],
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        },
        responsive: true
    });
    */

    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerClientes,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row) {

                    let estado = data.Activo
                        ? '<span class="badge bg-success">Activo</span>'
                        : '<span class="badge bg-danger">No Activo</span>';

                    return `
                    <div class="card border-0 shadow-sm mb-2 rounded-3">
                        <div class="card-body p-3">

                            <div class="d-flex justify-content-between">

                                <!-- IZQUIERDA -->
                                <div class="flex-grow-1 pe-3">

                                    <div class="fw-bold text-primary mb-1">
                                        ${data.TipoDocumento}: ${data.NumeroDocumento}
                                    </div>

                                    <div class="fw-semibold mb-1">
                                        ${data.Nombre}
                                    </div>

                                    <div class="text-muted small mb-1">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${data.Direccion || '-'}
                                    </div>

                                    <div class="text-muted small">
                                        <i class="fas fa-phone"></i>
                                        ${data.Telefono || '-'}
                                    </div>

                                </div>

                                <!-- DERECHA -->
                                <div class="d-flex flex-column align-items-end">

                                    <div class="mb-2">
                                        ${estado}
                                    </div>

                                    <div class="d-flex gap-1">

                                        <button class='btn btn-primary btn-sm'
                                                type='button'
                                                onclick='abrirPopUpForm(${JSON.stringify(row)})'>
                                            <i class='fas fa-pen'></i>
                                        </button>

                                        <button class='btn btn-danger btn-sm'
                                                type='button'
                                                onclick='eliminar(${data.IdCliente})'>
                                            <i class='fa fa-trash'></i>
                                        </button>

                                    </div>

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

})
function abrirPopUpForm(json) {

    $("#txtid").val(0);
    let latInicial = 0;
    let lngInicial = 0;

    if (json != null) {
        $("#seccionDirecciones").show();
        $("#btnAgregaDireccion").prop("disabled", false);

        $("#txtid").val(json.IdCliente);
        $("#cboclientetipodocumento").val(json.TipoDocumento);
        $("#txtNumeroDocumento").val(json.NumeroDocumento);
        $("#txtNombres").val(json.Nombre);
        $("#txtDireccion").val(json.Direccion);
        $("#txtTelefono").val(json.Telefono);
        $("#txtEmail").val(json.Email);
        $("#cboEstado").val(json.Activo == true ? 1 : 0);
        latInicial = parseFloat(json.Latitud || -6.7714);
        lngInicial = parseFloat(json.Longitud || -79.8409);
        $("#txtNombreDireccion").val(json.Dir_Nombre);
        $("#txtDireccionEntrega").val(json.Direccion);
        $("#txtEncargado").val(json.Encargado);
        $("#txtTelefonoEntrega").val(json.Telefono);
        $("#txtEmailEncargado").val(json.EmailEncargado);
        abrirDataDirecciones(json.IdCliente);

    } else {
        $("#seccionDirecciones").hide();
        $("#btnAgregaDireccion").prop("disabled", true);

        $("#cboclientetipodocumento").val($("#cboclientetipodocumento option:first").val());
        $("#txtNumeroDocumento").val("");
        $("#txtNombres").val("");
        $("#txtDireccion").val("");
        $("#txtTelefono").val("");
        $("#txtEmail").val("");
        $("#cboEstado").val(1);
        latInicial = -6.7714;
        lngInicial = -79.8409;
        $("#txtNombreDireccion").val("");
        $("#txtDireccionEntrega").val("");
        $("#txtEncargado").val("");
        $("#txtTelefonoEntrega").val("");
        $("#txtEmailEncargado").val("");
    }

    $('#FormModal').modal('show');

    $('#FormModal').off('shown.bs.modal').on('shown.bs.modal', function () {

        // crear mapa una sola vez
        if (!map) {

            iniciarMapa(latInicial, lngInicial);

        } else {

            // mover mapa
            map.setView([latInicial, lngInicial], 15);

            // mover marcador
            marker.setLatLng([latInicial, lngInicial]);

            // actualizar variables globales
            latitudSeleccionada = latInicial;
            longitudSeleccionada = lngInicial;
        }

        // refrescar tamaño
        setTimeout(function () {
            map.invalidateSize();
        }, 300);

    });

}
function abrirDataDirecciones(id) {

    $("#contenedorDirecciones").html("");

    $.ajax({
        url: $.MisUrls.url._ObtenerClienteDireccion,
        type: "GET",
        data: {
            idCliente: id
        },
        success: function (response) {

            let html = "";

            $.each(response.data, function (i, item) {

                html += `
                
                <div class="col-12 mb-2">
                    <div class="card shadow-sm border-0 rounded-lg tarjeta-direccion">

                        <div class="card-body p-2">

                            <div class="d-flex justify-content-between align-items-start">

                                <div>

                                    <div class="font-weight-bold text-dark small">
                                        <i class="fas fa-map-marker-alt text-danger mr-1"></i>
                                        ${item.Nombre}
                                    </div>

                                    <div class="text-muted small mt-1">
                                        ${item.Direccion}
                                    </div>

                                </div>

                            </div>

                            <hr class="my-2"/>

                            <div class="row text-center">

                                <div class="col-4">
                                    <div class="text-muted" style="font-size:11px">
                                        Encargado
                                    </div>

                                    <div class="small font-weight-bold text-truncate">
                                        ${item.Encargado || '-'}
                                    </div>
                                </div>

                                <div class="col-4">
                                    <div class="text-muted" style="font-size:11px">
                                        Teléfono
                                    </div>

                                    <div class="small font-weight-bold">
                                        ${item.Telefono || '-'}
                                    </div>
                                </div>

                                <div class="col-4">
                                    <div class="text-muted" style="font-size:11px">
                                        Email
                                    </div>

                                    <div class="small font-weight-bold text-truncate">
                                        ${item.Email || '-'}
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>

                `;
            });

            $("#contenedorDirecciones").html(html);

        },
        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}
function Guardar() {

    if ($("#form").valid()) {

        var request = {
            objeto: {
                IdCliente: $("#txtid").val(),
                TipoDocumento: $("#cboclientetipodocumento").val(),
                NumeroDocumento: $("#txtNumeroDocumento").val(),
                Nombre: $("#txtNombres").val(),
                Direccion: $("#txtDireccion").val(),
                Telefono: $("#txtTelefono").val(),
                Email: $("#txtEmail").val(),
                Latitud: latitudSeleccionada,
                Longitud: longitudSeleccionada,
                Activo: parseInt($("#cboEstado").val()) == 1 ? true : false
            }
        }

        jQuery.ajax({
            url: $.MisUrls.url._GuardarCliente,
            type: "POST",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json; charset=utf-8",

            success: function (data) {

                if (data.resultado) {

                    swal("Éxito", data.mensaje, "success");

                    tabladata.ajax.reload();

                    $('#FormModal').modal('hide');

                } else {

                    swal("Mensaje", data.mensaje, "warning");
                }
            },

            error: function (error) {

                console.log(error);

                swal("Error", "Ocurrió un error al procesar la solicitud", "error");
            },

            beforeSend: function () {

            },
        });

    }

}
function eliminar($id) {


    swal({
        title: "Mensaje",
        text: "¿Desea eliminar el cliente seleccionado?",
        type: "warning",
        showCancelButton: true,

        confirmButtonText: "Si",
        confirmButtonColor: "#DD6B55",

        cancelButtonText: "No",

        closeOnConfirm: true
    },

        function () {
            jQuery.ajax({
                url: $.MisUrls.url._EliminarCliente + "?id=" + $id,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    if (data.resultado) {
                        tabladata.ajax.reload();
                    } else {
                        swal("Mensaje", "No se pudo eliminar el cliente", "warning")
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

// =========================================
// GEOLOCALIZA INICIO
// =========================================
let map;
let marker;
let latitudSeleccionada = 0;
let longitudSeleccionada = 0;
function iniciarMapa(_latInicial, _lngInicial) {

    // Lima por defecto
    const latInicial = _latInicial;
    const lngInicial = _lngInicial;

    map = L.map('mapa').setView([latInicial, lngInicial], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([latInicial, lngInicial], {
        draggable: true
    }).addTo(map);

    latitudSeleccionada = latInicial;
    longitudSeleccionada = lngInicial;

    // click en mapa
    map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        latitudSeleccionada = e.latlng.lat;
        longitudSeleccionada = e.latlng.lng;
    });

    // arrastrar marcador
    marker.on('dragend', function (e) {
        let pos = marker.getLatLng();
        latitudSeleccionada = pos.lat;
        longitudSeleccionada = pos.lng;
    });
}

$("#btnUbicacionActual").on("click", function () {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            map.setView([lat, lng], 17);
            marker.setLatLng([lat, lng]);

            latitudSeleccionada = lat;
            longitudSeleccionada = lng;
        });
    }
});

$("#btnSeccionDireccion").click(function () {

    $("#seccionCliente").hide();
    $("#seccionDirecciones").show();

    $("#btnSeccionDireccion")
        .removeClass("btn-outline-secondary")
        .addClass("btn-secondary active");

    $("#btnSeccionCliente")
        .removeClass("btn-secondary active")
        .addClass("btn-outline-secondary");

    setTimeout(function () {

        if (map) {
            map.invalidateSize();
        }

    }, 300);

});

$("#btnSeccionCliente").click(function () {

    $("#seccionDirecciones").hide();
    $("#seccionCliente").show();

    $("#btnSeccionCliente")
        .removeClass("btn-outline-secondary")
        .addClass("btn-secondary active");

    $("#btnSeccionDireccion")
        .removeClass("btn-secondary active")
        .addClass("btn-outline-secondary");

});

// =========================================
// GUARDAR DIRECCION
// =========================================
$("#btnAgregaDireccion").click(function () {

    limpiarDireccion();

    $("#modalDireccion").modal("show");

    $('#modalDireccion').off('shown.bs.modal').on('shown.bs.modal', function () {

        let lat = latitudSeleccionada || -12.0464;
        let lng = longitudSeleccionada || -77.0428;

        iniciarMapaDireccion(lat, lng);

    });

});

$("#btnUbicacionDireccion").click(function () {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            mapDireccion.setView([lat, lng], 17);

            markerDireccion.setLatLng([lat, lng]);

            latitudDireccion = lat;
            longitudDireccion = lng;

        });

    }

});

$("#btnGuardarDireccion").click(function () {

    GuardarDireccion();

});
function GuardarDireccion() {

    if ($("#txt_NombreDireccion").val().trim() === "") {

        swal(
            "Mensaje",
            "Debe ingresar el nombre de la dirección",
            "warning"
        );

        $("#txt_NombreDireccion").focus();

        return;
    }

    if ($("#txt_Direccion").val().trim() === "") {

        swal(
            "Mensaje",
            "Debe ingresar la dirección",
            "warning"
        );

        $("#txt_Direccion").focus();

        return;
    }

    if ($("#txt_TelefonoDireccion").val().trim() === "") {

        swal(
            "Mensaje",
            "Debe ingresar el teléfono",
            "warning"
        );

        $("#txt_TelefonoDireccion").focus();

        return;
    }

    let request = {

        objeto: {

            IdCliente: $("#txtid").val(),
            Nombre: $("#txt_NombreDireccion").val(),
            Direccion: $("#txt_Direccion").val(),
            Telefono: $("#txt_TelefonoDireccion").val(),
            Latitud: latitudDireccion,
            Longitud: longitudDireccion,
            Encargado: $("#txt_Encargado").val(),
            EmailEncargado: $("#txt_EmailEncargado").val(),
            EsPrincipal: $("#chk_EsPrincipal").is(":checked")
        }
    };

    $.ajax({
        url: $.MisUrls.url._GuardarClienteDireccion,
        type: "POST",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: "application/json; charset=utf-8",

        success: function (data) {

            if (data.resultado) {

                swal("Mensaje", "Dirección guardada correctamente", "success");

                abrirDataDirecciones($("#txtid").val());

                limpiarDireccion();

                $("#modalDireccion").modal("hide");

            } else {

                swal("Mensaje", "No se pudo guardar la dirección", "warning");
            }

        },
        error: function (xhr) {

            console.log(xhr.responseText);

            swal("Error", "Ocurrió un error", "error");
        }
    });

}
function limpiarDireccion() {

    $("#txtIdClienteDireccion").val(0);

    $("#txt_NombreDireccion").val("");
    $("#txt_Direccion").val("");

    $("#txt_TelefonoDireccion").val("");
    $("#txt_Encargado").val("");
    $("#txt_EmailEncargado").val("");

    $("#chk_EsPrincipal").prop("checked", false);

}

// MAPA DIRECCIONES
let mapDireccion;
let markerDireccion;
let latitudDireccion = 0;
let longitudDireccion = 0;
function iniciarMapaDireccion(lat, lng) {

    if (mapDireccion) {
        mapDireccion.remove();
    }

    mapDireccion = L.map('mapaDireccion').setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapDireccion);

    markerDireccion = L.marker([lat, lng], {
        draggable: true
    }).addTo(mapDireccion);

    latitudDireccion = lat;
    longitudDireccion = lng;

    // CLICK MAPA
    mapDireccion.on('click', function (e) {

        markerDireccion.setLatLng(e.latlng);

        latitudDireccion = e.latlng.lat;
        longitudDireccion = e.latlng.lng;

    });

    // DRAG
    markerDireccion.on('dragend', function () {

        let pos = markerDireccion.getLatLng();

        latitudDireccion = pos.lat;
        longitudDireccion = pos.lng;

    });

    setTimeout(function () {
        mapDireccion.invalidateSize();
    }, 300);
}