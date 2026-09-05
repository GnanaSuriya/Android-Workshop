package com.example.androidworkshop.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.androidworkshop.data.RegistrationRepository
import com.example.androidworkshop.model.AttendanceValidationResult
import com.example.androidworkshop.model.ParticipantRegistration
import com.example.androidworkshop.util.IdGenerator
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

enum class CoordinatorTab {
    SCAN, MANUAL, LIST
}

data class FormState(
    val name: String = "",
    val email: String = "",
    val phone: String = "",
    val college: String = "",
    val department: String = "",
    val year: String = "",
    val nameError: String? = null,
    val emailError: String? = null,
    val phoneError: String? = null,
    val collegeError: String? = null,
    val departmentError: String? = null,
    val yearError: String? = null,
    val isSubmitting: Boolean = false,
    val submitError: String? = null
)

class WorkshopViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = RegistrationRepository(application)

    private val _formState = MutableStateFlow(FormState())
    val formState: StateFlow<FormState> = _formState.asStateFlow()

    private val _currentRegistration = MutableStateFlow<ParticipantRegistration?>(null)
    val currentRegistration: StateFlow<ParticipantRegistration?> = _currentRegistration.asStateFlow()

    private val _coordinatorTab = MutableStateFlow(CoordinatorTab.SCAN)
    val coordinatorTab: StateFlow<CoordinatorTab> = _coordinatorTab.asStateFlow()

    private val _manualInput = MutableStateFlow("")
    val manualInput: StateFlow<String> = _manualInput.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _attendanceResult = MutableStateFlow<AttendanceValidationResult?>(null)
    val attendanceResult: StateFlow<AttendanceValidationResult?> = _attendanceResult.asStateFlow()

    val registrations: StateFlow<List<ParticipantRegistration>> = repository.registrations

    val filteredRegistrations: StateFlow<List<ParticipantRegistration>> = combine(
        registrations,
        _searchQuery
    ) { list, query ->
        if (query.isBlank()) list
        else {
            val q = query.trim().lowercase(Locale.US)
            list.filter {
                it.name.lowercase(Locale.US).contains(q) ||
                it.id.lowercase(Locale.US).contains(q) ||
                it.college.lowercase(Locale.US).contains(q) ||
                it.department.lowercase(Locale.US).contains(q)
            }
        }
    }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    init {
        viewModelScope.launch {
            repository.refreshRegistrations()
        }
    }

    fun updateName(value: String) {
        _formState.value = _formState.value.copy(name = value, nameError = null)
    }

    fun updateEmail(value: String) {
        _formState.value = _formState.value.copy(email = value, emailError = null)
    }

    fun updatePhone(value: String) {
        _formState.value = _formState.value.copy(phone = value, phoneError = null)
    }

    fun updateCollege(value: String) {
        _formState.value = _formState.value.copy(college = value, collegeError = null)
    }

    fun updateDepartment(value: String) {
        _formState.value = _formState.value.copy(department = value, departmentError = null)
    }

    fun updateYear(value: String) {
        _formState.value = _formState.value.copy(year = value, yearError = null)
    }

    fun setCoordinatorTab(tab: CoordinatorTab) {
        _coordinatorTab.value = tab
    }

    fun updateManualInput(value: String) {
        _manualInput.value = value.uppercase(Locale.US)
    }

    fun updateSearchQuery(value: String) {
        _searchQuery.value = value
    }

    fun setCurrentRegistration(reg: ParticipantRegistration) {
        _currentRegistration.value = reg
    }

    fun clearAttendanceResult() {
        _attendanceResult.value = null
    }

    private fun validateForm(): Boolean {
        val s = _formState.value
        var isValid = true

        val nameErr = if (s.name.trim().length < 2) "Name is required (min 2 characters)" else null
        val emailErr = if (!android.util.Patterns.EMAIL_ADDRESS.matcher(s.email.trim()).matches()) "Enter a valid email address" else null
        val phoneErr = if (s.phone.trim().length < 7) "Enter a valid phone number" else null
        val collegeErr = if (s.college.trim().length < 2) "Institution name is required" else null
        val deptErr = if (s.department.trim().length < 2) "Department is required" else null
        val yearErr = if (s.year.trim().isEmpty()) "Please select your year of study" else null

        if (nameErr != null || emailErr != null || phoneErr != null || collegeErr != null || deptErr != null || yearErr != null) {
            isValid = false
        }

        _formState.value = s.copy(
            nameError = nameErr,
            emailError = emailErr,
            phoneError = phoneErr,
            collegeError = collegeErr,
            departmentError = deptErr,
            yearError = yearErr
        )
        return isValid
    }

    fun submitRegistration(onSuccess: (ParticipantRegistration) -> Unit) {
        if (!validateForm()) return

        _formState.value = _formState.value.copy(isSubmitting = true, submitError = null)

        viewModelScope.launch {
            try {
                val regId = IdGenerator.generateRegId()
                val isoDate = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US).format(Date())
                val participant = ParticipantRegistration(
                    id = regId,
                    name = _formState.value.name.trim(),
                    email = _formState.value.email.trim(),
                    phone = _formState.value.phone.trim(),
                    college = _formState.value.college.trim(),
                    department = _formState.value.department.trim(),
                    year = _formState.value.year.trim(),
                    checkedIn = false,
                    checkInTime = null,
                    registeredAt = isoDate
                )
                val success = repository.register(participant)
                if (success) {
                    _currentRegistration.value = participant
                    _formState.value = FormState() // reset form
                    onSuccess(participant)
                } else {
                    _formState.value = _formState.value.copy(
                        isSubmitting = false,
                        submitError = "Failed to save registration. Please try again."
                    )
                }
            } catch (e: Exception) {
                _formState.value = _formState.value.copy(
                    isSubmitting = false,
                    submitError = e.localizedMessage ?: "Registration error"
                )
            }
        }
    }

    fun validateId(rawId: String, onComplete: () -> Unit = {}) {
        if (rawId.isBlank()) return
        viewModelScope.launch {
            val result = repository.markAttendance(rawId)
            _attendanceResult.value = result
            onComplete()
        }
    }
}
