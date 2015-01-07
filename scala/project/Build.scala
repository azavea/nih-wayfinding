import sbt._
import sbt.Keys._

object Build extends Build {

  override lazy val settings =
    super.settings ++ Seq(shellPrompt := { s => Project.extract(s).currentProject.id + " > " })

  lazy val root =
    Project("Wayfinder_ROOT", file("."))
      .aggregate(wayfinder)
      .settings(
        scalaVersion := "2.11.2"
      )

  lazy val wayfinder =
    Project("wayfinder", file("wayfinder"))
      .settings(
        name := "wayfinder",
        organization := "com.azavea",
        version := "0.1-SNAPSHOT",
        scalaVersion := "2.10.4",
        scalacOptions ++=
          Seq("-deprecation",
            "-unchecked",
            "-Yinline-warnings",
            "-language:implicitConversions",
            "-language:reflectiveCalls",
            "-language:postfixOps",
            "-language:existentials",
            "-feature"),

        libraryDependencies ++= Seq(
          "io.argonaut" %% "argonaut" % "6.0.4",

          "io.spray" %% "spray-routing" % "1.3.2",
          "io.spray" %% "spray-can" % "1.3.2",
          "io.spray" %% "spray-httpx" % "1.3.2",
          "com.typesafe.akka" %% "akka-actor" % "2.3.6",

          "io.spray" %% "spray-testkit" % "1.3.2" % "test",
          "org.scalatest" % "scalatest_2.10" % "2.2.0" % "test",
          "ch.qos.logback" % "logback-classic" % "1.1.1",
          "org.clapper" %% "grizzled-slf4j" % "1.0.2"
        )
      )
    .settings(spray.revolver.RevolverPlugin.Revolver.settings:_*)

}


