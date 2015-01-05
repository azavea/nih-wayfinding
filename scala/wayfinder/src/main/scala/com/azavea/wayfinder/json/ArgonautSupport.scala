package com.azavea.wayfinder.json

import argonaut.Json
import argonaut._
import Argonaut._
import spray.httpx.marshalling.BasicMarshallers._

import spray.http.{ ContentTypes, ContentTypeRange, HttpCharsets, HttpEntity, MediaTypes }
import spray.httpx.marshalling.Marshaller
import spray.httpx.unmarshalling.{ Deserialized, MalformedContent, SimpleUnmarshaller, Unmarshaller }


/** A trait providing automatic to and from JSON marshalling/unmarshalling
* using in-scope ''argonaut'' EncodeJson/DecodeJson.
* Note that ''argonaut-spray'' does not have an automatic dependency on
* ''argonaut'', ''spray'', or ''akka''.
* You'll need to provide the appropriate artifacts yourself.
*/
trait ArgonautSupport {
  /** marshall from a T that can be encoded to an Argonaut Json value */
    implicit def argonautMarshallerFromT[T](
implicit encodeJson: EncodeJson[T],
prettyPrinter: PrettyParams = PrettyParams.nospace
): Marshaller[T] =
Marshaller.delegate[T, String](ContentTypes.`application/json`)(value => {
  val enc = encodeJson.encode(value)
  prettyPrinter.pretty(enc)
}
)

/** unmarshall to a T that can be decoded from an Argonaut Json value */
implicit def argonautUnmarshallerToT[T : DecodeJson]: Unmarshaller[T] =
delegate[String, T](MediaTypes.`application/json`)(string =>
string.decodeEither[T].toEither.left.map(e => MalformedContent(e))
)(UTF8StringUnmarshaller)

private val UTF8StringUnmarshaller = new Unmarshaller[String] {
def apply(entity: HttpEntity) = Right(entity.asString(defaultCharset = HttpCharsets.`UTF-8`))
}


  /** marshall from an Argonaut Json value */
  implicit def argonautMarshallerFromJson(
    implicit prettyPrinter: PrettyParams = PrettyParams.nospace
  ): Marshaller[Json] =
    Marshaller.delegate[Json, String](ContentTypes.`application/json`)(jsValue =>
      prettyPrinter.pretty(jsValue)
    )

  /** unmarshall to an Argonaut Json value */
  implicit val argonautUnmarshallerToJson: Unmarshaller[Json] =
    delegate[String, Json](MediaTypes.`application/json`)(string =>
      JsonParser.parse(string).toEither.left.map(e => MalformedContent(e))
    )(UTF8StringUnmarshaller)

  // Unmarshaller.delegate is used as a kind of map operation; play-json JsResult can contain either validation errors or the JsValue
  // representing a JSON object. We need a delegate method that works as a flatMap and let the provided A => Deserialized[B] function
  // to deal with any possible error, including exceptions.
  //
  private def delegate[A, B](unmarshalFrom: ContentTypeRange*)(f: A => Deserialized[B])(implicit ma: Unmarshaller[A]): Unmarshaller[B] =
    new SimpleUnmarshaller[B] {
      val canUnmarshalFrom = unmarshalFrom
      def unmarshal(entity: HttpEntity) = ma(entity).right.flatMap(a => f(a))
    }
}

object ArgonautSupport extends ArgonautSupport
