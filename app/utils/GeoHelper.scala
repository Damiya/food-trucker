package utils

import com.vividsolutions.jts.geom._

object GeoHelper {
  val SRID = 4326
  val precisionModel = new PrecisionModel()
  val geometryFactory = new GeometryFactory(precisionModel, SRID)

  def createPoint(latitude: Double, longitude: Double): Point = {
    val coordinate = new Coordinate(latitude, longitude)
    geometryFactory.createPoint(coordinate)
  }

  def createBoundingBox(nePoint: Point, swPoint: Point): Geometry = {
    val envelope = new Envelope(nePoint.getCoordinate, swPoint.getCoordinate)
    geometryFactory.toGeometry(envelope)
  }
}
