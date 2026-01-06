<template>
  <div class="container">
    <div class="top">
      <div class="title">
        <el-icon>
          <House />
        </el-icon>
        数据总览
      </div>
      <div class="card-grid">
        <NumCard v-for="(item, index) in topCard" :key="index" :item="item" />
      </div>
    </div>

    <div class="main">
      <div class="title">
        <el-icon>
          <MessageBox />
        </el-icon>
        管理卡片
      </div>
      <div class="info-grid">
        <table-card title="门店信息" show-more>
          <template #table>
            <el-table :data="shops" :show-header="false" border style="width: 100%" height="300">
              <el-table-column prop="name" min-width="120" />
              <el-table-column width="100" align="center">
                <template #default="{ row }">
                  <el-tag type="success" size="small">营业中</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </table-card>
        <table-card title="最近订单" show-more>
          <template #table>
            <el-table :data="orders" :show-header="false" border style="width: 100%" height="300">
              <el-table-column prop="shopName" label="门店" min-width="120" />
              <el-table-column prop="amount" label="金额" width="100" align="right">
                <template #default="{ row }">¥{{ row.amount }}</template>
              </el-table-column>
              <el-table-column prop="orderStatus" label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getOrderStatusType(row.orderStatus)" size="small">
                    {{ getOrderStatusText(row.orderStatus) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </table-card>
        <table-card title="最近评价" show-more>
          <template #table>
            <el-table :data="comments" :show-header="false" border style="width: 100%" height="300">
              <el-table-column prop="rate" label="评分" width="160" align="center">
                <template #default="{ row }">
                  <div class="rate-display">
                    <el-rate v-model="row.rate" disabled show-score text-color="#ff9900" score-template="{value}分"
                      :max="5" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="评价内容" min-width="140" />
              <el-table-column label="操作" width="100" align="center">
                <template #default="{ row }">
                  <el-button type="text" size="small">回复</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </table-card>
      </div>
    </div>

    <div class="bottom">
      <div class="title">
        <el-icon>
          <Histogram />
        </el-icon>
        数据图表
      </div>
      <div class="chart-grid">
        <chart-card title="订单分布" :data="orderChartData">
          <template #filter>
            <el-select v-model="chartDateRange" placeholder="选择日期" size="small">
              <el-option v-for="item in chartOpt" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
          </template>
        </chart-card>
        <chart-card title="营业额分布" :data="sellChartData">
          <template #filter>
            <el-select v-model="chartDateRange" placeholder="选择日期" size="small">
              <el-option v-for="item in chartOpt" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
          </template>
        </chart-card>
        <chart-card title="营业额趋势" :data="sellShopChartData">
          <template #filter>
            <el-select v-model="distDateRange" placeholder="选择日期" size="small">
              <el-option v-for="item in chartOpt" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
          </template>
        </chart-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import NumCard from './components/NumCard.vue'
import ChartCard from './components/ChartCard.vue'
import TableCard from './components/TableCard.vue'
// Data
const statisicData = ref([])
const shops = ref([])
const orders = ref([])
const comments = ref([])
const chartDateRange = ref('week')
const distDateRange = ref('week')
const chartOpt = ref([
  {
    label: '日',
    value: 'day',
  },
  {
    label: '周',
    value: 'week',
  },
  {
    label: '月',
    value: 'month',
  },
  {
    label: '年',
    value: 'year',
  }
])
const orderChartData = ref({
  xAxis: {
    data: ['一店', '二店', '三店', '四店', '五店']
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: [23, 24, 18, 25, 27]
    }
  ]
})
const sellChartData = ref({
  xAxis: {
    data: ['一店', '二店', '三店', '四店', '五店']
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: [5000.66, 2300.46, 4600.78, 6800.45, 2468.56]
    }
  ]
})

const sellShopChartData = ref({
  xAxis: {
    type: 'category',
    data: ['一月', '二月', '三月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [1206, 2020, 1550],
      type: 'line'
    }
  ]
})
// Fake data
const topCard = [{
  title: '门店',
  val: 100,
  icon: 'shop',
  ratio: 0.5,
  compare: 'week'
}, {
  title: '订单',
  val: 400,
  icon: 'order',
  ratio: -0.1,
  compare: 'month'
}, {
  title: '营业额',
  val: 3444.96,
  icon: 'sell',
  ratio: 0.8,
  compare: 'week'
}]

const fakeShops = [{
  id: 1,
  name: '旗舰店（中心广场）'
}, {
  id: 2,
  name: '分店一（商业街）'
}, {
  id: 3,
  name: '分店二（大学城）'
}, {
  id: 4,
  name: '分店三（科技园）'
}, {
  id: 5,
  name: '分店四（火车站）'
}, {
  id: 6,
  name: '分店五（机场店）'
}]

const fakeOrders = [{
  id: 1,
  amount: 156.00,
  shopId: 1,
  shopName: '旗舰店',
  orderStatus: 1
}, {
  id: 2,
  amount: 89.50,
  shopId: 2,
  shopName: '分店一',
  orderStatus: 2
}, {
  id: 3,
  amount: 203.00,
  shopId: 3,
  shopName: '分店二',
  orderStatus: 3
}, {
  id: 4,
  amount: 67.80,
  shopId: 1,
  shopName: '旗舰店',
  orderStatus: 1
}, {
  id: 5,
  amount: 145.20,
  shopId: 4,
  shopName: '分店三',
  orderStatus: 2
}, {
  id: 6,
  amount: 98.50,
  shopId: 5,
  shopName: '分店四',
  orderStatus: 1
}]

const fakeComment = [{
  id: 1,
  rate: 5,
  content: '咖啡味道非常棒，服务态度也很好，会经常光顾！'
}, {
  id: 2,
  rate: 4,
  content: '环境优雅，适合工作会谈，咖啡品质不错'
}, {
  id: 3,
  rate: 3,
  content: '价格有点偏高，不过味道还可以接受'
}, {
  id: 4,
  rate: 5,
  content: '店员非常专业，推荐的咖啡很符合我的口味'
}, {
  id: 5,
  rate: 4,
  content: '位置便利，装修很有格调，咖啡品质稳定'
}, {
  id: 6,
  rate: 5,
  content: '最爱的咖啡店，每次来都会尝试不同的单品'
}]

// Lifecycle hooks
onMounted(() => {
  getStatisicData()
  getShops()
  getOrders()
  getComments()
})

// Methods
const getStatisicData = () => {
  statisicData.value = topCard
}

const getShops = () => {
  shops.value = fakeShops
}

const getOrders = () => {
  orders.value = fakeOrders
}

const getComments = () => {
  comments.value = fakeComment
}
const getOrderStatusType = (status) => {
  const types = ['success', 'warning', 'info']
  return types[status - 1] || 'info'
}

const getOrderStatusText = (status) => {
  const texts = ['已完成', '制作中', '待支付']
  return texts[status - 1] || '未知状态'
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  padding: 20px;
  //background: #f5f7fa;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: auto;

  .title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 20px;
    // text-align: center;
  }

  .top {
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;

      // .card-item {
      //   background: white;
      //   border-radius: 12px;
      //   padding: 24px;
      //   display: flex;
      //   align-items: center;
      //   gap: 20px;
      //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
      //   border: 1px solid #ebeef5;
      //   transition: all 0.3s ease;
      //   cursor: pointer;

      //   &:hover {
      //     transform: translateY(-4px);
      //     box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
      //     border-color: #409EFF;
      //   }

      //   .card-icon {
      //     width: 60px;
      //     height: 60px;
      //     border-radius: 10px;
      //     display: flex;
      //     align-items: center;
      //     justify-content: center;

      //     .icon {
      //       font-size: 28px;
      //       color: white;
      //     }

      //     &:nth-child(2) {
      //       background: linear-gradient(135deg, #67C23A 0%, #85ce61 100%);
      //     }

      //     &:nth-child(3) {
      //       background: linear-gradient(135deg, #E6A23C 0%, #ebb563 100%);
      //     }
      //   }

      //   .card-content {
      //     flex: 1;

      //     .card-title {
      //       font-size: 14px;
      //       color: #909399;
      //       margin-bottom: 8px;
      //     }

      //     .card-val {
      //       font-size: 28px;
      //       font-weight: 600;
      //       color: black;
      //       margin-bottom: 12px;
      //     }

      //     .card-trend {
      //       display: flex;
      //       align-items: center;
      //       gap: 6px;

      //       .trend-icon {
      //         width: 20px;
      //         height: 20px;
      //         border-radius: 4px;
      //         display: flex;
      //         align-items: center;
      //         justify-content: center;

      //         &.down {
      //           background: rgba(103, 194, 58, 0.1);
      //           color: #67C23A;
      //         }

      //         &.up {
      //           background: rgba(245, 108, 108, 0.1);
      //           color: #F56C6C;
      //         }

      //         i {
      //           font-size: 12px;
      //         }
      //       }

      //       .trend-value {
      //         font-size: 14px;
      //         font-weight: 500;

      //         &.down {
      //           color: #67C23A;
      //         }

      //         &.up {
      //           color: #F56C6C;
      //         }
      //       }

      //       .trend-label {
      //         font-size: 12px;
      //         color: #909399;
      //       }
      //     }
      //   }
      // }
    }
  }

  .main {
    flex: 1;

    .info-grid {
      // height: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;

      // .info-card {
      //   background: white;
      //   border-radius: 12px;
      //   padding: 20px;
      //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
      //   border: 1px solid #ebeef5;
      //   display: flex;
      //   flex-direction: column;

      //   .card-header {
      //     display: flex;
      //     justify-content: space-between;
      //     align-items: center;
      //     margin-bottom: 20px;
      //     padding-bottom: 15px;
      //     border-bottom: 1px solid #ebeef5;

      //     .header-title {
      //       display: flex;
      //       align-items: center;
      //       gap: 10px;
      //       font-size: 16px;
      //       font-weight: 500;
      //       color: #303133;

      //       .header-icon {
      //         font-size: 20px;
      //         color: #409EFF;
      //       }
      //     }

      //     .more-btn {
      //       color: #909399;

      //       &:hover {
      //         color: #409EFF;
      //       }
      //     }
      //   }

      //   .rate-display {
      //     :deep(.el-rate) {
      //       .el-rate__icon {
      //         font-size: 14px;
      //       }
      //     }
      //   }
      // }
    }
  }

  .bottom {
    .chart-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 20px;

      .chart-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
        border: 1px solid #ebeef5;
        display: flex;
        flex-direction: column;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #ebeef5;

          .header-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            font-weight: 500;
            color: #303133;

            .header-icon {
              font-size: 20px;
              color: #409EFF;
            }
          }

          .date-filter {
            width: 120px;
          }
        }

        .chart-container {
          flex: 1;
          min-height: 300px;

          .chart-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9f9f9;
            border-radius: 8px;

            .placeholder-content {
              text-align: center;
              color: #909399;
              width: 450px;
              height: 300px;

              .placeholder-icon {
                font-size: 60px;
                color: #dcdfe6;
                margin-bottom: 20px;
              }

              .placeholder-text {
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 8px;
                color: #606266;
              }

              .placeholder-hint {
                font-size: 14px;
                color: #909399;
              }
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1400px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .chart-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 992px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .info-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .card-grid {
    grid-template-columns: 1fr !important;
  }

  .card-item {
    flex-direction: column;
    text-align: center;
    gap: 15px !important;

    .card-content {
      .card-val {
        font-size: 24px !important;
      }
    }
  }
}

@media (max-width: 576px) {
  .container {
    padding: 10px;
  }

  .chart-card {
    .card-header {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 10px;

      .date-filter {
        width: 100% !important;
      }
    }
  }
}

// 表格样式优化
:deep(.el-table) {
  .el-table__header-wrapper {
    th {
      background-color: #f5f7fa;
      color: #606266;
      font-weight: 600;
    }
  }

  .el-table__body-wrapper {
    .el-table__row {
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }

  .el-table__cell {
    padding: 12px 0;
  }
}

// Element Plus 样式覆盖
:deep(.el-select) {
  width: 100%;
}

:deep(.el-button--text) {
  padding: 0;
}
</style>