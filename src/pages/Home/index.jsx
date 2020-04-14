import React, { useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Calendar from '@material-ui/icons/CalendarToday'
import { Meses } from '../../Mocks/CardMocks'
import { Link, useHistory } from 'react-router-dom'

import { currentMonth } from '../../Utils/Dates'
import removerAcentos from '../../Utils/RemoverAcento'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

export default function Home() {
  const classes = useStyles()
  const history = useHistory()

  //Getting redux states
  const { isLogged } = useSelector(
    (state) => ({
      isLogged: state.auth.isLogged,
    }),
    shallowEqual
  )

  useEffect(() => {
    if (!isLogged) {
      history.push('/')
    }
  }, [isLogged, history])

  return (
    <>
      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader component='div' id='nested-list-subheader'>
            Selecione o mês desejado
          </ListSubheader>
        }
        className={classes.root}
      >
        {Meses.filter((mes) => mes.id <= currentMonth).map((mes) => (
          <Link
            key={mes.id}
            style={{ textDecoration: 'none', color: 'white' }}
            to={`${removerAcentos(mes.descricao).toLowerCase()}`}
          >
            <ListItem button>
              <ListItemIcon>
                <Calendar />
              </ListItemIcon>
              <ListItemText primary={mes.descricao} />
            </ListItem>
          </Link>
        ))}
      </List>
    </>
  )
}
