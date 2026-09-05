package com.example.androidworkshop.ui.screens

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Android
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.ArrowDropUp
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.outlined.AccountBalance
import androidx.compose.material.icons.outlined.Code
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Phone
import androidx.compose.material.icons.outlined.School
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.androidworkshop.model.ParticipantRegistration
import com.example.androidworkshop.ui.components.AuroraBackground
import com.example.androidworkshop.ui.components.GlassCard
import com.example.androidworkshop.ui.theme.AndroidGreen
import com.example.androidworkshop.ui.theme.BgDark
import com.example.androidworkshop.ui.theme.ErrorRed
import com.example.androidworkshop.ui.theme.GlassBorder
import com.example.androidworkshop.ui.theme.GlassBorderFocus
import com.example.androidworkshop.ui.theme.GlassCardBg
import com.example.androidworkshop.ui.theme.TextLabel
import com.example.androidworkshop.ui.theme.TextPrimary
import com.example.androidworkshop.ui.theme.TextSecondary
import com.example.androidworkshop.ui.viewmodel.WorkshopViewModel

@Composable
fun RegistrationFormScreen(
    viewModel: WorkshopViewModel,
    onBackClick: () -> Unit,
    onRegistrationSuccess: (ParticipantRegistration) -> Unit
) {
    val formState by viewModel.formState.collectAsState()
    val focusManager = LocalFocusManager.current
    var yearDropdownExpanded by remember { mutableStateOf(false) }

    val yearOptions = listOf(
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "PG / Masters",
        "Other"
    )

    AuroraBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Spacer(modifier = Modifier.height(28.dp))

            // Header with Back Button
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                IconButton(
                    onClick = onBackClick,
                    modifier = Modifier.testTag("btn_back_from_form")
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back to landing",
                        tint = TextPrimary
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    imageVector = Icons.Filled.Android,
                    contentDescription = null,
                    tint = AndroidGreen,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "ANDROID CLUB",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp,
                    color = TextSecondary
                )
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Title Block
            Text(
                text = "JOIN THE",
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
            Text(
                text = "WORKSHOP",
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                color = AndroidGreen
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "Reserve your seat and build something real.",
                fontSize = 14.sp,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Form Fields Card
            GlassCard(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(22.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {

                    // Full Name
                    FormField(
                        label = "Full Name",
                        value = formState.name,
                        onValueChange = { viewModel.updateName(it) },
                        placeholder = "Aarav Mehta",
                        icon = Icons.Outlined.Person,
                        errorMessage = formState.nameError,
                        testTag = "input_full_name",
                        imeAction = ImeAction.Next
                    )

                    // Email
                    FormField(
                        label = "Email Address",
                        value = formState.email,
                        onValueChange = { viewModel.updateEmail(it) },
                        placeholder = "aarav@example.com",
                        icon = Icons.Outlined.Email,
                        errorMessage = formState.emailError,
                        testTag = "input_email",
                        keyboardType = KeyboardType.Email,
                        imeAction = ImeAction.Next
                    )

                    // Phone
                    FormField(
                        label = "Phone Number",
                        value = formState.phone,
                        onValueChange = { viewModel.updatePhone(it) },
                        placeholder = "+91 98765 43210",
                        icon = Icons.Outlined.Phone,
                        errorMessage = formState.phoneError,
                        testTag = "input_phone",
                        keyboardType = KeyboardType.Phone,
                        imeAction = ImeAction.Next
                    )

                    // College
                    FormField(
                        label = "College / Institution",
                        value = formState.college,
                        onValueChange = { viewModel.updateCollege(it) },
                        placeholder = "Tech Institute",
                        icon = Icons.Outlined.AccountBalance,
                        errorMessage = formState.collegeError,
                        testTag = "input_college",
                        imeAction = ImeAction.Next
                    )

                    // Department
                    FormField(
                        label = "Department",
                        value = formState.department,
                        onValueChange = { viewModel.updateDepartment(it) },
                        placeholder = "Computer Science",
                        icon = Icons.Outlined.Code,
                        errorMessage = formState.departmentError,
                        testTag = "input_department",
                        imeAction = ImeAction.Done,
                        onDone = { focusManager.clearFocus() }
                    )

                    // Year of Study Dropdown
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = "Year of Study",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextLabel,
                            modifier = Modifier.padding(bottom = 6.dp)
                        )
                        Box(modifier = Modifier.fillMaxWidth()) {
                            OutlinedTextField(
                                value = formState.year.ifEmpty { "Select year of study" },
                                onValueChange = {},
                                readOnly = true,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("dropdown_year")
                                    .clickable { yearDropdownExpanded = true },
                                leadingIcon = {
                                    Icon(
                                        imageVector = Icons.Outlined.School,
                                        contentDescription = null,
                                        tint = if (formState.year.isNotEmpty()) AndroidGreen else TextLabel,
                                        modifier = Modifier.size(18.dp)
                                    )
                                },
                                trailingIcon = {
                                    IconButton(onClick = { yearDropdownExpanded = !yearDropdownExpanded }) {
                                        Icon(
                                            imageVector = if (yearDropdownExpanded) Icons.Default.ArrowDropUp else Icons.Default.ArrowDropDown,
                                            contentDescription = "Expand year selector",
                                            tint = TextSecondary
                                        )
                                    }
                                },
                                shape = RoundedCornerShape(12.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = GlassBorderFocus,
                                    unfocusedBorderColor = if (formState.yearError != null) ErrorRed else GlassBorder,
                                    focusedContainerColor = GlassCardBg,
                                    unfocusedContainerColor = GlassCardBg,
                                    focusedTextColor = TextPrimary,
                                    unfocusedTextColor = if (formState.year.isEmpty()) TextLabel else TextPrimary
                                )
                            )

                            DropdownMenu(
                                expanded = yearDropdownExpanded,
                                onDismissRequest = { yearDropdownExpanded = false },
                                modifier = Modifier.fillMaxWidth(0.85f)
                            ) {
                                yearOptions.forEach { year ->
                                    DropdownMenuItem(
                                        text = { Text(year) },
                                        onClick = {
                                            viewModel.updateYear(year)
                                            yearDropdownExpanded = false
                                        }
                                    )
                                }
                            }
                        }

                        if (formState.yearError != null) {
                            ErrorMessage(formState.yearError!!)
                        }
                    }

                    // Submission error banner if any
                    if (formState.submitError != null) {
                        ErrorMessage(formState.submitError!!)
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    // Submit Button
                    Button(
                        onClick = {
                            focusManager.clearFocus()
                            viewModel.submitRegistration(onRegistrationSuccess)
                        },
                        enabled = !formState.isSubmitting,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp)
                            .testTag("btn_complete_registration"),
                        shape = CircleShape,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = AndroidGreen,
                            contentColor = BgDark,
                            disabledContainerColor = AndroidGreen.copy(alpha = 0.5f)
                        )
                    ) {
                        if (formState.isSubmitting) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = BgDark,
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "PROCESSING…",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                        } else {
                            Icon(
                                imageVector = Icons.Filled.Android,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "COMPLETE REGISTRATION",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.ExtraBold,
                                letterSpacing = 1.sp
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(48.dp))
        }
    }
}

@Composable
private fun FormField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    icon: ImageVector,
    errorMessage: String?,
    testTag: String,
    keyboardType: KeyboardType = KeyboardType.Text,
    imeAction: ImeAction = ImeAction.Next,
    onDone: () -> Unit = {}
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextLabel,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder, color = TextLabel, fontSize = 14.sp) },
            singleLine = true,
            leadingIcon = {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = if (value.isNotEmpty()) AndroidGreen else TextLabel,
                    modifier = Modifier.size(18.dp)
                )
            },
            isError = errorMessage != null,
            keyboardOptions = KeyboardOptions(
                keyboardType = keyboardType,
                imeAction = imeAction
            ),
            keyboardActions = KeyboardActions(
                onDone = { onDone() }
            ),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = GlassBorderFocus,
                unfocusedBorderColor = GlassBorder,
                errorBorderColor = ErrorRed,
                focusedContainerColor = GlassCardBg,
                unfocusedContainerColor = GlassCardBg,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            ),
            modifier = Modifier
                .fillMaxWidth()
                .testTag(testTag)
        )

        if (errorMessage != null) {
            ErrorMessage(errorMessage)
        }
    }
}

@Composable
private fun ErrorMessage(message: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(top = 4.dp)
    ) {
        Icon(
            imageVector = Icons.Default.Warning,
            contentDescription = "Error",
            tint = ErrorRed,
            modifier = Modifier.size(12.dp)
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = message,
            color = ErrorRed,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )
    }
}
