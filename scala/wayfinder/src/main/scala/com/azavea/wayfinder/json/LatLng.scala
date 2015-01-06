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
        jNumber(p.lng) -->>:
        jNumber(p.lat) -->>:
        jEmptyArray,
      c => for {
        lng <- (c \\).as[Double] // down to array
        lat <- ((c \\) :->- 1 ).as[Double] // down to array and to the right 1
      } yield LatLng(lat, lng))
}


