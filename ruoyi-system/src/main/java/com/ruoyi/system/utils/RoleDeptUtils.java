package com.ruoyi.system.utils;

import com.ruoyi.common.core.domain.entity.SysRole;
import com.ruoyi.common.core.domain.entity.SysUser;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.system.service.ISysDeptService;
import com.ruoyi.system.service.ISysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Array;
import java.util.*;

/**
 * @author JunoSong
 * @version V1.0
 * @Package com.ruoyi.system.utils
 * @date 2023/3/1 16:40
 */
@Component
public class RoleDeptUtils {
    @Autowired
    ISysRoleService roleService;
    @Autowired
    ISysDeptService deptService;

    public Boolean haveDept(Long userId,Long deptId) {
        Set<Long> deptList = deptList();
        return deptList.contains(deptId);
    }

    public Set<Long> deptList() {
        HashSet<Long> deptSet = new HashSet<>();
        SysUser user = SecurityUtils.getLoginUser().getUser();
        deptSet.add(user.getDeptId());
        List<SysRole> roles = user.getRoles();
        for (SysRole role : roles) {
            Long roleId = role.getRoleId();
            List<Long> longs = deptService.selectDeptListByRoleId(roleId);
            deptSet.addAll(longs);
        }
        return deptSet;
    }

}
