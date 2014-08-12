package utils

import models.{PermitStatus, FacilityType}
import slick.driver.PostgresDriver
import com.github.tminglei.slickpg.PgEnumSupport
import com.github.tminglei.slickpg.PgPostGISSupport

trait CorePostgresDriver extends PostgresDriver
with PgPostGISSupport
with PgEnumSupport {
  override lazy val Implicit = new ImplicitsPlus {}
  override val simple = new SimpleQLPlus {}

  trait EnumImplicits {
    implicit val facilityTypeMapper = createEnumJdbcType("facility_type", FacilityType)
    implicit val facilityTypeListMapper = createEnumListJdbcType("facility_type", FacilityType)
    implicit val permitStatusMapper = createEnumJdbcType("permit_status", PermitStatus)
    implicit val permitStatusListMapper = createEnumListJdbcType("permit_status", PermitStatus)
    implicit val facilityTypeExtensionMethodsBuilder = createEnumColumnExtensionMethodsBuilder(FacilityType)
    implicit val permitTypeExtensionMethodsBuilder = createEnumColumnExtensionMethodsBuilder(PermitStatus)
  }

  //////
  trait ImplicitsPlus extends Implicits
  with PostGISImplicits
  with EnumImplicits

  trait SimpleQLPlus extends SimpleQL
  with ImplicitsPlus
  with PostGISAssistants

}

object CorePostgresDriver extends CorePostgresDriver