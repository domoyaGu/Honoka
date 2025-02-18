import { defineStore } from 'pinia';
import { SystemState } from '@/types/store/system';
import { listRolePages } from '@/api/basic/role';
import { listDeptPages } from '@/api/basic/dept';

export const useSystemStore = defineStore({
  id: 'system',
  state: (): SystemState => ({
    roleList: [],
    deptList: []
  }),
  actions: {
    // 全局存储角色、单位
    getSystemInfo() {
      return new Promise((resolve, reject) => {
        Promise.all([listRolePages({} as any), listDeptPages({ deptName: '', deptId: '', type: 0 } as any)]).then((values: any) => {
          const [roleRes, DeptRes] = [values[0], values[1]]
          if (roleRes.code == 0 && DeptRes.code == 0) {
            const roleList = []
            const deptList = []
            if (roleRes.data.records.length) {
              roleRes.data.records.forEach(e => {
                roleList.push({
                  roleId: e.roleId,
                  roleName: e.roleName,
                })
              })
            }
            if (DeptRes.data.length) {
              DeptRes.data.forEach(v => {
                deptList.push(v)
              })
            }
            this.roleList = roleList
            this.deptList = deptList
          }
          resolve(null)
        })
          .catch((err) => {
            reject(err)
          })
      })
  }
},
});

export default useSystemStore;
