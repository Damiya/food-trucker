package controllers

import com.vividsolutions.jts.geom.Geometry
import models.{PermitStatus, FacilityType, MobileFoodFacility, MFFQueries}
import play.api.db.slick._
import play.api.libs.json._
import play.api.Play.current
import play.api.mvc._
import utils.{JSONFormatters, Logging, GeoHelper}

import scala.concurrent.Future

object FacilityController extends Controller with JSONFormatters with Logging {

  def findNearbyFacilities(lat: Double, lng: Double, limit: Int) = Action { implicit request =>
    DB.withSession { implicit s =>
      val targetPoint = GeoHelper.createPoint(lat, lng)
      val facilities = MFFQueries.findNearby(targetPoint, limit)
      Ok(Json.toJson(facilities))
    }
  }

  def findFacilitiesWithinBoundingBox(maybeNeLat: Option[Double], maybeNeLng: Option[Double], maybeSwLat: Option[Double], maybeSwLng: Option[Double]) = Action { implicit request =>
    val boundingBox: Option[Geometry] = for {// This option will be Some(Envelope) if all of the params are present
      neLat <- maybeNeLat
      neLng <- maybeNeLng
      swLat <- maybeSwLat
      swLng <- maybeSwLng
    } yield {
      val northeastPoint = GeoHelper.createPoint(neLat, neLng)
      val southwestPoint = GeoHelper.createPoint(swLat, swLng)
      GeoHelper.createBoundingBox(northeastPoint, southwestPoint)
    }
    DB.withSession { implicit s => Session
      boundingBox.map { boundingBox =>
        val facilities = MFFQueries.findWithinBoundingBox(boundingBox)
        Ok(Json.toJson(facilities))
      } getOrElse {
        BadRequest("Must specify all four params")
      }
    }


  }


}
