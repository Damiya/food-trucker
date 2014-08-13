package controllers

import models.{FacilityType, MFFQueries, MobileFoodFacility, PermitStatus}
import play.api.Play.current
import play.api.db.slick._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.{JsResultException, JsValue, Json}
import play.api.libs.ws._
import play.api.mvc._
import utils._

object Application extends Controller with JSONFormatters with Logging {
  val dataSourceUrl = "http://data.sfgov.org/resource/rqzj-sfat.json"


  def jsonToMFF(json: JsValue): Option[MobileFoodFacility] = {
    try {
      val locationId = (json \ "objectid").as[String].toLong
      val applicant = (json \ "applicant").as[String]

      val maybeFacilityType = (json \ "facilitytype").asOpt[String].map { facilityType =>
        FacilityType.withName(facilityType)
      }
      val locationDescription = (json \ "locationdescription").as[String]
      val maybeAddress = (json \ "address").asOpt[String]
      val permitId = (json \ "permit").as[String]
      val permitStatus = PermitStatus.withName((json \ "status").as[String])
      val maybeFoodItems = (json \ "fooditems").asOpt[String]
      val maybeLocation = for {
        latitude <- (json \ "latitude").asOpt[String] // We can't parse them out into Doubles directly, we'll have to parse to String and cast
        longitude <- (json \ "longitude").asOpt[String]
      } yield {
        GeoHelper.createPoint(latitude.toDouble, longitude.toDouble)
      }
      Some(MobileFoodFacility(locationId, applicant, maybeFacilityType, locationDescription, maybeAddress, permitId, permitStatus, maybeFoodItems, maybeLocation))
    } catch {
      case throwable: JsResultException =>
        logger.error("Failed to successfully parse MFF entry", throwable)
        None
    }
  }

  def loadData = Action.async { implicit request =>
    DB.withSession { implicit s =>
      WS.url(dataSourceUrl).get().map { response =>
        val jsonifiedBody = Json.parse(response.body).as[Seq[JsValue]]
        // Safely deserialize the json entries. Failed deserialization will result in None which gets dropped from the collection
        val validMobileFoodFacilities = jsonifiedBody.flatMap(jsonToMFF)
        validMobileFoodFacilities.foreach(MFFQueries.insert) // Iterate over each remaining entry and insert into the db
        Ok
      }
    }
  }

  def index = Action { implicit request =>
    Ok(views.html.index())
  }

}