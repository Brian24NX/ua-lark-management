<template>
  <el-dialog class="ccrSheet-dialog" title="title" :visible.sync="visible" width="1200px"
             :close-on-press-escape="false"
             :close-on-click-modal="false" :showClose="false">
    <el-button class="closeBtn" type="text" icon="el-icon-close" @click="close('rest')"></el-button>
    <div class="el-dialog__title" slot="title">
      <span>工单详情</span><span class="number">{{form.ccrId}}</span>
      <span v-if="pagetype != 3" class="status-default" :class="[form.statusName==='未处理'?'status-no':'', form.statusName==='已完成'?'status-success':'']">{{form.statusName}}</span>
      <span v-if="pagetype==3" class="status-default" :class="[form.serviceDeptStatus===2?'status-no':'status-success']">
        {{form.serviceDeptStatus===2?'未处理':'已完成'}}
      </span>
    </div>

    <el-form v-loading="loadingForm" :inline="true" :disabled="form.status==16" :model="form" :rules="rules" ref="form">

      <div class="marketingQa-form">

        <div class="template">
          <div class="template-contant">
            <el-row class="pl-10">
              <el-col><span class="css-label">工单提交时间：</span><span
                class="corlor-red">{{form.customerSubmitTime}}</span></el-col>
            </el-row>

            <h3 class="titleH3">提报人信息</h3>
            <el-row>
              <el-col :span="6"><span class="css-label">提报人姓名：</span><span
                class="css-value">{{form.customerName}}</span></el-col>
              <el-col :span="6"><span class="css-label">提报人电话：</span><span
                class="css-value">{{form.customerMobile}}</span></el-col>
              <el-col :span="6"><span class="css-label">公司名称：</span><span
                class="css-value">{{form.customerCompany}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="template-bg" v-if="form.status !== 16"></div>
        </div>
        <el-divider></el-divider>

        <div class="template">
          <div class="template-contant">
            <h3 class="titleH3">产品信息</h3>
            <el-row>
              <el-col :span="6"><span class="css-label">产品类型：</span><span class="css-value">{{form.productName}}</span>
              </el-col>
              <el-col :span="6"><span class="css-label">产品型号：</span><span class="css-value">{{form.productCode}}</span>
              </el-col>
              <el-col :span="6"><span class="css-label">序列号：</span><span class="css-value">{{form.serialNumber}}</span>
              </el-col>
              <el-col :span="6"><span class="css-label">生产日期：</span><span
                class="css-value">{{form.productionDate}}</span>
              </el-col>
            </el-row>
            <el-row class="mt20">
              <el-col :span="6"><span class="css-label">开业日期：</span><span
                class="css-value">{{form.openingDate}}</span></el-col>
              <el-col :span="6"><span class="css-label">合同号：</span><span
                class="css-value">{{form.contractNumber}}</span>
              </el-col>
            </el-row>
            <el-row class="mt20">
              <el-col :span="24">
                <div class="css-label vtop">产品铭牌：</div>
                <div class="css-value" style="width: calc(100% - 70px);">
                  <bigMedium v-model="form.productLabel"></bigMedium>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="template-bg" v-if="form.status !== 16"></div>
        </div>
        <el-divider></el-divider>

        <div class="template">
          <div class="template-contant">
            <h3 class="titleH3">问题信息</h3>
            <el-row>
              <el-col :span="6"><span class="css-label">问题类别：</span><span
                class="css-value">{{form.problemCategory}}</span>
              </el-col>
              <el-col :span="6"><span class="css-label">故障发生日期：</span><span
                class="css-value">{{form.problemTime}}</span></el-col>
              <el-col :span="12"><span class="css-label">问题描述：</span><span
                class="css-value">{{form.problemDescription}}</span>
              </el-col>
            </el-row>
            <el-row class="mt20">
              <el-col :span="12">
                <div class="css-label vtop">故障视频/图片：</div>
                <div class="css-value">
                  <bigMedium v-model="form.problemResource"></bigMedium>
                </div>
              </el-col>

              <el-col :span="12">
                <el-form-item label="补充信息：" prop="additionInfo" label-width="120px" label-position="left">
                  <el-input :disabled="!(pagetype===1 && [1,2,3,4,5,6,7,8,9,10,11,12,13].indexOf(form.status) !== -1)"
                            type="textarea" style="min-width: 400px;" :rows="5"
                            v-model="form.additionInfo" placeholder="" clearable/>
                  <!--                  <el-input :disabled="!subFlag"-->
                  <!--                            type="textarea" style="min-width: 400px;" :rows="5"-->
                  <!--                            v-model.trim="form.additionInfo" placeholder="" clearable/>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="mt20">
              <el-col :span="24">
                <div class="css-label vtop">补充视频/图片：</div>
                <div class="css-value">
                  <bigMedium ref="additionResourceRef" :key="bigIndex" v-model="form.additionResource" :isFile="pagetype===1 && [1,2,3,4,5,6,7,8,9,10,11,12,13].indexOf(form.status) !== -1"></bigMedium>
                  <!--                  <bigMedium ref="additionResourceRef" :key="bigIndex" v-model="form.additionResource" :isFile="subFlag"></bigMedium>-->
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="template-bg" v-if="!(form.status == 16 || (pagetype==1 && [1,2,3,4,5,6,7,8,9,10,11,12,13].indexOf(form.status) !== -1))"></div>
          <!--          <div class="template-bg" v-if="!subFlag"></div>-->
        </div>
        <el-divider></el-divider>

        <div class="template">
          <div class="template-contant">
            <h3 class="titleH3">应急方案与派工</h3>
            <el-row>
              <el-form-item label="是否需要派工：" prop="needForDispatch"
                            :rules="pagetype===1 && [1,3,5,7,9,11,13].indexOf(form.status) !== -1 ? { required: true, message: '此项为必填项'} : {}">
                <el-radio-group :disabled="!(pagetype===1 && [1,3,5,7,9,11,13].indexOf(form.status) !== -1)"
                                v-model="form.needForDispatch">
                  <el-radio label="1">需要</el-radio>
                  <el-radio label="0">不需要</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row class="mt20">
              <el-col :span="4"><span class="css-label">派工状态：</span><span
                class="css-value">{{form.dispatchStatus}}</span></el-col>
              <el-col :span="6"><span class="css-label">派工工单：</span><span
                class="css-value ">{{form.dispatchWorkOrder}}</span>
              </el-col>
              <el-col :span="6" :offset="1"><span class="css-label">派工师傅：</span><span class="css-value ">{{form.dispatchMaster}}</span>
              </el-col>
              <el-col :span="6" :offset="1"><span class="css-label">联系方式：</span><span class="css-value ">{{form.dispatchContact}}</span>
              </el-col>
            </el-row>
            <el-row class="mt20">
              <el-col :span="6"><span class="css-label">问题说明：</span><span class="css-value ">{{form.dispatchProblemDescription}}</span>
              </el-col>
            </el-row>

            <el-row class="mt20">
              <el-col :span="24">
                <el-form-item label="应急方案：" prop="emergencyPlan"
                              :rules="pagetype===1 && [1,3,5,7,9,11,13].indexOf(form.status) !== -1 ? { required: true, message: '此项为必填项', trigger: ['blur','change']} : [{}]">
                  <el-input :disabled="!(pagetype===1 && [1,3,5,7,9,11,13].indexOf(form.status) !== -1)"
                            @input="form.emergencyPlan = !!form.emergencyPlan.match(/^[ ]*$/) ? '' : form.emergencyPlan"
                            type="textarea" style="min-width: 400px;" :rows="5" v-model="form.emergencyPlan"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="template-bg"
               v-if="!(form.status == 16 || (pagetype==1 && [1,3,5,7,9,11,13].indexOf(form.status) !== -1))"></div>
        </div>
        <el-divider></el-divider>

        <div class="template">
          <div class="template-contant">
            <h3 class="titleH3">运营质量初步认定</h3>
            <el-row>
              <el-form-item label="是否为质量问题：" prop="isQualityProblem"
                            :rules="pagetype===2 && [1,2].indexOf(form.status) !== -1 ? { required: true, message: '此项为必填项', trigger: ['change']} : [{}]">
                <el-radio-group :disabled="!(pagetype===2 && [1,2].indexOf(form.status) !== -1)"
                                v-model="form.isQualityProblem">
                  <el-radio label="1">是质量问题</el-radio>
                  <el-radio label="0">非质量问题</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>

            <el-row v-if="form.isQualityProblem == 1" class="mt20">
              <el-form-item label="是否需要退回备件或设备进行分析：" prop="needReturnForAnalysis"
                            :rules="pagetype===2 && [1,2].indexOf(form.status) !== -1 ? { required: true, message: '此项为必填项', trigger: ['change']} : [{}]">
                <el-radio-group :disabled="!(pagetype===2 && [1,2].indexOf(form.status) !== -1)"
                                v-model="form.needReturnForAnalysis">
                  <el-radio label="1">需要</el-radio>
                  <el-radio label="0">不需要</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row v-if="form.isQualityProblem == 1" class="mt20">
              <el-col :span="7">
                <el-form-item label="退回单号：" prop="returnNumber" :rules="pagetype===3 && form.serviceDeptStatus == 2 ? { required: true, message: '此项为必填项', trigger: ['blur','change']} : {}">
                  <el-input :disabled="!(pagetype===3 && form.serviceDeptStatus == 2)" v-model.trim="form.returnNumber" type="text"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预计送达时间：" prop="expectedDeliveryTime"
                              :rules="pagetype===3 && form.serviceDeptStatus == 2 ? { required: true, message: '此项为必填项', trigger: ['blur','change']} : [{}]">
                  <el-date-picker
                    :disabled="!(pagetype===3 && form.serviceDeptStatus == 2)"
                    v-model="form.expectedDeliveryTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="template-bg"
               v-if="!(form.status == 16 || (pagetype==2 && [1,2].indexOf(form.status) !== -1) || pagetype==3 && form.serviceDeptStatus == 2)"></div>
        </div>
        <el-divider></el-divider>

        <div class="template">
          <div class="template-contant">
            <h3 class="titleH3">解决措施</h3>
            <el-row>
              <el-col :span="12">
                <el-form-item label="缺陷分类：" prop="defectClassification" label-width="120px" :inline="false"
                              label-position="left"
                              :rules="(pagetype===2 || pagetype===5) && [3,4,7,8].indexOf(form.status) !== -1 ? { required: true, message: '此项为必填项', trigger: ['change']} : {}">
                  <el-select clearable v-model="form.defectClassification" placeholder=""
                             :disabled="!((pagetype===2 || pagetype===5) && [3,4,7,8].indexOf(form.status) !== -1)">
                    <el-option v-for="(item,index) of defectClassificationList" :key="index" :label="item.label"
                               :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="责任部门：" prop="responsibleDepartment" label-width="120px" label-position="left"
                              :rules="(pagetype===2 || pagetype===5) && [3,4,7,8].indexOf(form.status) !== -1 ? { required: true, message: '此项为必填项', trigger: ['change']} : {}">
                  <el-select clearable v-model="form.responsibleDepartment" placeholder=""
                             :disabled="!((pagetype===2 || pagetype===5) && [3,4,7,8].indexOf(form.status) !== -1)">
                    <el-option v-for="(item,index) of responsibleDepartmentList" :key="index" :label="item.label"
                               :value="item.value"/>
                  </el-select>
                </el-form-item>
                <el-button
                  v-if="pagetype===4 && [9,10].indexOf(form.status) !== -1"
                  @click="rejectionCountFn" type="text" class="danger">不认可，请重新分配
                </el-button>
              </el-col>
            </el-row>

            <el-row class="mt20">
              <el-col :span="12">
                <el-form-item label="是否有效：" prop="areMeasuresEffective" label-width="120px" :inline="false"
                              label-position="left"
                              :rules="pagetype===2 && [11,12].indexOf(form.status) !== -1 ? { required: true, message: '此项为必填项', trigger: ['change']} : {}">
                  <el-select clearable v-model="form.areMeasuresEffective" placeholder=""
                             :disabled="!(pagetype===2 && [11,12].indexOf(form.status) !== -1)">
                    <el-option v-for="(item,index) of xx8List" :key="index" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.areMeasuresEffective == 1">
                <el-form-item label="费用归属：" prop="costAttribution" label-width="120px" label-position="left"
                              :rules="pagetype===2 && [11,12].indexOf(form.status) !== -1 ? { required: true, message: '此项为必填项', trigger: ['change']} : {}">
                  <el-select clearable v-model="form.costAttribution" placeholder=""
                             :disabled="!(pagetype===2 && [11,12].indexOf(form.status) !== -1)">
                    <el-option v-for="(item,index) of searchCostAttributionEnumList" :key="index" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="mt20">
              <el-col :span="24">
                <el-form-item label="措施描述：" prop="measuresDescription" label-width="120px" label-position="left">
                  <el-input style="min-width: 780px;" :rows="5" v-model="form.measuresDescription" type="textarea"
                            :disabled="!(pagetype===4 && [9,10].indexOf(form.status) !== -1)"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="mt20">
              <el-col :span="24">
                <el-form-item label="报告：" prop="report" label-width="120px" label-position="left"
                              :rules="pagetype===4 && [9,10].indexOf(form.status) !== -1 ? { required: true, message: '此项为必填项', trigger: ['change']} : {}">

                  <!--                    -->
                  <input accept="" ref="reportFile" type="file" name="" style="display: none" @change="onChange"/>
                  <el-button :disabled="!(pagetype===4 && [9,10].indexOf(form.status) !== -1)" type="primary"
                             @click="uploadFile(form.report)">上传文件
                  </el-button>

                  <el-link style="margin-left: 15px;" v-if="form.reportUrl" :href="form.reportUrl" :underline="false"
                           target="_blank">
                    <span class="el-icon-document"> {{form.reportName}} </span>
                  </el-link>

                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="template-bg"
               v-if="!(form.status == 16 || (pagetype==2 && [3,4,7,8,11,12].indexOf(form.status) !== -1) || (pagetype==4 && [9,10].indexOf(form.status) !== -1) || (pagetype==5 && [3,4,7,8].indexOf(form.status) !== -1))"></div>
        </div>
        <el-divider></el-divider>

        <div class="template">
          <div class="template-contant">
            <h3 class="titleH3">市场措施补充说明及跟踪 </h3>

            <el-row>
              <el-col :span="12">
                <el-form-item label="补充回复：" prop="additionalReply">
                  <el-input :disabled="!(pagetype==1 && [14].indexOf(form.status)!== -1)" style="min-width: 400px;"
                            :rows="5" v-model="form.additionalReply" type="textarea"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-col :span="6">
                  <span class="css-label">提报人满意度：</span>
                  <span class="css-value" v-if="!!form.customerSatisfaction && form.customerSatisfaction != 0">{{form.customerSatisfaction}}星</span>
                </el-col>
              </el-col>

            </el-row>
          </div>
          <div class="template-bg" v-if="!(form.status == 16 || (pagetype==1 && [14].indexOf(form.status) !== -1))"></div>
        </div>
        <el-divider></el-divider>

        <div class="template">
          <div class="template-contant">
            <el-row>
              <el-col :span="3">
                <h3 class="titleH3">工单状态</h3>
              </el-col>
              <el-col :span="12">
                <el-button @click="openList = !openList" v-show="openList">收起 <i class="el-icon-arrow-up"></i>
                </el-button>
                <el-button @click="openList = !openList" v-show="!openList">展开 <i class="el-icon-arrow-down"></i>
                </el-button>
              </el-col>
            </el-row>
            <el-row v-show="openList" class="historyList">
              <el-col :span="24">
                <div class="block" v-if="historyList.length > 0">
                  <el-timeline>
                    <el-timeline-item v-for="(item, index) in historyList" color="#2D75FF" placement="bottom">
                      <el-card>
                        <el-row>
                          <el-col :span="20">
                            <h4>{{item.operator}}</h4>
                            <h5>{{item.operation}}</h5>
                          </el-col>
                          <el-col :span="4" class="fixRight">
                            <p>{{item.operationTime}}</p>
                          </el-col>
                        </el-row>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
                <div v-else>
                  暂无数据
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn">取消</el-button>
      <el-button v-if="subFlag" :loading="loadingSave" type="primary" @click="save">提交
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
  import bigMedium from '@/views/ccrSheet/components/bigMedium'
  import FileUpload from '@/views/ccrSheet/components/FileUpload'
  import { getQueryObject } from '@/utils'

  import {
    ccrqueryFeedbackDetailsApi,
    ccrproductTypeListApi,
    ccrTicketHistoryListApi,
    submitApi,
    ccrresponsibleDepartmentListApi,
    ccrdefectClassificationListApi,
    ccrUploadFileApi,
    searchCostAttributionEnumListApi
  } from '@/api/ccrSheet'

  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      pagetype: {
        type: Number,
        default: null
      },
      ccrId: {
        type: String,
        default: ''
      },
      submitUrl: {
        type: String,
        default: ''
      }
    },
    components: { bigMedium, FileUpload },
    data() {
      return {
        subFlag: false,
        bigIndex: 0,
        fileUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_CCR_PATH + 'ccrUploadFile/3',
        loadingForm: true,
        loadingSave: false,
        visible: false,
        detailData: {},
        form: {
          statusName:'',
          submitType: 2,
          needForDispatch: '',
          emergencyPlan: '',
          isQualityProblem: '',
          needReturnForAnalysis: '',
          defectClassification: null,
          responsibleDepartment: null,
          costAttribution: null,
          measuresDescription: '',
          additionalReply: '',
          additionResource: '',
          report: '',
          xx4: '',
          xx5: '',
          xx6: '',
          xx7: '',
          xx8: '',
          xx9: ''
        },
        rules: {
          // needForDispatch: [],
          // emergencyPlan: [],
          // isQualityProblem: [],
          // needReturnForAnalysis: [],
          // returnNumber: [],
          // expectedDeliveryTime: [],
        },
        xx3List: [
          { label: 'A', value: 0 },
          { label: 'B', value: 1 },
          { label: 'C', value: 2 },
          { label: 'D', value: 3 }
        ],
        xx4List: [
          { label: '开发设计A', value: 0 },
          { label: '开发设计B', value: 1 },
          { label: '开发设计C', value: 2 },
          { label: '开发设计D', value: 3 }
        ],
        xx5List: [
          { label: '开发设计A', value: 0 },
          { label: '开发设计B', value: 1 },
          { label: '开发设计C', value: 2 },
          { label: '开发设计D', value: 3 }
        ],
        defectClassificationList: [
          { label: '开发设计A', value: 0 },
          { label: '开发设计B', value: 1 },
          { label: '开发设计C', value: 2 },
          { label: '开发设计D', value: 3 }
        ],
        responsibleDepartmentList: [],
        xx8List: [
          { label: '有效', value: "1" },
          { label: '无效', value: "0" }
        ],
        xx9List: [
          { label: '1st year warranty Spend', value: 0 },
          { label: '2st year warranty Spend', value: 1 },
          { label: '3st year warranty Spend', value: 2 },
          { label: '4st year warranty Spend', value: 3 }
        ],
        openList: false,
        productTypeList: [],
        historyList: [],
        searchCostAttributionEnumList: [],
      }
    },

    async created() {
      // this.loading=false
      // this.form.status = 13
      //
      // let pagetype = this.pagetype
      // let status = this.form.status
      // this.subFlag =
      //   (pagetype==1 && [2,4,6,8,10,12].indexOf(status) === -1) ||
      //   (pagetype==2 && [5,6,9,10,13,14].indexOf(status) === -1) ||
      //   (pagetype==3 && [1,2,3,4,7,8,9,10,11,12,13,14].indexOf(status) === -1) ||
      //   (pagetype==4 && [1,2,3,4,5,6,7,8,11,12,13,14].indexOf(status) === -1) ||
      //   (pagetype==5 && [1,2,5,6,9,10,11,12,13,14].indexOf(status) === -1)
      //
      // return
      console.log('ccrId', this.ccrId)
      await this.ccrdefectClassificationListFun()
      await this.ccrresponsibleDepartmentListFun()
      await this.ccrproductTypeListFun()
      await this.searchCostAttributionEnumListFun()
      await this.ccrTicketHistoryListFun()
      this.getDetail()
    },
    watch: {
      'form.needForDispatch'() {
        console.log('form.needForDispatch', this.form.needForDispatch)
      }
    },
    mounted() {

    },
    filters: {
      filterProduct(e) {
        console.log('e', e, this.productTypeList)
        let value = ''
        value = this.productTypeList.filter((item) => item.value === e)
        return value.length > 0 && value[0].label || ''
      }
    },
    methods: {
      searchCostAttributionEnumListFun() {
        searchCostAttributionEnumListApi().then(res => {
          if (res.code == 200) {
            let data = []
            for (let key in res.data) {
              data.push({
                label: res.data[key],
                value: key
              })
            }
            this.searchCostAttributionEnumList = data
          }
        })
      },
      ccrdefectClassificationListFun() {
        ccrdefectClassificationListApi().then(res => {
          if (res.code == 200) {
            let data = []
            for (let key in res.data) {
              data.push({
                label: res.data[key],
                value: key
              })
            }
            this.defectClassificationList = data
          }
        })
      },
      ccrresponsibleDepartmentListFun() {
        ccrresponsibleDepartmentListApi().then(res => {
          if (res.code == 200) {
            let data = []
            for (let key in res.data) {
              data.push({
                label: res.data[key],
                value: key
              })
            }
            this.responsibleDepartmentList = data
          }
        })
      },

      ccrproductTypeListFun() {
        ccrproductTypeListApi().then(res => {
          if (res.code == 200) {
            let data = []
            for (let key in res.data) {
              data.push({
                label: res.data[key],
                value: key
              })
            }
            console.log('datae', data)
            this.productTypeList = data
          }
        })
      },

      ccrTicketHistoryListFun() {
        ccrTicketHistoryListApi(this.ccrId).then(res => {
          if (res.code == 200) {
            this.historyList = res.data
          }
        })
      },

      getDetail() {
        if (this.ccrId) {
          this.loadingForm = true
          ccrqueryFeedbackDetailsApi(this.ccrId).then(res => {
            if (res.code == 200) {

              let pagetype = this.pagetype
              let status = res.data.status

              if (pagetype == 3) {
                res.data.status = 3
              }

              let statusName = this.$parent.statusList.filter((item) => item.value === res.data.status) || []
              let productName = this.productTypeList.filter((item) => item.value === res.data.productType)
              console.log('productName1' , this.productTypeList)
              console.log('productName2' , productName)

              res.data.statusName = statusName.length > 0 && statusName[0].label || ''
              res.data.productName = productName.length > 0 && productName[0].label || ''

              // res.data.report = "https://qhc-qiwei-uat.oss-cn-shanghai.aliyuncs.com/ccr/pdf/1678949668015%E6%96%B0%E5%BB%BA%20XLS%20%E5%B7%A5%E4%BD%9C%E8%A1%A8%20-%20%E5%89%AF%E6%9C%AC.xls?新建 XLS 工作表 - 副本.xls"
              res.data.report = !!res.data.report ? res.data.report : ''
              res.data.reportUrl =  res.data.report && res.data.report.split('?')[0] || ''
              res.data.reportName = res.data.report && res.data.report.split('?')[1] || ''


              this.subFlag =
                (pagetype==1 && [15,16].indexOf(status) === -1) ||
                (pagetype==2 && [5,6,9,10,13,14,15,16].indexOf(status) === -1) ||
                (pagetype==3 && res.data.serviceDeptStatus == 2) ||
                (pagetype==4 && [1,2,3,4,5,6,7,8,11,12,13,14,15,16].indexOf(status) === -1) ||
                (pagetype==5 && [1,2,5,6,9,10,11,12,13,14,15,16].indexOf(status) === -1)
              // (pagetype==3 && [1,2,3,4,7,8,9,10,11,12,13,14,15,16].indexOf(status) === -1) ||

              this.form = res.data
              this.form.submitType = 2

              // this.form.status = 4

              // if (this.pagetype==1 && [1,3,5,7,9,11,13,16].indexOf(this.form.status) !== -1){
              //   this.$set(this.rules,'needForDispatch',[{ required: true, message: '此项为必填项', trigger: ['blur','change']}])
              //   this.$set(this.rules,'emergencyPlan',[{ required: true, message: '此项为必填项', trigger: ['blur','change']}])
              // }
              // if (this.pagetype===2 && [1,2].indexOf(this.form.status) !== -1){
              //   this.$set(this.rules,'isQualityProblem',[{ required: true, message: '此项为必填项', trigger: ['blur','change']}])
              //   this.$set(this.rules,'needReturnForAnalysis',[{ required: true, message: '此项为必填项', trigger: ['blur','change']}])
              // }
              // if (this.pagetype===3 && [5,6].indexOf(this.form.status) !== -1){
              //   this.$set(this.rules,'returnNumber',[{ required: true, message: '此项为必填项', trigger: ['blur','change']}])
              //   this.$set(this.rules,'expectedDeliveryTime',[{ required: true, message: '此项为必填项', trigger: ['blur','change']}])
              // }

            }
          }).finally(() => {
            this.loadingForm = false
          })
        } else {
          this.$message.error('缺少ccrId！')
        }
      },

      additionResourceFile(type, data) {
        console.log('additionResourceFile111', type, data)

        // if (type == 0) {
        //   let arr = this.form.additionResource.split(',')
        //   arr.splice(data, 1);
        //   console.log('arr777', arr)
        //   arr = arr.length === 0 ? '' : arr.join(',')
        //   this.$set(this.form, 'additionResource', arr)
        // }
        //
        // if (type == 1) {
        //   if (!!this.form.additionResource) {
        //     let arr = this.form.additionResource.split(',')
        //     arr.push(data.url)
        //     this.$set(this.form, 'additionResource', arr.join(','))
        //   } else {
        //     this.$set(this.form, 'additionResource', data.url)
        //   }
        // }
        // console.log('arr777', this.form.additionResource)

        // this.bigIndex++
      },

      save() {
        console.log('ooo111', this.$refs['additionResourceRef'].mediaUrlList)
        console.log('ooo113333', this.form.report)
        console.log('form123', this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            console.log('good submit!!')

            this.saveFn()

          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      saveFn(){
        this.form.report = this.form.reportUrl + '?' +  this.form.reportName
        let mediaUrlList = this.$refs['additionResourceRef'].mediaUrlList
        let getArr = []
        if (mediaUrlList.length > 0) {
          mediaUrlList.forEach((item) => {
            getArr.push(item.url)
          })
        }
        this.form.additionResource = getArr.length > 0 ? getArr.join(',') : ''

        let param = JSON.parse(JSON.stringify(this.form))
        console.log('param123', param)

        this.loadingSave = true
        submitApi(this.submitUrl, param).then(res => {
          if (res.code == 200) {
            this.closeFn()
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loadingSave = false
        })
      },

      rejectionCountFn(row) {
        console.log('row', row)
        this.$confirm('该操作只能完成一次，是否确认有疑议需要驳回？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.form.submitType = 1
          this.saveFn()
        }).catch(() => {
        })
      },

      close(type) {
        if (type === 'rest') {
          this.$confirm('是否直接关闭？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.closeFn()
          }).catch(() => {
          })
        } else {
          this.closeFn()
        }
      },

      closeFn() {
        this.visible = false
        this.$refs['form'].clearValidate()
        this.$refs['form'].resetFields()
        setTimeout(() => {
          this.$parent.visible = false
          this.$emit('emitInit')
        }, 200)
      },

      uploadFile() {
        this.$refs.reportFile.click()
      },

      onChange() {
        console.log('this.$refs.reportFile', this.$refs.reportFile.files)
        const file = this.$refs.reportFile.files[0]
        let index = file.name.lastIndexOf('.')
        let ext = file.name.substring(index + 1)
        if (['doc', 'docx', 'xlsx', 'xls', 'pdf', 'ppt','pptx'].indexOf(ext) === -1) {
          this.$message.error('请上传格式为 doc,docx,xlsx,xls,pdf,ppt,pptx 的文件')
          return
        }
        let formData = new FormData()
        formData.append('file', file)
        ccrUploadFileApi(3, formData).then((res) => {
          console.log('获取上传后的文件地址', res)
          if (res.code === '200') {
            this.$set(this.form, 'reportUrl', res.data.url)
            this.$set(this.form, 'reportName', res.data.fileName)
            this.form.report = res.data.url + '?' + res.data.fileName
            //this.$refs.form.validateField('report');
          } else {
            this.$message.error(res.message)
          }
        })
        this.$refs.reportFile.value = null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .number {
    padding-left: 15px;
    margin-left: 15px;
    position: relative;
  }

  .number::before {
    content: "";
    width: 2px;
    height: 15px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: #8f8f8f;
  }

  .status-default {
    color: #E6A23C;
    margin-left: 30px;
  }

  .status-no {
    color: #F56C6C;
  }

  .status-success {
    color: #67C23A;
  }

  .titleH3 {
    font-size: 16px;
    position: relative;
    padding-left: 15px;
    color: #000;
    left: -7px;
    margin: 5px 0 30px;
  }

  .titleH3::before {
    content: "";
    width: 4px;
    height: 20px;
    background: #1991F6;
    border-radius: 3px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .marketingQa-form {
    position: relative;
  }

  .css-label, .css-value {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    line-height: 32px;
  }

  .css-label {
    color: #000;
  }

  .css-value {
    color: #686868;
  }

  .vtop {
    vertical-align: top;
  }

  .corlor-red {
    color: #FA3C3C;
  }

  .pl-10 {
    position: relative;
    left: -7px;
    margin-bottom: 30px;
  }

  .template {
    position: relative;
    padding: 15px;

    .template-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 9;
      background: rgba(0, 0, 0, 0.1);
      pointer-events: none;
      /*cursor: none;*/
    }
  }

  .historyList {
    position: relative;

    h4 {
      font-size: 16px;
      color: #2D75FF;
    }

    h5 {
      color: #000;
    }

    .fixRight {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #999999;
    }
  }
</style>
<style lang="scss">
  .ccrSheet-dialog {
    .el-dialog__body {
      padding: 0 20px 20px;
    }

    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }

    .el-form-item__label {
      font-weight: normal;
      color: #000;
      font-size: 14px;
    }

    textarea, input {
      font-size: 13px;
      color: #606266;
      font-family: 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';
    }

    .el-card__body {
      padding: 0 15px;
    }
  }


</style>
