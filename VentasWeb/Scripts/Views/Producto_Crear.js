
var tabladata;
$(document).ready(function () {
    activarMenu("Producto");


    ////validamos el formulario
    $("#form").validate({
        rules: {
            Nombre: "required",
            Descripcion: "required"
        },
        messages: {
            Nombre: "(*)",
            Descripcion: "(*)"

        },
        errorElement: 'span'
    });

    //OBTENER CATEGORIAS
    jQuery.ajax({
        url: $.MisUrls.url._ObtenerCategorias,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            
            $("#cboCategoria").html("");

            if (data.data != null) {
                $.each(data.data, function (i, item) {

                    if (item.Activo == true) {
                        $("<option>").attr({ "value": item.IdCategoria }).text(item.Descripcion).appendTo("#cboCategoria");
                    }
                })
                $("#cboCategoria").val($("#cboCategoria option:first").val());
            }

        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
        },
    });

    //OBTENER GRUPO DIGESA
    jQuery.ajax({
        url: $.MisUrls.url._ObtenerFamiliaDigesa,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            $("#cboGrupoDigesa").html("");

            if (data.data != null) {
                $.each(data.data, function (i, item) {

                    if (item.Activo == true) {
                        $("<option>").attr({ "value": item.Id }).text(item.Descripcion).appendTo("#cboGrupoDigesa");
                    }
                })
                $("#cboGrupoDigesa").val($("#cboGrupoDigesa option:first").val());
            }

        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
        },
    });


    /*
    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerProductos,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "Codigo" },
            { "data": "Nombre" },
            { "data": "Descripcion" },
            {
                "data": "oCategoria", render: function (data) {
                    return data.Descripcion
                }
            },
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
                "data": "IdProducto", "render": function (data, type, row, meta) {
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
            "url": $.MisUrls.url._ObtenerProductos,
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
                                        ${data.Codigo}
                                    </div>

                                    <div class="fw-semibold mb-1">
                                        ${data.Nombre}
                                    </div>

                                    <div class="text-muted small mb-1">
                                        <i class="fas fa-align-left"></i>
                                        ${data.Descripcion || '-'}
                                    </div>

                                    <div class="text-muted small">
                                        <i class="fas fa-tags"></i>
                                        ${data.oCategoria?.Descripcion || '-'}
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
                                                onclick='eliminar(${data.IdProducto})'>
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

    if (json != null) {

        $("#txtid").val(json.IdProducto);
        $("#txtCodigo").val(json.Codigo);
        $("#txtNombre").val(json.Nombre);
        $("#txtDescripcion").val(json.Descripcion);
        $("#cboCategoria").val(json.IdCategoria);
        $("#cboGrupoDigesa").val(json.IdGrupoDigesa);
        $("#cboEstado").val(json.Activo == true ? 1 : 0);
        $("#txtCodigo").prop("disabled", true);

        generarCodigoBarra(json.Codigo);

    } else {

        $("#txtCodigo").val("AUTOGENERADO");
        $("#txtCodigo").prop("disabled", true)
        $("#txtNombre").val("");
        $("#txtDescripcion").val("");
        $("#cboCategoria").val($("#cboCategoria option:first").val());
        $("#cboGrupoDigesa").val($("#cboGrupoDigesa option:first").val());
        $("#cboEstado").val(1);
        $("#divCodigoBarra").hide();
        
    }

    $('#FormModal').modal('show');
}

function Guardar() {

    if ($("#form").valid()) {

        var request = {
            objeto: {
                IdProducto: parseInt($("#txtid").val()),
                Nombre: $("#txtNombre").val(),
                Descripcion: $("#txtDescripcion").val(),
                IdCategoria: $("#cboCategoria").val(),
                IdGrupoDigesa: $("#cboGrupoDigesa").val(),
                Activo: ($("#cboEstado").val() == "1" ? true : false)
            }
        }

        jQuery.ajax({
            url: $.MisUrls.url._GuardarProducto,
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

function eliminar($id) {


    swal({
        title: "Mensaje",
        text: "¿Desea eliminar el producto seleccionado?",
        type: "warning",
        showCancelButton: true,

        confirmButtonText: "Si",
        confirmButtonColor: "#DD6B55",

        cancelButtonText: "No",

        closeOnConfirm: true
    },

        function () {
            jQuery.ajax({
                url: $.MisUrls.url._EliminarProducto + "?id=" + $id,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    if (data.resultado) {
                        tabladata.ajax.reload();
                    } else {
                        swal("Mensaje", "No se pudo eliminar el producto", "warning")
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

function generarCodigoBarra(codigo) {

    if (codigo == null || codigo.trim() == "") {

        $("#divCodigoBarra").hide();
        return;
    }

    $("#divCodigoBarra").show();

    $("#lblNombreProducto").text($("#txtNombre").val());

    JsBarcode("#barcode", codigo, {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: true,
        fontSize: 12,
        margin: 0
    });
}

$("#txtCodigo").on("keyup", function () {

    generarCodigoBarra($(this).val());

});

$("#txtNombre").on("keyup", function () {

    $("#lblNombreProducto").text($(this).val());

});

function imprimirCodigoBarra() {

    let contenido = document.getElementById("contenedorEtiqueta").outerHTML;

    let ventana = window.open('', '', 'width=400,height=300');

    ventana.document.write(`
        <html>
        <head>

            <title>Etiqueta</title>

            <style>

                body{
                    margin:0;
                    padding:10px;
                    font-family:Arial;
                    text-align:center;
                }

                #contenedorEtiqueta{
                    width:230px;
                    padding:8px;
                    border:1px solid #000;
                    margin:auto;
                }

                #lblNombreProducto{
                    font-size:11px;
                    font-weight:bold;
                    line-height:13px;
                    margin-bottom:4px;
                }

                svg{
                    width:100%;
                    height:60px;
                }

            </style>

        </head>

        <body>

            ${contenido}

            <script>

                window.onload = function(){

                    window.print();
                    window.close();

                }

            <\/script>

        </body>

        </html>
    `);

    ventana.document.close();
}