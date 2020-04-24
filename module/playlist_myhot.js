// one api 最近一月的

module.exports = (query, request) => {
  return request(
    'GET', `https://music.163.com/api/playlist/detail?id=${query.id}`, {},
    {crypto: 'myapi', cookie: query.cookie, proxy: query.proxy}
  )
}
