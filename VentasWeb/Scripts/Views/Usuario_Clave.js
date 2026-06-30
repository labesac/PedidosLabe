
var tabladata;
$(document).ready(function () {
    activarMenu("Mantenedor");


    ////validamos el formulario
    $("#form").validate({
        rules: {
            Nombres: "required",
            Apellidos: "required",
            Correo: "required",
            Clave: "required"
        },
        messages: {
            Nombres: "(*)",
            Apellidos: "(*)",
            Correo: "(*)",
            Clave: "(*)"
        },
        errorElement: 'span'
    });

    //OBTENER ROLES
    jQuery.ajax({
        url: $.MisUrls.url._ObtenerRoles,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            $("#cboRol").html("");
            
            if (data.data != null) {
                $.each(data.data, function (i, item) {

                    if (item.Activo == true) {
                        $("<option>").attr({ "value": item.IdRol }).text(item.Descripcion).appendTo("#cboRol");
                    }
                })
                $("#cboRol").val($("#cboRol option:first").val());
            }
                
        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
        },
    });


    //OBTENER TIENDAS
    jQuery.ajax({
        url: $.MisUrls.url._ObtenerTiendas,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $("#cboTienda").html("");

            if (data.data != null) {
                $.each(data.data, function (i, item) {

                    if (item.Activo == true) {
                        $("<option>").attr({ "value": item.IdTienda }).text(item.Nombre).appendTo("#cboTienda");
                    }
                })
                $("#cboTienda").val($("#cboTienda option:first").val());
            }
                
        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
        },
    });

    


    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerUsuariosClave,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            {
                "data": "oRol", render: function (data) {
                    return data.Descripcion
                }
            },
            {
                "data": null,
                render: function (data, type, row) {
                    return `${row.Apellidos || ''} ${row.Nombres || ''}`.trim();
                }

            },
            { "data": "Correo" },
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
                "data": "IdUsuario", "render": function (data, type, row, meta) {
                    return "<button class='btn btn-primary btn-sm' type='button' onclick='abrirPopUpForm(" + JSON.stringify(row) + ")'><i class='fas fa-pen'></i></button>"
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


})


function abrirPopUpForm(json) {

    $("#txtid").val(0);

    if (json != null) {

        $("#txtid").val(json.IdUsuario);
        $("#txtNombres").val((json.Apellidos || "") + " " + (json.Nombres || ""));
        $("#txtCorreo").val(json.Correo);
        //$("#txtClave").val(json.Clave);
        $("#cboTienda").val(json.IdTienda);
        $("#cboRol").val(json.IdRol);
        $("#cboEstado").val(json.Activo == true ? 1 : 0);

        $("#txtNombres").prop("disabled", true);
        $("#txtApellidos").prop("disabled", true);
        $("#txtCorreo").prop("disabled", true);
        $("#cboTienda").prop("disabled", true);
        $("#cboRol").prop("disabled", true);
        $("#cboEstado").prop("disabled", true);

    } else {
        $("#txtNombres").val("");
        $("#txtApellidos").val("");
        $("#txtCorreo").val("");
        $("#txtClave").val("");
        $("#cboTienda").val($("#cboTienda option:first").val());
        $("#cboRol").val($("#cboRol option:first").val());
        $("#cboEstado").val(1);        
        $("#txtClave").prop("disabled", false);
    }

    $('#FormModal').modal('show');

}


function Guardar() {

    if ($("#form").valid()) {

        var request = {
            objeto: {
                IdUsuario: $("#txtid").val(),
                Nombres: $("#txtNombres").val(),
                Apellidos: $("#txtApellidos").val(),
                Correo: $("#txtCorreo").val(),
                Clave: $("#txtClave").val(),
                IdTienda: $("#cboTienda").val(),
                IdRol: $("#cboRol").val(),
                Activo: parseInt($("#cboEstado").val()) == 1 ? true : false
            }
        }

        jQuery.ajax({
            url: $.MisUrls.url._GuardarUsuarioClave,
            type: "POST",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                if (data.resultado) {
                    tabladata.ajax.reload();
                    $('#FormModal').modal('hide');
                } else {

                    swal("Mensaje", "No se pudo guardar los cambios", "warning")
                }
            },
            error: function (error) {
                console.log(error)
            },
            beforeSend: function () {

            },
        });

    }

}
