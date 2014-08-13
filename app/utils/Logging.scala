package utils

import play.api.Logger

trait Logging {
  val logger = Logger("application")
}
