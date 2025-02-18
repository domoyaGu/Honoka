import { PageQueryParam, PageResult } from '../base';

/**
 * 公司查询参数类型声明
 */
export interface MemberQueryParam extends PageQueryParam {
  companyName: string;
  companyAdminPhone: string;
  companyPermissions: string;
  companyStatus: string
}

/**
 * 公司列表项类型声明
 */
export interface MemberItem {
  companyName: string;
  companyId: string;
  companyPermissions: string;
  companyAdminName: string;
  companyAdminPhone: string;
  companyStatus: number;
  companyStartData: string;
  dateRemaining: number;
}

/**
 * 公司分页项类型声明
 */
export type MemberPageResult = PageResult<MemberItem[]>;

/**
 * 公司表单数据类型声明
 */
export interface MemberDetail {
  companyAddressCity: string;
  companyAddressDistrict: string;
  companyAddressInfo: string;
  companyAddressProvince: string;
  companyAdminEmail: string;
  companyAdminName: string;
  companyAdminPassword: string;
  companyAdminPhone: string;
  companyAdminSalt: string;
  companyBusinessLicenseNo: string;
  companyBusinessLicenseUrl: string;
  companyContractJsonStr: string;
  companyDepositBankBranch: string;
  companyDepositBankCity: string;
  companyDepositBankName: string;
  companyDepositBankNo: string;
  companyDepositBankProvince: string;
  companyDomain: string;
  companyEndData: string;
  companyId: string;
  companyLegalPerson: string;
  companyName: string;
  companyOtherJsonStr: string;
  companyPaymentJsonStr: string;
  companyPermissions: string;
  companyStartData: string;
  companyStatus: number
}
