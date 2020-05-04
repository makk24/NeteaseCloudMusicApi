// one api 获取某一天的

module.exports = (query, request) => {
  return request(
    'GET', `http://v3.wufazhuce.com:8000/api/hp/bymonth/${query.day}`, {},
    {crypto: 'oneapi', cookie: query.cookie, proxy: query.proxy}
  )
}
