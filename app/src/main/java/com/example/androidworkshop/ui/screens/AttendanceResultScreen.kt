package com.example.androidworkshop.ui.screens

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Android
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Tag
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.androidworkshop.model.AttendanceValidationResult
import com.example.androidworkshop.model.WorkshopConstants
import com.example.androidworkshop.ui.components.AuroraBackground
import com.example.androidworkshop.ui.components.GlassCard
import com.example.androidworkshop.ui.theme.AndroidGreen
import com.example.androidworkshop.ui.theme.BgDark
import com.example.androidworkshop.ui.theme.ErrorRed
import com.example.androidworkshop.ui.theme.GlassBorder
import com.example.androidworkshop.ui.theme.TextLabel
import com.example.androidworkshop.ui.theme.TextPrimary
import com.example.androidworkshop.ui.theme.TextSecondary
import com.example.androidworkshop.ui.theme.WarnAmber

@Composable
fun AttendanceResultScreen(
    result: AttendanceValidationResult,
    onDoneClick: () -> Unit,
    onScanAnotherClick: () -> Unit
) {
    val (statusColor, statusBg, iconVector, titleText) = when (result) {
        is AttendanceValidationResult.Success -> {
            Tuple4(
                AndroidGreen,
                Color(0x263DDC84),
                Icons.Default.Check,
                "ATTENDANCE\nMARKED"
            )
        }
        is AttendanceValidationResult.Duplicate -> {
            Tuple4(
                WarnAmber,
                Color(0x26FFB300),
                Icons.Default.Check,
                "ALREADY\nCHECKED IN"
            )
        }
        is AttendanceValidationResult.NotFound -> {
            Tuple4(
                ErrorRed,
                Color(0x26FF5252),
                Icons.Default.Close,
                "INVALID\nQR CODE"
            )
        }
    }

    AuroraBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                Spacer(modifier = Modifier.height(56.dp))

                // Status Icon Circle
                Surface(
                    shape = CircleShape,
                    color = statusBg,
                    border = androidx.compose.foundation.BorderStroke(3.dp, statusColor),
                    modifier = Modifier.size(80.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = iconVector,
                            contentDescription = "Attendance status",
                            tint = statusColor,
                            modifier = Modifier.size(44.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Title
                Text(
                    text = titleText,
                    fontSize = 28.sp,
                    lineHeight = 32.sp,
                    fontWeight = FontWeight.Black,
                    textAlign = TextAlign.Center,
                    letterSpacing = (-0.5).sp,
                    color = if (result is AttendanceValidationResult.Duplicate) WarnAmber else if (result is AttendanceValidationResult.NotFound) ErrorRed else TextPrimary
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Details Card
                GlassCard(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    borderColor = statusColor.copy(alpha = 0.35f)
                ) {
                    when (result) {
                        is AttendanceValidationResult.Success -> {
                            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                                DetailRow(
                                    icon = Icons.Outlined.Person,
                                    label = "Participant",
                                    value = result.participant.name
                                )
                                DetailRow(
                                    icon = Icons.Outlined.Tag,
                                    label = "Registration ID",
                                    value = result.participant.id,
                                    isMono = true
                                )
                                DetailRow(
                                    icon = Icons.Outlined.Schedule,
                                    label = "Check-in Time",
                                    value = result.participant.checkInTime ?: "Just now"
                                )
                                DetailRow(
                                    icon = Icons.Filled.Android,
                                    label = "Workshop",
                                    value = WorkshopConstants.NAME
                                )
                            }
                        }
                        is AttendanceValidationResult.Duplicate -> {
                            Column(
                                verticalArrangement = Arrangement.spacedBy(14.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                DetailRow(
                                    icon = Icons.Outlined.Person,
                                    label = "Participant",
                                    value = result.participant.name
                                )
                                DetailRow(
                                    icon = Icons.Outlined.Schedule,
                                    label = "Originally checked in at",
                                    value = result.participant.checkInTime ?: "Earlier"
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "This participant has already been marked present.",
                                    fontSize = 12.sp,
                                    color = TextSecondary,
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                        is AttendanceValidationResult.NotFound -> {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 12.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "Registration not found in database.",
                                    fontSize = 14.sp,
                                    color = TextSecondary,
                                    textAlign = TextAlign.Center
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = result.id,
                                    fontSize = 16.sp,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    color = ErrorRed
                                )
                            }
                        }
                    }
                }
            }

            // Buttons
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 36.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Button(
                    onClick = onDoneClick,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .testTag("btn_attendance_done"),
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
                        text = "DONE",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.sp
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedButton(
                    onClick = onScanAnotherClick,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .testTag("btn_scan_another"),
                    shape = CircleShape,
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                    border = androidx.compose.foundation.BorderStroke(1.dp, GlassBorder)
                ) {
                    Text(
                        text = "Scan / Check Another",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun DetailRow(
    icon: ImageVector,
    label: String,
    value: String,
    isMono: Boolean = false
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth()
    ) {
        Surface(
            shape = RoundedCornerShape(8.dp),
            color = Color(0x18FFFFFF),
            modifier = Modifier.size(36.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = AndroidGreen,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = label,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = TextLabel
            )
            Text(
                text = value,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = if (isMono) FontFamily.Monospace else FontFamily.SansSerif,
                color = TextPrimary
            )
        }
    }
}

private data class Tuple4<A, B, C, D>(val a: A, val b: B, val c: C, val d: D)
