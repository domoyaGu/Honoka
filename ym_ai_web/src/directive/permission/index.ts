import useStore from '@/store';
import { Directive, DirectiveBinding } from 'vue';

/**
 * 按钮权限校验
 */
export const perm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 直接获取按钮权限
    // const { permission } = useStore();
    // const { value } = binding;
    // if (Object.prototype.toString.call(value) === '[object Number]') {
    //   const requiredPerms = value; // DOM绑定需要的按钮权限标识
    //   const hasPerm = permission.rights?.some(right => {
    //     return (
    //       right.menuId === requiredPerms ||
    //       right.menuList?.some(child => child.menuId === requiredPerms)
    //     );
    //   });
    //   if (!hasPerm) {
    //     el.parentNode && el.parentNode.removeChild(el);
    //   }
    // } else if (Object.prototype.toString.call(value) === '[object Array]') {
    //   const requiredPerms = value; // DOM绑定需要的按钮权限标识
    //   const hasPerm = requiredPerms.some(itemPerm => {
    //     return permission.rights?.some(right => {
    //       return (
    //         right.menuId === itemPerm ||
    //         right.menuList?.some(child => child.menuId === itemPerm)
    //       );
    //     });
    //   });
    //   if (!hasPerm) {
    //     el.parentNode && el.parentNode.removeChild(el);
    //   }
    // } else {
    //   throw new Error(
    //     "need perms! Like v-has-perm=\"['sys:user:add','sys:user:edit']\""
    //   );
    // }
  }
};
