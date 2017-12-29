/**
 * Created by MACHENIKE on 2017/11/21.
 */
const User = require('../models/user')

const userInfoController =  {
    /**
     * id查找用户信息
     * @param ctx 上下文
     */
    async getUserInfoById(ctx){

           ctx.body ={
               success:true,
               data: ctx.session
           }


    },
    /**
     * 注册
     * @param ctx
     * @returns {Promise.<void>}
     */
    async register(ctx){
        let data =  ctx.request.body;
        let isExit = await User.isExitOne(data);
        let res = {
            success:false,
            message:'fail',
        }
       if(isExit.length>0){
           res.message='已存在用户名或邮箱';
       }else{
         delete  data.timestamp;
           data.create_time = new Date();
         let r =await  User.create(data);

           if ( r && r.insertId * 1 > 0) {
               res.success = true;
               res.message = '成功';

           } else {
               res.message ='添加信息失败'
           }
       }
        ctx.body = res;

    },

    /**
     * 登录
     * @param ctx
     * @returns {Promise.<void>}
     */
    async userLogin(ctx){
        let data =  ctx.request.body;
        let res = {
            success:false,
            message:'fail'
        }
        if(data.email&&data.pwd){

            let emailResult =await User.isExitByKey('email',data.email);
            if(emailResult.length>0){

                if(emailResult[0].pwd===data.pwd){
                    res.message = '登录成功';

                    let session = ctx.session;
                    ctx.cookies.set(
                        'username',
                        emailResult[0].username,
                        {
                            domain: 'localhost',  // 写cookie所在的域名
                            path: '/',       // 写cookie所在的路径
                            maxAge: 10 * 60 * 1000, // cookie有效时长
                            httpOnly: false,  // 是否只用于http请求中获取
                            overwrite: false  // 是否允许重写
                        }
                    )
                    ctx.cookies.set(
                        'isLogin',
                        true,
                        {
                            domain: 'localhost',  // 写cookie所在的域名
                            path: '/',       // 写cookie所在的路径
                            maxAge: 10 * 60 * 1000, // cookie有效时长
                            httpOnly: false,  // 是否只用于http请求中获取
                            overwrite: false  // 是否允许重写
                        }
                    )
                    session.isLogin = true;
                    session.userName = emailResult[0].username;
                    session.userId = emailResult[0].id;
                    res.success = true
                    res.data = session
                }else{
                    res.message = '密码错误'
                }
            }else{
                res.message = '邮箱不存在'
            }
            ctx.body = res
        }else{
            res.message = '数据不全';
            ctx.body = res
        }



    },
    /**
     * 退出
     * @param ctx
     * @returns {Promise.<void>}
     */
    async userLogout(ctx){
       ctx.session = {};

        ctx.cookies.set(
            'username',
            '',
            {
                domain: 'localhost',  // 写cookie所在的域名
                path: '/',       // 写cookie所在的路径
                maxAge: 10 * 60 * 1000, // cookie有效时长
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
            }
        )
        ctx.cookies.set(
            'isLogin',
            false,
            {
                domain: 'localhost',  // 写cookie所在的域名
                path: '/',       // 写cookie所在的路径
                maxAge: 10 * 60 * 1000, // cookie有效时长
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
            }
        )

       ctx.body = {
            success:true,
            message:'退出成功'
        }
    },
    async test(ctx,next){
        ctx.body = 1221
    },
    /**
     *
     * @param ctx
     * @returns {Promise.<void>}
     */
    async getUserInfo(ctx){
        if(ctx.session){
            ctx.body = {
                userName:ctx.session.userName
            }
        }

    }
}

module.exports = userInfoController;