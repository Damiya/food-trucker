package models

import com.vividsolutions.jts.geom.{Envelope, Point, Geometry}
import models.FacilityType.FacilityType
import models.PermitStatus.PermitStatus
import play.api.Logger
import play.api.libs.json.JsValue
import utils.CorePostgresDriver.simple._
import utils.GeoHelper

object FacilityType extends Enumeration {
  type FacilityType = Value
  val PushCart = Value("Push Cart")
  val Truck = Value("Truck")
}

object PermitStatus extends Enumeration {
  type PermitStatus = Value
  val Approved = Value("APPROVED")
  val Requested = Value("REQUESTED")
  val PostApproved = Value("POSTAPPROVED")
  val Expired = Value("EXPIRED")
  val OnHold = Value("ONHOLD")
  val Status = Value("SUSPEND")
}

/**
 * Represents a food truck or push cart.
 * @param location_id Mostly-Unique ID representing a given location
 * @param applicant Operator name
 * @param facility_type
 * @param location_description Cross streets
 * @param address
 * @param permit_id Operator's permit id
 * @param permit_status Operator's permit status
 * @param food_items Free response from operator with info on what facility sells
 * @param location Point representing Lat Lng
 */
case class MobileFoodFacility(
                               location_id: Long,
                               applicant: String,
                               facility_type: Option[FacilityType],
                               location_description: String,
                               address: Option[String],
                               permit_id: String,
                               permit_status: PermitStatus,
                               food_items: Option[String],
                               location: Option[Point])

/**
 * Class used by the ORM to map a Model to its DB representation
 * @param tag
 */
class MobileFoodFacilityTable(tag: Tag) extends Table[MobileFoodFacility](tag, "mobile_food_facility") {
  def location_id = column[Long]("location_id", O.NotNull)

  def applicant = column[String]("applicant", O.NotNull)

  def facility_type = column[FacilityType]("facility_type", O.Nullable)

  def location_description = column[String]("location_description", O.NotNull)

  def address = column[String]("address", O.Nullable)

  def permit_id = column[String]("permit_id", O.NotNull)

  def permit_status = column[PermitStatus]("permit_status", O.NotNull)

  def food_items = column[String]("food_items", O.Nullable)

  def location = column[Point]("location", O.Nullable)

  def * = (location_id, applicant, facility_type.?, location_description, address.?, permit_id, permit_status, food_items.?,
    location.?) <>(MobileFoodFacility.tupled, MobileFoodFacility.unapply)
}

/**
 * Provides type-safe access to the DB
 */
object MFFQueries {
  val logger = Logger("application")
  val tableRef = TableQuery[MobileFoodFacilityTable]

  def insert(value: MobileFoodFacility)(implicit session: Session): Unit = {
    // As far as I can tell any duplicate entries represent the same location entered multiple ways.
    // Possibly different corners of the intersection
    val exists = tableRef.filter(facility => facility.location_id === value.location_id).exists.run
    if (!exists) {
      tableRef.insert(value)
    } else {
      // We could potentially do an update if it exists, but I'm just going to log them for now.
      logger.warn(s"Duplicate entry discarded for ${value.location_id}")
    }
  }

  def findByLocationId(id: Long)(implicit session: Session): Option[MobileFoodFacility] = {
    tableRef.filter(_.location_id === id).firstOption
  }

  def findNearby(point: Geometry, limit: Int)(implicit session: Session): List[MobileFoodFacility] = {
    tableRef.sortBy(_.location.distanceSphere(point))
      .take(limit)
      .list
  }

  def findWithinBoundingBox(boundingBox: Geometry)(implicit session: Session): List[MobileFoodFacility] = {
    tableRef.filter(boundingBox.bind contains _.location)
      .list
  }
}