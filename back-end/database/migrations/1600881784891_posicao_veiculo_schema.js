'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PosicaoVeiculoSchema extends Schema {
  up () {
    this.create('posicao_veiculos', (table) => {
      table.bigIncrements()
      table.decimal('latitude', 15, 6).notNullable()
      table.decimal('longitude', 15, 6).notNullable()
      table
        .bigInteger('veiculo_id')
        .unsigned()
        .references('id')
        .inTable('veiculos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('posicao_veiculos')
  }
}

module.exports = PosicaoVeiculoSchema
