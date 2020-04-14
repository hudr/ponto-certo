import React, { useState } from 'react'
import { usePosition } from 'use-position'
import Geocode from 'react-geocode'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

export default function Home() {
  const [destiny, setDestiny] = useState({})
  const [address, setAddress] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [distance, setDistance] = useState('')
  const { latitude, longitude, error } = usePosition(true)
  function getCoordsFromAddress(address) {
    Geocode.setApiKey('AIzaSyCZDDQuUVR-8sXcu6ztHxMH9qNq9hUTnoU')
    // set response language. Defaults to english.
    Geocode.setLanguage('en')
    Geocode.enableDebug()
    // Get latidude & longitude from address.
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location
        setDestiny({ latitude: lat, longitude: lng })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  function getCoordsUserAddress() {
    Geocode.setApiKey('AIzaSyCZDDQuUVR-8sXcu6ztHxMH9qNq9hUTnoU')
    // set response language. Defaults to english.
    Geocode.setLanguage('en')
    Geocode.enableDebug()
    Geocode.fromLatLng(latitude, longitude).then(
      (response) => {
        const address = response.results[0].formatted_address
        setUserAddress(address)
      },
      (error) => {
        console.error(error)
      }
    )
  }

  function getDistance() {
    var lat1 = latitude
    var radianLat1 = lat1 * (Math.PI / 180)
    var lng1 = longitude
    var radianLng1 = lng1 * (Math.PI / 180)
    var lat2 = destiny.latitude
    var radianLat2 = lat2 * (Math.PI / 180)
    var lng2 = destiny.longitude
    var radianLng2 = lng2 * (Math.PI / 180)
    var earth_radius = 3959 // or 6371 for kilometers
    var diffLat = radianLat1 - radianLat2
    var diffLng = radianLng1 - radianLng2
    var sinLat = Math.sin(diffLat / 2)
    var sinLng = Math.sin(diffLng / 2)
    var a =
      Math.pow(sinLat, 2.0) +
      Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0)
    var distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)))
    return setDistance(distance.toFixed(3) * 1000)
  }
  return (
    <>
      <Typography variant='h6' component='h6'>
        Localização Atual
      </Typography>
      <div style={{ marginBottom: '15px' }}>
        <Typography variant='subtitle1'>Latitude: {latitude}</Typography>
        <Typography variant='subtitle1'>Longitude: {longitude}</Typography>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <Typography variant='h6' component='h6'>
          Destino
        </Typography>
        <Typography variant='subtitle1'>
          Latitude: {destiny.latitude}
        </Typography>
        <Typography variant='subtitle1'>
          Longitude: {destiny.longitude}
        </Typography>
      </div>
      <TextField
        onChange={(e) => setAddress(e.target.value)}
        type='text'
        id='outlined-basic'
        label='Endereço'
        variant='outlined'
      />
      <p>
        <Button
          onClick={() => getCoordsFromAddress(address)}
          variant='contained'
          color='primary'
        >
          1. Pegar posição
        </Button>
      </p>
      <div style={{ paddingTop: '20px' }}>
        <Typography variant='h6' component='h6'>
          Distância: {distance && distance}m
        </Typography>
        {distance && distance <= 100 && (
          <Typography style={{ color: 'green' }} variant='h6' component='h6'>
            Você está no local!
          </Typography>
        )}
        <Button onClick={getDistance} variant='contained' color='primary'>
          2. Calcular distância
        </Button>
      </div>
      <div style={{ paddingTop: '40px' }}>
        <Typography variant='h6' component='h6'>
          Endereço: {userAddress && userAddress}
        </Typography>
        <p>
          <Button
            onClick={() => getCoordsUserAddress()}
            variant='contained'
            color='primary'
          >
            DESCOBRIR ONDE ESTOU
          </Button>
        </p>
      </div>
      {error && <h4>Error: {error}</h4>}
    </>
  )
}
