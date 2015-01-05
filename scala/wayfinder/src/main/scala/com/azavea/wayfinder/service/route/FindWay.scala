package com.azavea.wayfinder.service.route

import argonaut._
import Argonaut._

import spray.routing._
import spray.routing.HttpService

import scala.concurrent._

import spray.httpx.marshalling.BasicMarshallers._
import com.azavea.wayfinder.json.ArgonautSupport._
import com.azavea.wayfinder.json.RoutingRequestParams.RouteParamsJson._

import com.azavea.wayfinder.service.BaseRoute

trait FindWay extends BaseRoute {

  def findWay =
    path("findway") {
      get {
        parameters(
          'parameter ? "defaultParameter"
        ) { (parameter) =>
          complete {
            ("parameter" := parameter) ->: jEmptyObject
          }
        }
      }
    }
}

