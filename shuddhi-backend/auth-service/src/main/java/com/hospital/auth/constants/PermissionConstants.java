package com.hospital.auth.constants;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class PermissionConstants {
	// Auth & users
	public static final String AUTH_LOGIN = "auth:login";
	public static final String AUTH_LOGOUT = "auth:logout";
	public static final String ADMIN_MANAGE_USERS = "admin:manage_users";
	public static final String ADMIN_MANAGE_ROLES = "admin:manage_roles";
	public static final String ADMIN_VIEW_AUDIT_LOG = "admin:view_audit_log";
	public static final String AUTH_RESET_ANY_PASSWORD = "auth:reset_any_password";

	// Patients
	public static final String PATIENTS_VIEW_ALL = "patients:view_all";
	public static final String PATIENTS_VIEW_OWN = "patients:view_own";
	public static final String PATIENTS_CREATE = "patients:create";
	public static final String PATIENTS_UPDATE = "patients:update";
	public static final String PATIENTS_VIEW_VITALS = "patients:view_vitals";
	public static final String PATIENTS_RECORD_VITALS = "patients:record_vitals";
	public static final String PATIENTS_VIEW_ALLERGIES = "patients:view_allergies";
	public static final String PATIENTS_MANAGE_ALLERGIES = "patients:manage_allergies";

	// Doctors & staff
	public static final String DOCTORS_VIEW = "doctors:view";
	public static final String DOCTORS_MANAGE = "doctors:manage";
	public static final String DEPARTMENTS_VIEW = "departments:view";
	public static final String DEPARTMENTS_MANAGE = "departments:manage";
	public static final String STAFF_VIEW = "staff:view";
	public static final String STAFF_MANAGE = "staff:manage";
	public static final String SCHEDULES_MANAGE = "schedules:manage";

	// Appointments
	public static final String APPOINTMENTS_READ_OWN = "appointments:read_own";
	public static final String APPOINTMENTS_READ_ALL = "appointments:read_all";
	public static final String APPOINTMENTS_CREATE = "appointments:create";
	public static final String APPOINTMENTS_UPDATE = "appointments:update";
	public static final String APPOINTMENTS_CANCEL = "appointments:cancel";
	public static final String APPOINTMENTS_SLOTS_MANAGE = "appointments:slots_manage";

	// Medical records
	public static final String MEDICAL_RECORDS_READ_OWN = "medical_records:read_own";
	public static final String MEDICAL_RECORDS_READ_ALL = "medical_records:read_all";
	public static final String MEDICAL_RECORDS_WRITE = "medical_records:write";
	public static final String PRESCRIPTIONS_CREATE = "prescriptions:create";
	public static final String PRESCRIPTIONS_READ = "prescriptions:read";
	public static final String PRESCRIPTIONS_READ_OWN = "prescriptions:read_own";

	// Lab
	public static final String LAB_ORDER_TEST = "lab:order_test";
	public static final String LAB_VIEW_ORDERS = "lab:view_orders";
	public static final String LAB_VIEW_OWN_RESULTS = "lab:view_own_results";
	public static final String LAB_COLLECT_SAMPLE = "lab:collect_sample";
	public static final String LAB_UPLOAD_RESULTS = "lab:upload_results";
	public static final String LAB_VERIFY_RESULTS = "lab:verify_results";
	public static final String LAB_MANAGE_TESTS = "lab:manage_tests";

	// Pharmacy
	public static final String PHARMACY_VIEW_QUEUE = "pharmacy:view_queue";
	public static final String PHARMACY_DISPENSE = "pharmacy:dispense";
	public static final String PHARMACY_VIEW_INVENTORY = "pharmacy:view_inventory";
	public static final String PHARMACY_MANAGE_STOCK = "pharmacy:manage_stock";
	public static final String PHARMACY_MANAGE_MEDICINES = "pharmacy:manage_medicines";

	// Ward
	public static final String WARD_VIEW = "ward:view";
	public static final String WARD_MANAGE_BEDS = "ward:manage_beds";
	public static final String WARD_ADMIT_PATIENT = "ward:admit_patient";
	public static final String WARD_TRANSFER_PATIENT = "ward:transfer_patient";
	public static final String WARD_DISCHARGE_PATIENT = "ward:discharge_patient";

	// Billing
	public static final String BILLING_VIEW_OWN = "billing:view_own";
	public static final String BILLING_VIEW_ALL = "billing:view_all";
	public static final String BILLING_CREATE_INVOICE = "billing:create_invoice";
	public static final String BILLING_FINALIZE_INVOICE = "billing:finalize_invoice";
	public static final String BILLING_PROCESS_PAYMENT = "billing:process_payment";
	public static final String BILLING_APPLY_DISCOUNT = "billing:apply_discount";
	public static final String BILLING_VIEW_LEDGER = "billing:view_ledger";
	public static final String BILLING_EXPORT_REPORTS = "billing:export_reports";

	// Notifications
	public static final String NOTIFY_RECEIVE = "notify:receive";
	public static final String NOTIFY_MANAGE_TEMPLATES = "notify:manage_templates";
	public static final String NOTIFY_VIEW_LOGS = "notify:view_logs";
}
