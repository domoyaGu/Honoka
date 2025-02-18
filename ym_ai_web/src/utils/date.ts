import dayjs from 'dayjs';

// 入参 fmt-格式 date-日期
export function dateFormat(fmt: string, date: Date) {
  let ret: RegExpExecArray;
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'D+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      );
    }
  }
  return fmt;
}

/**
 * 计算相差天数
 */
export function dateDiff(Date_start, Date_end) {
  const dateStart = new Date(
    dayjs(dayjs(Date_start).format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss')
  );
  const dateEnd = new Date(
    dayjs(dayjs(Date_end).format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss')
  );
  let iDays = null;
  iDays = parseInt(
    (
      Math.abs(Number(dateEnd) - Number(dateStart)) /
      1000 /
      60 /
      60 /
      24
    ).toString()
  ); //把相差的毫秒数转换为天数
  return iDays;
}

/**
 * 计算相差小时数
 */
export function hourDiff(Date_start, Date_end) {
  const dateStart = new Date(
    dayjs(dayjs(Date_start).format('YYYY-MM-DD HH')).format(
      'YYYY-MM-DD HH:mm:ss'
    )
  );
  const dateEnd = new Date(
    dayjs(dayjs(Date_end).format('YYYY-MM-DD HH')).format('YYYY-MM-DD HH:mm:ss')
  );
  let iHours = null;
  iHours = parseInt(
    (Math.abs(Number(dateEnd) - Number(dateStart)) / 1000 / 60 / 60).toString()
  ); //把相差的毫秒数转换为小时数
  return iHours;
}
