export interface LoginFormData {
  userName: string;
  password: string;
}

export interface CurrentResult {
  isAdmin: string;
  userEmail: string;
  userId: string;
  userName: string;
  userPhone: string;
}
export interface PutUserPassword {
  confirmPassword: string;
  password: string;
  userCredit: string;
  verifyCode: string;
}
