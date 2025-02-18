#!/bin/bash
# 苏州本地服务

project="lp"
version=`date +%Y%m%d%H%M%S`

apiUrl="http://ym.api.com:8888"

dockerHost="192.168.3.36"
dockerLoginUsr="admin"
dockerLoginPwd="Root123456"
dockerPath="192.168.3.36/ym-web"

rancherHost="https://192.168.3.70/v3"
rancherToken="token-ml6cl:pqx4k2fpk9jhjxqxh784hdmhp26rv2hd7nnbrn5qnv7nxpr25mdczm"
rancherProjectId="c-c48ss:p-lxv2f"

echo "开始执行脚本"

echo -------------------------------------

#切换node版本
n 18.14.1

/usr/local/n/versions/node/18.14.1/bin/npm i
/usr/local/n/versions/node/18.14.1/bin/npm run build:dev

if [ $? -eq 0 ];then
    echo "npm 编译通过"
else
    echo "!!! npm 编译失败!" && exit 1
fi
sleep 2

#切换node版本
n 14.21.1

cat >nginx-local.conf << EOF
server {
    listen       80;
    server_name  127.0.0.1;
    client_max_body_size 100m;
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

docker login -u "$dockerLoginUsr" -p "$dockerLoginPwd" "$dockerHost"

echo "开始push新镜像到私服！"
docker push $dockerPath/$project:$version
[ $? != 0 ] && echo "请注意，在执行push上传时出错，故而退出！" && exit 1
docker rmi $dockerPath/$project:$version

echo "开始将新镜像部署到远端！"
rancher login "$rancherHost" --token "$rancherToken" --skip-verify --context "$rancherProjectId"

rancher kubectl set image deployment/$project $project=$dockerPath/$project:$version -n web
[ $? != 0 ] && echo "请注意，在执行镜像更新时出错，故而退出！" && exit 1

echo "部署完成！"
