

// 用户状态
const userStatusEnum = {
  0: {spot:'#23BE90', text:'正常'},
  1: {spot:'#f43535', text:'锁定'},
  // '不拦截': {spot:'#007AFF'},
  // '未通过': {spot:'#f43535'}
  // 0:{back:'#fff3f3',spot:'#f43535',text:'拦截'},
  // 1:{back:'#EAF9F5',spot:'#23BE90',text:'通过'},
  // 2:{back:'#ECF6FF',spot:'#007AFF',text:'不拦截'},
  // 2:{back:'#EFF1FF',spot:'#5C74FE', text:'待修改报案'},
  // 5:{back:'#FFF3EA',spot:'#FF8E35',text:'注销案件'},
}

// 车辆状态
const carStatusEnum = {
  1: {spot:'#23BE90', text:'已验真'},
  0: {spot:'#f43535', text:'未验真'},
  null: {spot:'#f43535', text:'未验真'},
  // '不拦截': {spot:'#007AFF'},
  // '未通过': {spot:'#f43535'}
  // 0:{back:'#fff3f3',spot:'#f43535',text:'拦截'},
  // 1:{back:'#EAF9F5',spot:'#23BE90',text:'通过'},
  // 2:{back:'#ECF6FF',spot:'#007AFF',text:'不拦截'},
  // 2:{back:'#EFF1FF',spot:'#5C74FE', text:'待修改报案'},
  // 5:{back:'#FFF3EA',spot:'#FF8E35',text:'注销案件'},
}

export const status = {
  userStatusEnum,
  carStatusEnum
}