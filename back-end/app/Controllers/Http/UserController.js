'use strict'

const User = use("App/Models/User")
const {validate} = use('Validator')

const messages = {
  'usuario.required': 'É preciso informar o usuário',
  'usuario.unique': 'O usuário deve ser único',
  'senha.required': 'É preciso informar a senha'
}

class UserController {
    async create ({ request, response }) {
        const data = request.only(["usuario", "senha"])

        //Validacao dos dados
        const rules = {
          usuario: 'required|unique:users',
          senha: 'required'
        }

        const validacao = await validate(data, rules, messages)

        //Se a validacao falhar retorna o erro
        if(validacao.fails()){
          let mensagem = (validacao.messages())[0].message
          return response.status(400).json({message: mensagem})
        }

        const user = await User.create(data)
    
        return user
      }
}

module.exports = UserController
