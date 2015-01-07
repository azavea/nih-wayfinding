package com.azavea.wayfinder.service

import argonaut._
import Argonaut._

import spray.httpx.marshalling.BasicMarshallers._
import com.azavea.wayfinder.json.ArgonautSupport._

import spray.http.StatusCodes
import spray.routing.{ExceptionHandler, HttpService}
import scala.concurrent._
import spray.util.LoggingContext
import spray.routing._

import scala.util.Success

trait BaseRoute extends HttpService {
  // Required for marshalling futures
  implicit val dispatcher: ExecutionContext

  def successMessage(msg: String) =
    ("success" := true) ->: ("message" := msg.replace("\"", "'")) ->: jEmptyObject

  def failureMessage(msg: String) =
    ("success" := false) ->: ("message" := msg.replace("\"", "'")) ->: jEmptyObject

  implicit def myExceptionHandler(implicit log: LoggingContext) =
    ExceptionHandler {
      case e: Exception =>
        requestUri { uri =>
          log.warning("Request to {} could not be handled normally", uri)

          log.error(e.getMessage)
          log.error(e.getStackTrace.mkString("\n"))

          complete {
            ((StatusCodes.InternalServerError.toString := failureMessage(e.getMessage)) ->: jEmptyObject).asJson
          }
        }
    }
}
