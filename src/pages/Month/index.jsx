import React, { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { Creators as MarkActions } from '../../store/ducks/mark'
import { alertSuccessMessage, alertErrorMessage } from '../../Utils/SweetAlert'
import { makeStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { format, differenceInMinutes } from 'date-fns'
import { usePosition } from 'use-position'
import Geocode from 'react-geocode'
import { useHistory } from 'react-router-dom'
import { currentMonth } from '../../Utils/Dates'

const GOOGLEMAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY

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

function Month({ month, actualMonth }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const { latitude, longitude } = usePosition(true)

  //Getting redux states
  const { auth, marks } = useSelector(
    (state) => ({
      auth: state.auth.authUser,
      marks: state.marks.marks,
    }),
    shallowEqual
  )

  //Getting redux states
  const { isLogged, isLoading } = useSelector(
    (state) => ({
      isLogged: state.auth.isLogged,
      isLoading: state.auth.isLoading,
    }),
    shallowEqual
  )

  useEffect(() => {
    if (!isLogged) {
      history.push('/')
    }
  }, [isLogged, history])

  if (isLoading) {
    return <h1>Carregando...</h1>
  }

  const hasMarks = marks
    .filter((mark) => new Date(mark.markTime).getMonth() + 1 === actualMonth)
    .filter((mark) => mark.userUid === auth.userUid)

  let distance = 0

  async function getCoordsFromAddress() {
    Geocode.setApiKey(GOOGLEMAPS_KEY)
    // set response language. Defaults to english.
    Geocode.setLanguage('en')

    // Get latidude & longitude from address.
    await Geocode.fromAddress(auth.businessAddress).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location

        var lat1 = latitude
        var radianLat1 = lat1 * (Math.PI / 180)
        var lng1 = longitude
        var radianLng1 = lng1 * (Math.PI / 180)
        var lat2 = lat
        var radianLat2 = lat2 * (Math.PI / 180)
        var lng2 = lng
        var radianLng2 = lng2 * (Math.PI / 180)
        var earth_radius = 3959 // or 6371 for kilometers
        var diffLat = radianLat1 - radianLat2
        var diffLng = radianLng1 - radianLng2
        var sinLat = Math.sin(diffLat / 2)
        var sinLng = Math.sin(diffLng / 2)
        var a =
          Math.pow(sinLat, 2.0) +
          Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0)
        var distance2 = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)))
        distance = distance2.toFixed(3) * 1000
        return distance
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async function submitMark() {
    dispatch(MarkActions.getMarks())

    await getCoordsFromAddress()

    if (distance <= 150) {
      // Pegando última marcação
      let lastMark
      lastMark =
        hasMarks.slice(-1)[0] !== undefined ? hasMarks.slice(-1)[0] : undefined

      let markId
      let markDesc
      let isSameDay = false

      if (lastMark !== undefined) {
        isSameDay =
          new Date().getDate() === new Date(lastMark.markTime).getDate()
      }

      if (lastMark !== undefined && lastMark.markId === '3' && isSameDay) {
        return alertErrorMessage('Marcações de hoje já preenchidas!')
      } else if (lastMark === undefined) {
        markId = '0'
        markDesc = 'Entrada'
      } else if (
        lastMark !== undefined &&
        lastMark.markId === '0' &&
        isSameDay
      ) {
        markId = '1'
        markDesc = 'Almoço'
      } else if (
        lastMark !== undefined &&
        lastMark.markId === '1' &&
        isSameDay
      ) {
        if (
          differenceInMinutes(new Date(), new Date(lastMark.markTime)) >= 30
        ) {
          markId = '2'
          markDesc = 'Retorno'
        } else {
          return alertErrorMessage(
            'Por lei o retorno do almoço deve exceder 30 minutos!'
          )
        }
      } else if (
        lastMark !== undefined &&
        lastMark.markId === '2' &&
        isSameDay
      ) {
        markId = '3'
        markDesc = 'Saída'
      } else if (
        lastMark !== undefined &&
        lastMark.markId === '3' &&
        !isSameDay
      ) {
        markId = '0'
        markDesc = 'Entrada'
      } else if (lastMark !== undefined && !isSameDay) {
        markId = '0'
        markDesc = 'Entrada'
      }

      dispatch(
        MarkActions.submitUserMark({
          userUid: auth.userUid,
          userName: auth.userName,
          markId,
          markDesc,
          markTime: new Date(),
        })
      )

      //Display success message
      alertSuccessMessage('Marcação criada!')
    } else {
      alertErrorMessage(`Você está a ${distance} metros do trabalho!`)
    }
  }

  return (
    <>
      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader component='div' id='nested-list-subheader'>
            Mês selecionado: {month}
          </ListSubheader>
        }
        className={classes.root}
      >
        {hasMarks.length >= 1 ? (
          <>
            {hasMarks.map((mark) => (
              <ListItem key={mark.rowIndex}>
                <ListItemText
                  primary={mark.markDesc}
                  secondary={`Dia ${format(
                    new Date(mark.markTime),
                    "dd' às ' HH:mm'h'"
                  )}`}
                />
              </ListItem>
            ))}
          </>
        ) : (
          <ListItem>
            <ListItemText
              style={{ textAlign: 'center' }}
              primary='Oops!'
              secondary='Você não tem marcações neste mês.'
            />
          </ListItem>
        )}
      </List>

      {actualMonth === currentMonth && (
        <Button
          color='secondary'
          type='submit'
          fullWidth
          onClick={() => submitMark()}
          variant='contained'
        >
          REALIZAR MARCAÇÃO
        </Button>
      )}
    </>
  )
}

export default Month
