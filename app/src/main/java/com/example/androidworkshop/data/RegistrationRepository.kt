package com.example.androidworkshop.data

import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import com.example.androidworkshop.model.AttendanceValidationResult
import com.example.androidworkshop.model.ParticipantRegistration
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class RegistrationRepository(context: Context) {
    private val dbHelper = WorkshopDatabaseHelper(context.applicationContext)

    private val _registrations = MutableStateFlow<List<ParticipantRegistration>>(emptyList())
    val registrations: StateFlow<List<ParticipantRegistration>> = _registrations.asStateFlow()

    suspend fun refreshRegistrations() = withContext(Dispatchers.IO) {
        val list = mutableListOf<ParticipantRegistration>()
        val db = dbHelper.readableDatabase
        val cursor: Cursor = db.query(
            WorkshopDatabaseHelper.TABLE_REGISTRATIONS,
            null, null, null, null, null,
            "${WorkshopDatabaseHelper.COL_REGISTERED_AT} DESC"
        )
        cursor.use {
            val idIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_ID)
            val nameIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_NAME)
            val emailIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_EMAIL)
            val phoneIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_PHONE)
            val collegeIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_COLLEGE)
            val deptIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_DEPARTMENT)
            val yearIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_YEAR)
            val checkedInIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_CHECKED_IN)
            val checkInTimeIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_CHECK_IN_TIME)
            val regAtIdx = it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_REGISTERED_AT)

            while (it.moveToNext()) {
                list.add(
                    ParticipantRegistration(
                        id = it.getString(idIdx),
                        name = it.getString(nameIdx),
                        email = it.getString(emailIdx),
                        phone = it.getString(phoneIdx),
                        college = it.getString(collegeIdx),
                        department = it.getString(deptIdx),
                        year = it.getString(yearIdx),
                        checkedIn = it.getInt(checkedInIdx) == 1,
                        checkInTime = it.getString(checkInTimeIdx),
                        registeredAt = it.getString(regAtIdx)
                    )
                )
            }
        }
        _registrations.value = list
    }

    suspend fun getById(id: String): ParticipantRegistration? = withContext(Dispatchers.IO) {
        val cleanId = id.trim().uppercase(Locale.US)
        val db = dbHelper.readableDatabase
        val cursor = db.query(
            WorkshopDatabaseHelper.TABLE_REGISTRATIONS,
            null,
            "${WorkshopDatabaseHelper.COL_ID} = ?",
            arrayOf(cleanId),
            null, null, null
        )
        cursor.use {
            if (it.moveToFirst()) {
                ParticipantRegistration(
                    id = it.getString(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_ID)),
                    name = it.getString(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_NAME)),
                    email = it.getString(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_EMAIL)),
                    phone = it.getString(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_PHONE)),
                    college = it.getString(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_COLLEGE)),
                    department = it.getString(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_DEPARTMENT)),
                    year = it.getString(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_YEAR)),
                    checkedIn = it.getInt(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_CHECKED_IN)) == 1,
                    checkInTime = it.getString(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_CHECK_IN_TIME)),
                    registeredAt = it.getString(it.getColumnIndexOrThrow(WorkshopDatabaseHelper.COL_REGISTERED_AT))
                )
            } else null
        }
    }

    suspend fun register(participant: ParticipantRegistration): Boolean = withContext(Dispatchers.IO) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put(WorkshopDatabaseHelper.COL_ID, participant.id.trim().uppercase(Locale.US))
            put(WorkshopDatabaseHelper.COL_NAME, participant.name.trim())
            put(WorkshopDatabaseHelper.COL_EMAIL, participant.email.trim())
            put(WorkshopDatabaseHelper.COL_PHONE, participant.phone.trim())
            put(WorkshopDatabaseHelper.COL_COLLEGE, participant.college.trim())
            put(WorkshopDatabaseHelper.COL_DEPARTMENT, participant.department.trim())
            put(WorkshopDatabaseHelper.COL_YEAR, participant.year.trim())
            put(WorkshopDatabaseHelper.COL_CHECKED_IN, if (participant.checkedIn) 1 else 0)
            put(WorkshopDatabaseHelper.COL_CHECK_IN_TIME, participant.checkInTime)
            put(WorkshopDatabaseHelper.COL_REGISTERED_AT, participant.registeredAt)
        }
        val rowId = db.insertWithOnConflict(
            WorkshopDatabaseHelper.TABLE_REGISTRATIONS,
            null,
            values,
            android.database.sqlite.SQLiteDatabase.CONFLICT_REPLACE
        )
        if (rowId != -1L) {
            refreshRegistrations()
            true
        } else false
    }

    suspend fun markAttendance(rawId: String): AttendanceValidationResult = withContext(Dispatchers.IO) {
        val id = extractId(rawId)
        val existing = getById(id) ?: return@withContext AttendanceValidationResult.NotFound(id)

        if (existing.checkedIn) {
            return@withContext AttendanceValidationResult.Duplicate(existing)
        }

        val timeFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())
        val checkInTime = timeFormat.format(Date())

        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put(WorkshopDatabaseHelper.COL_CHECKED_IN, 1)
            put(WorkshopDatabaseHelper.COL_CHECK_IN_TIME, checkInTime)
        }
        db.update(
            WorkshopDatabaseHelper.TABLE_REGISTRATIONS,
            values,
            "${WorkshopDatabaseHelper.COL_ID} = ?",
            arrayOf(id)
        )

        val updated = existing.copy(checkedIn = true, checkInTime = checkInTime)
        refreshRegistrations()
        AttendanceValidationResult.Success(updated)
    }

    fun extractId(raw: String): String {
        val trimmed = raw.trim()
        val upper = trimmed.uppercase(Locale.US)
        // Check if plain ID
        if (upper.startsWith("REG-")) {
            return upper.take(14)
        }
        // Match regex for REG-... in URL or text
        val regMatch = Regex("REG-[A-Z0-9]{4,10}", RegexOption.IGNORE_CASE).find(trimmed)
        if (regMatch != null) {
            return regMatch.value.uppercase(Locale.US)
        }
        return upper
    }
}
