'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ParadaSchema extends Schema {
  up () {
    this.create('paradas', (table) => {
      table.bigIncrements()
      table.string('nome').notNullable()
      table.decimal('latitude',15,6).notNullable()
      table.decimal('longitude',15,6).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('paradas')
  }
}

module.exports = ParadaSchema
