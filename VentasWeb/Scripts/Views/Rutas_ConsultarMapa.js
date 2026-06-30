var map;
var markers = [];
var lineas = [];

$(document).ready(function () {

    // FECHA ACTUAL
    $("#txtFecha").val(new Date().toISOString().split('T')[0]);

    // MAPA
    map = L.map('map', {
        zoomControl: false
    }).setView([-6.7705123, -79.8412104], 13);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // CARGAR VENDEDORES
    cargarVendedores();

    // BUSCAR
    $('#btnBuscar').click(function () {
        cargarMapa();
    });

});

function cargarMapa() {

    // VALIDAR
    if ($("#txtFecha").val() == "") {
        alert("Seleccione fecha");
        return;
    }

    // LIMPIAR MARKERS
    markers.forEach(x => map.removeLayer(x));
    markers = [];

    $.ajax({

        url: $.MisUrls.url._ObtenerMapaRutas,
        type: 'GET',

        data: {
            fecha: $('#txtFecha').val(),
            idvendedor: $('#cboVendedor').val()
        },

        success: function (response) {

            if (!response.data || response.data.length === 0) {
                return;
            }

            response.data.forEach(function (item) {

                let lat = parseFloat(item.latitud);
                let lng = parseFloat(item.longitud);

                if (isNaN(lat) || isNaN(lng))
                    return;

                let colorMarker = item.estado === 'Generado'
                    ? '#28a745'
                    : '#0d6efd';

                // ICONO
                let icono = L.divIcon({
                    className: '',
                    html: `
                        <div class="pin-map ${item.estado === 'Generado' ? 'blink' : ''}"
                             style="background:${colorMarker}">
                        </div>
                    `,
                    iconSize: [22, 22],
                    iconAnchor: [11, 22]
                });

                let marker = L.marker([lat, lng], {
                    icon: icono
                }).addTo(map);

                // TOOLTIP
                marker.bindTooltip(`
                    <b>${item.cliente}</b>
                `, {
                    direction: 'top',
                    opacity: 0.9
                });

                // POPUP
                marker.bindPopup(`
                    <div style="min-width:220px">
                        <b>Cliente:</b> ${item.cliente}<br>
                        <b>Ruta:</b> ${item.codigo}<br>
                        <b>Orden:</b> ${item.orden}<br>
                        <b>Estado:</b> ${item.estado}
                    </div>
                `);

                markers.push(marker);

            });

            // AJUSTAR MAPA
            if (markers.length > 0) {

                let grupo = new L.featureGroup(markers);

                map.fitBounds(grupo.getBounds().pad(0.2));

            }

        },

        error: function (xhr) {

            console.log(xhr.responseText);

        }

    });

}

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

            // SELECCIONAR PRIMERO
            if (response.data.length > 0) {

                $("#cboVendedor").val(response.data[0].IdUsuario);

            }

            // CARGAR MAPA AUTOMÁTICO
            cargarMapa();

        },

        error: function (xhr) {

            console.log(xhr.responseText);

        }

    });

}