'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Veiculo extends Model {
    posicao_veiculos () { //Um veiculo tem uma posicao
        return this.hasOne('App/Models/PosicaoVeiculo')
    }

    linhas () { //Um veiculo tem uma linha
        return this.hasOne('App/Models/Linha')
    }

}

module.exports = Veiculo
