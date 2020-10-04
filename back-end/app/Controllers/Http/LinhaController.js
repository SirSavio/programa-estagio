'use strict'

const Linha = use('App/Models/Linha')
const Parada = use('App/Models/Parada')

const {validate} = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with linhas
 */
class LinhaController {
  /**
   * Show a list of all linhas.
   * GET linhas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try{
      return await Linha.all()  //Recupera todas as linhas
    }catch(err){
      return response.status(err.status).json({ message: err.message });
    }

  }

  /**
   * Create/save a new linha.
   * POST linhas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    //Recupero os dados necessários para cadastrar uma linha
    const data = request.only([
      'nome',
      'paradas'
    ])

    //Validacao dos dados
    const rules = {
      nome: 'required|unique:linhas',
      paradas: 'required'
    }

    //Mensagens personalizadas caso a validacao falhe
    const messages = {
      'nome.required': 'É preciso informar um nome',
      'nome.unique': 'O nome não pode ser repetido',
      'paradas.required': 'É preciso informar as paradas'
    }

    const validacao = await validate(data, rules, messages)

    //Se a validacao falhar retorna o erro
    if(validacao.fails()){
      let mensagem = (validacao.messages())[0].message
      return response.status(400).json({message: mensagem})
    }
    //Verifica se as paradas são um vetor...
    if(!Array.isArray(data.paradas)){
      return response.status(400).json({message: 'As paradas devem ser um vetor'})
    }
    //... e se os IDs passados são válidos
    for(let i = 0; i < data.paradas.length; i++){
      if(!await Parada.find(data.paradas[i])){
        return response.status(400).json({message: 'ID de parada inválido'})
      }
    }

    try{
      let linha = await Linha.create({nome: data.nome}) // Cria uma nova linha

      for(let i = 0; i < data.paradas.length; i++){ //Relaciono a linha com as paradas
        await linha.paradas().attach(data.paradas[i])
      }

      return await Linha.query() //Retorno as linhas com as paradas
      .select('*')
      .where('id', '=', linha.id)
      .with('paradas', builder => {
        builder.select('*')
      })
      .fetch()

    }catch(err){
      return response.status(err.status).json({ message: err.message });
    }

  }

  /**
   * Display a single linha.
   * GET linhas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try{
      let linha = await Linha.findOrFail(params.id) //Recupera a linha peli ID
      return linha

    }catch(err){
      return response.status(400).json({ message: 'ID inválido' }); //Caso falhe
    }
  }

  /**
   * Update linha details.
   * PUT or PATCH linhas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    //Recupero os dados necessários para atualizar uma linha uma linha
    const data = request.only([
      'nome',
      'paradas'
    ])
    //Validação dos dados
    const rules = {
      nome: `required|unique:linhas,nome,id,${params.id}`,
      paradas: 'required'
    }
    //Mensagens personalizadas caso falhe
    const messages = {
      'nome.required': 'É preciso informar um nome',
      'nome.unique': 'O nome não pode ser repetido',
      'paradas.required': 'É preciso informar as paradas'
    }

    const validacao = await validate(data, rules, messages)

    //Se a validacao falhar retorna o erro
    if(validacao.fails()){
      let mensagem = (validacao.messages())[0].message
      return response.status(400).json({message: mensagem})
    }
    //Verifico se as paradas foram passadas em um vetor...
    if(!Array.isArray(data.paradas)){
      return response.status(400).json({message: 'As paradas devem ser um vetor'})
    }
    //... e se os IDs são válidos 
    for(let i = 0; i < data.paradas.length; i++){
      if(!await Parada.find(data.paradas[i])){
        return response.status(400).json({message: 'ID de parada inválido'})
      }
    }

    const linha = await Linha.findOrFail(params.id) //Recupera a linha pelo ID

    await linha.paradas().detach() //Removo as relações com paradas antigas

    for(let i = 0; i < data.paradas.length; i++){ //Adiciono as novas relações
      await linha.paradas().attach(data.paradas[i])
    }

    linha.merge({'nome': data.nome}) 

    await linha.save() //Salvo as mudanças

    return await Linha.query() //Retorno a linha com as paradas
    .select('*')
    .where('id', '=', linha.id)
    .with('paradas', builder => {
      builder.select('*')
    })
    .fetch()
    
  }

  /**
   * Delete a linha with id.
   * DELETE linhas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const linha = await Linha.findOrFail(params.id); //Recupero a linha pelo ID
      await linha.delete()
    } catch (err) {
      return response.status(404).json({message: 'ID inválido'}); //Caso falhe
    }
  }

  /**
   * Retorna os veículos associados a linha informada.
   * GET veiculosLinha/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async veiculosLinha ({ params, request, response }) {
    try {
      let linha = await Linha.find(params.id); //Recupero a linha por ID
      if(!linha){
        return response.status(404).json({message: 'ID inválido'}); //Caso falhe
      }

      await linha.load('veiculos') //Recupero os veiculos que estão nessa linha
      return linha

    } catch (err) {
      return response.status(404).json({message: err.message});
    }
  }

  /**
   * Retorna as paradas associadas a linha informada.
   * GET paradasLinha/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async paradasLinha ({ params, request, response }) {
    try {
      let linha = await Linha.find(params.id); //Recupero a linha pelo ID
      if(!linha){
        return response.status(404).json({message: 'ID inválido'}); //Caso falhe
      }

      await linha.load('paradas') //Recupero as paradas dessa linha
      return linha

    } catch (err) {
      return response.status(404).json({message: err.message});
    }
  }

  /**
   * Retorna a parada da linha informada mais próxima a posição informada informada.
   * POST paradaProximaLinha/
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async paradaProximaLinha ({ params, request, response }) {
    //Recupero os dados necessários
    const data = request.only([
      'linha_id',
      'latitude',
      'longitude'
    ])

    //Validação dos dados
    const rules = {
      linha_id: 'required|number',
      longitude: 'required|number',
      latitude: 'required|number'
    }

    //Mensagens personalizadas caso a validação falhe
    const messages = {
      'linha_id.required': 'É preciso informar uma linha',
      'linha_id.number': 'ID da linha inválido',
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

    try {
      let linha = await Linha.find(data.linha_id); //Recupera a linha pelo ID
      if(!linha){
        return response.status(404).json({message: 'ID da linha inválido'}); //Caso falhe
      }

      await linha.load('paradas') //Recupera as paradas da linha
      
      let parada = (linha.toJSON()).paradas
      let menor = []

      if(parada.length == 0){ //Caso nao tenha paradas na linha
        return []
      }

      for(let i = 0; i < parada.length; i++){ //Verifico qual a parada com menor distancia da posicao informada
        let lat = parada[i].latitude
        let long = parada[i].longitude

        if(i == 0){ //Caso seja a primeira parada ela sera a com menor distancia
          menor['distancia'] = this.distancia(lat, long, data.latitude, data.longitude)
          menor['posicao'] = i
          continue
        }

        let distancia = this.distancia(lat, long, data.latitude, data.longitude)

        if(distancia < menor['distancia']){ //Caso tenha uma distancia menor atualiza
          menor['distancia'] = distancia
          menor['posicao'] = i
        }
      }

      return parada[menor['posicao']]

    } catch (err) {
      return response.status(404).json({message: err.message});
    }
  }

  distancia (lat1, long1, lat2, long2){ //Funcao para calculo da distancia
    return Math.sqrt(Math.pow(lat2-lat1, 2) + Math.pow(long2-long1, 2))
}

}

module.exports = LinhaController
