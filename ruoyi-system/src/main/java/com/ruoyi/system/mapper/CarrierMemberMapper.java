package com.ruoyi.system.mapper;

import com.ruoyi.system.domain.member.Bu;

import java.util.List;

/**
 * @author iSoftStone-Robert
 * @date 2023/3/17
 */
public interface CarrierMemberMapper {

    /**
     * 获取所有的Bu信息列表
     *
     * @return 所有的Bu信息列表
     */
    List<Bu> getBuList();
}
