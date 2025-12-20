import Mock from 'mockjs'
import { authTemplate } from './template/authTemplate'
import { storeTemplate } from './template/storeTemplate'
import { catalogTemplate } from './template/catalogTemplate'
import { itemTemplate } from './template/itemTemplate'
import { imageTemplate } from './template/imageTemplate'
import { skuTemplate } from './template/skuTemplate'
import { orderTemplate } from './template/orderTemplate'
import { dictTemplate } from './template/dictTemplate'
import { resp } from './template/'
Mock.setup({
  timeout: 500
})

export const staticLatAndLongitude = [22.306583887776, 114.17854456]


console.log('mock启动成功');

Mock.Random.extend({
  image: () => {
    let images = [
      '/static/act.png', '/static/act1.png',
      '/static/act2.png', '/static/act3.png', '/static/act4.png'
    ]
    return images[Math.floor(Math.random() * images.length)]
  },
  shopName: () => {
    const perfix = ['店', '分店', '二分店', '三分店', '四分店', '五分店', '六分店', '七分店', '八分店', '九分店', '总店']
    const nameSuffix = '糊涂咖啡'
    const region = ['九龙', '新界', '观塘', '屯门', '荃湾', '葵青', '西贡', '沙田', '大埔', '北区', '南区', '油尖旺', '深水埗', '九龙坡', '黄大仙', '西贡', '沙田', '大埔', '北区', '南区', '油尖旺', '深水埗', '九龙坡', '黄大仙', '西贡', '沙田', '大埔', '北区', '南区']
    return nameSuffix + perfix[Math.floor(Math.random() * perfix.length)] + '（' + region[Math.floor(Math.random() * region.length)] + '店）'
  },
  latAndLongitude() {
    const latitude = staticLatAndLongitude[0]
    const longitude = staticLatAndLongitude[1]
    const offset = 0.1 * Math.random(0, 1)
    return [latitude + offset, longitude + offset]
  },
  lat() {
    return Mock.Random.latAndLongitude()[0]
  },
  longitude() {
    return Mock.Random.latAndLongitude()[1]
  },
  phone() {
    return Mock.mock(/\d{13}/)
  },
  catalog() {
    const catalogs = ['咖啡', '茶', '面包', '蛋糕', '水果', '酒水', '西餐', '自助餐', '小吃', '快餐', '甜点', '冰淇淋', '冰品', '咖啡豆', '咖啡豆豆']
    return catalogs[Math.floor(Math.random() * catalogs.length)]
  }

})

// Mock.mock(/login/, 'post', authTemplate.login)
// Mock.mock(/user\/info/, 'get', authTemplate.getUserInfo)
Mock.mock(/menu/, 'get', authTemplate.getMenu)

Mock.mock(/store\/page\/\d+\/\d+/, 'post', storeTemplate.query)
Mock.mock(/store\/details\/\d+/, 'get', storeTemplate.detail)
Mock.mock(/store\/update\/\d+/, 'put', resp)
Mock.mock(/store\/delete\/\d+/, 'delete', resp)

// Mock.mock(/catalog\/page\/\d+\/\d+/, 'post', catalogTemplate.query)
// Mock.mock(/catalog\/details\/\d+/, 'get', catalogTemplate.detail)
// Mock.mock(/catalog\/update\/\d+/, 'put', resp)
// Mock.mock(/catalog\/delete\/\d+/, 'delete', resp)

Mock.mock(/item\/page\/\d+\/\d+/, 'post', itemTemplate.query)
Mock.mock(/item\/details\/\d+/, 'get', itemTemplate.detail)
Mock.mock(/item\/shopCatalogTree\/\d+/, 'get', itemTemplate.tree)
Mock.mock(/item\/update\/\d+/, 'put', resp)
Mock.mock(/item\/delete\/\d+/, 'delete', resp)


Mock.mock(/image\/page\/\d+\/\d+/, 'post', imageTemplate.query)
Mock.mock(/image\/details\/\d+/, 'get', imageTemplate.detail)
Mock.mock(/image\/update\/\d+/, 'put', resp)
Mock.mock(/image\/delete\/\d+/, 'delete', resp)

Mock.mock(/sku\/page\/\d+\/\d+/, 'post', skuTemplate.query)
Mock.mock(/sku\/details\/\d+/, 'get', skuTemplate.detail)
Mock.mock(/sku\/update\/\d+/, 'put', resp)
Mock.mock(/sku\/delete\/\d+/, 'delete', resp)

Mock.mock(/order\/page\/\d+\/\d+/, 'post', orderTemplate.query)
Mock.mock(/order\/details\/\d+/, 'get', orderTemplate.detail)
Mock.mock(/order\/update\/\d+/, 'put', resp)
Mock.mock(/order\/delete\/\d+/, 'delete', resp)

Mock.mock(/dict\/page\/\d+\/\d+/, 'post', dictTemplate.query)
Mock.mock(/dict\/details\/\d+/, 'get', dictTemplate.detail)
Mock.mock(/dict\/update\/\d+/, 'put', resp)
Mock.mock(/dict\/delete\/\d+/, 'delete', resp)

console.log('已注册 Mock 路由:', Mock._mocked)