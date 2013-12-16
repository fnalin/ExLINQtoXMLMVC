/*
    By Fabiano Nalin
*/

//stackoverflow.com/questions/18754020/bootstrap-3-with-jquery-validation-plugin
$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function (error, element) {
        if (element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

var validador = $("form").validate({
    rules: {
        nome: {
            required: true,
        },
        sobrenome: {
            required: true,
        },
        email: {
            email: true,
        },
    },
    messages: {
        nome: {
            required: "O Nome é obrigatório",
        },
        sobrenome: {
            required: "O Sobrenome é Obrigatório",
        },
        email: {
            email: "Informe um e-mail válido",
        },
    }
});

$(".delete-btn").click(function (e) {
    e.preventDefault();
    var itemID = $(this).data('id');
    var nome = $(this).data("nome");
    $('#deleteModal').modal('show');
    $(".modal-body input[type=hidden]").val(itemID);
    $(".modal-body span").text(nome);
});

$("#deleteModal .modal-footer button").click(function (e) {
    e.preventDefault();
    var itemID = $(".modal-body input[type=hidden]").val();
    window.location = urlDelete + itemID;
    $('#deleteModal').modal('hide');
});

$('#myModal').on('shown.bs.modal', function () {
    $("#inputNome").focus();
});

$('#myModal').on('show.bs.modal', function () {
    validador.resetForm();
    $('.form-group').removeClass('has-error');
    $("#inputID").val('Auto');
    $("#inputIDHidden").val('');
    $("#inputNome").val('');
    $("#inputSobrenome").val('');
    $("#inputEmail").val('');
    $("#inputTelefone").val('');
});

$(".edit-btn").click(function (e) {
    e.preventDefault();
    var itemID = $(this).data('id');
    CarregaContato(itemID);
    //$("#inputID").val(itemID);
    //$('#myModal').modal('show');
});

var CarregaContato = function (id) {
    $.ajax({
        type: "GET",
        url: urlEdit + id,
        dataType: "json",
        cache: false,
        beforeSend: function () {
            $('#myModal').modal('show');
        },
        success: function (data) {
            $("#inputID").val(id);
            $("#inputIDHidden").val(id);
            $("#inputNome").val(data.nome);
            $("#inputSobrenome").val(data.sobrenome);
            $("#inputEmail").val(data.email);
            $("#inputTelefone").val(data.telefone);
            $("#inputNome").focus();
        },
    });
};

$('#myModal .modal-footer button').click(function () {
    var valid = validador.form()
    if (!valid) {
        validador.showErrors();
    }
});