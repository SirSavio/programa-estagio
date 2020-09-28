'use strict'

class SessionController {
  async create ({ request, auth }) { 
    const { usuario, senha } = request.all()

    const token = await auth.attempt(usuario, senha)

    return token
  }
}

module.exports = SessionController
