name := """food-trucker"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  json,
  "org.slf4j" % "slf4j-nop" % "1.6.4",
  // DB libs
  "org.postgresql" % "postgresql" % "9.3-1100-jdbc4",
  "com.typesafe.slick" %% "slick" % "2.1.0",
  "com.typesafe.play" %% "play-slick" % "0.8.0",
  "com.github.tminglei" %% "slick-pg" % "0.6.1",
  "com.github.tminglei" %% "slick-pg_jts" % "0.6.1", // PostgresGIS
  "com.github.tminglei" %% "slick-pg_joda-time" % "0.6.1"
)
