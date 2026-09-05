package com.example.androidworkshop.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import com.example.androidworkshop.ui.theme.AndroidBlue
import com.example.androidworkshop.ui.theme.AndroidGreen
import com.example.androidworkshop.ui.theme.AndroidTeal
import com.example.androidworkshop.ui.theme.BgDark

@Composable
fun AuroraBackground(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(BgDark)
            .drawBehind {
                val canvasWidth = size.width
                val canvasHeight = size.height

                // Top-right Green blob
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            AndroidGreen.copy(alpha = 0.28f),
                            AndroidGreen.copy(alpha = 0.12f),
                            Color.Transparent
                        ),
                        center = Offset(canvasWidth * 0.9f, canvasHeight * 0.05f),
                        radius = canvasWidth * 0.7f
                    ),
                    radius = canvasWidth * 0.7f,
                    center = Offset(canvasWidth * 0.9f, canvasHeight * 0.05f)
                )

                // Bottom-left Teal blob
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            AndroidTeal.copy(alpha = 0.22f),
                            AndroidTeal.copy(alpha = 0.08f),
                            Color.Transparent
                        ),
                        center = Offset(canvasWidth * 0.1f, canvasHeight * 0.85f),
                        radius = canvasWidth * 0.65f
                    ),
                    radius = canvasWidth * 0.65f,
                    center = Offset(canvasWidth * 0.1f, canvasHeight * 0.85f)
                )

                // Mid-right Blue blob
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            AndroidBlue.copy(alpha = 0.16f),
                            AndroidBlue.copy(alpha = 0.05f),
                            Color.Transparent
                        ),
                        center = Offset(canvasWidth * 0.85f, canvasHeight * 0.45f),
                        radius = canvasWidth * 0.55f
                    ),
                    radius = canvasWidth * 0.55f,
                    center = Offset(canvasWidth * 0.85f, canvasHeight * 0.45f)
                )
            }
    ) {
        content()
    }
}
