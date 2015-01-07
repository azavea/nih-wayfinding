package com.azavea.wayfinder.service.route

import spray.http.StatusCodes
import org.scalatest._
import spray.testkit.ScalatestRouteTest

import argonaut._, Argonaut._
import com.azavea.wayfinder.json.ArgonautSupport._

import com.azavea.wayfinder.json.RouteParamsJson._
import com.azavea.wayfinder.json.LatLngJson._

class FindWayRouteSpec extends FunSuite
  with ScalatestRouteTest
  with Matchers
  with FindWay
{
  def actorRefFactory = system
  implicit val dispatcher = actorRefFactory.dispatcher

  def root =
    sealRoute(
      pathPrefix("wf") {
        findWay
      }
    )

  test("Can receive json and properly interpret it") {
    val testEntity =
      RouteParams(
        wheels = true,
        challenge = "so tough",
        origin = LatLng(123.4, 432.1),
        destination = LatLng(87.212, 85.234),
        walkLength = 45.6,
        options = "opt1|opt2|opt3"
      )
    Post("/wf/findway", testEntity) ~> root ~> check {
      response.entity.asString should equal (f"""{"challenge\":"not so hard","options":"opt1|opt2|opt3","wheels":true,"origin":[432.1,123.4],"destination":[85.234,87.212],"walkLength":45.6}""")
      response.status should equal (StatusCodes.OK)
    }
  }
}
