//  

module.exports = (query, request) => {
  const data = {
    id: query.id,
    n: 100000,
    s: query.s || 8
  }
  return request(
    'POST', `https://music.163.com/weapi/v3/playlist/detail`, data,
    {crypto: 'linuxapi', cookie: query.cookie, proxy: query.proxy}
  )
}

// module.exports = (query, request) => {
//   return request(
//     'GET', `https://music.163.com/api/playlist/detail?id=${query.id}`, {},
//     {crypto: 'myapi', cookie: query.cookie, proxy: query.proxy}
//   )



// }
