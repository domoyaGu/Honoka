import useUserStore from './modules/user';
import useRefreshStore from './modules/refresh';

const useStore = () => ({
  user: useUserStore(),
  refresh: useRefreshStore()
});

export default useStore;
