var SqliteDB = require('../util/sqliteUtils.js').SqliteDB;

// /// create table.

// var createTileTableSql = "create table if not exists tiles(level INTEGER, column INTEGER, row INTEGER, content BLOB);";

var createLabelTableSql = "alter table userInfo add [appid] VARCHAR NOT NULL DEFAULT('wxe2e247dd3a071632');";

// sqliteDB.createTable(createTileTableSql);

sqliteDB.createTable(createLabelTableSql);