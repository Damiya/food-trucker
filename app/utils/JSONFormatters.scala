package utils

import com.vividsolutions.jts.geom.Point
import models.{PermitStatus, FacilityType, MobileFoodFacility}
import play.api.libs.json._

trait JSONFormatters {
  implicit val facilityTypeFormat = EnumUtils.enumStringFormat(FacilityType)
  implicit val permitStatusFormat = EnumUtils.enumStringFormat(PermitStatus)
  implicit val pointFormatter = new Format[Point] {
    override def reads(json:JsValue):JsResult[Point] = {
      val jsResult = json.validate[Seq[Double]]
      jsResult.fold(
      invalid => JsError(invalid),
       // This could potentially deserialize wrong, but it's good enough for MVP
      valid => JsSuccess(GeoHelper.createPoint(valid(0), valid(1)))
      )
    }

    override def writes(o:Point):JsValue = {
      Json.toJson(Seq(o.getX,o.getY))
    }
  }
  implicit val mobileFoodFacilityFormat = Json.format[MobileFoodFacility]
}
