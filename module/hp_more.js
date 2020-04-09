// one api 最近10天的

module.exports = (query, request) => {
  return request(
    'GET', `http://v3.wufazhuce.com:8000/api/hp/more/0`, {},
    {crypto: 'oneapi', cookie: query.cookie, proxy: query.proxy}
  )
}
