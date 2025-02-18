import useUserStore from './modules/user';
import useParame from './modules/paramdata';

const useStore = () => ({
  user: useUserStore(),
  parame: useParame()
});

export default useStore;
