package com.azavea.wayfinder.json

import argonaut._, Argonaut._

import LatLngJson._

object RouteParamsJson {

  case class RouteParams(
    wheels: Boolean,
    challenge: String,
    origin: LatLng,
    destination: LatLng,
    walkLength: Double,
    options: String
  )

  implicit def RouteParamsCodecJson: CodecJson[RouteParams] =
    CodecJson(
      (p: RouteParams) =>
        ("wheels" := p.wheels) ->:
        ("challenge" := p.challenge) ->:
        ("origin" := p.origin) ->:
        ("destination" := p.destination) ->:
        ("walkLength" := p.walkLength) ->:
        ("options" := p.options) ->:
        jEmptyObject,
      c => for {
        wheels <- (c --\ "wheels").as[Boolean]
        challenge <- (c --\ "challenge").as[String]
        origin <- (c --\ "origin").as[LatLng]
        destination <- (c --\ "destination").as[LatLng]
        walkLength <- (c --\ "walkLength").as[Double]
        options <- (c --\ "options").as[String]
      } yield RouteParams(wheels, challenge, origin, destination, walkLength, options))
}

