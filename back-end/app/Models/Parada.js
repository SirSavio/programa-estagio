'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Parada extends Model {
    linhas (){ //Uma parada tem varias linhas
        return this.belongsToMany('App/Models/Linha')
            .pivotTable('linha_paradas')
    }

}

module.exports = Parada
