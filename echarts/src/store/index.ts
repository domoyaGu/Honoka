import useUserStore from './modules/user';
import useAppStore from './modules/app';
import useParame from './modules/parame';
import usePermissionStore from './modules/permission';
import useSettingStore from './modules/settings';
import useTagsViewStore from './modules/tagsView';
import useSystemStore from './modules/system';
import useBusinessStore from './modules/business';

const useStore = () => {
  return {
    user: useUserStore(),
    app: useAppStore(),
    parame: useParame(),
    permission: usePermissionStore(),
    setting: useSettingStore(),
    tagsView: useTagsViewStore(),
    system: useSystemStore(),
    business: useBusinessStore(),
  }
};

export default useStore;
