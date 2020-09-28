'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PosicaoVeiculo extends Model {
    veiculos () { //Uma posicao tem exatamente um veiculo e precida dele pra existir
        return this.belongsTo('App/Models/Veiculo')
      }
}

module.exports = PosicaoVeiculo
