# 获取正在监听 3000 端口的进程号
PORT=3000
PID=$(lsof -t -i:$PORT)

# 如果进程号存在，则杀死进程
if [ -n "$PID" ]; then
  echo "Killing process on port $PORT: $PID"
  kill $PID
fi

nohup yarn start >/opt/eminstore/log/storefront-run.log 2>&1 &