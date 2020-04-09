// one api 最近一月的

module.exports = (query, request) => {
  return request(
    'GET', `http://v3.wufazhuce.com:8000/api/hp/bymonth/2020`, {},
    {crypto: 'oneapi', cookie: query.cookie, proxy: query.proxy}
  )
}
