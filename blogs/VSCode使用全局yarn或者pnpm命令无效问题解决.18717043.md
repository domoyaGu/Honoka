## 问题描述
  VSCode 终端显示“pnpm : 无法加载文件 C:\Program Files\nodejs\pnpm.ps1，因为在此系统上禁止运行脚本”，而用管理员打开命令行是可以查到pnpm命令的。

## 原因
  VSCode并没有获得系统管理员的权利使用命令行，可以使用*get-ExecutionPolicy*获取当前系统的执行策略。
  > 执行策略是指控制PowerShell脚本在系统上运行的安全策略，用于控制脚本的执行权限。通过运行get-ExecutionPolicy命令，可以查看当前系统的执行策略设置。
  ```
  执行策略的类型及其含义
  ‌Restricted‌：最严格的策略，只允许签名的脚本运行。
  ‌AllSigned‌：所有未经签名的脚本会被阻止。
  ‌Unrestricted‌：允许所有脚本运行。
  ‌Bypass‌：禁用策略，但不推荐使用。
  ‌RemoteSigned‌：本地脚本无限制，但来自网络的脚本必须经过签名‌
  ```
  由于VSCode是*‌Restricted*策略，所以没有权限运行yarn或者pnpm脚本，只需要修改成*RemoteSigned*或者*‌AllSigned*(不建议，会有安全性问题)。
## 解决
  在VSCode的终端运行以下命令即可:
  ```
  set-ExecutionPolicy RemoteSigned
  ```
  如果提示需要管理员权限，可加参数运行
  ```
  set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```
