# Android Club Workshop Registration App

A native Android application built with Jetpack Compose and Kotlin for the Android Club workshop registration and attendance management system.

## Features
- 🎨 **Aurora Glass & Modern Dark UI**: Sleek dark space aesthetic with glowing radial aurora gradients and glassmorphic translucent cards.
- 📋 **Workshop Registration Form**: Live input validation for Full Name, Email, Phone, College, Department, and Year of study.
- 🆔 **Unique Registration ID Generator**: Automatically generates unique registration IDs formatted as `REG-XXXXXX`.
- 📱 **Native QR Code Generation**: High-resolution, offline QR code generation using ZXing.
- 🎫 **Digital QR Pass**: Ticket layout with participant details, workshop schedule, and scannable QR pass.
- 📤 **Android Integrations**: Native Share Intent to share passes and Calendar Contract integration to add the event to Google Calendar.
- 🛡️ **Coordinator Attendance Panel**:
  - **Scan QR**: Camera viewfinder with animated scanning line and instant test scanner.
  - **Manual Validation**: Direct registration ID verification.
  - **Live Participant List**: Searchable list with live stats (Total, Checked In, Pending).
  - **Attendance Status**: Instant feedback for marked attendance, duplicate check-in warnings, and invalid IDs.
- 💾 **Local Persistence**: SQLite database storing registrations and attendance status offline.

## Tech Stack
- Kotlin 2.1
- Jetpack Compose with Material 3
- Android Architecture Components (ViewModel, StateFlow, Coroutines)
- ZXing Core for QR code generation
- SQLite for local persistence

## Architecture
- `MainActivity`: Single-activity architecture with animated Compose screen transitions.
- `WorkshopViewModel`: State management and reactive business logic.
- `RegistrationRepository` & `WorkshopDatabaseHelper`: Thread-safe database operations.
- `ui/screens`: Composable screens for Landing, Form, Success, Digital Pass, Coordinator, and Attendance Result.
