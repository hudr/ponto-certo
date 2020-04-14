import React from 'react'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Navigator from './Components/Navigator'
import Home from './pages/Home'
import Home2 from './pages/Home2'
import Month from './pages/Month'
import Error404 from './pages/404'

// Utils
import removerAcentos from './Utils/RemoverAcento'
import { currentMonth } from './Utils/Dates'

// Mock Mapping Routes
import { Meses } from './Mocks/CardMocks'

const explicitRoutes = [
  {
    path: '/',
    component: SignIn,
    exact: true,
  },
  {
    path: '/cadastrar',
    component: SignUp,
    exact: true,
  },
  {
    path: '/inicio',
    render: () => (
      <>
        <Navigator />
        <Home />
      </>
    ),
    exact: true,
  },
  {
    path: '/home2',
    render: () => (
      <>
        <Navigator />
        <Home2 />
      </>
    ),
    exact: true,
  },
  {
    path: '*',
    component: Error404,
  },
]

const mesesRoutes = Meses.filter((mes) => mes.id <= currentMonth).map(
  (mes) => ({
    path: `/${removerAcentos(mes.descricao).toLowerCase()}`,
    render: () => (
      <>
        <Navigator />
        <Month month={`${mes.descricao}`} actualMonth={mes.id} />
      </>
    ),
    exact: true,
  })
)

const routes = [...mesesRoutes, ...explicitRoutes]

export default routes
