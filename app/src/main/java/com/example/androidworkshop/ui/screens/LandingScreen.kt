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
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.androidworkshop.model.WorkshopConstants
import com.example.androidworkshop.ui.components.AuroraBackground
import com.example.androidworkshop.ui.components.GlassCard
import com.example.androidworkshop.ui.theme.AndroidGreen
import com.example.androidworkshop.ui.theme.BgDark
import com.example.androidworkshop.ui.theme.GlassBorder
import com.example.androidworkshop.ui.theme.TextLabel
import com.example.androidworkshop.ui.theme.TextPrimary
import com.example.androidworkshop.ui.theme.TextSecondary

@Composable
fun LandingScreen(
    onRegisterClick: () -> Unit,
    onCoordinatorClick: () -> Unit
) {
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
                Spacer(modifier = Modifier.height(48.dp))

                // Brand Pill
                Surface(
                    shape = CircleShape,
                    color = Color(0x1A3DDC84),
                    border = androidx.compose.foundation.BorderStroke(1.dp, AndroidGreen.copy(alpha = 0.35f))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Android,
                            contentDescription = "Android Club Icon",
                            tint = AndroidGreen,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = WorkshopConstants.CLUB,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 2.sp,
                            color = TextPrimary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // Hero Headline
                Text(
                    text = "BUILD FOR\nANDROID.",
                    fontSize = 44.sp,
                    lineHeight = 46.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = (-1).sp,
                    color = TextPrimary,
                    fontFamily = FontFamily.SansSerif,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Tagline
                Text(
                    text = WorkshopConstants.DESCRIPTION,
                    fontSize = 15.sp,
                    lineHeight = 22.sp,
                    color = TextSecondary,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(32.dp))

                // Info Glass Card
                GlassCard(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(22.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        InfoItem(
                            icon = Icons.Outlined.CalendarMonth,
                            text = WorkshopConstants.DATE
                        )
                        HorizontalDivider(color = GlassBorder)
                        InfoItem(
                            icon = Icons.Outlined.Schedule,
                            text = WorkshopConstants.TIME
                        )
                        HorizontalDivider(color = GlassBorder)
                        InfoItem(
                            icon = Icons.Outlined.LocationOn,
                            text = WorkshopConstants.VENUE
                        )
                    }
                }
            }

            // CTAs at bottom
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Button(
                    onClick = onRegisterClick,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .testTag("btn_register_now"),
                    shape = CircleShape,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = AndroidGreen,
                        contentColor = BgDark
                    )
                ) {
                    Icon(
                        imageVector = Icons.Filled.Android,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "REGISTER NOW",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.sp
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                TextButton(
                    onClick = onCoordinatorClick,
                    modifier = Modifier.testTag("btn_coordinator_link")
                ) {
                    Text(
                        text = "Coordinator? Mark attendance →",
                        fontSize = 13.sp,
                        color = TextLabel,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
}

@Composable
private fun InfoItem(
    icon: ImageVector,
    text: String
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(vertical = 2.dp)
    ) {
        Surface(
            shape = RoundedCornerShape(8.dp),
            color = Color(0x1AFFFFFF),
            modifier = Modifier.size(34.dp)
        ) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = AndroidGreen,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
        Spacer(modifier = Modifier.width(14.dp))
        Text(
            text = text,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextPrimary
        )
    }
}
