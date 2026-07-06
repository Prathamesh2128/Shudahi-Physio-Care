// Mirrors backend PermissionConstants.java exactly
export const PERMISSIONS = {
  // Auth
  AUTH_LOGIN: "auth:login",
  AUTH_LOGOUT: "auth:logout",
  AUTH_RESET_ANY_PASSWORD: "auth:reset_any_password",

  // Admin
  ADMIN_MANAGE_USERS: "admin:manage_users",
  ADMIN_MANAGE_ROLES: "admin:manage_roles",
  ADMIN_VIEW_AUDIT_LOG: "admin:view_audit_log",

  // Patients
  PATIENTS_VIEW_ALL: "patients:view_all",
  PATIENTS_VIEW_OWN: "patients:view_own",
  PATIENTS_CREATE: "patients:create",
  PATIENTS_UPDATE: "patients:update",
  PATIENTS_VIEW_VITALS: "patients:view_vitals",
  PATIENTS_RECORD_VITALS: "patients:record_vitals",
  PATIENTS_VIEW_ALLERGIES: "patients:view_allergies",
  PATIENTS_MANAGE_ALLERGIES: "patients:manage_allergies",

  // Doctors
  DOCTORS_VIEW: "doctors:view",
  DOCTORS_MANAGE: "doctors:manage",
  DEPARTMENTS_VIEW: "departments:view",
  DEPARTMENTS_MANAGE: "departments:manage",
  SCHEDULES_MANAGE: "schedules:manage",

  // Appointments
  APPOINTMENTS_READ_OWN: "appointments:read_own",
  APPOINTMENTS_READ_ALL: "appointments:read_all",
  APPOINTMENTS_CREATE: "appointments:create",
  APPOINTMENTS_UPDATE: "appointments:update",
  APPOINTMENTS_CANCEL: "appointments:cancel",

  // Medical records
  MEDICAL_RECORDS_READ_ALL: "medical_records:read_all",
  MEDICAL_RECORDS_READ_OWN: "medical_records:read_own",
  MEDICAL_RECORDS_WRITE: "medical_records:write",
  PRESCRIPTIONS_CREATE: "prescriptions:create",
  PRESCRIPTIONS_READ: "prescriptions:read",
  PRESCRIPTIONS_READ_OWN: "prescriptions:read_own",

  // Lab
  LAB_ORDER_TEST: "lab:order_test",
  LAB_VIEW_ORDERS: "lab:view_orders",
  LAB_VIEW_OWN_RESULTS: "lab:view_own_results",
  LAB_COLLECT_SAMPLE: "lab:collect_sample",
  LAB_UPLOAD_RESULTS: "lab:upload_results",
  LAB_VERIFY_RESULTS: "lab:verify_results",

  // Pharmacy
  PHARMACY_VIEW_QUEUE: "pharmacy:view_queue",
  PHARMACY_DISPENSE: "pharmacy:dispense",
  PHARMACY_VIEW_INVENTORY: "pharmacy:view_inventory",
  PHARMACY_MANAGE_STOCK: "pharmacy:manage_stock",

  // Ward
  WARD_VIEW: "ward:view",
  WARD_ADMIT_PATIENT: "ward:admit_patient",
  WARD_MANAGE_BEDS: "ward:manage_beds",
  WARD_DISCHARGE_PATIENT: "ward:discharge_patient",

  // Billing
  BILLING_VIEW_OWN: "billing:view_own",
  BILLING_VIEW_ALL: "billing:view_all",
  BILLING_CREATE_INVOICE: "billing:create_invoice",
  BILLING_FINALIZE_INVOICE: "billing:finalize_invoice",
  BILLING_PROCESS_PAYMENT: "billing:process_payment",
  BILLING_VIEW_LEDGER: "billing:view_ledger",
  BILLING_EXPORT_REPORTS: "billing:export_reports",
};

// Role → dashboard redirect mapping
export const ROLE_HOME = {
  super_admin: "/dashboard",
  admin: "/dashboard",
  doctor: "/appointments",
  nurse: "/patients",
  receptionist: "/appointments",
  lab_technician: "/lab",
  pharmacist: "/pharmacy",
  accountant: "/billing",
  patient: "/appointments",
};
