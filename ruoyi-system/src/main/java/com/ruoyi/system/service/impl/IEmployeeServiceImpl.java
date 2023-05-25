package com.ruoyi.system.service.impl;

import com.ruoyi.system.domain.member.Employee;
import com.ruoyi.system.mapper.EmployeeMapper;
import com.ruoyi.system.service.IEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 员工信息 服务层实现
 *
 * @author iSoftStone-Robert
 * @date 2023/2/23
 */
@Service
public class IEmployeeServiceImpl implements IEmployeeService {

    @Autowired
    private EmployeeMapper employeeMapper;

    /**
     * 获取员工用户查询列表
     *
     * @param queryParam 查询参数
     * @return 员工查询列表
     */
    @Override
    public List<Employee> getEmployeeSearchList(String queryParam) {
        return employeeMapper.getEmployeeSearchList(queryParam);
    }
}
