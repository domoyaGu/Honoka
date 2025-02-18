// ES6模块化语法导入
import $ from 'jquery'
import './css/index.css'
import './less/index.less'

// 隔行变色
$(function() {
    $('li:odd').css('backgroundColor', 'green')
    $('li:even').css('backgroundColor', 'cyan')
})

class Person {
    static info = "testss"
}

consle.log(Person.info)