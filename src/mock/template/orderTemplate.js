export const orderTemplate = {
  query: {
    code: 200,
    message: '成功',
    data: {
      'total|10-100': 10,
      'current|1': 1,
      'size|10': 10,
      'records|1-10': [
        {
          'id': '@id',
          'userId': '@id',
          'userName': '@cname',
          'shopOrderNo|+1': 1,
          payTime: '@datetime',
          'totalAmount|1-100': 1,
          'orderStatus|0-6': 0,
          'shopId': '@id',
          shopName: '@shopName',
          payType: '微信支付',
          payCode: '5500',
          'pickupType|0-1': 0,
          'createTime': '@datetime',
          'updateTime': '@datetime',
          'delFlag|0-1': 0
        }
      ]
    }
  },
  detail: {
    code: 200,
    message: '成功',
    data: {
      'id|+1': 1,
      'userId': '@id',
      'userName': '@cname',
      'shopOrderNo': '@guid()',
      orderId: '@id',
      payTime: '@datetime',
      'totalAmount|1-100.00': 1.00,
      'orderStatus|0-6': 0,
      'shopId': '@id',
      shopName: '@shopName',
      payType: '微信支付',
      payCode: '5500',
      'pickupType|0-1': 0,
      itemInfo: [
        {
          id: 1,
          name: 'Hutu Coffee',
          cover: '',
          price: 11,
          count: 1,
          skus: [
            {
              label: '微糖',
              value: '4',
              parentId: '1'
            },
            {
              label: '去冰',
              parentId: '2'
            },
            {
              label: '超大杯',
              value: '3',
              parentId: '3'
            },
            {
              label: '一份糖浆',
              value: '3',
              parentId: '4',
              addonalPrice: 1
            }
          ]
        },
        {
          id: 77,
          name: 'Hutu Coffee',
          cover: '',
          price: 11,
          count: 1,
          skus: [
            {
              label: '微糖',
              value: '4',
              parentId: '1'
            },
            {
              label: '去冰',
              parentId: '2'
            },
            {
              label: '超大杯',
              value: '3',
              parentId: '3'
            },
            {
              label: '一份糖浆',
              value: '3',
              parentId: '4',
              addonalPrice: 1
            }
          ]
        },
        {
          id: 66,
          name: 'Hutu Coffee',
          cover: '',
          price: 11,
          count: 1,
          skus: [
            {
              label: '微糖',
              value: '4',
              parentId: '1'
            },
            {
              label: '去冰',
              parentId: '2'
            },
            {
              label: '超大杯',
              value: '3',
              parentId: '3'
            },
            {
              label: '一份糖浆',
              value: '3',
              parentId: '4',
              addonalPrice: 1
            }
          ]
        },
        {
          id: 2,
          name: 'Hutu Coffee',
          cover: '',
          price: 11,
          count: 1,
          skus: [
            {
              label: '微糖',
              value: '4',
              parentId: '1'
            },
            {
              label: '去冰',
              parentId: '2'
            },
            {
              label: '超大杯',
              value: '3',
              parentId: '3'
            },
            {
              label: '一份糖浆',
              value: '3',
              parentId: '4',
              addonalPrice: 1
            }
          ]
        },
        {
          id: 3,
          name: 'Hutu Coffee',
          cover: '',
          price: 11,
          count: 1,
          skus: [
            {
              label: '微糖',
              value: '4',
              parentId: '1'
            },
            {
              label: '去冰',
              parentId: '2'
            },
            {
              label: '超大杯',
              value: '3',
              parentId: '3'
            },
            {
              label: '一份糖浆',
              value: '3',
              parentId: '4',
              addonalPrice: 1
            }
          ]
        }
      ]
    }
  }
}