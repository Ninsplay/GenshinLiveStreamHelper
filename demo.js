// ==UserScript==
// @name         原神/崩坏：星穹铁道直播活动抢码助手
// @namespace    https://github.com/ifeng0188
// @version      3.6.1
// @description  一款用于原神/崩坏：星穹铁道直播活动的抢码助手，支持哔哩哔哩、虎牙、斗鱼多个平台的自动抢码，附带一些页面优化功能
// @author       原作者ifeng0188 由Ninsplay修改
// @match        *://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=*
// @match        *://zt.huya.com/*/pc/index.html
// @match        *://www.douyu.com/topic/*
// @icon         https://ys.mihoyo.com/main/favicon.ico
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @homepageURL  https://github.com/Ninsplay/GenshinLiveStreamHelper
// @supportURL   https://github.com/Ninsplay/GenshinLiveStreamHelper/issues
// @downloadURL  https://raw.fastgit.org/Ninsplay/GenshinLiveStreamHelper/main/demo.js
// @updateURL    https://raw.fastgit.org/Ninsplay/GenshinLiveStreamHelper/main/demo.js
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
    GM_setValue('gh_interval', '10,1000,100');
  }
  if (!GM_getValue('gh_autoExpand')) {
    GM_setValue('gh_autoExpand', false);
  }
  if (!GM_getValue('gh_pagePurify')) {
    GM_setValue('gh_pagePurify', false);
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
    const temp = prompt('请输入里程碑进度，输入范围1~6，天数从小到大对应相关奖励', GM_getValue('gh_reward_progress'));
    if (temp == null) return;
    if (parseInt(temp, 10) > 0 || parseInt(temp, 10) < 7) {
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
    const temp = prompt('请输入抢码间隔，格式示例：10,1000,100，即代表B站平台间隔为10毫秒 虎牙平台间隔为1000毫秒 斗鱼平台间隔为100毫秒', GM_getValue('gh_interval'));
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
  GM_registerMenuCommand(`${GM_getValue('gh_getNew') ? '✅' : '❌'}虎牙/斗鱼抢萌新任务,*抢里程碑时需关闭*（点击切换）`, switchGetNew);
  GM_registerMenuCommand(`虎牙/斗鱼抢第几个萌新任务：${GM_getValue('gh_getNewNum')}（点击修改）`, setGetNewNum);

  // 用于xpath获取元素
  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  // 移除元素
  function clearElement(el) {
    el.parentNode.removeChild(el);
  }

  // 日志
  function log(msg) {
    console.info(`【原神直播活动抢码助手】${msg}`);
  }

  // 运行净化进程
  function runPurifyProcess() {
    if ((platform !== 'B站') && (!platform || !game)) {
      alert('未检测到平台或游戏，无法执行脚本');
      return;
    }

    if (GM_getValue('gh_autoExpand')) {
      switch (platform) {
        case '虎牙':
          document.querySelectorAll('.J_item')[1].click();
          setTimeout(() => {
            if (game === '星穹铁道') {
              const selectorIndex = GM_getValue('gh_getNew') ? 2 : 1;
              document.querySelectorAll('.J_holder')[selectorIndex].click();
            }
            document.querySelectorAll('.J_expBox')[0].scrollIntoView();
          }, 5000);
          break;
        case '斗鱼': {
          const selectorId = game === '原神' ? '#bc68' : '#bc58';
          const timer = setInterval(() => {
            if (document.querySelectorAll(selectorId)[0]) {
              clearInterval(timer);
              document.querySelectorAll(selectorId)[0].click();
              let selectorIndex = 0;
              if (game === '星穹铁道') {
                document.querySelectorAll('#bc92')[0].click();
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
          if (document.querySelectorAll('div[title="暂停"]')[0]) {
            clearInterval(timer);
            document.querySelectorAll('div[title="暂停"]')[0].click();
            clearElement(document.querySelectorAll('.wm-general')[1]);
          }
        }, 2000);
      }
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

    // 抢码实现
    function rob() {
      log('助手开始领取，如若出现数据异常为正常情况');
      if (platform === '虎牙' && !getNew) {
        const timer = setInterval(() => {
          document.querySelectorAll('div[title="10经验值"]+button')[0].click();
          document.querySelectorAll('.exp-award .reload')[0].click();
          if (document.querySelectorAll('div[title="10经验值"]+button')[0].innerText === '已领取') {
            clearInterval(timer);
            setTimeout(() => {
              Array.from(document.querySelectorAll('.J_dcpConfirm')).forEach((e) => {
                e.click();
              });
            }, 1000);
          }
        }, interval);
      }
      let selector;
      switch (platform) {
        case 'B站':
          [selector] = document.querySelectorAll('.exchange-button');
          break;
        case '虎牙':
        {
          if (!getNew) {
            selector = document.querySelectorAll('.exp-award li button')[level - 1];
            break;
          }
          // 很蠢，但能用
          selector = getElementByXpath(`//*[@id="matchComponent23"]/div/div/div[1]/div[2]/div[2]/div/div/div[${GM_getValue('gh_getNewNum')}]/div/div[3]`);
          const timer = setInterval(() => {
            document.querySelectorAll('.J_comp_23 .reload-item')[0].click();
            if (selector.innerText !== '未完成') {
              clearInterval(timer);
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
          } else {
            selectorIndex = level - 1;
          }
          selector = document.querySelectorAll('.wmTaskV3GiftBtn-btn')[selectorIndex];
          break;
        }
        default:
          break;
      }
      setInterval(() => {
        selector.click();
      }, interval);
    }
    // 等待开抢
    const timer = setInterval(() => {
      const date = new Date();
      if (date.getHours() === startHour && date.getMinutes() === startMin && date.getSeconds() >= startSec) {
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
