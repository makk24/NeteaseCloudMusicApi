const schedule = require('node-schedule');
const request = require('./request');
const SqliteDB = require('./sqliteUtils.js').SqliteDB;
var log4js  = require('./log');
const logger = log4js.getLogger();

const appids = [
  'wxe2e247dd3a071632',
  'wx6f8db60e5cc9d60b',
  'wx34e13c37e0ae2675'
]
const apps = {
  'wxe2e247dd3a071632': { template_id: 'd6JdFiWEpk5Vdzd8nQEPFN2C623GAXS3mkq3OepBOYM', appSecret: '6a7902de8b0937d57648ab9dca2ff281', page: 'pages/detail/index' }, //one
  'wx6f8db60e5cc9d60b': { template_id: 'crTiw-b8jHvszBiDgfk98dolackN-RvaZcYyWR8BK00', appSecret: '956254709fe32880519ee405b0702ab2', page: 'lib/hardcore/pages/subject/subject-list1' }, //查影视
  'wx34e13c37e0ae2675': { template_id: 'dyHKUlEDOsCDzSQjQ_4fc3VfVcS0DpsqwPe64sI2llk', appSecret: '6f0c30645c1039eb87a75950302ae73c', page: 'pages/index/index', thing1: '来放松一下，听首歌吧~', }, //查音乐
}

let pushData = {
  'touser': 'OPENID',
  'template_id': 'TEMPLATE_ID',
  'page': 'index',
  'miniprogram_state': 'formal', //跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
  'lang': 'zh_CN',
  'data': {
    'thing8': {
      'value': '每日一美句，快来看看吧~'
    },
    'thing10': {
      'value': '小决心提醒你该行动了'
    },
    'thing1': {
      'value': '来放松一下，听首歌吧~'//快来看看最近有什么热门好评电影吧
    },
    'date2': {
      'value': getdate()
    }
  }
}

const scheduleCronstyle = () => {
  //6个占位符从左到右分别代表：秒、分、时、日、月、周几   每分钟的第30秒定时执行一次:
  /**
   * 每分钟的第30秒触发： '30 * * * * *'

每小时的1分30秒触发 ：'30 1 * * * *'

每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'

每月的1日1点1分30秒触发 ：'30 1 1 1 * *'

2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'

每周1的1点1分30秒触发 ：'30 1 1 * * 1'
   */

  schedule.scheduleJob('30 00 9 * * *', () => {
    pushMsg()
    logger.info('run date====>' + new Date().toLocaleString())
  });
}
/**
 * 消息推送
 */
function pushMsg() {
  logger.info('running date====>' + new Date().toLocaleString())
  var sqliteDB = new SqliteDB();
  appids.forEach(item => {
    let appid = item;
    let querySql = `select * from userInfo where appid='${appid}'`;
    sqliteDB.queryData(querySql, (objects) => {
      if (objects.length > 0) {
        getToken({ appid: appid, appSecret: apps[appid].appSecret }).then( async res => {
          console.log('token', res)
          if (res.status == 200) {
            let token = res.body.access_token;
            for (let index = 0; index < objects.length; index++) {
              const element = objects[index];
              if (element.openId) {
                pushData.template_id = apps[appid].template_id;
                pushData.page = apps[appid].page
                pushData.data.thing1['value'] = apps[appid].thing1 || '';
                pushData.touser = element.openId;
                if(appid == 'wxe2e247dd3a071632'){
                  let res_one = await getOneData({day: getdate(2)})
                  console.log(res_one)
                  pushData.data.thing8['value'] = res_one.body.data[0].hp_content ? (res_one.body.data[0].hp_content.substring(0, 17) + '...') : pushData.thing8;
                }
                pushWx({ token: token, pushData: pushData }).then(result => {
                  console.log('push', result)
                })
              }
            }
          }
        })
      }
    });
    sqliteDB.close();
  })
}
function getOneData(query){
  return request(
    'GET', `http://v3.wufazhuce.com:8000/api/hp/bymonth/${query.day}`, {},
    {crypto: 'oneapi', cookie: query.cookie, proxy: query.proxy}
  )
}

function getToken(query) {
  return request(
    'GET', `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${query.appid}&secret=${query.appSecret}`, {},
    { crypto: 'wxapi', cookie: query.cookie, proxy: query.proxy }
  )
}

function pushWx(query) {
  return request(
    'POST', `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${query.token}`, query.pushData || {},
    { crypto: 'wxapi', cookie: query.cookie, proxy: query.proxy }
  )
}
function getdate(type = 1) {
  var now = new Date();

  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var day = now.getDate();            //日

  var hh = now.getHours();            //时
  var mm = now.getMinutes();          //分
  var ss = now.getSeconds();          //分
  return type == 1 ? `${year}年${month}月${day}日` : `${year}-${month}-${day}`;
}

scheduleCronstyle();
