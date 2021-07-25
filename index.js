"use strict"

const phantom = require('phantom');
const debug = console.log;

const timeout = ms => new Promise(res => setTimeout(res, ms))

var account = 'testizone';
var password = 'mswallow9*8';

// 셀렉터 대기
async function waitForSelector(page, selector, timeOutMillis) {
    return new Promise((res)=>{
        var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000;
        var start = new Date().getTime();

        var timer = setInterval(async ()=>{
            //console.log('wait..');

            if (new Date().getTime() - start >= maxtimeOutMillis) {
                debug("'waitFor()' timeout");
                clearTimeout(timer);
                res(false);
            }

            var ret = await page.evaluate(function (selector) {
                return document.querySelectorAll(selector).length;
            }, selector);
            if (ret) {
                clearTimeout(timer);
                res(true);
            }
        }, 250);
    });
}

// 로그인
async function dc_login(page) {
    debug('--dc_login');
    var url = 'https://m.dcinside.com/auth/login?r_url=https%3A%2F%2Fm.dcinside.com';
    const status = await page.open(url);
    var ret = false;

    ret = await waitForSelector(page, '#user_id');

    if (!ret) return false;

    await page.evaluate(function (account, password) {
        var form = document.getElementById('login_process');
        form.user_id.value = account;
        form.user_pw.value = password;
        document.getElementById('login_ok').click();
    }, account, password);

    ret = await waitForSelector(page, '.login-box');

    if (!ret) {
        debug('timeout!');
    }
    debug(ret);

    //await page.render('login.png')

    if (!ret) return false;

    return true;
}

// 글작성
async function dc_writer(page, gall, subject, memo) {
    debug('--dc_writer');
    var url = 'http://m.dcinside.com/write/'+gall;
    const status = await page.open(url);
    var ret = false;

    ret = await waitForSelector(page, '.gall-tit');
    if (!ret) {
        return 'timeout';
    }

    ret = await page.evaluate(function (selector) {
        return document.querySelectorAll(selector).length;
    }, '#name');
    if (ret) {
        return 'logout';
    }

    await page.evaluate(function (subject, memo) {
        var form = document.getElementById('writeForm');

        document.getElementById('subject').value = subject;
        document.getElementById('textBox').innerHTML = memo;
        document.getElementById('memo').value = memo;

        write_submit();
    }, subject, memo);

    await timeout(3000);

    //await page.render('write.png')

    return 'write';
}

// 메인루프
(async ()=>{
    const instance = await phantom.create();

    try {
        var ret = false;

        var page = await instance.createPage();
        ret = await dc_login(page);
        if (!ret) {
            debug('login fail');
            throw new Error('login fail');
        }
        await page.close();

        var running = true;
        while (running) {
            debug('--running');
            page = await instance.createPage();

            var gallid = '[top12]';
            var subject = '제목입니다.';
            var memo = '내용입니다.<br/>test content<br/>test content';

            var ret = await dc_writer(page, gallid, subject, memo);
            debug(ret);
            if (ret=='write') {
                // 성공
            }

            await page.close();
            await timeout(60 * 60 * 1000); //한시간 대기
        }

        debug('--end');
    } catch(e) {
        debug(e);
    }

    await instance.exit();
})();