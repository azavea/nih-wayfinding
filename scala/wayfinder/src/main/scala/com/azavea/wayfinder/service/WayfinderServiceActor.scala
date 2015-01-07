package com.azavea.wayfinder.service

import akka.actor.{Actor}
import spray.util.LoggingContext
import spray.routing.ExceptionHandler
import spray.http.{HttpResponse, HttpRequest, Timedout}

import spray.http.StatusCodes.InternalServerError
import spray.routing.{ExceptionHandler, HttpService}

import scala.concurrent._

import com.azavea.wayfinder.service.route._

class WayfinderServiceActor extends Actor with WayfinderService {
  // This is the execution context to use for this Actor
  implicit val dispatcher = context.dispatcher

  // The HttpService trait (which GeoTrellisService will extend) defines
  // only one abstract member, which connects the services environment
  // to the enclosing actor or test.
  def actorRefFactory = context

  // timeout handling, from here:
  // http://spray.io/documentation/1.1-SNAPSHOT/spray-routing/key-concepts/timeout-handling/
  // return JSON message instead of default string message:
  // The server was not able to produce a timely response to your request.
  def handleTimeouts: Receive = {
    case Timedout(x: HttpRequest) =>
      sender ! HttpResponse(InternalServerError,
        """{ "success": false, "message": "Spray timeout encountered" }""")
  }

  def receive = runRoute(handleTimeouts orElse runRoute(wayfinderRoute))
}

trait WayfinderService
  extends BaseRoute
  with FindWay
{

  def wayfinderRoute =
    pathPrefix("wf") {
      findWay
    }
}
