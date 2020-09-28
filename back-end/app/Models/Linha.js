'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Linha extends Model {
    paradas () { //Relacionamento da linha com as paradas, belongsToMany é um N.N
        return this.belongsToMany('App/Models/Parada')
            .pivotTable('linha_paradas')
    }

    veiculos() { //Relacionamento com veiculos, uma linha pode ter varios veiculos
        return this.hasMany('App/Models/Veiculo')
    }
}

module.exports = Linha
