// ==UserScript==
// @name         原神/崩坏：星穹铁道/绝区零b站直播活动抢码助手
// @namespace    GenshinLiveStreamHelper
// @version      4.8-2.4-1.0-2024.07.31-0
// @description  一款用于原神/崩坏：星穹铁道/绝区零b站直播活动的抢码助手
// @author       原作者ifeng0188 由ionase修改
// @match        *://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=*
// @match        *://www.bilibili.com/blackboard/new-award-exchange.html?task_id=*
// @icon         https://ys.mihoyo.com/main/favicon.ico
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @homepageURL  https://github.com/iona-s/GenshinLiveStreamHelper
// @supportURL   https://github.com/iona-s/GenshinLiveStreamHelper/issues
// @downloadURL  https://mirror.ghproxy.com/https://raw.githubusercontent.com/iona-s/GenshinLiveStreamHelper/main/demo.js
// @updateURL    https://mirror.ghproxy.com/https://raw.githubusercontent.com/iona-s/GenshinLiveStreamHelper/main/demo.js
// @license      GPL-3.0 license
// ==/UserScript==
(function main() {
  // 配置初始化
  if (!GM_getValue('gh_start_time')) {
    GM_setValue('gh_start_time', '00:59:40');
  }
  if (!GM_getValue('gh_interval')) {
    GM_setValue('gh_interval', '1000');
  }
  if (!GM_getValue('gh_biliExtraInfo')) {
    GM_setValue('gh_biliExtraInfo', true);
  }
  if (!GM_getValue('gh_biliRefreshTaskInfo')) {
    GM_setValue('gh_biliRefreshTaskInfo', false);
  }

  const game = (function getGame() {
    if (document.location.href.includes('new-award-exchange')) return '原神'; // 用于判断b站，目前原神用的new-award-exchange
    return '';
  }());

  function setStartTime() {
    const temp = prompt('请输入抢码时间，格式示例：01:59:59', GM_getValue('gh_start_time'));
    if (temp == null) return;
    if (/^(\d{2}):(\d{2}):(\d{2})$/.test(temp)) {
      GM_setValue('gh_start_time', temp);
      alert('设置成功，即将刷新页面使之生效');
      document.location.reload();
    } else {
      alert('格式错误，请重新输入');
    }
  }

  function setTimeInterval() {
    const temp = prompt('请输入抢码间隔，格式示例：1000，单位毫秒', GM_getValue('gh_interval'));
    if (temp == null) return;
    if (/^(\d+)$/.test(temp)) {
      GM_setValue('gh_interval', temp);
      alert('设置成功，即将刷新页面使之生效');
      document.location.reload();
    } else {
      alert('格式错误，请重新输入');
    }
  }

  function switchBiliExtraInfo() {
    GM_setValue('gh_biliExtraInfo', !GM_getValue('gh_biliExtraInfo'));
    alert('切换成功，即将刷新页面使之生效');
    document.location.reload();
  }

  function switchbiliRefreshTaskInfo() {
    GM_setValue('gh_biliRefreshTaskInfo', !GM_getValue('gh_biliRefreshTaskInfo'));
    alert('切换成功，即将刷新页面使之生效');
    document.location.reload();
  }

  // 注册菜单
  GM_registerMenuCommand(`设定抢码时间：${GM_getValue('gh_start_time')}（点击修改）`, setStartTime);
  GM_registerMenuCommand(`设定抢码间隔：${GM_getValue('gh_interval')} 毫秒（点击修改）`, setTimeInterval);
  GM_registerMenuCommand(`${GM_getValue('gh_biliExtraInfo') ? '✅' : '❌'}启用b站额外信息和主动开始按钮（点击切换）`, switchBiliExtraInfo);
  GM_registerMenuCommand(`${GM_getValue('gh_biliRefreshTaskInfo') ? '✅' : '❌'}启用抢码时的状态刷新，有风控风险（点击切换）`, switchbiliRefreshTaskInfo);

  // 日志
  function log(msg) {
    console.info(`【b站直播活动抢码助手】${msg}`);
  }

  // 获取ck，主要是b站csrf
  function getCookie(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  // 一些常用变量
  const csrfToken = getCookie('bili_jct');
  const taskId = new URLSearchParams(window.location.href.split('?')[1]).get('task_id');
  let activityId;
  let activityName;
  let taskName;
  let rewardName;
  let receiveId;
  let taskIdReceive;

  const queryInterval = 3000;

  // b站的一些api
  function getTaskInfo() {
    let url;
    if (game === '原神') {
      const params = new URLSearchParams({
        task_id: taskId,
      });
      url = `https://api.bilibili.com/x/activity_components/mission/info?${params}`;
    } else {
      const params = new URLSearchParams({
        csrf: csrfToken,
        id: taskId,
      });
      url = `https://api.bilibili.com/x/activity/mission/single_task?${params}`;
    }

    return fetch(url, {
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    });
  }

  function postReceive() {
    let url;
    let data;
    if (game === '原神') {
      url = 'https://api.bilibili.com/x/activity_components/mission/receive';
      data = {
        task_id: taskId,
        activity_id: activityId,
        activity_name: activityName,
        task_name: taskName,
        reward_name: rewardName,
        gaia_vtoken: '',
        receive_from: 'missionPage',
        csrf: csrfToken,
      };
    } else {
      url = 'https://api.bilibili.com/x/activity/mission/task/reward/receive';
      data = {
        act_id: activityId,
        act_name: activityName,
        csrf: csrfToken,
        gaia_vtoken: '',
        group_id: 0,
        receive_from: 'missionPage',
        receive_id: receiveId,
        reward_name: rewardName,
        task_id: taskIdReceive,
        task_name: taskName,
      };
    }

    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, text/plain, */*',
      },
      body: new URLSearchParams(data),
    });
  }

  function modifyBiliInfoPanelTask(status) {
    if (!GM_getValue('gh_biliExtraInfo')) return;
    const infoPanel = document.querySelector('.bili-task');
    infoPanel.innerText = status;
  }

  function modifyBiliInfoPanelStock(status) {
    if (!GM_getValue('gh_biliExtraInfo')) return;
    const infoPanel = document.querySelector('.bili-stock_remain');
    infoPanel.innerText = status;
  }

  function modifyBiliInfoPanel(status) {
    if (!GM_getValue('gh_biliExtraInfo')) return;
    const infoPanel = document.querySelector('.bili-status');
    infoPanel.innerText = status;
  }

  function modifyBiliInfoPanelCaptcha(status) {
    if (!GM_getValue('gh_biliExtraInfo')) return;
    const infoPanel = document.querySelector('.bili-captcha');
    infoPanel.innerText = status;
  }

  let manualStart = false;

  function checkCaptchaStatus() {
    const waitTimer = setInterval(() => {
      if (!(activityId === undefined)) {
        clearInterval(waitTimer);
        postReceive().then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              const statusCode = data.code;
              if (statusCode === 202101) {
                alert('当前账号行为异常，无法领奖');
              } else if (statusCode === 202102) {
                log('风控系统异常');
              } else if (statusCode === 202100) {
                modifyBiliInfoPanelCaptcha('需要过验证码');
              } else {
                modifyBiliInfoPanelCaptcha('好了');
              }
            });
          }
        });
      }
    }, queryInterval);
  }

  function initData() {
    if (game === '原神') {
      const receiveIdTimer = setInterval(() => {
        getTaskInfo().then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              if (data.code !== 0) return;
              const stockInfo = data.data.stock_info;
              const Stock = `总：${stockInfo.total_stock}% 今日：${stockInfo.day_stock}%`;
              modifyBiliInfoPanelTask('N/A');
              modifyBiliInfoPanelStock(Stock);
              activityId = data.data.act_id;
              activityName = data.data.act_name;
              taskName = data.data.task_name;
              rewardName = data.data.reward_info.award_name;
              clearInterval(receiveIdTimer);
            });
          }
        });
      }, queryInterval);
      return;
    }
    const receiveIdTimer = setInterval(() => {
      getTaskInfo().then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            if (data.code !== 0) return;
            const taskInfo = data.data.task_info;
            const groupList = taskInfo.group_list[0];
            const taskProgress = `${groupList.group_complete_num}/${groupList.group_base_num}`;
            const remainStock = taskInfo.reward_period_stock_num;
            modifyBiliInfoPanelTask(taskProgress);
            modifyBiliInfoPanelStock(remainStock);
            activityId = data.data.act_info.id;
            activityName = data.data.act_info.act_name;
            taskName = taskInfo.task_name;
            rewardName = taskInfo.reward_info.reward_name;
            receiveId = taskInfo.receive_id;
            taskIdReceive = taskInfo.id;
            clearInterval(receiveIdTimer);
          });
        }
      });
    }, queryInterval);
  }

  // b站添加额外信息和手动开始按钮
  function addExtras() {
    if (GM_getValue('gh_biliExtraInfo')) {
      const noticeWarp = document.querySelector('.tool-wrap');
      const infoPanel = document.createElement('div');
      // 添加额外信息
      infoPanel.className = 'task-progress-tip';
      infoPanel.innerHTML = (
        `<div style="margin-bottom: 10px;">抢码开始时间：${GM_getValue('gh_start_time')}</div>
        <div style="margin-bottom: 10px;">抢码间隔：${GM_getValue('gh_interval')} 毫秒</div>
        <div style="margin-bottom: 10px;">
          任务完成情况：
          <span class="bili-task">
          获取中
          </spam>
        </div>
        <div style="margin-bottom: 10px;">
          剩余库存：
          <span class="bili-stock_remain">
          获取中
          </span>
        </div>
        <div style="margin-bottom: 10px;">
          验证码状态：
          <span class="bili-captcha">
          获取中
          </span>
        </div>
        <div style="margin-bottom: 10px;">
          当前状态：
          <span class="bili-status">
          等待开始
          </span>
        </div>`
      );
      noticeWarp.appendChild(infoPanel);
      // 添加便利性按钮
      const captchaDiv = document.createElement('div');
      const checkCaptchaButton = document.createElement('button');
      checkCaptchaButton.innerText = '检查验证码状态';
      checkCaptchaButton.className = 'button exchange-button'; // 直接用叔叔的样式
      checkCaptchaButton.onclick = () => { checkCaptchaStatus(); };
      captchaDiv.appendChild(checkCaptchaButton);
      const summonCaptchaButton = document.createElement('button');
      summonCaptchaButton.innerText = '手动抢一次->召唤验证码';
      summonCaptchaButton.className = 'button exchange-button'; // 直接用叔叔的样式
      summonCaptchaButton.onclick = () => { document.querySelector('.exchange-button').click(); };
      captchaDiv.appendChild(summonCaptchaButton);
      noticeWarp.appendChild(captchaDiv);
      const manualStartButton = document.createElement('button');
      manualStartButton.innerText = '手动开抢';
      manualStartButton.className = 'button exchange-button'; // 直接用叔叔的样式
      manualStartButton.onclick = () => { manualStart = true; };
      noticeWarp.appendChild(manualStartButton);

      initData();
      checkCaptchaStatus();
    }
  }

  // 运行抢码进程
  function runRobProcess() {
    // 变量初始化
    const startTime = GM_getValue('gh_start_time').split(':');
    const startHour = parseInt(startTime[0], 10);
    const startMin = parseInt(startTime[1], 10);
    const startSec = parseInt(startTime[2], 10);

    log(`助手计划于${startHour}点${startMin}分${startSec}秒开始领取奖励`);

    let robTimer = null;

    function startRob() {
      if (!robTimer) {
        const selector = document.querySelector('.exchange-button');
        modifyBiliInfoPanel('开抢中');
        robTimer = setInterval(() => {
          selector.click();
        }, GM_getValue('gh_interval'));
      }
    }

    // 抢码实现
    function rob() {
      startRob();
      let remainStock = 0;
      if (GM_getValue('gh_biliRefreshTaskInfo')) {
        const receiveIdTimer = setInterval(() => {
          if (game === '原神') {
            getTaskInfo()
              .then((response) => {
                if (response.status === 200) {
                  response.json()
                    .then((data) => {
                      if (data.code !== 0) return;
                      const stockInfo = data.data.stock_info;
                      const Stock = `总：${stockInfo.total_stock}% 今日：${stockInfo.day_stock}%`;
                      modifyBiliInfoPanelStock(Stock);
                      const statusCode = data.data.status;
                      if (statusCode === 7) {
                        modifyBiliInfoPanel('任务还未完成');
                      } else if (statusCode === 0) {
                        modifyBiliInfoPanel('任务已完成，在抢了');
                      } else if (statusCode === 6) {
                        clearInterval(receiveIdTimer);
                        clearInterval(robTimer);
                        modifyBiliInfoPanel('抢到了');
                      }
                      if (stockInfo.day_stock === 0 && remainStock !== 0) {
                        clearInterval(receiveIdTimer);
                        clearInterval(robTimer);
                        modifyBiliInfoPanel('寄');
                      }
                      remainStock = stockInfo.day_stock;
                    });
                }
              });
            return;
          }

          getTaskInfo()
            .then((response) => {
              if (response.status === 200) {
                response.json()
                  .then((data) => {
                    if (data.code !== 0) return;
                    const taskInfo = data.data.task_info;
                    const groupList = taskInfo.group_list[0];
                    modifyBiliInfoPanelTask(`${groupList.group_complete_num}/${groupList.group_base_num}`);
                    const receiveStatus = taskInfo.receive_status;
                    if (receiveStatus === 0) {
                      modifyBiliInfoPanel('任务还未完成');
                    } else if (receiveStatus === 1) {
                      modifyBiliInfoPanel('任务已完成，在抢了');
                    } else if (receiveStatus === 3) {
                      clearInterval(receiveIdTimer);
                      clearInterval(robTimer);
                      modifyBiliInfoPanel('抢到了');
                    }
                    if (taskInfo.reward_period_stock_num === 0 && remainStock !== 0) {
                      clearInterval(receiveIdTimer);
                      clearInterval(robTimer);
                      modifyBiliInfoPanel('寄');
                    }
                    remainStock = taskInfo.reward_period_stock_num;
                    modifyBiliInfoPanelStock(remainStock);
                  });
              }
            });
        }, queryInterval);
      }
    }
    // 等待开抢
    const timer = setInterval(() => {
      const date = new Date();
      if (manualStart || (date.getHours() === startHour && date.getMinutes() === startMin && date.getSeconds() >= startSec)) {
        clearInterval(timer);
        rob();
      }
    }, 100);
  }

  // Run
  log('助手开始运行');
  addExtras();
  runRobProcess();
}());
