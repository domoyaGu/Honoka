
// 自己配置行和列
const ROW = 8
const COL = 8
const CAT_NUM = 3
const names = ["A", "B", "C", "D", "E", "F", "G", "H"]
const colors = ["green", "blue", "red", "yellow", "grey", "pink"]
let colorIndex = 0
let cats = []

// 初始化迷宫属性
const initCells = {
    // 墙
    blackCells: [{x: 1, y: 1},{x: 1, y: 2},{x: 1, y: 4},{x: 1, y: 5},{x: 1, y: 6},{x: 2, y: 1},
        {x: 2, y: 6},{x: 3, y: 1},{x: 3, y: 3},{x: 3, y: 4},{x: 4, y: 3},{x: 4, y: 4},
        {x: 4, y: 6},{x: 5, y: 1},{x: 5, y: 6},{x: 6, y: 1},{x: 6, y: 2},{x: 6, y: 3},
        {x: 6, y: 5},{x: 6, y: 6}],
    // 加速块(这边坐标可改成随机生成)
    speedCells: [{x: 2, y: 0},{x: 4, y: 5}],
    // 猫(这边坐标可改成随机生成)
    catsCells: [{x: 4, y: 2},{x: 0, y: 6},{x: 0, y: 1}]
}

const mazeEvent = document.getElementById("maze")
// 迷宫长宽
mazeEvent.style.width = COL * 50 + "px"
mazeEvent.style.height = ROW * 50 + "px"

// 迷宫
class Maze {
    constructor(element) {
        let cells = []
        for (let i = 0; i < ROW; i++) {
            cells.push([])
            for (let j = 0; j < COL; j++) {
                // 格子类型
                let type = this.findType(initCells,i,j)
                let cellElement = document.createElement("div")
                cellElement.className = "cell " + (type == "black" ? "blackCell" : "whiteCell")
                let cell = new Cell(type, cellElement, i, j)
                cells[i].push(cell)
                element.appendChild(cell.element)
            }
        }
        this.cells = cells
    }
    
    findType(initCells, i, j) {
        // 格子类型
        let type = "white"
        // 黑白格子
        let isBlack = this.findCell(initCells.blackCells,i,j)
        if (!isBlack) {
            let isSpeed = this.findCell(initCells.speedCells,i,j)
            if (isSpeed) {
                type = "speed"
            } else if (this.findCell(initCells.catsCells,i,j)) {
                type = "cat"
            }
        } else {
            type = "black"
        }
        return type
    }

    findCell(arr, i, j) {
        return arr.findIndex(item => {return item.x == i && item.y == j}) > -1
    }
}

// 格子
class Cell {
    constructor(type, element, x, y){
        this.type = type
        this.element = element
        this.x = x
        this.y = y
        this.isCat = type == "cat"
        if (type != "black") {
            // 白格子初始化
            let childCell = document.createElement("div")
            childCell.className = "childCell " + type + "Cell"
            if (type == "speed") {
                // 添加加速块
                childCell.innerText = "?"
                element.appendChild(childCell)
            } else if (type == "cat") {
                // 猫的格子初始化
                childCell.style.backgroundColor = colors[colorIndex]
                childCell.innerText = names[colorIndex]
                cats.push(new Cat(colors[colorIndex], childCell, x, y))
                mazeEvent.appendChild(childCell)
                colorIndex++
            }
        }
	}
}

// 猫
class Cat{
	constructor(color, element, x, y){
		this.color = color
        this.element = element
        this.x = x
        this.y = y
        element.style.left = `calc(${y * 50 + 5}px + 50% - 200px)`
        element.style.top = (x * 50 + 55) + "px"
        this.speed = 1
        this.beforeX = -1
        this.beforeY = -1
	}

    move(cells) {
        let moveArr = []
        // 不能回头，不能越界,不能走墙
        // 往上
        let notUp = (this.x == this.beforeX && this.y - 1 == this.beforeY) || this.y - 1 < 0
        || cells[this.x][this.y - 1].type == 'black'
        if (!notUp) moveArr.push("up")
        // 往下
        let notDown = (this.x == this.beforeX && this.y + 1 == this.beforeY) || this.y + 1 > ROW - 1
        || cells[this.x][this.y + 1].type == 'black'
        if (!notDown) moveArr.push("down")
        // 往左
        let notLeft = (this.x - 1 == this.beforeX && this.y == this.beforeY) || this.x - 1 < 0
        || cells[this.x - 1][this.y].type == 'black'
        if (!notLeft) moveArr.push("left")
        // 往右
        let notRight = (this.x + 1 == this.beforeX && this.y == this.beforeY) || this.x + 1 > COL - 1
        || cells[this.x + 1][this.y].type == 'black'
        if (!notRight) moveArr.push("right")
        this.beforeX = this.x
        this.beforeY = this.y
        // 随机移动(随机生成)
        let moveType = moveArr[Math.round(Math.random() * (moveArr.length - 1))]
        switch(moveType) {
            case "up": this.y--;break
            case "down": this.y++;break
            case "left": this.x--;break
            case "right": this.x++;break
        }
        this.element.style.left = `calc(${this.y * 50 + 5}px + 50% - 200px)`
        this.element.style.top = (this.x * 50 + 55) + "px"
        // 遇到加速块,speed变为2
        if (cells[this.x][this.y].type == 'speed') {
            this.speed = 2
            // this.element.style.transition = "0.5s"
            cells[this.x][this.y].type == "white"
            cells[this.x][this.y].element.innerHTML = ""
        }
        return {x: this.x, y: this.y}
    }
}

let maze = new Maze(mazeEvent)
let cells = maze.cells

let tick = setInterval(() => {
    // 目的地坐标
    let dests = []
    // 所有猫开始移动
    for (let i = 0; i < cats.length; i++) {
        if (cats[i].speed == 2) {
            cats[i].move(cells)
            dests.push(cats[i].move(cells))
        } else {
            dests.push(cats[i].move(cells))
        }
    }
    let hasFind = false
    // 目的坐标两两相比，判断是否相遇
    for (let i = 0; i < dests.length; i++) {
        for (let j = i + 1; j < dests.length; j++) {
            if((dests[i].x == dests[j].x && Math.abs(dests[i].y - dests[j].y) <= 1) ||
                (dests[i].y == dests[j].y && Math.abs(dests[i].x - dests[j].x) <= 1)) {
                    hasFind = true
                    break    
            }
        }
        if (hasFind) break
    }
    // 如果相遇了就停止
    if (hasFind) {
        clearInterval(tick)
        alert("游戏结束")
    }
}, 800)
