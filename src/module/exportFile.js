export var exportToFile = function (export_data, rowKeys, file_name, flag) {
    if (!export_data || !rowKeys)
      return;
    var obj = {
      "CSV": "CSV"
    }
    var result, ctr, keys, columnDelimiter, lineDelimiter, data, fileData, count = 0;
    columnDelimiter = export_data.columnDelimiter || ',';
    lineDelimiter = export_data.lineDelimiter || '\n';
    result = '';
  
    if (Array.isArray(export_data)) {
      execute(export_data, false)
    } else {
      for (var a in export_data) {
        execute(export_data[a], true);
      }
    }
  
    function execute(params, arr_flag) {
      data = params;
      if (arr_flag) {
        keys = Object.keys(data[0]);
        var mapper = keys.map(function (item) {
          return rowKeys[item] || item;
        })
        result += mapper.join(columnDelimiter);
        if (count == 0) {
          result += lineDelimiter;
          count++;
        }
        else {
          result += columnDelimiter
        }
      } else {
        keys = Object.keys(rowKeys);
        result += Object.values(rowKeys).join(columnDelimiter);
        result += lineDelimiter;
      }
      if (data.length > 0) {
        data.map(function (item) {
          ctr = 0;
          keys.map(function (key) {
            if (ctr > 0) result += columnDelimiter;
            if (item[key] != undefined) {
              if (flag == obj.CSV) {
                result += item[key];
              } else {
                result += ((typeof (item[key]) == 'string') && (item[key].includes('\t'))) ? item[key] : '"' + item[key] + '"';
              }
            }
            ctr++;
          });
          result += lineDelimiter;
          fileData = result;
        });
      } else {
        fileData = result;
      }
    }
    var link = document.createElement("a");
  
    if (flag == obj.CSV) {
      var filename = file_name + '.csv';
      var blob = new Blob([fileData], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
    } else {
      var filename = file_name + '.xlsx';
      var blob = new Blob(['\ufeff', fileData], { type: 'application/vnd.ms-excel' });
      var url = URL.createObjectURL(blob);
    }
    link.href = url;
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }