'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VeiculoSchema extends Schema {
  up () {
    this.create('veiculos', (table) => {
      table.bigIncrements()
      table.string('nome').notNullable()
      table.string('modelo').notNullable()
      table
        .bigInteger('linha_id')
        .unsigned()
        .references('id')
        .inTable('linhas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('veiculos')
  }
}

module.exports = VeiculoSchema
