import { generateService } from '@umijs/openapi'

generateService({
  requestLibPath: "import request from '@/request'", //发送请求库
  schemaPath: 'http://localhost:8123/api/v2/api-docs', //后端接口文档地址
  serversPath: './src',
})
