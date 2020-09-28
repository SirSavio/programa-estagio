'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LinhaSchema extends Schema {
  up () {
    this.create('linhas', (table) => {
      table.bigIncrements()
      table.string('nome').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('linhas')
  }
}

module.exports = LinhaSchema
