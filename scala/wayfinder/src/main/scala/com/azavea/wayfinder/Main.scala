package com.azavea.wayfinder

import akka.io.IO
import akka.actor.{ActorSystem, Props}

import spray.can.Http

import com.typesafe.config.{ConfigFactory, Config}

import com.azavea.wayfinder.service.WayfinderServiceActor

object Main {


  def main(args: Array[String]) = {
    // We need an ActorSystem to host our service
    implicit val system = ActorSystem("wayfinder")

    // Create our service actor
    val service = system.actorOf(Props[WayfinderServiceActor], "wayfinder-service")

    // Bind our actor to HTTP
    IO(Http) ! Http.Bind(service, interface = "0.0.0.0", port = ConfigFactory.load.getInt("wayfinder.port"))
  }
}

