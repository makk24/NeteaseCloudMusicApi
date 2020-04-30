var SqliteDB = require('../util/sqliteUtils.js').SqliteDB;

// /// create table.

// var createTileTableSql = "create table if not exists tiles(level INTEGER, column INTEGER, row INTEGER, content BLOB);";

// var createLabelTableSql = "alter table userInfo add [appid] VARCHAR NOT NULL DEFAULT('wxe2e247dd3a071632');";

// // sqliteDB.createTable(createTileTableSql);

// sqliteDB.createTable(createLabelTableSql);

// var tileData = [[1, 10, 10], [1, 11, 11], [1, 10, 9], [1, 11, 9]];

// var insertTileSql = "insert into userInfo(level, column, row) values(?, ?, ?)";

// sqliteDB.insertData(insertTileSql, tileData);

// /// query data.

// var querySql = 'select * from userInfo where level = 1 and column >= 10 and column <= 11 and row >= 10 and row <=11';

// sqliteDB.queryData(querySql, dataDeal);



// /// update data.

// var updateSql = 'update userInfo set level = 2 where level = 1 and column = 10 and row = 10';

// sqliteDB.executeSql(updateSql);



/// query data after update.

// querySql = "select * from userInfo where id = 2";

// sqliteDB.queryData(querySql, dataDeal);





// function dataDeal(objects) {
//   console.log(objects)
//   for (var i = 0; i < objects.length; ++i) {

//     console.log(objects[i]);

//   }

// }
var apps = {
  'wxe2e247dd3a071632': '6a7902de8b0937d57648ab9dca2ff281'
}

module.exports = (query, request) => {
  let res = request(
    'GET', `https://api.weixin.qq.com/sns/jscode2session?appid=${query.appid}&secret=${apps[query.appid]}&js_code=${query.code}&grant_type=authorization_code`, {},
    { crypto: 'wxapi', cookie: query.cookie, proxy: query.proxy }
  ).then((answer) => {
    return new Promise((resolve, reject) => {
      if (answer.status === 200) {
        if (answer.body.openid) {
          var sqliteDB = new SqliteDB();
          let querySql = `select * from userInfo where openId='${answer.body.openid}'`;
          sqliteDB.queryData(querySql, (objects) => {
            if (objects.length == 0) {
              var tileData = [[answer.body.openid, answer.body.session_key, '', query.appid]];
              var insertTileSql = 'insert into userInfo(openId, sessionKey, nickName,appid) values(?, ?, ?, ?)';
              sqliteDB.insertData(insertTileSql, tileData);
              sqliteDB.close();
            }else{
              sqliteDB.close();
            }
          });
          
        }
        resolve(answer)
      }
      else reject(answer)
    })
  })
  return res
}