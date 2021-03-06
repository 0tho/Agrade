import "./jquery";
import "selectize";
import Event from "./Event";

export default class Visao {
    constructor(template, versao) {
        this.template = template;

        this.$camadaCarregando = $("#carregando");

        this.$camadaSeletor = $("#seletor");
        this.$cursosDropdown = $("#cursoSelector");
        this.$carregarCurso = $("#carregar");

        this.$camadaLista = $("#lista");
        this.$listaDeDisciplinas = $("#lista-disciplinas");
        this.$nomeDoCurso = $("#lista-nomeCurso");

        this.$camadaBarraDoTopo = $("#query");
        this.$maisDetalhes = $("#more__plus");
        this.$minimizar = $("#topBar-minimizar");
        this.$desfazerTodos = $("#topBar-desfazer");
        this.$dadosDeConjuntos = $("#topBar-dataConjuntos");
        this.$porcentagemDoCurso = $(
            "#topBar-data__porcentagemDoCurso-conteudo"
        );
        this.$creditosFeitos = $("#topBar-data__creditosFeitos");
        this.$creditosParaFazer = $("#topBar-data__creditosTotais");
        this.$barraDoTopoNomeDoCurso = $("#topBar-data__nomeCurso");
        this.$barraDePesquisa = $("#query-input");

        this.minimizar = true;
        this.desejaDesfazer = false;

        this.iniciarEvent = new Event(this);
        this.carregarCursoEvent = new Event(this);

        this.checkboxCliqueEvent = new Event(this);
        this.infoCliqueEvent = new Event(this);

        this.separadorCliqueEvent = new Event(this);

        this.desfazerTodosEvent = new Event(this);
        this.mudarPesquisaEvent = new Event(this);

        $(".footer-version").text(versao);

        $(document).ready(() => this.iniciar());
    }

    iniciar() {
        var caminhoInteiro, caminho;

        //Pegue a URL inteira do browser
        caminhoInteiro = window.location.href;

        //Separe ela pelo '#'' e pegue a segunda parte
        caminho = caminhoInteiro.split("#")[1];

        //Notifique que o aplicativo foi iniciado com esse caminho
        this.iniciarEvent.notify(caminho);
    }

    iniciarSelecaoDeCurso(listaDeCursos) {
        this.$cursosDropdown.selectize({
            maxItems: 1,
            valueField: "url",
            labelField: "nome",
            searchField: "nome",
            options: listaDeCursos,
            items: [listaDeCursos[0].url],
            create: false
        });

        this.$camadaCarregando.hide();

        this.$carregarCurso.click(this.carregarCurso.bind(this));
    }

    iniciarListagemDoCurso(curso) {
        var _this = this;

        //Alterar url da pagina para condizer com curs
        window.location.hash = curso.id;

        if (this.template.itemCurso) {
            this.$camadaCarregando.hide();
            this.$camadaSeletor.hide();
            this.$camadaLista.show();
            this.$camadaBarraDoTopo.show();

            this.atualizarCabecalho(curso);

            this.$nomeDoCurso.text(curso.nomeCompleto);

            this.$maisDetalhes.click(function() {
                var $this;

                $this = $(this);

                $this.toggleClass("glyphicon-minus");
                $this.toggleClass("glyphicon-plus");

                if (!_this.$camadaBarraDoTopo.hasClass("aberta")) {
                    _this.$camadaBarraDoTopo.addClass("aberta");
                    _this.$camadaBarraDoTopo.removeClass("fechada");
                } else {
                    _this.$camadaBarraDoTopo.addClass("fechada");
                    _this.$camadaBarraDoTopo.removeClass("aberta");
                }
            });

            this.$minimizar.click(function() {
                $(".separador>.titulo>span", this.$listaDeDisciplinas).each(
                    function(element) {
                        var $this;

                        $this = $(this)
                            .parent()
                            .parent();

                        if (_this.minimizar) {
                            $(".titulo>span", $this).removeClass(
                                "glyphicon-minus"
                            );
                            $(".titulo>span", $this).addClass("glyphicon-plus");
                            $(".separador-conteudo", $this).hide();
                        } else {
                            $(".titulo>span", $this).addClass(
                                "glyphicon-minus"
                            );
                            $(".titulo>span", $this).removeClass(
                                "glyphicon-plus"
                            );
                            $(".separador-conteudo", $this).show();
                        }
                    }
                );

                _this.minimizar = !_this.minimizar;
                $("span", _this.$minimizar).toggleClass("glyphicon-minus");
                $("span", _this.$minimizar).toggleClass("glyphicon-plus");
            });

            this.$desfazerTodos.click(function() {
                if (!_this.desejaDesfazer) {
                    _this.desejaDesfazer = true;
                    $(this).toggleClass("btn-warning");
                    $(this).toggleClass("btn-danger");

                    $(this).text("Confirmar");

                    _$this = $(this);
                    setTimeout(function() {
                        _this.desejaDesfazer = false;
                        _$this.addClass("btn-warning");
                        _$this.removeClass("btn-danger");

                        _$this.text("Desfazer todos");
                    }, 1500);
                } else {
                    _this.desejaDesfazer = false;
                    $(this).toggleClass("btn-warning");
                    $(this).toggleClass("btn-danger");

                    $(this).text("Desfazer todos");

                    _this.desfazerTodosEvent.notify();
                }
            });

            this.$barraDePesquisa.keyup(function() {
                _this.mudarPesquisaEvent.notify(
                    $(this)
                        .val()
                        .toLowerCase()
                );
            });
        } else {
            this.$camadaCarregando.show();
            this.template.caregarItemCursoEvent.onEventCall(function() {
                _this.iniciarListagemDoCurso();
            });
        }
    }

    carregarCurso() {
        var caminho = this.$cursosDropdown[0].selectize.getValue();

        this.carregarCursoEvent.notify(caminho);
    }

    criarGrupo(id, nivel, $pai) {
        var separadorId = Math.min(nivel, this.template.separadores.length - 1);

        var $separador = $('<div class="separador">'),
            $titulo = $(this.template.separadores[separadorId]),
            $conteudo = $(this.template.separadorConteudo);

        id = id.charAt(0).toUpperCase() + id.slice(1);
        $titulo.text(id);
        $titulo.prepend($('<span class="glyphicon glyphicon-minus"></span>'));

        $separador.attr("data-id", id);
        $separador.addClass("col-md-12 col-sm-12 col-xs-12");
        $separador.append($titulo);
        $separador.append($conteudo);

        $pai.append($separador);

        return $conteudo;
    }

    fazerLista(disciplinasObj, infoId) {
        var _this = this;

        this.$listaDeDisciplinas.empty();

        function lookDown(obj, id, nivel, pai) {
            if (id) pai = _this.criarGrupo(id, nivel, pai);
            if (!(obj instanceof Array)) {
                for (var x in obj) {
                    lookDown(obj[x], x, nivel + 1, pai);
                }
            } else {
                obj.forEach(function(disciplina) {
                    _this.adicionarDisciplina(disciplina, pai);
                });
            }
        }

        lookDown(disciplinasObj, null, -1, this.$listaDeDisciplinas);

        if (typeof infoId !== "undefined") {
            var element = $($(".info[data-id=" + infoId + "]")[0]);
            element.addClass("selecionado");
            $("span", element).toggleClass(
                "glyphicon-chevron-left glyphicon-info-sign"
            );
        }

        //Adicione evento no checkbox de cada disciplina
        $(".checkbox", this.$listaDeDisciplinas).click(function() {
            var $this, id;

            $this = $(this);
            id = $this.attr("data-id");

            _this.checkboxCliqueEvent.notify(id);
            event.stopPropagation();
        });

        //Adicione evento no info de cada disciplina
        $(".info", this.$listaDeDisciplinas).click(function() {
            var $this, id;

            $this = $(this);
            id = $this.attr("data-id");

            _this.infoCliqueEvent.notify(id);
            event.stopPropagation();
        });

        $(".separador>.titulo>span", this.$listaDeDisciplinas).click(function(
            event
        ) {
            var $this;

            $this = $(this)
                .parent()
                .parent();

            $($(".titulo>span", $this)[0]).toggleClass("glyphicon-minus");
            $($(".titulo>span", $this)[0]).toggleClass("glyphicon-plus");
            $($(".separador-conteudo", $this)[0]).toggle();
            event.stopPropagation();
        });
    }

    adicionarDisciplina(disciplina, $pai) {
        var $disciplina, html;

        html = this.template.itemCurso;
        html = html.replace(
            new RegExp("{{disciplina.id}}", "g"),
            disciplina.id
        );
        html = html.replace(
            new RegExp("{{disciplina.nome}}", "g"),
            disciplina.nome
        );

        $disciplina = $(html);
        $disciplina.attr("data-id", disciplina.id);

        if (!disciplina.liberada) {
            $(".checkbox", $disciplina).addClass("trancada");
        } else if (disciplina.feita) {
            $(".checkbox", $disciplina).addClass("feita");
        }

        $pai.append($disciplina);
    }

    definirPesquisa(pesquisa) {
        this.$barraDePesquisa.val(pesquisa);
    }

    atualizarDisciplinas(disciplinas) {
        disciplinas.forEach(function(disciplina) {
            let $disciplina = $($(".checkbox[data-id=" + disciplina.id + "]")[0]);

            if (disciplina.liberada) {
                $disciplina.removeClass("trancada");
                if (disciplina.feita) {
                    $disciplina.addClass("feita");
                } else {
                    $disciplina.removeClass("feita");
                }
            } else {
                $disciplina.addClass("trancada");
                $disciplina.removeClass("feita");
            }
        });
    }

    atualizarCabecalho(curso) {
        this.$porcentagemDoCurso.text(
            (
                (curso.totalDeCreditosFeitos * 100) /
                curso.totalDeCreditos
            ).toFixed(2) + "%"
        );
        this.$creditosFeitos.text(curso.totalDeCreditosFeitos);
        this.$creditosParaFazer.text(curso.totalDeCreditos);
        this.$barraDoTopoNomeDoCurso.text(curso.nome);

        this.$dadosDeConjuntos.empty();

        var $conjunto = $('<div class="col-md-12 col-sm-12 col-xs-12">');
        var $row = $('<div class="row">');

        $row.append(
            $(
                '<div class="col-md-6 col-sm-6 col-xs-3"> <h4> Conjunto </h4> </div>'
            )
        );
        $row.append(
            $(
                '<div class="col-md-2 col-sm-2 col-xs-3"> <h4> Creditos </h4> </div>'
            )
        );
        $row.append(
            $(
                '<div class="col-md-2 col-sm-2 col-xs-3"> <h4> Disciplinas </h4> </div>'
            )
        );
        $row.append(
            $(
                '<div class="col-md-2 col-sm-2 col-xs-3"> <h4> Porcentagem </h4> </div>'
            )
        );

        $conjunto.append($row);
        this.$dadosDeConjuntos.append($conjunto);
        for (var i = 0; i < curso.conjuntos.length; i++) {
            var conjunto = curso.conjuntos[i];
            var $conjunto = $('<div class="col-md-12 col-sm-12 col-xs-12">');
            var $row = $('<div class="row">');

            $row.append(
                $(
                    '<div class="col-md-6 col-sm-6 col-xs-3">' +
                        conjunto.nome +
                        "</div>"
                )
            );
            $row.append(
                $(
                    '<div class="col-md-2 col-sm-2 col-xs-3"> ' +
                        conjunto.creditosFeitos +
                        " / " +
                        conjunto.creditos +
                        " </div>"
                )
            );
            $row.append(
                $(
                    '<div class="col-md-2 col-sm-2 col-xs-3"> ' +
                        conjunto.disciplinasFeitas +
                        " / " +
                        conjunto.disciplinas +
                        " </div>"
                )
            );
            $row.append(
                $(
                    '<div class="col-md-2 col-sm-2 col-xs-3"> ' +
                        (
                            (conjunto.creditosFeitos * 100) /
                            conjunto.creditos
                        ).toFixed(2) +
                        "% </div>"
                )
            );

            $conjunto.append($row);
            this.$dadosDeConjuntos.append($conjunto);
        }
    }
}
