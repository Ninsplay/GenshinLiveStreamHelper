// ==UserScript==
// @name         原神/崩坏：星穹铁道直播活动抢码助手
// @namespace    https://github.com/ifeng0188
// @version      4.4-2.0-2024.03.08-1
// @description  一款用于原神/崩坏：星穹铁道直播活动的抢码助手，支持哔哩哔哩、虎牙、斗鱼多个平台的自动抢码，附带一些页面优化功能
// @author       原作者ifeng0188 由ionase修改
// @match        *://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=*
// @match        *://www.bilibili.com/blackboard/new-award-exchange.html?task_id=*
// @match        *://zt.huya.com/*/pc/index.html
// @match        *://www.douyu.com/topic/ys*
// @match        *://www.douyu.com/topic/xq*
// @match        *://www.douyu.com/topic/*xqtd*
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
  if (!GM_getValue('gh_reward_progress')) {
    GM_setValue('gh_reward_progress', 1);
  }
  if (!GM_getValue('gh_start_time')) {
    GM_setValue('gh_start_time', '01:59:59');
  }
  if (!GM_getValue('gh_interval')) {
    GM_setValue('gh_interval', '1000,1000,100');
  }
  if (!GM_getValue('gh_autoExpand')) {
    GM_setValue('gh_autoExpand', false);
  }
  if (!GM_getValue('gh_pagePurify')) {
    GM_setValue('gh_pagePurify', false);
  }
  if (!GM_getValue('gh_biliExtraInfo')) {
    GM_setValue('gh_biliExtraInfo', false);
  }
  if (!GM_getValue('gh_biliUseApi')) {
    GM_setValue('gh_biliUseApi', false);
  }
  if (!GM_getValue('gh_getNew')) {
    GM_setValue('gh_getNew', false);
  }
  if (!GM_getValue('gh_getNewNum')) {
    GM_setValue('gh_getNewNum', 1);
  }

  // 变量初始化
  const platform = (function getPlatform() {
    if (document.location.href.includes('bilibili')) return 'B站';
    if (/(原神|星穹铁道)/.test(document.title)) {
      if (document.location.href.includes('huya')) return '虎牙';
      if (document.location.href.includes('douyu')) return '斗鱼';
    }
    return '';
  }());

  const game = (function getGame() {
    if (document.title.includes('原神')) return '原神';
    if (document.title.includes('星穹铁道')) return '星穹铁道';
    if (document.location.href.includes('activity-award-exchange')) return '原神'; // 用于判断b站，目前铁道用的new-award-exchange
    return '';
  }());

  const interval = (function getInterval() {
    const group = GM_getValue('gh_interval').split(',');
    switch (platform) {
      case 'B站':
        return group[0];
      case '虎牙':
        return group[1];
      case '斗鱼':
        return group[2];
      default:
        return '1000';
    }
  }());

  function setRewardProgress() {
    const temp = prompt('请输入里程碑进度，输入范围1~13，从小到大对应相关奖励', GM_getValue('gh_reward_progress'));
    if (temp == null) return;
    const upperLimit = game === '原神' ? 14 : 7;
    if (parseInt(temp, 10) > 0 || parseInt(temp, 10) < upperLimit) {
      GM_setValue('gh_reward_progress', temp);
      alert('设置成功，即将刷新页面使之生效');
      document.location.reload();
    } else {
      alert('格式错误，请重新输入');
    }
  }

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
    const temp = prompt('请输入抢码间隔，格式示例：1000,1000,100，即代表B站平台间隔为1000毫秒 虎牙平台间隔为1000毫秒 斗鱼平台间隔为100毫秒', GM_getValue('gh_interval'));
    if (temp == null) return;
    if (/^(\d+),(\d+),(\d+)$/.test(temp)) {
      GM_setValue('gh_interval', temp);
      alert('设置成功，即将刷新页面使之生效');
      document.location.reload();
    } else {
      alert('格式错误，请重新输入');
    }
  }

  function switchAutoExpand() {
    GM_setValue('gh_autoExpand', !GM_getValue('gh_autoExpand'));
    alert('切换成功，即将刷新页面使之生效');
    document.location.reload();
  }

  function switchPagePurify() {
    GM_setValue('gh_pagePurify', !GM_getValue('gh_pagePurify'));
    alert('切换成功，即将刷新页面使之生效');
    document.location.reload();
  }

  function switchBiliExtraInfo() {
    GM_setValue('gh_biliExtraInfo', !GM_getValue('gh_biliExtraInfo'));
    alert('切换成功，即将刷新页面使之生效');
    document.location.reload();
  }

  function switchBiliUseApi() {
    GM_setValue('gh_biliUseApi', !GM_getValue('gh_biliUseApi'));
    alert('切换成功，即将刷新页面使之生效');
    document.location.reload();
  }

  function switchGetNew() {
    GM_setValue('gh_getNew', !GM_getValue('gh_getNew'));
    alert('切换成功，即将刷新页面使之生效');
    document.location.reload();
  }

  function setGetNewNum() {
    const temp = prompt('请输入萌新任务进度，*以网页实际布局为准*，输入范围1~5', GM_getValue('gh_getNewNum'));
    if (temp == null) return;
    if (parseInt(temp, 10) > 0 || parseInt(temp, 10) < 6) {
      GM_setValue('gh_getNewNum', temp);
      alert('设置成功，即将刷新页面使之生效');
      document.location.reload();
    } else {
      alert('格式错误，请重新输入');
    }
  }

  // 注册菜单
  GM_registerMenuCommand(`设定里程碑进度：${GM_getValue('gh_reward_progress')}（点击修改）`, setRewardProgress);
  GM_registerMenuCommand(`设定抢码时间：${GM_getValue('gh_start_time')}（点击修改）`, setStartTime);
  GM_registerMenuCommand(`设定抢码间隔：${interval} 毫秒（点击修改）`, setTimeInterval);
  GM_registerMenuCommand(`${GM_getValue('gh_autoExpand') ? '✅' : '❌'}自动打开里程碑（点击切换）`, switchAutoExpand);
  GM_registerMenuCommand(`${GM_getValue('gh_pagePurify') ? '✅' : '❌'}页面净化（点击切换）`, switchPagePurify);
  GM_registerMenuCommand(`${GM_getValue('gh_biliExtraInfo') ? '✅' : '❌'}启用b站额外信息和主动开始按钮（点击切换）`, switchBiliExtraInfo);
  GM_registerMenuCommand(`${GM_getValue('gh_biliUseApi') ? '✅' : '❌'}启用b站api抢码，废弃，不要开启（点击切换）`, switchBiliUseApi);
  GM_registerMenuCommand(`${GM_getValue('gh_getNew') ? '✅' : '❌'}虎牙/斗鱼抢萌新任务,*抢里程碑时需关闭*（点击切换）`, switchGetNew);
  GM_registerMenuCommand(`虎牙/斗鱼抢第几个萌新任务：${GM_getValue('gh_getNewNum')}（点击修改）`, setGetNewNum);

  // 移除元素
  function clearElement(el) {
    el.parentNode.removeChild(el);
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

  // 日志
  function log(msg) {
    console.info(`【原神直播活动抢码助手】${msg}`);
  }

  function modifyBiliInfoPanel(status) {
    if (!GM_getValue('gh_biliExtraInfo')) return;
    const infoPanel = document.querySelector('.bili-status');
    infoPanel.innerText = `当前状态：${status}`;
  }

  let manualStart = false;

  // 斗鱼和虎牙运行净化和自动打开里程碑，b站添加额外信息和手动开始按钮
  function runPurifyProcess() {
    if (platform !== 'B站' && (!platform || !game)) {
      alert('未检测到平台或游戏，无法执行脚本');
      return;
    }

    if (GM_getValue('gh_autoExpand')) {
      switch (platform) {
        case '虎牙':
          if (game === '原神') {
            document.querySelectorAll('.J_item')[2].click();
          } else if (game === '星穹铁道') {
            document.querySelectorAll('.J_item')[1].click();
          }
          setTimeout(() => {
            if (game === '星穹铁道') {
              const selectorIndex = GM_getValue('gh_getNew') ? 2 : 1;
              document.querySelectorAll('.J_holder')[selectorIndex].click();
            }
            document.querySelector('.J_expBox').scrollIntoView();
          }, 5000);
          break;
        case '斗鱼': {
          const selectorId = game === '原神' ? '#bc37' : '#bc58';
          const timer = setInterval(() => {
            if (document.querySelector(selectorId)) {
              clearInterval(timer);
              document.querySelector(selectorId).click();
              let selectorIndex = 1;
              if (game === '星穹铁道') {
                document.querySelector('#bc92').click();
                selectorIndex = GM_getValue('gh_getNew') ? 0 : 1;
              }
              setTimeout(() => {
                document.querySelectorAll('.wmTaskV3')[selectorIndex].scrollIntoView();
              }, 5000);
            }
          }, 2000);
          break;
        }
        default:
          break;
      }
    }
    if (GM_getValue('gh_pagePurify')) {
      if (platform === '斗鱼') {
        const timer = setInterval(() => {
          if (document.querySelector('div[title="暂停"]')) {
            clearInterval(timer);
            document.querySelector('div[title="暂停"]').click();
            clearElement(document.querySelectorAll('.wm-general')[1]);
          }
        }, 2000);
      }
    }
    if (platform === 'B站' && GM_getValue('gh_biliExtraInfo')) {
      // 添加额外信息
      const noticeWarp = document.querySelector('.tool-wrap');
      const infoPanel = document.createElement('div');
      infoPanel.className = 'task-progress-tip';
      infoPanel.innerHTML = (
        `<div style="margin-bottom: 10px;">抢码开始时间：${GM_getValue('gh_start_time')}</div>
        <div style="margin-bottom: 10px;">抢码间隔：${interval} 毫秒</div>
        <div class="bili-status" style="margin-bottom: 10px;">当前状态：等待开始</div>`
      );
      noticeWarp.appendChild(infoPanel);
      // 添加手动开始按钮
      const manualStartButton = document.createElement('button');
      manualStartButton.innerText = '手动开抢';
      manualStartButton.className = 'button exchange-button'; // 直接用叔叔的样式
      manualStartButton.onclick = () => { manualStart = true; };
      noticeWarp.appendChild(manualStartButton);
    }
  }

  // 运行抢码进程
  function runRobProcess() {
    // 显示注意事项
    if (!GM_getValue('gh_autoExpand')) {
      switch (platform) {
        case '虎牙':
          log('★请手动打开里程碑页面★');
          break;
        case '斗鱼':
          log('★请手动打开里程碑页面，并通过领取其他奖励，完成一次验证码★');
          break;
        default:
          break;
      }
    }

    // 变量初始化
    const level = parseInt(GM_getValue('gh_reward_progress'), 10);
    const startTime = GM_getValue('gh_start_time').split(':');
    const startHour = parseInt(startTime[0], 10);
    const startMin = parseInt(startTime[1], 10);
    const startSec = parseInt(startTime[2], 10);
    const getNew = GM_getValue('gh_getNew');
    const getNewNum = GM_getValue('gh_getNewNum');
    const rewardType = getNew ? '萌新任务' : '里程碑';

    log(`助手计划于${startHour}点${startMin}分${startSec}秒开始领取${platform}的第${level}个${rewardType}奖励（如有误请自行通过菜单修改配置）`);

    function getBiliViaApi() {
      // 获取receive_id
      const csrfToken = getCookie('bili_jct');
      const taskId1 = new URLSearchParams(window.location.href.split('?')[1]).get('task_id');
      const params = new URLSearchParams({
        csrf: csrfToken,
        id: taskId1,
      });
      const receiveIdUrl = `https://api.bilibili.com/x/activity/mission/single_task?${params}`;
      let actId;
      let taskId;
      let groupId;
      let revieveId = 0;
      let actName;
      let taskName;
      let rewardName;
      const receiveIdTimer = setInterval(() => {
        modifyBiliInfoPanel('正在获取receive_id');
        fetch(receiveIdUrl, {
          credentials: 'include',
          headers: {
            Accept: 'application/json, text/plain, */*',
          },
        })
          .then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                if (data.code === 0 && data.data.task_info.receive_id !== 0) {
                  clearInterval(receiveIdTimer);
                  const taskInfo = data.data.task_info;
                  const groupList = taskInfo.group_list[0];
                  actId = groupList.act_id;
                  taskId = groupList.task_id;
                  groupId = groupList.group_id;
                  revieveId = taskInfo.receive_id;
                  actName = data.data.act_info.act_name;
                  taskName = taskInfo.task_name;
                  rewardName = taskInfo.reward_info.reward_name;
                  modifyBiliInfoPanel('receive_id获取成功');
                } else {
                  modifyBiliInfoPanel('任务还未完成，等待重试');
                }
              });
            }
          });
      }, 1000);
      // 开始抢
      const receiveUrl = 'https://api.bilibili.com/x/activity/mission/task/reward/receive';
      const formData = new FormData();
      let counter = 0;
      const receiveTimer = setInterval(() => {
        if (revieveId !== 0) {
          if (!formData.has('csrf')) {
            formData.set('csrf', csrfToken);
            formData.set('act_id', actId);
            formData.set('task_id', taskId);
            formData.set('group_id', groupId);
            formData.set('receive_id', revieveId);
            formData.set('receive_from', 'missionPage');
            formData.set('act_name', actName);
            formData.set('task_name', taskName);
            formData.set('reward_name', rewardName);
          }
          fetch(receiveUrl, {
            credentials: 'include',
            method: 'POST',
            headers: {
              Accept: 'application/json, text/plain, */*',
            },
            body: formData,
          })
            .then((response) => {
              if (response.status === 200) {
                response.json().then((data) => {
                  let msg = '领取成功！';
                  switch (data.code) {
                    case 0:
                      clearInterval(receiveTimer);
                      try {
                        msg += `兑换码为${data.data.extra.cdkey_content}`;
                      } catch (e) {
                        // 原神没有兑换码
                      }
                      alert(msg);
                      break;
                    // 感觉没必要先注释掉了
                    // case 75153:
                    //   // 星铁改成后续也只能半夜两点开始领了，这时候有receive_id然后跳这个
                    //   clearInterval(receiveTimer);
                    //   alert('不在奖品领取时间内，无法领取奖品~，是不是时间设置错了');
                    //   break;
                    case 202100:
                      modifyBiliInfoPanel('有验证码，改为点击按钮');
                      return;
                    case 75154:
                      clearInterval(receiveTimer);
                      alert('来晚了，奖品已被领完~，明日再战');
                      break;
                    case 75255:
                      clearInterval(receiveTimer);
                      alert('库存已使用完，寄');
                      break;
                    case 75086:
                      clearInterval(receiveTimer);
                      alert('任务奖励已领取');
                      break;
                    default:
                      // -702 -705 请求频率过高，请稍候重试
                      counter += 1;
                      modifyBiliInfoPanel(`领取失败${data.code}，已重试${counter}次`);
                      break;
                  }
                });
              }
            });
        }
      }, interval);
    }

    // 抢码实现
    function rob() {
      log('助手开始领取，如若出现数据异常为正常情况');
      let selector;
      switch (platform) {
        case 'B站':
          selector = document.querySelector('.exchange-button');
          break;
        case '虎牙':
        {
          if (!getNew) {
            selector = document.querySelectorAll('.exp-award li button')[level - 1];
            const expSelector = document.querySelector('div[title^="10经验值"]').querySelector('button');
            const timer = setInterval(() => {
              if (expSelector.innerText === '领取') {
                expSelector.nextElementSibling.click();
              } else {
                document.querySelector('.exp-award .reload').click();
              }
              if (expSelector.innerText === '已领取') {
                clearInterval(timer);
                // setTimeout(() => {
                //   Array.from(document.querySelectorAll('.J_dcpConfirm')).forEach((e) => {
                //     e.click();
                //   });
                // }, 1000);
              } else {
                setTimeout(() => {}, Math.random() * 100);
              }
            }, interval);
            break;
          }
          // 萌新任务
          selector = document.querySelectorAll('.J_comp_27 .swiper-slide > div> div:nth-child(3)')[GM_getValue('gh_getNewNum') - 1];
          const timer = setInterval(() => {
            document.querySelector('.J_comp_27 .reload-item').click();
            if (selector.innerText !== '未完成') {
              clearInterval(timer);
              document.querySelector('.diy-popup--btn').click();
            }
          }, interval);
          break;
        }
        case '斗鱼':
        {
          let selectorIndex;
          if (getNew) {
            selectorIndex = getNewNum - 1;
          } else if (game === '星穹铁道') {
            selectorIndex = level + 4;
          } else if (game === '原神') {
            selectorIndex = level;
          }
          selector = document.querySelectorAll('.wmTaskV3GiftBtn-btn')[selectorIndex];
          break;
        }
        default:
          break;
      }
      if (platform === 'B站') {
        if (GM_getValue('gh_biliUseApi')) {
          getBiliViaApi();
        } else {
          const csrfToken = getCookie('bili_jct');
          const taskId = new URLSearchParams(document.location.href.split('?')[1]).get('task_id');
          // let url;
          // if (game === '原神')
          // {
          const params = new URLSearchParams({
            csrf: csrfToken,
            id: taskId,
          });
          // url = `https://api.bilibili.com/x/activity/mission/single_task?${params}`;
          // }
          // else {
          //   const params = new URLSearchParams({
          //     csrf: csrfToken,
          //     task_id: taskId,
          //   });
          //   url = `https://api.bilibili.com/x/activity_components/mission/info?${params}`;
          // }
          // 用来刷新库存
          setInterval(() => {
            fetch(`https://api.bilibili.com/x/activity/mission/single_task?${params}`, {
              credentials: 'include',
              headers: {
                Accept: 'application/json, text/plain, */*',
              },
            });
          }, 1000);
        }
      }
      if (platform === '虎牙' && !getNew) {
        setInterval(() => {
          // 虎牙重新选取下避免出问题
          selector = document.querySelectorAll('.exp-award li button')[level - 1];
          selector.click();
        }, interval);
      } else {
        if (platform === 'B站') {
          modifyBiliInfoPanel('开抢中');
        }
        setInterval(() => {
          selector.click();
        }, interval);
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
  if (platform) {
    log(`当前直播平台为${platform}，助手开始运行`);
    runPurifyProcess();
    runRobProcess();
  }
}());
