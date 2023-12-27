前端使用到的包antd,axios等。（package.json）应该有。

2023.12.20 后端已全部完成，已用postman测试，可以正常实现增删查改数据和标签，并且实现了添加数据后自动添加相关标签，以及无法删除

2023.12.21 修改了后端的逻辑，解决了一些bug；基本实现了前端data页面的功能，对后端反馈的数据进行了重新编号，确保不会出现因为删除而出现断号的情况

2023.12.23 已经实现了全部要求，前后端可以正常运行

2023.12.24 完蛋，要求用ts写，GG

2023.12.26 已经重新用ts写了一遍

2023.12.27 发现bug，由于后端逻辑有问题：由于data里面只存了标签的name，更新标签后并不会更新存储在data里面的标签的name

​					bug已修正

## PS:后端使用指令npm run initDB初始化数据库

进入server 目录，执行npm run start 启动3001端口
进入client 目录，执行npm run start启动3000端口
停掉3000端口
进入client 目录，执行npm run build命令，编译前端代码到client/build目录。在server代码中，使用 koa-static将这个目录变为静态资源目录
打开 http://localhost:3001/index.html，体验功能

