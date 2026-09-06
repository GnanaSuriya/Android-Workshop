# Android Workshop App

This is a native Android rewrite of the Android Workshop application, developed for an Android Development Workshop to handle registration and attendance verification using digital QR passes.

## Features

-   **Registration:** Participants can register for the workshop providing details like name, email, phone, college, department, and year of study.
-   **Digital Pass Generation:** A digital pass with a unique QR code is generated upon successful registration using ZXing.
-   **Coordinator Tools:** A panel to verify registrations. Uses ML Kit for robust in-app QR code scanning, as well as manual entry and participant lists.
-   **Data Persistence:** Uses Room Database for local data persistence.
-   **Modern UI:** Built fully with Jetpack Compose following Material 3 guidelines and a custom dark theme.

## Running Locally

1. Open the project in Android Studio.
2. Build and run the app on an emulator or physical device.
