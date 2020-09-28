'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LinhaParadaSchema extends Schema {
  up () {
    this.create('linha_paradas', (table) => {
      table.increments()
      table
        .bigInteger('linha_id')
        .unsigned()
        .references('id')
        .inTable('linhas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        table
        .bigInteger('parada_id')
        .unsigned()
        .references('id')
        .inTable('paradas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('linha_paradas')
  }
}

module.exports = LinhaParadaSchema
