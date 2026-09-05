package com.example.androidworkshop.data

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import com.example.androidworkshop.model.ParticipantRegistration

class WorkshopDatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """
            CREATE TABLE $TABLE_REGISTRATIONS (
                $COL_ID TEXT PRIMARY KEY,
                $COL_NAME TEXT NOT NULL,
                $COL_EMAIL TEXT NOT NULL,
                $COL_PHONE TEXT NOT NULL,
                $COL_COLLEGE TEXT NOT NULL,
                $COL_DEPARTMENT TEXT NOT NULL,
                $COL_YEAR TEXT NOT NULL,
                $COL_CHECKED_IN INTEGER NOT NULL DEFAULT 0,
                $COL_CHECK_IN_TIME TEXT,
                $COL_REGISTERED_AT TEXT NOT NULL
            )
            """.trimIndent()
        )
        // Insert sample participants for quick demo & testing
        insertSample(db, "REG-AX7K29", "Aarav Mehta", "aarav.mehta@example.com", "+91 98765 43210", "Tech Institute of Technology", "Computer Science", "3rd Year", false, null)
        insertSample(db, "REG-BL4P81", "Priya Sharma", "priya.sharma@example.com", "+91 98123 45678", "National Institute of Design", "Information Tech", "2nd Year", true, "10:15 AM")
        insertSample(db, "REG-CQ9R12", "Rohan Verma", "rohan.v@example.com", "+91 99887 76655", "City College of Engineering", "Electronics", "4th Year", false, null)
    }

    private fun insertSample(
        db: SQLiteDatabase,
        id: String,
        name: String,
        email: String,
        phone: String,
        college: String,
        dept: String,
        year: String,
        checkedIn: Boolean,
        checkInTime: String?
    ) {
        val values = ContentValues().apply {
            put(COL_ID, id)
            put(COL_NAME, name)
            put(COL_EMAIL, email)
            put(COL_PHONE, phone)
            put(COL_COLLEGE, college)
            put(COL_DEPARTMENT, dept)
            put(COL_YEAR, year)
            put(COL_CHECKED_IN, if (checkedIn) 1 else 0)
            put(COL_CHECK_IN_TIME, checkInTime)
            put(COL_REGISTERED_AT, "2025-10-18T09:30:00Z")
        }
        db.insert(TABLE_REGISTRATIONS, null, values)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_REGISTRATIONS")
        onCreate(db)
    }

    companion object {
        private const val DATABASE_NAME = "android_workshop.db"
        private const val DATABASE_VERSION = 1

        const val TABLE_REGISTRATIONS = "registrations"
        const val COL_ID = "id"
        const val COL_NAME = "name"
        const val COL_EMAIL = "email"
        const val COL_PHONE = "phone"
        const val COL_COLLEGE = "college"
        const val COL_DEPARTMENT = "department"
        const val COL_YEAR = "year"
        const val COL_CHECKED_IN = "checked_in"
        const val COL_CHECK_IN_TIME = "check_in_time"
        const val COL_REGISTERED_AT = "registered_at"
    }
}
