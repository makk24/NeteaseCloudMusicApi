// one api 获取近十天图文集合ID的数组

module.exports = (query, request) => {
  return request(
    'GET', `http://v3.wufazhuce.com:8000/api/onelist/idlist`, {},
    {crypto: 'oneapi', cookie: query.cookie, proxy: query.proxy}
  )
}
