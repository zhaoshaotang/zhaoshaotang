
// 统一配置ajax选项
$.ajaxPrefilter(function (options) {
  // console.log(options);
  // 更改 url
  options.url = 'http://localhost:3007' + options.url;
});

// ------------------------------------  获取数据并渲染 ------------------------
/**
 * url: 'http://localhost:3007/api/list'
 * type: 'GET'
 */
function renderHtml () {
  // 发送ajax请求，获取数据
  $.ajax({
    url: '/api/list',
    success: function (res) {
      console.log(res);
      // 通过模板引擎把数据渲染到页面中
      let htmlStr = template('tpl-list', res);
      $('tbody').html(htmlStr);
    }
  });
}
renderHtml();


let addIndex;
let editIndex;
// ------------------------------------  添加数据 ------------------------
// 点击 添加用户 ，出现弹层
$('button:contains("添加")').on('click', function () {
  // 实现一个弹出层
  // addIndex 用于后面关闭弹层的
  addIndex = layer.open({
    area: ['500px', '300px'],
    title: '添加用户',
    content: $('#tpl-add').html(), // 获取id为tpl-add元素里面的内容，当作弹出层的内容
    type: 1
  });
})

// 点击上传按钮，触发文件域的单击事件
$('body').on('click', '#chooseImgage', function () {
  $('#file').trigger('click');
})

// 当文件域的内容改变的时候，实现预览效果
$('body').on('change', '#file', function () {
  // console.log(111);
  // 找到文件对象
  let fileObj = this.files[0];
  // 可以为文件对象生成一个临时的url。这个url可以访问到我们选择的图片
  let url = URL.createObjectURL(fileObj);
  // console.log(url);
  $('#preview').attr('src', url);
})

/**
 * /api/add
 * POST
 * data(FormData)
 *  - username
 *  - nickname
 *  - user_pic
 */
$('body').on('submit', '#add-form', function (e) {
  e.preventDefault();
  // 收集表单数据
  let fd = new FormData(this);
  // Ajax提交数据
  $.ajax({
    url: '/api/add',
    data: fd,
    type: 'POST',
    processData: false,
    contentType: false,
    success: function (res) {
      // 无论成功还是失败都提示
      layer.msg(res.message);
      if (res.status === 0) {
        renderHtml();
        // 关闭弹出层
        layer.close(addIndex);
      }
    }
  })
})


// ------------------------------------  编辑数据 ------------------------
$('tbody').on('click', 'button:contains("编辑")', function () {
  // 获取事件源（编辑按钮）的四个自定义属性
  let data = $(this).data();
  // console.log(data);
  // 下面是实现弹出层的代码
  editIndex = layer.open({
    area: ['500px', '300px'],
    title: '编辑用户',
    content: $('#tpl-edit').html(),
    type: 1,
    // 弹层成功之后，会执行下面的success回调函数
    success: function () {
      // console.log('编辑的弹出出来了');
      // 这里完成数据回填。
      $('input[name=username]').val(data.username);
      $('input[name=nickname]').val(data.nickname);
      $('input[name=id]').val(data.id);
      $('#preview2').attr('src', 'http://localhost:3007/' + data.pic)
    }
  });
});

// 点击上传按钮，触发文件域的单击事件
$('body').on('click', '#chooseImage2', function () {
  $('#file2').trigger('click');
})

// 当文件域的内容改变的时候，实现预览效果
$('body').on('change', '#file2', function () {
  // console.log(111);
  // 找到文件对象
  let fileObj = this.files[0];
  // 可以为文件对象生成一个临时的url。这个url可以访问到我们选择的图片
  let url = URL.createObjectURL(fileObj);
  // console.log(url);
  $('#preview2').attr('src', url);
})

$('body').on('submit', '#edit-form', function (e) {
  e.preventDefault();
  // 收集表单数据
  let fd = new FormData(this);
  // Ajax提交数据
  $.ajax({
    url: '/api/update',
    data: fd,
    type: 'POST',
    processData: false,
    contentType: false,
    success: function (res) {
      // 无论成功还是失败都提示
      layer.msg(res.message);
      if (res.status === 0) {
        renderHtml();
        // 关闭弹出层
        layer.close(editIndex);
      }
    }
  })
})


// ------------------------------------  删除数据 ------------------------
/**
 * url: '/api/delete
 * data: id
 * type: GET
 */
$('tbody').on('click', 'button:contains("删除")', function () {
  // 获取数据的id
  let id = $(this).data('id');

  layer.confirm('确定要删除吗？', function (index) {
    // console.log('你点了确认按钮');
    // 这里写代码完成删除操作
    $.ajax({
      url: '/api/delete',
      data: {
        id: id
      },
      success: function (res) {
        // console.log(res);
        // 无论成功还是失败，都给一个提示
        layer.msg(res.message);
        if (res.status === 0) {
          renderHtml();
        }
      }
    });
    layer.close(index); // 关闭窗口
  });
})