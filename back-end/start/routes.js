'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'OK' }
})

Route.group(() => {
  Route.post('/user', 'UserController.create');
  Route.post('/login', 'SessionController.create');
})//.middleware(new Map([
//  [['user.create'], ['auth']]
//]));


//Rotas posição veiculo
Route.resource('/posicao_veiculo', 'PosicaoVeiculoController')
  .apiOnly()
  .except(['store', 'destroy'])
  //.middleware(new Map([
//    [['posicao_veiculo.update'], ['auth']]
//  ]));

//Rotas veiculos
Route.resource('/veiculo', 'VeiculoController')
  .apiOnly()
  //.middleware(new Map([
//    [['veiculo.update', 'veiculo.store', 'veiculo.delete'], ['auth']]
//  ]));

//Rotas linhas
Route.resource('/linhas', 'LinhaController')
  .apiOnly()
  //.middleware(new Map([
//    [['linhas.update', 'linhas.store', 'linhas.delete'], ['auth']]
//  ]));

//Rotas paradas
Route.resource('/paradas', 'ParadaController')
  .apiOnly()
  //.middleware(new Map([
//    [['paradas.update', 'paradas.store', 'paradas.delete'], ['auth']]
//  ]));

//Rotas obrigatorias
Route.group(() => {
  Route.get('/linhasParada/:id', 'ParadaController.linhasParada')
  Route.get('/veiculosLinha/:id', 'LinhaController.veiculosLinha')
})

//Rotas extras
Route.group(() => {
  Route.get('/paradasLinha/:id', 'LinhaController.paradasLinha')
  Route.get('/paradasVeiculo/:id', 'VeiculoController.paradasVeiculo')

  Route.post('/paradaProxima/', 'ParadaController.paradaProxima')
  Route.post('/paradaProximaLinha/', 'LinhaController.paradaProximaLinha')
})