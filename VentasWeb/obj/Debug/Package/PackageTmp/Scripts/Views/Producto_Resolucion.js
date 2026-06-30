var tabla;

$(document).ready(function () {
    activarMenu("Producto");

    tabla = $('#tbdata').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerResolucionDigesa,
            "type": "GET",
            "datatype": "json"
        },
        "order": [],
        "columns": [

            { "data": "GrupoDigesa" },
            { "data": "NumeroResolucion" },
            { "data": "sFechaEmision" },
            { "data": "sFechaInicio" },
            { "data": "sFechaVencimiento" },
            {
                "data": "Estado",
                render: function (data) {

                    if (data === null || data === undefined)
                        return '<span class="badge bg-secondary">SIN RESOLUCION</span>';

                    if (data == 0)
                        return '<span class="badge bg-danger">VENCIDO</span>';

                    if (data == 1)
                        return '<span class="badge bg-success">VIGENTE</span>';

                    return '<span class="badge bg-secondary">SIN RESOLUCION</span>';
                }
            },
            {
                "data": "RutaArchivo",
                render: function (data, type, row) {

                    if (data == null || data == "")
                        return "";

                    return `
                            <a href="${data}" 
                               target="_blank"
                               class="btn btn-danger btn-sm"
                               title="Ver PDF">

                                <i class="fas fa-file-pdf"></i>

                            </a>
                        `;
                }
            }

        ],
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        },
        responsive: true
    });

    cargarGrupos();

});

function abrirModal() {
    $('#modalResolucion').modal('show');
}

function cargarGrupos() {

    $.ajax({
        url: $.MisUrls.url._ObtenerGrupoDigesa,
        type: 'GET',
        success: function (response) {

            console.log(response);

            $('#cboGrupoDigesa').empty();

            $.each(response.data, function (i, item) {

                $('#cboGrupoDigesa').append(
                    $('<option>', {
                        value: item.IdGrupoDigesa,
                        text: item.Nombre
                    })
                );
            });
        },
        error: function (xhr) {

            console.log(xhr.responseText);

            alert('Error cargando grupos');
        }
    });
}

function guardar() {

    let idGrupoDigesa = $('#cboGrupoDigesa').val();
    let numeroResolucion = $('#txtNumeroResolucion').val().trim();
    let fechaEmision = $('#txtFechaEmision').val();
    let fechaInicio = $('#txtFechaInicio').val();
    let fechaVencimiento = $('#txtFechaVencimiento').val();

    // VALIDACIONES

    if (idGrupoDigesa == "" || idGrupoDigesa == null) {

        alert("Seleccione grupo DIGESA");
        $('#cboGrupoDigesa').focus();

        return;
    }

    if (numeroResolucion == "") {

        alert("Ingrese número de resolución");
        $('#txtNumeroResolucion').focus();

        return;
    }

    if (fechaEmision == "") {

        alert("Ingrese fecha de emisión");
        $('#txtFechaEmision').focus();

        return;
    }

    if (fechaInicio == "") {

        alert("Ingrese fecha de inicio");
        $('#txtFechaInicio').focus();

        return;
    }

    if (fechaVencimiento == "") {

        alert("Ingrese fecha de vencimiento");
        $('#txtFechaVencimiento').focus();

        return;
    }

    // VALIDAR FECHAS

    let fInicio = new Date(fechaInicio);
    let fVencimiento = new Date(fechaVencimiento);

    if (fVencimiento < fInicio) {

        alert("La fecha de vencimiento no puede ser menor a la fecha inicio");

        $('#txtFechaVencimiento').focus();

        return;
    }

    // VALIDAR PDF

    let archivo = $('#filePdf')[0].files[0];

    if (archivo != undefined) {

        let extension = archivo.name.split('.').pop().toLowerCase();

        if (extension != "pdf") {

            alert("Solo se permite archivo PDF");

            return;
        }
    }

    // FORM DATA

    let formData = new FormData();

    formData.append('IdGrupoDigesa', idGrupoDigesa);
    formData.append('NumeroResolucion', numeroResolucion);
    formData.append('FechaEmision', fechaEmision);
    formData.append('FechaInicio', fechaInicio);
    formData.append('FechaVencimiento', fechaVencimiento);

    if (archivo != undefined) {
        formData.append('Archivo', archivo);
    }

    $.ajax({
        url: $.MisUrls.url._GuardarResolucionDigesa,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {

            $('.btn-success').prop('disabled', true);

        },
        success: function (response) {

            $('.btn-success').prop('disabled', false);

            if (response.success) {

                $('#modalResolucion').modal('hide');

                tabla.ajax.reload();

                alert("Resolución registrada correctamente");
            }
            else {

                alert(response.message);
            }
        },
        error: function () {

            $('.btn-success').prop('disabled', false);

            alert("Ocurrió un error");
        }
    });
}