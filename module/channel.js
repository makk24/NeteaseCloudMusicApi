// one api 获取当天的图文集合信息以及当地天气信息

module.exports = (query, request) => {
  return request(
    'GET', `http://v3.wufazhuce.com:8000/api/channel/one/0/${encodeURIComponent(query.city || '北京')}`, {},
    {crypto: 'oneapi', cookie: query.cookie, proxy: query.proxy}
  )
}
