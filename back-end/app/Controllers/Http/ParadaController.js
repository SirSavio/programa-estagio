'use strict'

const Parada = use('App/Models/Parada')

const {validate} = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with paradas
 */
class ParadaController {

  /**
   * Show a list of all paradas.
   * GET paradas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const paradas = await Parada.all() //Recupera todas as paradas
    return paradas
  }

  /**
   * Create/save a new parada.
   * POST paradas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    //Recupero os dados necessários para cadastrar uma parada
    const data = request.only([
      'nome',
      'longitude',
      'latitude'
    ])

    //Mensagens personalizadas caso a validacao falhe
    const messages = {
      'longitide.required': 'É preciso informar a longitude',
      'longitude.number': 'A longitude deve ser um número',
      'latitude.required': 'É preciso informar a latitude',
      'latitude.number': 'A latitude deve ser um número',
      'nome.required': 'É preciso informar um nome',
      'nome.unique': 'O nome não pode ser repetido'
    }

    //Validacao dos dados
    const rules = {
      nome: 'required|unique:paradas',
      longitude: 'required|number',
      latitude: 'required|number'
    }

    const validacao = await validate(data, rules, messages)

    //Se a validacao falhar retorna o erro
    if(validacao.fails()){
      let mensagem = (validacao.messages())[0].message
      return response.status(400).json({message: mensagem})
    }

    const parada = await Parada.create({...data})

    return parada
  }

  /**
   * Display a single parada.
   * GET paradas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try{
      const parada = await Parada.findOrFail(params.id) //Recupero a parada pelo ID
      return parada
    }catch(err){
      return response.status(400).json({message: 'ID inválido'}) //Caso falhe
    }
  }

  /**
   * Update parada details.
   * PUT or PATCH paradas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    //Recupero os dados necessários para atualizar uma parada
    const data = request.only([
      'nome',
      'longitude',
      'latitude'
    ])

    //Mensagens personalizadas caso a validacao falhe
    const messages = {
      'longitide.required': 'É preciso informar a longitude',
      'longitude.number': 'A longitude deve ser um número',
      'latitude.required': 'É preciso informar a latitude',
      'latitude.number': 'A latitude deve ser um número',
      'nome.required': 'É preciso informar um nome',
      'nome.unique': 'O nome não pode ser repetido'
    }

    //Validacao dos dados
    const rules = {
      nome: `required|unique:paradas,nome,id,${params.id}`,
      longitude: 'required|number',
      latitude: 'required|number'
    }

    const validacao = await validate(data, rules, messages)

    //Se a validacao falhar retorna o erro
    if(validacao.fails()){
      let mensagem = (validacao.messages())[0].message
      return response.status(400).json({message: mensagem})
    }

    let parada;

    try{
      parada = await Parada.findOrFail(params.id) //Recupero a parada pelo ID
    }catch(err){
      return response.status(400).json({message: 'ID inválido'}) //Caso falhe
    }

    await parada.merge(data) //Atualizo os dados
    await parada.save() //Salvo

    return parada
  }

  /**
   * Delete a parada with id.
   * DELETE paradas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try{
      const parada = await Parada.findOrFail(params.id) //Recupero a parada pelo ID
      await parada.delete()
    }catch(err){
      return response.status(400).json({message: 'ID inválido'}) //Caso falhe
    }
  }

  /**
   * Recupera as linhas associadas a uma parada.
   * GET linhasParada/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async linhasParada ({ params, request, response, view }) {
    try{
      const parada = await Parada.find(params.id) //Recupero a parada pelo ID
      if(!parada){
        return response.status(400).json({ message: 'ID inválido' }); //Caso falhe
      }

      await parada.load('linhas') //Recupero as linhas associadas a essa parada (N.N)

      return parada
        
    }catch(err){
      return response.status(400).json({ message: err.message });
    }
  }

  /**
   * Recupera a parada mais próxima a uma determinada posição (lat/long)
   * GET linhasParada/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async paradaProxima ({ params, request, response, view }) {
    //Recupero os dados necessários 
    const data = request.only([
      'longitude',
      'latitude'
    ])

    //Mensagens personalizadas caso a validacao falhe
    const messages = {
      'longitide.required': 'É preciso informar a longitude',
      'longitude.number': 'A longitude deve ser um número',
      'latitude.required': 'É preciso informar a latitude',
      'latitude.number': 'A latitude deve ser um número'
    }

    //Validacao dos dados
    const rules = {
      longitude: 'required|number',
      latitude: 'required|number'
    }

    const validacao = await validate(data, rules, messages)

    //Se a validacao falhar retorna o erro
    if(validacao.fails()){
      let mensagem = (validacao.messages())[0].message
      return response.status(400).json({message: mensagem})
    }
    
    let parada = await Parada.all() //Recupero todas as paradas
    parada = parada.toJSON()

    let menor = []

    if(parada.length == 0){ //Caso nao tenha paradas na linha
      return []
    }

    for(let i = 0; i < parada.length; i++){ //Verifico qual a menor distancia
      let lat = parada[i].latitude
      let long = parada[i].longitude

      if(i == 0){ //Se for a primeira será a menor 
        menor['distancia'] = this.distancia(lat, long, data.latitude, data.longitude)
        menor['posicao'] = i
        continue
      }

      let distancia = this.distancia(lat, long, data.latitude, data.longitude)

      if(distancia < menor['distancia']){
        menor['distancia'] = distancia
        menor['posicao'] = i
      }

    }

    return parada[menor['posicao']]
  }

  distancia (lat1, long1, lat2, long2){ //Funcao para calculo da distancia
    return Math.sqrt(Math.pow(lat2-lat1, 2) + Math.pow(long2-long1, 2))
}

}

module.exports = ParadaController
