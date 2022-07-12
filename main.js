const { get, post } = require('./request');

function main() {
  return get('https://api.bilibili.com/x/space/acc/info?mid=1458143131&jsonp=jsonp').then(data => {
    if (data.code) {
      return pushMessage(data.message);
    }
    const { liveStatus, url, title } = data.data.live_room;
    if (liveStatus) {
      return pushMessage(title, url);
    }
  });
}

function pushMessage(title, url = '') {
  return post('https://wxpusher.zjiecode.com/api/send/message', {
    appToken: process.env.WX_PUSHER_TOKEN,
    content: title,
    summary: '翠翠直播啦！o(*￣▽￣*)ブ', //消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度100，可以不传，不传默认截取content前面的内容。
    contentType: 1, //内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
    // topicIds: [
    //   //发送目标的topicId，是一个数组！！！，也就是群发，使用uids单发的时候， 可以不传。
    // ],
    uids: [
      //发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
      process.env.WX_UID,
    ],
    url, //原文链接，可选参数
  }).then(res => {
    if (!res.success) {
      return Promise.reject(new Error(res.code + res.msg));
    }
  });
}

if (process.argv.includes('--test')) {
  pushMessage('test hehehe').catch(err => {
    console.error(err);
    process.exit(-1);
  });
} else {
  main().catch(err => {
    console.error(err);
    process.exit(-1);
  });
}

console.log(22222, process.env.WX_PUSHER_TOKEN);
