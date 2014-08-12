package utils

import play.api.libs.json._

// Courtesy https://gist.github.com/mikesname/5237809
object EnumUtils {
  def enumStringWrites[E <: Enumeration]: Writes[E#Value] = new Writes[E#Value] {
    def writes(v: E#Value): JsValue = JsString(v.toString)
  }

  def enumStringReads[E <: Enumeration](enum: E): Reads[E#Value] = new Reads[E#Value] {
    def reads(json: JsValue): JsResult[E#Value] = json match {
      case JsString(s) =>
        try {
          JsSuccess(enum.withName(s))
        } catch {
          case t: Throwable => JsError(s"Invalid Enumeration for $s")
        }
      case _ => JsError("String Value expected")
    }
  }

  def enumStringFormat[E <: Enumeration](enum: E): Format[E#Value] = {
    Format(enumStringReads(enum), enumStringWrites)
  }
}
