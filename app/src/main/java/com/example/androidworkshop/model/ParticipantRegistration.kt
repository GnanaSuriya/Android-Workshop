package com.example.androidworkshop.model

data class ParticipantRegistration(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val college: String,
    val department: String,
    val year: String,
    val checkedIn: Boolean = false,
    val checkInTime: String? = null,
    val registeredAt: String = ""
)

object WorkshopConstants {
    const val NAME = "Android Development Workshop"
    const val CLUB = "Android Club"
    const val DATE = "SAT, 18 OCT"
    const val TIME = "10:00 AM – 1:00 PM"
    const val VENUE = "Android Lab · Block A"
    const val DESCRIPTION = "A hands-on Android Development Workshop for builders ready to ship."
}

sealed class AttendanceValidationResult {
    data class Success(val participant: ParticipantRegistration) : AttendanceValidationResult()
    data class Duplicate(val participant: ParticipantRegistration) : AttendanceValidationResult()
    data class NotFound(val id: String) : AttendanceValidationResult()
}
