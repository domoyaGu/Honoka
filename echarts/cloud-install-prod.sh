#!/bin/bash
# 生产环境

project="prod-web-cb"
version=`date +%Y%m%d%H%M%S`

apiUrl="http://ym.api.com:8888"

dockerLoginUsr="cn-east-3@7HGSKMGFFAQ1F0ZXFEKI"
dockerLoginPwd="bde5cd05c04af081c31a0faee80ae983652a28d7b18dfaac652ae7a1627853e2"
dockerPath="swr.cn-east-3.myhuaweicloud.com/ym-web2"

rancherHost="https://121.36.246.204/v3"
rancherToken="token-b76br:98ww8q8m9526gc72g5p7ptldhgggkn8bhmx4lc987kw6rzw6np684f"
rancherProjectId="c-2f85w:p-76nfv"

echo "开始执行脚本"

echo -------------------------------------

/usr/local/n/versions/node/14.17.3/bin/npm i
/usr/local/n/versions/node/14.17.3/bin/npm run build:prod
if [ $? -eq 0 ];then
    echo "npm 编译通过"
else
    echo "!!! npm 编译失败!" && exit 1
fi
sleep 2

cat >nginx-local.conf << EOF
server {
    listen       80;
    server_name  127.0.0.1;
    client_max_body_size 50m;
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    location /api {
        proxy_pass $apiUrl;
        proxy_set_header Host \$host:\$server_port;
    }
}
EOF

cat >Dockerfile << EOF
FROM nginx
COPY dist/  /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx-local.conf /etc/nginx/conf.d/
RUN echo 'docker init ok!!'
EOF

echo "开始构建当次镜像！"
docker build -t $dockerPath/$project:$version .
echo "镜像构建完成！$dockerPath/$project:$version"

docker login -u "$dockerLoginUsr" -p "$dockerLoginPwd" swr.cn-east-3.myhuaweicloud.com

echo "开始push新镜像到私服！"
docker push $dockerPath/$project:$version
[ $? != 0 ] && echo "请注意，在执行push上传时出错，故而退出！" && exit 1
docker rmi $dockerPath/$project:$version

echo "开始将新镜像部署到远端！"
rancher login "$rancherHost" --token "$rancherToken" --skip-verify --context "$rancherProjectId"

rancher kubectl set image deployment/$project $project=$dockerPath/$project:$version -n web
[ $? != 0 ] && echo "请注意，在执行镜像更新时出错，故而退出！" && exit 1
echo "部署完成！"
