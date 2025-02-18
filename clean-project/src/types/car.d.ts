export interface QueryCarinfo {
	carInfoVo: carInfoVo,
  malfunctionInfoVo: malfunctionInfoVo[]
}

export interface carInfoVo {
  carVinNo: string,
  malfunctionTimes: number,
  materialMoneySum: number,
  repairMoneySum: number,
  carNo: string,
  carProductModel: string,
  carRegistrationDate: string,
  carType: string,
  carDelivery: string,
  auditName: string,
  isAudit: number
}

export interface malfunctionInfoVo {
  carInfoId: number,
  carInfoSource?: string,
  carVinNo?: string,
  malfuntionTime: string,
  materialMoney: number,
  materialText: string,
  repairMoney: number,
  repairText: string
}
