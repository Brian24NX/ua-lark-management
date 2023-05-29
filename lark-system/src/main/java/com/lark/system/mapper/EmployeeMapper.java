package com.lark.system.mapper;

import com.lark.system.domain.member.Employee;

import java.util.List;

/**
 * @author iSoftStone-Robert
 * @date 2023/2/23
 */
public interface EmployeeMapper {

    /**
     * 获取员工用户查询列表
     *
     * @param queryParam 查询参数
     * @return 员工查询列表
     */
    List<Employee> getEmployeeSearchList(String queryParam);

}
