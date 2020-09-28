'use strict'

const PosicaoVeiculo = use('App/Models/PosicaoVeiculo')

const {validate} = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with posicaoveiculos
 */
class PosicaoVeiculoController {
  /**
   * Show a list of all posicaoveiculos.
   * GET posicaoveiculos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    return await PosicaoVeiculo.all() //retorno todas as posições dos veiculos
  }

  /**
   * Display a single posicaoveiculo.
   * GET posicaoveiculos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const posicao = await PosicaoVeiculo.find(params.id) //Recupero a posicao pelo ID 
    if(!posicao){
      return response.status(400).json({message: 'ID inválido'})  //Caso falhe
    }
    
    return posicao
  }

  /**
   * Update posicaoveiculo details.
   * PUT or PATCH posicaoveiculos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    //Recupero os dados necessários para atualizar uma posicao
    const data = request.only([
      'longitude',
      'latitude'
    ])

    //Validacao dos dados
    const rules = {
      longitude: 'required|number',
      latitude: 'required|number'
    }

    //Mensagens personalizadas caso a validacao falhe
    const messages = {
      'longitide.required': 'É preciso informar a longitude',
      'longitude.number': 'A longitude deve ser um número',
      'latitude.required': 'É preciso informar a latitude',
      'latitude.number': 'A latitude deve ser um número'
    }

    const validacao = await validate(data, rules, messages)

    //Se a validacao falhar retorna o erro
    if(validacao.fails()){
      let mensagem = (validacao.messages())[0].message
      return response.status(400).json({message: mensagem})
    }

    const posicao = await PosicaoVeiculo.find(params.id) //Recupero a posicao pelo ID

    if(!posicao){
      return response.status(400).json({message: 'ID inválido'}) //Caso falhe
    }

    await posicao.merge(data) //Atualizo os dados
    await posicao.save() //Salvo

    return posicao
  }

}

module.exports = PosicaoVeiculoController
