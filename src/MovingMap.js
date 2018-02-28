import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { MAPBOX_ACCESS_TOKEN } from './secrets'
import mapboxgl from 'mapbox-gl'
import { Debug } from './Debug'

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`

const cameraProp = PropTypes.shape({
  center: PropTypes.shape({
    lng: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired
  }).isRequired,
  zoom: PropTypes.number.isRequired,
  bearing: PropTypes.number.isRequired,
  pitch: PropTypes.number.isRequired
})

class MovingMap extends Component {
  _container
  _map

  static propTypes = {
    initialStyle: PropTypes.string.isRequired,
    startView: cameraProp.isRequired,
    endView: cameraProp.isRequired
  }

  static defaultProps = {
    initialStyle: 'mapbox/light-v9'
  }

  reset = () => {
    this._map.jumpTo(this.props.startView)
  }

  forward = () => {
    this._map.flyTo(this.props.endView)
  }

  backward = () => {
    this._map.flyTo(this.props.startView)
  }

  componentDidMount() {
    const {
      initialStyle,
      startView: { center, zoom, bearing, pitch }
    } = this.props

    const options = {
      container: this._container,
      style: `mapbox://styles/${initialStyle}`,
      center,
      zoom,
      bearing,
      pitch
    }
    this._map = new mapboxgl.Map(options)
  }

  shouldComponentUpdate(nextProps) {
    return this.props.stop !== nextProps.stop
  }

  componentWillUpdate(nextProps) {
    nextProps.stop === 0 && this.reset()
    nextProps.stop === 1 && this.forward()
  }

  componentWillUnmount() {
    this._map.remove()
  }

  render() {
    const { debug } = this.props
    return (
      <MapContainer innerRef={el => (this._container = el)}>
        {debug && <Debug map={this} />}
      </MapContainer>
    )
  }
}

export { MovingMap }
