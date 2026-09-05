# Android Workshop Web

This is a web rewrite of the Android Workshop application, developed for an Android Development Workshop to handle registration and attendance verification using digital QR passes.

## Features Preserved

-   **Registration:** Participants can register for the workshop providing details like name, email, phone, college, department, and year of study.
-   **Digital Pass Generation:** A digital pass with a unique QR code is generated upon successful registration.
-   **Coordinator Tools:** A panel to manually verify registration using a REG-ID or search from the participant list, with QR scan visually simulated.
-   **Data Persistence:** Uses the browser's `localStorage` as an in-memory database to persist registration data across sessions.
-   **Aurora Theme:** The styling mimics the original Android application's `AuroraBackground` and `GlassCard` effects using Tailwind CSS and Framer Motion for smooth transitions.

## Running Locally

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
