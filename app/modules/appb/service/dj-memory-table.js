!(function (angular, window, undefined) {

  /**
   * 本地存贮数据表工厂
   */
  angular.module('dj-service').factory('LocalStorageTable', ['$q', function ($q) {

    /** 安全返回数据，以防止被改动 */
    function safeData(data) {
      return JSON.parse(JSON.stringify(data));
    }

    class LocalStorageTable {
      constructor(tableName) {
        this.tableName = tableName;
        this.initTable();
      }

      initTable() {
        var str = window.localStorage.getItem(this.tableName) || JSON.stringify({ rows: [] });
        this.data = JSON.parse(str);
        this.rows = this.data.rows;
        this.maxId = 0;
        this.rows.map(row => {
          if (row.id > this.maxId) this.maxId = row.id;
        })
      }

      autoInsertId() {
        return ++this.maxId;
      }

      saveToLocalStorage() {
        window.localStorage.removeItem(this.tableName);
        window.localStorage.setItem(this.tableName, JSON.stringify(this.data));
      }

      insert(data, dontSave) {
        var id = this.autoInsertId();
        this.rows.push(angular.extend({
          id: id
        }, data));
        !dontSave && this.saveToLocalStorage();
        return $q.when(id);
      }

      select(where) {
        where = where || {};
        var list = this.rows.filter(row => {
          for (var k in where) {
            if (row[k] != where[k]) return false;
          }
          return true;
        });
        return $q.when(safeData(list));
      }

      update(where, value, insertIfNotExist) {
        //console.log("更新内存", where, value, insertIfNotExist)
        where = where || {};
        var list = this.rows.filter(row => {
          for (var k in where) {
            if (row[k] != where[k]) return false;
          }
          return true;
        });
        if (!list[0]) {
          if (!insertIfNotExist) return $q.reject('无此数据');
          return this.insert(angular.extend({}, where, value)).then(id => {
            return safeData(this.rows.find(row => row.id == id));
          });
        }
        angular.extend(list[0], value);
        this.saveToLocalStorage();
        return $q.when(safeData(list[0]));
      }
    }

    return LocalStorageTable;

  }]);

})(angular, window);
