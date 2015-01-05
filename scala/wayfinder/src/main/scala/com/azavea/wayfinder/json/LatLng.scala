package com.azavea.wayfinder.json

import argonaut._, Argonaut._

object LatLngJson {

  case class LatLng(
    lat: Double,
    lng: Double
  )

  implicit def LatLngCodecJson: CodecJson[LatLng] =
    CodecJson(
      (p: LatLng) =>
        ("lat" := p.lat) ->:
        ("lng" := p.lng) ->:
        jEmptyObject,
      c => for {
        lat <- (c --\ "lat").as[Double]
        lng <- (c --\ "lng").as[Double]
      } yield LatLng(lat, lng))
}


