import {defineConfig} from '@playwright/test';
const port=Number(process.env.PRODUCT_TEST_PORT||14323);
export default defineConfig({
  testDir:'./e2e', workers:2, timeout:30000, reporter:[['list'],['html',{open:'never'}]],
  use:{baseURL:'http://127.0.0.1:'+port,trace:'retain-on-failure'},
  projects:['chromium','webkit'].flatMap(browserName=>[
    {name:browserName+'-desktop',use:{browserName,viewport:{width:1440,height:900}}},
    {name:browserName+'-mobile',use:{browserName,viewport:{width:440,height:956},isMobile:true,hasTouch:true,deviceScaleFactor:3}},
  ]),
  webServer:{command:'npm run preview -- --host 127.0.0.1 --port '+port,url:'http://127.0.0.1:'+port,reuseExistingServer:false}
});
