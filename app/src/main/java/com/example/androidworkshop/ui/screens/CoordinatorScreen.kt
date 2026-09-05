package com.example.androidworkshop.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.outlined.CameraAlt
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Clear
import androidx.compose.material.icons.outlined.FormatListBulleted
import androidx.compose.material.icons.outlined.HourglassEmpty
import androidx.compose.material.icons.outlined.QrCodeScanner
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Tag
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.example.androidworkshop.model.ParticipantRegistration
import com.example.androidworkshop.ui.components.AuroraBackground
import com.example.androidworkshop.ui.components.GlassCard
import com.example.androidworkshop.ui.theme.AndroidGreen
import com.example.androidworkshop.ui.theme.BgDark
import com.example.androidworkshop.ui.theme.GlassBorder
import com.example.androidworkshop.ui.theme.GlassBorderFocus
import com.example.androidworkshop.ui.theme.GlassCardBg
import com.example.androidworkshop.ui.theme.TextLabel
import com.example.androidworkshop.ui.theme.TextPrimary
import com.example.androidworkshop.ui.theme.TextSecondary
import com.example.androidworkshop.ui.theme.WarnAmber
import com.example.androidworkshop.ui.viewmodel.CoordinatorTab
import com.example.androidworkshop.ui.viewmodel.WorkshopViewModel

@Composable
fun CoordinatorScreen(
    viewModel: WorkshopViewModel,
    onBackClick: () -> Unit,
    onValidationResult: () -> Unit
) {
    val selectedTab by viewModel.coordinatorTab.collectAsState()
    val registrations by viewModel.registrations.collectAsState()
    val filteredRegistrations by viewModel.filteredRegistrations.collectAsState()
    val manualInput by viewModel.manualInput.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()

    val context = LocalContext.current
    val focusManager = LocalFocusManager.current

    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        )
    }

    val cameraPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasCameraPermission = granted
    }

    AuroraBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
        ) {
            Spacer(modifier = Modifier.height(28.dp))

            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                IconButton(
                    onClick = onBackClick,
                    modifier = Modifier.testTag("btn_back_from_coordinator")
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back to landing",
                        tint = TextPrimary
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Coordinator Panel",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Tabs Selector
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GlassCardBg, RoundedCornerShape(14.dp))
                    .border(1.dp, GlassBorder, RoundedCornerShape(14.dp))
                    .padding(4.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                CoordinatorTabButton(
                    title = "Scan QR",
                    icon = Icons.Outlined.CameraAlt,
                    selected = selectedTab == CoordinatorTab.SCAN,
                    onClick = { viewModel.setCoordinatorTab(CoordinatorTab.SCAN) },
                    modifier = Modifier.weight(1f),
                    testTag = "tab_scan_qr"
                )
                CoordinatorTabButton(
                    title = "Manual",
                    icon = Icons.Outlined.Tag,
                    selected = selectedTab == CoordinatorTab.MANUAL,
                    onClick = { viewModel.setCoordinatorTab(CoordinatorTab.MANUAL) },
                    modifier = Modifier.weight(1f),
                    testTag = "tab_manual"
                )
                CoordinatorTabButton(
                    title = "List (${registrations.size})",
                    icon = Icons.Outlined.FormatListBulleted,
                    selected = selectedTab == CoordinatorTab.LIST,
                    onClick = { viewModel.setCoordinatorTab(CoordinatorTab.LIST) },
                    modifier = Modifier.weight(1.1f),
                    testTag = "tab_list"
                )
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Tab Content
            when (selectedTab) {
                CoordinatorTab.SCAN -> {
                    ScanQrTab(
                        hasPermission = hasCameraPermission,
                        onRequestPermission = { cameraPermissionLauncher.launch(Manifest.permission.CAMERA) },
                        recentRegistrations = registrations,
                        onScanId = { id ->
                            viewModel.validateId(id) {
                                onValidationResult()
                            }
                        }
                    )
                }
                CoordinatorTab.MANUAL -> {
                    ManualValidationTab(
                        value = manualInput,
                        onValueChange = { viewModel.updateManualInput(it) },
                        onValidate = {
                            focusManager.clearFocus()
                            viewModel.validateId(manualInput) {
                                onValidationResult()
                            }
                        },
                        recentRegistrations = registrations
                    )
                }
                CoordinatorTab.LIST -> {
                    RegistrationListTab(
                        registrations = filteredRegistrations,
                        totalCount = registrations.size,
                        searchQuery = searchQuery,
                        onSearchChange = { viewModel.updateSearchQuery(it) },
                        onSelectParticipant = { reg ->
                            viewModel.validateId(reg.id) {
                                onValidationResult()
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun CoordinatorTabButton(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    testTag: String
) {
    Surface(
        onClick = onClick,
        modifier = modifier
            .height(42.dp)
            .testTag(testTag),
        shape = RoundedCornerShape(10.dp),
        color = if (selected) AndroidGreen else Color.Transparent
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (selected) BgDark else TextSecondary,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
                color = if (selected) BgDark else TextSecondary
            )
        }
    }
}

@Composable
private fun ScanQrTab(
    hasPermission: Boolean,
    onRequestPermission: () -> Unit,
    recentRegistrations: List<ParticipantRegistration>,
    onScanId: (String) -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "scan_line")
    val scanLineProgress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "scan_line_progress"
    )

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        GlassCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(22.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Scan QR Code",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Point camera at participant's QR pass or select a test ID below.",
                    fontSize = 13.sp,
                    color = TextSecondary,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(18.dp))

                // Scanner Viewfinder Card
                Box(
                    modifier = Modifier
                        .size(240.dp)
                        .background(Color(0xFF0F1519), RoundedCornerShape(18.dp))
                        .border(1.dp, GlassBorder, RoundedCornerShape(18.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    // Corner Reticle Canvas
                    Canvas(modifier = Modifier.fillMaxSize().padding(24.dp)) {
                        val stroke = 4.dp.toPx()
                        val cornerLen = 28.dp.toPx()

                        // Top-Left
                        drawLine(AndroidGreen, Offset(0f, 0f), Offset(cornerLen, 0f), stroke)
                        drawLine(AndroidGreen, Offset(0f, 0f), Offset(0f, cornerLen), stroke)

                        // Top-Right
                        drawLine(AndroidGreen, Offset(size.width, 0f), Offset(size.width - cornerLen, 0f), stroke)
                        drawLine(AndroidGreen, Offset(size.width, 0f), Offset(size.width, cornerLen), stroke)

                        // Bottom-Left
                        drawLine(AndroidGreen, Offset(0f, size.height), Offset(cornerLen, size.height), stroke)
                        drawLine(AndroidGreen, Offset(0f, size.height), Offset(0f, size.height - cornerLen), stroke)

                        // Bottom-Right
                        drawLine(AndroidGreen, Offset(size.width, size.height), Offset(size.width - cornerLen, size.height), stroke)
                        drawLine(AndroidGreen, Offset(size.width, size.height), Offset(size.width, size.height - cornerLen), stroke)

                        // Animated Scanning Line
                        val y = size.height * scanLineProgress
                        drawLine(
                            color = AndroidGreen,
                            start = Offset(0f, y),
                            end = Offset(size.width, y),
                            strokeWidth = 3.dp.toPx()
                        )
                    }

                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.QrCodeScanner,
                            contentDescription = null,
                            tint = AndroidGreen.copy(alpha = 0.8f),
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (hasPermission) "Scanner Active" else "Camera Ready",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = TextSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                if (!hasPermission) {
                    OutlinedButton(
                        onClick = onRequestPermission,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(44.dp)
                            .testTag("btn_request_camera"),
                        shape = CircleShape,
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = AndroidGreen),
                        border = androidx.compose.foundation.BorderStroke(1.dp, AndroidGreen)
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.CameraAlt,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("ENABLE CAMERA SCANNER", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Quick Simulated QR Scanner for instant testing
        GlassCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp)
        ) {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "SIMULATE QR SCAN (QUICK TEST)",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = TextLabel
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Tap any registered participant to simulate scanning their pass instantly:",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(10.dp))

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    recentRegistrations.take(4).forEach { reg ->
                        Surface(
                            onClick = { onScanId(reg.id) },
                            shape = RoundedCornerShape(12.dp),
                            color = Color(0x14FFFFFF),
                            border = androidx.compose.foundation.BorderStroke(1.dp, GlassBorder),
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("quick_scan_${reg.id}")
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text(
                                        text = reg.name,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = TextPrimary
                                    )
                                    Text(
                                        text = reg.id,
                                        fontSize = 11.sp,
                                        fontFamily = FontFamily.Monospace,
                                        color = AndroidGreen
                                    )
                                }
                                Surface(
                                    shape = CircleShape,
                                    color = if (reg.checkedIn) Color(0x263DDC84) else Color(0x26FFFFFF)
                                ) {
                                    Text(
                                        text = if (reg.checkedIn) "Checked In" else "Scan →",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (reg.checkedIn) AndroidGreen else TextPrimary,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ManualValidationTab(
    value: String,
    onValueChange: (String) -> Unit,
    onValidate: () -> Unit,
    recentRegistrations: List<ParticipantRegistration>
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        GlassCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(22.dp)
        ) {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Manual Validation",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Enter the registration ID from the participant's pass.",
                    fontSize = 13.sp,
                    color = TextSecondary
                )

                Spacer(modifier = Modifier.height(18.dp))

                OutlinedTextField(
                    value = value,
                    onValueChange = onValueChange,
                    placeholder = { Text("e.g. REG-AX7K29", color = TextLabel) },
                    singleLine = true,
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Outlined.Tag,
                            contentDescription = null,
                            tint = if (value.isNotEmpty()) AndroidGreen else TextLabel,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = GlassBorderFocus,
                        unfocusedBorderColor = GlassBorder,
                        focusedContainerColor = GlassCardBg,
                        unfocusedContainerColor = GlassCardBg,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    ),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(onDone = { onValidate() }),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_manual_reg_id")
                )

                Spacer(modifier = Modifier.height(14.dp))

                Button(
                    onClick = onValidate,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .testTag("btn_manual_validate"),
                    shape = CircleShape,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = AndroidGreen,
                        contentColor = BgDark
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "VALIDATE",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Quick Pick Registration IDs
        GlassCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp)
        ) {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "RECENT REGISTRATIONS",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = TextLabel
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Tap to autofill Registration ID:",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(10.dp))

                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    recentRegistrations.take(5).forEach { reg ->
                        Surface(
                            onClick = { onValueChange(reg.id) },
                            shape = RoundedCornerShape(10.dp),
                            color = Color(0x12FFFFFF),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = reg.name,
                                    fontSize = 13.sp,
                                    color = TextPrimary
                                )
                                Text(
                                    text = reg.id,
                                    fontSize = 12.sp,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    color = AndroidGreen
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RegistrationListTab(
    registrations: List<ParticipantRegistration>,
    totalCount: Int,
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    onSelectParticipant: (ParticipantRegistration) -> Unit
) {
    val checkedInCount = registrations.count { it.checkedIn }
    val pendingCount = totalCount - checkedInCount

    Column(modifier = Modifier.fillMaxWidth()) {

        // Stats Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            StatsCard(
                label = "TOTAL",
                count = totalCount.toString(),
                color = TextPrimary,
                modifier = Modifier.weight(1f)
            )
            StatsCard(
                label = "CHECKED IN",
                count = checkedInCount.toString(),
                color = AndroidGreen,
                modifier = Modifier.weight(1f)
            )
            StatsCard(
                label = "PENDING",
                count = pendingCount.toString(),
                color = WarnAmber,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Search Field
        OutlinedTextField(
            value = searchQuery,
            onValueChange = onSearchChange,
            placeholder = { Text("Search by name, ID or department…", color = TextLabel, fontSize = 13.sp) },
            singleLine = true,
            leadingIcon = {
                Icon(
                    imageVector = Icons.Outlined.Search,
                    contentDescription = null,
                    tint = TextLabel,
                    modifier = Modifier.size(18.dp)
                )
            },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { onSearchChange("") }) {
                        Icon(
                            imageVector = Icons.Outlined.Clear,
                            contentDescription = "Clear search",
                            tint = TextSecondary,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            },
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = GlassBorderFocus,
                unfocusedBorderColor = GlassBorder,
                focusedContainerColor = GlassCardBg,
                unfocusedContainerColor = GlassCardBg,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            ),
            modifier = Modifier
                .fillMaxWidth()
                .testTag("input_search_registrations")
        )

        Spacer(modifier = Modifier.height(12.dp))

        if (registrations.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 32.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = if (searchQuery.isEmpty()) "No registrations yet." else "No matching participants found.",
                    color = TextSecondary,
                    fontSize = 13.sp
                )
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(registrations, key = { it.id }) { reg ->
                    ParticipantListItem(
                        registration = reg,
                        onClick = { onSelectParticipant(reg) }
                    )
                }
            }
        }
    }
}

@Composable
private fun StatsCard(
    label: String,
    count: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(14.dp),
        color = GlassCardBg,
        border = androidx.compose.foundation.BorderStroke(1.dp, GlassBorder)
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = count,
                fontSize = 20.sp,
                fontWeight = FontWeight.Black,
                color = color
            )
            Text(
                text = label,
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = TextLabel
            )
        }
    }
}

@Composable
private fun ParticipantListItem(
    registration: ParticipantRegistration,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        color = GlassCardBg,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (registration.checkedIn) AndroidGreen.copy(alpha = 0.35f) else GlassBorder
        ),
        modifier = Modifier
            .fillMaxWidth()
            .testTag("participant_item_${registration.id}")
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = registration.name,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(2.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = registration.id,
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace,
                        color = AndroidGreen
                    )
                    Text(
                        text = " · ${registration.department}",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
                if (registration.checkedIn && registration.checkInTime != null) {
                    Text(
                        text = "Checked in at ${registration.checkInTime}",
                        fontSize = 11.sp,
                        color = AndroidGreen.copy(alpha = 0.8f),
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }

            Surface(
                shape = CircleShape,
                color = if (registration.checkedIn) Color(0x263DDC84) else Color(0x1EFFFFFF)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = if (registration.checkedIn) Icons.Outlined.CheckCircle else Icons.Outlined.HourglassEmpty,
                        contentDescription = null,
                        tint = if (registration.checkedIn) AndroidGreen else TextSecondary,
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (registration.checkedIn) "Checked In" else "Pending",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (registration.checkedIn) AndroidGreen else TextSecondary
                    )
                }
            }
        }
    }
}
