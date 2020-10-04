'use strict'
const Veiculo = use('App/Models/Veiculo')
const Linha = use('App/Models/Linha')
const PosicaoVeiculo = use('App/Models/PosicaoVeiculo')

const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


/**
 * Resourceful controller for interacting with veiculos
 */
class VeiculoController {
  /**
   * Show a list of all veiculos.
   * GET veiculos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    //Recupera todos os veiculos
    let veiculos =  await Veiculo.all()

    veiculos = veiculos.toJSON()

    for(let i =0 ; i < veiculos.length; i++){
      veiculos[i].linha = (await Linha.findOrFail(veiculos[i].linha_id)).nome //E a linha de cada um
    }

    return veiculos
      
  }

  /**
   * Create/save a new veiculo.
   * POST veiculos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    //Recupero os dados necessários para cadastrar um veiculo
    const data = request.only([
      'nome',
      'modelo',
      'linha_id'
    ])

    //Validacao dos dados
    const rules = {
      nome: 'required|unique:veiculos',
      modelo: 'required',
      linha_id: 'required|number|min:0'
    }

    //Mensagens personalizadas caso a validacao falhe
    const messages = {
      'nome.required': 'É preciso informar um nome',
      'nome.unique': 'O nome não pode ser repetido',
      'modelo.required': 'É precisa informar um modelo',
      'linha_id.required': 'É preciso informar a linha do veículo',
      'linha_id.number': 'Informe o ID da linha do veículo',
      'linha_id.min': 'ID da linha inválido'
    }

    const validacao = await validate(data, rules, messages)

    //Se a validacao falhar retorna o erro
    if(validacao.fails()){
      let mensagem = (validacao.messages())[0].message
      return response.status(400).json({message: mensagem})
    }

    if(!await Linha.find(data.linha_id)){ //Verifico a se a linha é válida
      return response.status(400).json({message: 'ID da linha inválido'})
    }

    //Crio no banco o veiculo
    const veiculo = await Veiculo.create({...data})

    //Crio uma posicao default para esse veiculo
    await PosicaoVeiculo.create({latitude: 0, longitude: 0, veiculo_id: veiculo.id})
    
    return await Veiculo.query() //Retorno o veiculo com a posicao
      .select('*')
      .where('id', '=', veiculo['id'])
      .with('posicao_veiculos')
      .fetch()

  }

  /**
   * Display a single veiculo.
   * GET veiculos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    let veiculos =  await Veiculo.find(params.id) //Recupero o veiculo pelo ID

    if(!veiculos){
      return response.status(400).json({message: 'ID inválido'}) //Caso falhe
    }

    veiculos = veiculos.toJSON()

    for(let i = 0; i < veiculos.length; i++){
      veiculos[i].linha = (await Linha.findOrFail(veiculos[i].linha_id)).nome //Recupero a linha de cada um
    }

    return veiculos
  }

  /**
   * Update veiculo details.
   * PUT or PATCH veiculos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    //Recupero os dados necessários para atualizar um veiculo
    const data = request.only([
      'nome',
      'modelo',
      'linha_id'
    ])

    //Validacao dos dados
    const rules = {
      nome: `required|unique:veiculos,nome,id,${params.id}`,
      modelo: 'required',
      linha_id: 'required|number|min:0'
    }

    //Mensagens personalizadas caso a validacao falhe
    const messages = {
      'nome.required': 'É preciso informar um nome',
      'nome.unique': 'O nome não pode ser repetido',
      'modelo.required': 'É precisa informar um modelo',
      'linha_id.required': 'É preciso informar a linha do veículo',
      'linha_id.number': 'Informe o ID da linha do veículo',
      'linha_id.min': 'ID da linha inválido'
    }

    const validacao = await validate(data, rules, messages)

    //Se a validacao falhar retorna o erro
    if(validacao.fails()){
      let mensagem = (validacao.messages())[0].message
      return response.status(400).json({message: mensagem})
    }

    if(!await Linha.find(data.linha_id)){ //Recupero a linha
      return response.status(400).json({message: 'ID da linha inválido'}) //Caso falhe
    }

    let veiculo = await Veiculo.find(params.id) //Recupero o veiculo
    
    if(!veiculo){
      return response.status(400).json({message: 'ID inválido'}) //Caso falhe
    }

    await veiculo.merge(data) //Atualizo os dados

    await veiculo.save() //Salvo

    veiculo = await Veiculo.query() //Recupero os dados do veiculo com a posicao
      .select('*')
      .where('id', '=', params.id)
      .fetch()

    veiculo = veiculo.toJSON()

    veiculo[0].linha = (await Linha.findOrFail(veiculo[0].linha_id)).nome //E a linha

    return veiculo


  }

  /**
   * Delete a veiculo with id.
   * DELETE veiculos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try{
      const veiculo = await Veiculo.findOrFail(params.id) //Recupero o veiculo pelo ID
      await veiculo.delete()
    }catch(err){
      return response.status(400).json({message: 'ID inválido'}) //Caso falhe
    }
    
  }

  /**
   * Recupera as paradas de um veiculo
   * GET paradasVeiculo/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async paradasVeiculo ({ params, request, response }) {
    try{
      let veiculo = await Veiculo.find(params.id) //Recupero o veiculo pelo ID
      if(!veiculo){
        return response.status(400).json({message: 'ID inválido'}) //Caso falhe
      }

      veiculo = veiculo.toJSON()

      let linha = await Linha.find(veiculo.linha_id) //Recupero a linha do veiculo
      await linha.load('paradas') //E as paradas dessa linha
      linha = linha.toJSON()

      veiculo.paradas = linha.paradas //Adiciono as paradas as objeto
      return veiculo //E retorno

    }catch(err){
      return response.status(400).json({message: err.message})
    }
    
  }

}

module.exports = VeiculoController
