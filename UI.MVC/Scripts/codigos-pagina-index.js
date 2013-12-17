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

$().ready(function () {
    VerificarAlerta();
    CarregaDados(1);
    CarregaPaginacao();
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

$("button.btn.btn-default").click(function () {
    $('#myModal .modal-header h4').text('Novo Contato');
});

var VerificarAlerta = function () {
    var strUrl = urlAlerta;
    $.ajax({
        type: 'GET',
        url: strUrl,
        dataType: 'html',
        cache: false,
        async: true,
        success: function (data) {
            if (data != "") {
                $("#avisoQtde").html(data);
                $("button.btn.btn-default").hide();
            }
        }
    });
};

var CarregaDados = function (bloco) {
    var strUrl = urlTabelaDados + "?bloco="+bloco;
    $.ajax(
    {
        type: 'GET',
        url: strUrl,
        dataType: 'html',
        cache: false,
        async: true,
        beforeSend: function () {
            $("#update i").removeClass("hide");
            $("#update span").text(" Atualizando");
            $("#update i").addClass("icon-refresh-animate");
        },
        success: function (data) {
            $('#tabelaDados').html(data);
            $(".delete-btn").click(function (e) {
                e.preventDefault();
                var itemID = $(this).data('id');
                var nome = $(this).data("nome");
                $('#deleteModal').modal('show');
                $(".modal-body input[type=hidden]").val(itemID);
                $(".modal-body span").text(nome);
            });
            $(".edit-btn").click(function (e) {
                e.preventDefault();
                var itemID = $(this).data('id');
                $('#myModal .modal-header h4').text('Editar Contato');
                CarregaContato(itemID);
            });

        },
        complete: function () {
            $("#update i").removeClass("icon-refresh-animate");
            $("#update i").addClass("hide");
            $("#update span").text('');
        },
        error: function () {
            $("#tabelaDados").html("<div id='erro-mensagem'><p style='color:gray;'><small><em><strong>Erro.<br />Não foi possível obter os dados do servidor</strong></em></small></p></div>");
        },
    });
};

var CarregaPaginacao = function (active) {
    var strUrl = urlMnuPaginacao;
    $.ajax({
        type: 'GET',
        url: strUrl,
        dataType: 'html',
        cache: false,
        async: true,
        success: function (data) {
            $("#menuPaginacao").html(data);
            $("#menuPaginacao ul li").click(function (e) {
                e.preventDefault();
                var itemClick = $(this);
                CarregaDados(Number(itemClick.text()));
                PagClick(itemClick);
            });
            switch (active) {
                case "last":
                    $("#menuPaginacao ul li:last-child").addClass("active");
                    break;
                case undefined:
                    $("#menuPaginacao ul li:first-child").addClass("active");
                    break;
                default:
                    $("#menuPaginacao ul li:nth-child(" + active + ")").addClass("active");
                    break;
            }
        },
        error: function () {
            $("#menuPaginacao").html("<div id='erro-mensagem'><p style='color:gray;'><small><em><strong>Erro.<br />Não foi possível obter a paginação de forma correta do servidor</strong></em></small></p></div>");
        },
    });
}

function PagClick(e) {
    $("#menuPaginacao ul li.active").removeClass("active");
    e.addClass("active");
}

$("#deleteModal .modal-footer button").click(function (e) {
    e.preventDefault();
    var itemID = $(".modal-body input[type=hidden]").val();
    window.location = urlDelete + itemID;
    $('#deleteModal').modal('hide');
});

var CarregaContato = function (id) {
    $.ajax({
        type: "GET",
        url: urlEdit + id,
        dataType: "json",
        cache: false,
        beforeSend: function () {
            $('#myModal').modal('show');
            $("#inputID").val('');
            var loading = "<span><em>Carregando</em>&nbsp;<i class='glyphicon glyphicon-refresh icon-refresh-animate'></i></span>";
            $('#myModal .modal-header h4').after(loading);
        },
        success: function (data) {
            $("div.modal-header span").remove();
            $("#inputID").val(id);
            $("#inputIDHidden").val(id);
            $("#inputNome").val(data.nome);
            $("#inputSobrenome").val(data.sobrenome);
            $("#inputEmail").val(data.email);
            $("#inputTelefone").val(data.telefone);
            $("#inputNome").focus();
        },
        complete: function () {
            $("div.modal-header span").remove();
        },
    });
};

$('#myModal .modal-footer button').click(function () {
    var valid = validador.form()
    if (!valid) {
        validador.showErrors();
    }
});