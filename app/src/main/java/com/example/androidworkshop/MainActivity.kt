package com.example.androidworkshop

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.example.androidworkshop.ui.screens.AttendanceResultScreen
import com.example.androidworkshop.ui.screens.CoordinatorScreen
import com.example.androidworkshop.ui.screens.DigitalPassScreen
import com.example.androidworkshop.ui.screens.LandingScreen
import com.example.androidworkshop.ui.screens.RegistrationFormScreen
import com.example.androidworkshop.ui.screens.SuccessScreen
import com.example.androidworkshop.ui.theme.AndroidWorkshopTheme
import com.example.androidworkshop.ui.viewmodel.CoordinatorTab
import com.example.androidworkshop.ui.viewmodel.WorkshopViewModel

enum class AppScreen {
    LANDING,
    FORM,
    SUCCESS,
    PASS,
    COORDINATOR,
    ATTENDANCE_RESULT
}

class MainActivity : ComponentActivity() {
    private val viewModel: WorkshopViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            AndroidWorkshopTheme {
                MainApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun MainApp(viewModel: WorkshopViewModel) {
    var currentScreen by remember { mutableStateOf(AppScreen.LANDING) }
    val currentRegistration by viewModel.currentRegistration.collectAsState()
    val attendanceResult by viewModel.attendanceResult.collectAsState()

    // Handle Android system back gestures
    BackHandler(enabled = currentScreen != AppScreen.LANDING) {
        currentScreen = when (currentScreen) {
            AppScreen.FORM -> AppScreen.LANDING
            AppScreen.SUCCESS -> AppScreen.LANDING
            AppScreen.PASS -> AppScreen.SUCCESS
            AppScreen.COORDINATOR -> AppScreen.LANDING
            AppScreen.ATTENDANCE_RESULT -> AppScreen.COORDINATOR
            AppScreen.LANDING -> AppScreen.LANDING
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .windowInsetsPadding(WindowInsets.safeDrawing)
    ) {
        AnimatedContent(
            targetState = currentScreen,
            transitionSpec = { fadeIn() togetherWith fadeOut() },
            label = "screen_transition"
        ) { screen ->
            when (screen) {
                AppScreen.LANDING -> {
                    LandingScreen(
                        onRegisterClick = { currentScreen = AppScreen.FORM },
                        onCoordinatorClick = { currentScreen = AppScreen.COORDINATOR }
                    )
                }
                AppScreen.FORM -> {
                    RegistrationFormScreen(
                        viewModel = viewModel,
                        onBackClick = { currentScreen = AppScreen.LANDING },
                        onRegistrationSuccess = { reg ->
                            viewModel.setCurrentRegistration(reg)
                            currentScreen = AppScreen.SUCCESS
                        }
                    )
                }
                AppScreen.SUCCESS -> {
                    if (currentRegistration != null) {
                        SuccessScreen(
                            registration = currentRegistration!!,
                            onViewPassClick = { currentScreen = AppScreen.PASS },
                            onHomeClick = { currentScreen = AppScreen.LANDING }
                        )
                    } else {
                        currentScreen = AppScreen.LANDING
                    }
                }
                AppScreen.PASS -> {
                    if (currentRegistration != null) {
                        DigitalPassScreen(
                            registration = currentRegistration!!,
                            onBackClick = { currentScreen = AppScreen.SUCCESS }
                        )
                    } else {
                        currentScreen = AppScreen.LANDING
                    }
                }
                AppScreen.COORDINATOR -> {
                    CoordinatorScreen(
                        viewModel = viewModel,
                        onBackClick = { currentScreen = AppScreen.LANDING },
                        onValidationResult = {
                            currentScreen = AppScreen.ATTENDANCE_RESULT
                        }
                    )
                }
                AppScreen.ATTENDANCE_RESULT -> {
                    if (attendanceResult != null) {
                        AttendanceResultScreen(
                            result = attendanceResult!!,
                            onDoneClick = {
                                viewModel.clearAttendanceResult()
                                currentScreen = AppScreen.COORDINATOR
                            },
                            onScanAnotherClick = {
                                viewModel.clearAttendanceResult()
                                viewModel.setCoordinatorTab(CoordinatorTab.SCAN)
                                currentScreen = AppScreen.COORDINATOR
                            }
                        )
                    } else {
                        currentScreen = AppScreen.COORDINATOR
                    }
                }
            }
        }
    }
}
