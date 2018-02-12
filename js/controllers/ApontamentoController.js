//import {apontamento} from '../models/apontamento';
//import {ListaApontamentos} from '../models/ListaApontamentos';
//import {Mensagem} from '../models/Mensagem';
//import {ApontamentosView} from '../views/ApontamentosView';
//import {MensagemView} from '../views/MensagemView';
//import {ApontamentoService} from '../services/ApontamentoService';
//import {Bind} from '../helpers/Bind';

class ApontamentoController {

    constructor() {
        this._ordemAtual = '';
        this._inputData = $('#data');

        this._listaApontamentos = new Bind(
            new ListaApontamentos(),
            new ApontamentosListView($('#apontamentosListView')),
            'adiciona', 'ordena', 'inverteOrdem'
        );

        this._service = new ApontamentoService();

        this._init();
    }

    _init() {
        /*
        new ApontamentoService()
            .lista()
            .then(apontamentos =>
                apontamentos.forEach(apontamento =>
                    this._listaApontamentos.adiciona(apontamento)))
            .catch(error => {
                //this._mensagem.texto = error;
            });
        */

        //01 - SE BASE (local) NAO EXISTE, PRECISA CRIAR.
        //  AO CRIAR A BASE (local), GRAVAR NA ESTRUTURA whoami, AS INFORMACOES DA CLASSE.
        //  AO CLICAR NO BOTAO REDEFINIR CLASSE, APAGAR AS INFORMACOES DE whoami.

        //02 - SE BASE (local) NAO EXISTE, PRECISA IMPORTAR AS INFORMACOES DE ACORDOM COM whoami.
        //  TENTAR SE CONECTAR PARA BAIXAR.
        //  SE NAO CONSEGUIU BAIXAR, PROGRAMA TENTATIVA PARA 1:30.
        //  VERIFICA SE TODAS AS CLASSES SUBMETERAM AS ATUALIZACOES (host).
        //  SE HA CLASSES A SUBMETER, PROGRAMA TENTATIVA PARA 1:30.
        //  SE TODAS AS CLASSES ATUALIZADAS (host), MARCA CLASSE ATUALIZADA, RE-CRIA BANCO (local).

        //03 - SE BASE (local) EXISTE, VERIFICAR SE PRECISA ENVIAR (host) APONTAMENTOS FECHADOS.
        //  TENTAR SE CONECTAR (host) PARA ENVIAR.
        //  SE NAO CONSEGUIU ENVIAR, PROGRAMA TENTATIVA PARA OS PROXIMOS 5:00.
        //  SE CONSEGUIR ENVIAR, APAGA A BASE (local) DE CLASSES/PESSOAS/APONTAMENTOS, E VOLTA PARA O PASSO 1.

        //FLAGS
        //0 - EM ABERTO
        //1 - PRONTO PARA ENVIO
        //2 - ATUALIZADO

        //setInterval( () => this.importaApontamentos(), 10000);
        //setTimeout( () => this.importaApontamentos(), 10000);
    }

    ordena(coluna) {
        if (this._ordemAtual == coluna) {
            this._listaApontamentos.inverteOrdem();
        } else {
            this._listaApontamentos.ordena((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
    }

    adiciona(event) {
        event.preventDefault();
        this.insertApontamento(this._criaApontamento());
        //this._mensagem.texto = 'Apontamento adicionado com sucesso';
    }

    insertApontamento(apontamento) {
        this._service
            .cadastra(apontamento)
            .then( () => {
                this._listaApontamentos.adiciona(apontamento);
                this._limpaFormulario();
        })
        .catch(
            //erro => this._mensagem.texto = erro
        );
    }

    importaApontamentos() {
        this._service
            .importa(this._listaApontamentos.apontamentos)
            .then(apontamentos => {
                apontamentos.forEach(apontamento => this.insertApontamento(apontamento));
                if (apontamentos.length > 0){
                    //this._mensagem.texto = 'Negociações do período importadas com sucesso';
                }
            });
    }

    _criaApontamento() {
        return new apontamento(
            DateHelper.textoParaData(this._inputData.val())
        )
    }

    _limpaFormulario(){
        this._inputData.val('');
        this._inputData.focus();
    }

    apaga() {
        this._service
            .apaga()
            .then( mensagem => {
                //this._mensagem.texto = mensagem;
                this._listaApontamentos.esvazia();
            })
            //.catch(erro => this._mensagem.texto = erro);
    }

}
