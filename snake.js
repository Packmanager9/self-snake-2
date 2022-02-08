let gridx 
window.addEventListener('DOMContentLoaded', (event) => {
    let canvas
    let canvas_context
    let keysPressed = {}
    let FLEX_engine
    let TIP_engine = {}
    let XS_engine
    let YS_engine
    TIP_engine.x = 350
    TIP_engine.y = 350
    function setUp(canvas_pass, style = "#000000") {
        canvas = canvas_pass
        canvas_context = canvas.getContext('2d');
        canvas.style.background = style
        window.setInterval(function () {
            // player.health = 1
            main()
        }, 1)
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            delete keysPressed[event.key];
        });
        window.addEventListener('pointerdown', e => {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine 
            TIP_engine.y = YS_engine 
            TIP_engine.body = TIP_engine
            // gridx.head.pather.search(gridx.food)

        });
        window.addEventListener('pointermove', continued_stimuli);

        window.addEventListener('pointerup', e => {
        })
        function continued_stimuli(e) {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine 
            TIP_engine.y = YS_engine 
            TIP_engine.body = TIP_engine
        }
    }
    let setup_canvas = document.getElementById('canvas') 
    setUp(setup_canvas)

    class Rectangle {
        constructor(x, y, width, height, color, fill = 1, stroke = 0, strokeWidth = 1) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
            this.stroke = stroke
            this.strokeWidth = strokeWidth
            this.fill = fill
            this.xforce = (Math.random() - .5) * 100
            this.yforce = (Math.random() - .5) * 100
            this.tail = 0
            this.walkable = true
            this.occupied = false
            this.closed = false

    // //////console.log(astar)
            this.pather = astar
        }

        getValueF() {
            //this is a problem
            var fValue = (this.getValueH()) + (this.getValueG());

            return (fValue);
        }
        getValueH() {
            var endNodePosition = {
                posx: endPoint.x,
                posy: endPoint.y
            };

            return (getDistance(this, endNodePosition));

        }
        getValueG() {
            var startPointPosition = {
                posx: endPoint.x,
                posy: endPoint.y
            };
            return (getDistance(this, startPointPosition));
        }
        getCost(fromNeighbor) {
            // Take diagonal weight into consideration.
            if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
                return this.weight * 1.41421;
            }
            return this.weight;
        }
        isWall(){
            if(this.tail > 0){
                return true
            }else{
                return false
            }
        }
        draw() {
            if(this.tail > 0){
                this.color = `rgba(${255-(this.tail*8)},${this.tail*8},${this.tail*this.tail})`
                canvas_context.fillStyle = this.color
                canvas_context.strokeStyle = this.color
            }else{
            canvas_context.fillStyle = this.color+"81"
            canvas_context.strokeStyle = this.color+"81"
            }
            canvas_context.lineWidth = .5
            canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move() {
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point) {
            if (point.x >= this.x) {
                if (point.y >= this.y) {
                    if (point.x <= this.x + this.width) {
                        if (point.y <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            if (point.x + point.radius >= this.x) {
                if (point.y + point.radius >= this.y) {
                    if (point.x - point.radius <= this.x + this.width) {
                        if (point.y - point.radius <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Grid{
        constructor(size){
            this.size = size
            this.grid = []
            this.steps = []
            for(let t = 0;t<size;t++){
                this.column = []
                for(let k = 0;k<size;k++){
                    let rectangle = new Rectangle(t*20, k*20, 20,20, "#000000")
                    rectangle.t = t
                    rectangle.k = k
                    this.column.push(rectangle)
                }
                this.grid.push(this.column)
            }
            this.grid[Math.floor(size*.5)][Math.floor(size*.5)].head = 1
            this.xdir = 0
            this.ydir = 0
            this.grid[Math.floor(size*.9)][Math.floor(size*.9)].food = 1
            this.length = 0
            this.diagonal = false
            this.food = this.grid[Math.floor(size*.9)][Math.floor(size*.9)]
            this.head =  this.grid[Math.floor(size*.5)][Math.floor(size*.5)]
            this.path = []
            this.dirtyNodes = []
            this.createGrid()

            this.head.pather.search(this, this.head, this.food)
        }
        crash(){
            this.length = 3
            for(let t = 0;t<this.grid.length;t++){
                for(let k = 0;k<this.grid[t].length;k++){
                    this.grid[t][k].head = 0
                    this.grid[t][k].ate = 0
                    this.grid[t][k].tail = 0
                    // this.grid[t][k].head = 0
                }
            }
            this.grid[Math.floor(this.size*.5)][Math.floor(this.size*.5)].head = 1
            for(let t = 0;t<this.grid.length;t++){
                for(let k = 0;k<this.grid[t].length;k++){
                    this.grid[t][k].tail = 0
                }
            }
        }

        cleanDirty() {
            for (var i = 0; i < this.dirtyNodes.length; i++) {
                astar.cleanNode(this.dirtyNodes[i]);
            }
            this.dirtyNodes = [];
        }
        markDirty(node) {
            this.dirtyNodes.push(node);
        }
        neighbors(node) {

            var ret = [];
            var x = node.t;
            var y = node.k;
            var grid = this.grid;

            // West
            if (grid[x - 1] && grid[x - 1][y]) {
                ret.push(grid[x - 1][y]);
            }

            // East
            if (grid[x + 1] && grid[x + 1][y]) {
                ret.push(grid[x + 1][y]);
            }

            // South
            if (grid[x] && grid[x][y - 1]) {
                ret.push(grid[x][y - 1]);
            }

            // North
            if (grid[x] && grid[x][y + 1]) {
                ret.push(grid[x][y + 1]);
            }

            if (this.diagonal) {
                // Southwest
                if (grid[x - 1] && grid[x - 1][y - 1]) {
                    ret.push(grid[x - 1][y - 1]);
                }

                // Southeast
                if (grid[x + 1] && grid[x + 1][y - 1]) {
                    ret.push(grid[x + 1][y - 1]);
                }

                // Northwest
                if (grid[x - 1] && grid[x - 1][y + 1]) {
                    ret.push(grid[x - 1][y + 1]);
                }

                // Northeast
                if (grid[x + 1] && grid[x + 1][y + 1]) {
                    ret.push(grid[x + 1][y + 1]);
                }
            }

            return ret;
        }
        createGrid() {
            let NODESIZE = 20
            var tempNode;
            var countNodes = 0;
            for (var i = 0; i < this.width; i += NODESIZE) {
                gridPointsByPos[i] = [];
                for (var j = 0; j < this.height; j += NODESIZE) {
                    gridPointsByPos[i][j] = countNodes;
                    tempNode = new Rectangle(i, j, 20, 20, "tan", countNodes, NODESIZE, i, j, true);
                    tempNode.F = tempNode.getValueF();
                    this.gridPoints.push(tempNode);
                    countNodes++;
                }
            }
        }

        draw(){
            // //console.log(this.path)
            // if(this.path.length > 0){
            //     if(this.path[1].t > this.head.t){
            //         if(this.xdir != -1){
            //         this.ydir = 0
            //         this.xdir = 1
            //     }else{
            //         this.ydir =  Math.sign(Math.random()-.5)
            //         this.xdir =  0
            //     }
            //     }else if(this.path[1].k > this.head.k){
            //         if(this.ydir != -1){
            //         this.ydir = 1
            //         this.xdir = 0
            //     }else{
            //         this.ydir = 0
            //         this.xdir =  Math.sign(Math.random()-.5)
            //     }
            //     }else if(this.path[1].t < this.head.t){
            //         if(this.xdir != 1){
            //         this.ydir = 0
            //         this.xdir = -1
            //     }else{
            //         this.ydir =  Math.sign(Math.random()-.5)
            //         this.xdir =  0
            //     }
            //     }else if(this.path[1].k < this.head.k){
            //             if(this.ydir != 1){
            //                 this.ydir = -1
            //                 this.xdir = 0
            //             }else{
            //                 this.ydir = 0
            //                 this.xdir =  Math.sign(Math.random()-.5)
            //             }
            //     }
            // }
            if(this.path.length > 1 && this.head){
            this.xdir = -Math.sign(this.head.t-this.path[1].t)
            this.ydir = -Math.sign(this.head.k-this.path[1].k)
            // if(this.head.t+this.xdir >= this.grid.length){
            //     this.ydir = -Math.sign(this.head.k-this.path[1].k)
            //     this.xdir = 0
            // }else if(this.head.t+this.xdir < 0){
            //     this.ydir = 0
            //     this.xdir = -Math.sign(this.head.t-this.path[1].t)
            // }else if(this.head.k+this.ydir >= this.grid.length){
            //     this.ydir = 0
            //     this.xdir = -Math.sign(this.head.t-this.path[1].t)
            // }else if(this.head.k+this.ydir < 0){
            //     this.ydir = -Math.sign(this.head.k-this.path[1].k)
            //     this.xdir = 0
            // }else if(this.grid[this.head.t+this.xdir][this.head.k+this.ydir].tail >= 1){
                let j = 0
                while(this.head.t+this.xdir >= this.grid.length    ||    this.head.t+this.xdir < 0   ||   this.head.k+this.ydir >= this.grid.length  ||  this.head.k+this.ydir < 0 ){
                    j++
                    if(j > 1000){
                        break
                    }
                    this.ydir = Math.sign(Math.random()-.5)
                    this.xdir = Math.sign(Math.random()-.5)

                    this.path = []
                    this.head.pather.search(this, this.head, this.food)
                }

                if(this.grid[this.head.t+this.xdir] ){
                    let j = 0
                    while(this.grid[this.head.t+this.xdir][this.head.k+this.ydir].tail >= 1){
                        j++
                        if(j > 1000){
                            break
                        }
                        this.ydir = Math.sign(Math.random()-.5)
                        this.xdir = Math.sign(Math.random()-.5)
    
                        this.path = []
                        this.head.pather.search(this, this.head, this.food)
                    }
                }
            // }else{

            }
            let j = 0
            while(this.head.t+this.xdir >= this.grid.length    ||    this.head.t+this.xdir < 0   ||   this.head.k+this.ydir >= this.grid.length  ||  this.head.k+this.ydir < 0 ){
                j++
                if(j > 1000){
                    break
                }
                if(Math.random()<.5){
                    this.ydir = Math.sign(Math.random()-.5)
                    this.xdir = 0
                }else{
                    this.ydir = 0
                    this.xdir = Math.sign(Math.random()-.5)
                }

                this.path = []
                this.head.pather.search(this, this.head, this.food)
            }

            if(Math.random()<.01){
                this.path = []
                this.head.pather.search(this, this.head, this.food)

            }

            if(this.grid[this.head.t+this.xdir] ){
                let j = 0
                while(this.grid[this.head.t+this.xdir][this.head.k+this.ydir].tail >= 1){
                    j++
                    if(j > 1000){
                        break
                    }
                    if(Math.random()<.5){
                        this.ydir = Math.sign(Math.random()-.5)
                        this.xdir = 0
                    }else{
                        this.ydir = 0
                        this.xdir = Math.sign(Math.random()-.5)
                    }
                    this.path = []
                    this.head.pather.search(this, this.head, this.food)
                }
            }
            ////console.log(this.path)
            // if(keysPressed['w']){
            //     if(this.ydir != 1){
            //         // //////console.log('hitw2')
            //         this.ydir = -1
            //         this.xdir = 0
            //     }
            // }
            // if(keysPressed['s']){
            //     if(this.ydir != -1){
            //         // //////console.log('hits2')
            //         this.ydir = 1
            //         this.xdir = 0
            //     }
            // }
            // if(keysPressed['a']){
            //     //////console.log('hita')
            //     if(this.xdir != 1){
            //         // //////console.log('hit2')
            //         this.xdir = -1
            //         this.ydir = 0
            //     }
            // }
            // if(keysPressed['d']){
            //     //////console.log('hitd')
            //     if(this.xdir != -1){
            //         // //////console.log('hitd2')
            //         this.xdir = 1
            //         this.ydir = 0
            //     }
            // }
            //////console.log(this.xdir, this.ydir)

            this.headmove = 0
            for(let t = 0;t<this.grid.length;t++){
                for(let k = 0;k<this.grid[t].length;k++){
                    if(this.grid[t][k].head == 1 &&  this.headmove == 0){
                        this.headmove = 1
                        this.grid[t][k].color = "#FF0000"
                        if(t+this.xdir > this.grid[t].length){
                            this.crash()
                        }else if(t+this.xdir < 0){
                            this.crash()
                        }else if(k+this.ydir > this.grid[t].length){
                            this.crash()
                        }else if(k+this.ydir < 0){
                            this.crash()
                        }else if(this.grid[t+this.xdir][k+this.ydir].tail >= 1){
                        this.crash()
                        }else{
                            this.grid[t][k].tail = this.length
                            this.grid[t][k].head = 0
                            this.grid[t+this.xdir][k+this.ydir].head = 1
                            this.head = this.grid[t+this.xdir][k+this.ydir]
                            if(this.path.includes(this.head) && this.path.indexOf(this.head) > 0 ){
                                this.path.splice((this.path.indexOf(this.head)),1)
                            }
                            if(this.grid[t+this.xdir][k+this.ydir].food == 1){
                                this.length++
                                this.grid[t+this.xdir][k+this.ydir].ate=1
                                this.grid[t+this.xdir][k+this.ydir].food=0
                                let x = Math.floor(Math.random()*this.size*1)
                                let y = Math.floor(Math.random()*this.size*1)
                                this.food = this.grid[x][y]
                                this.grid[x][y].food = 1
                                this.path = []
                                this.head.pather.search(this, this.head, this.food)
                            }
                        }


                    }else if(this.grid[t][k].food >= 1){
                        // this.head.pather.search(this, this.head, this.food)

                        if(this.grid[t][k].tail <= 1){
                            this.grid[t][k].color = "#000000"
                            this.grid[t][k].ate = 0
                        }
                        this.grid[t][k].color = "#FFFF00"
                        if(this.grid[t][k].color == "#00FFFF" ){
                            this.grid[t][k].color = "#000000"
                        }
                    }else if(this.grid[t][k].tail >= 1){
                        this.grid[t][k].color = "#0000ff"
                        this.grid[t][k].tail--
                        if(this.grid[t][k].color == "#00FFFF" && this.grid[t][k].tail <= 1){
                            this.grid[t][k].ate = 0
                            this.grid[t][k].color = "#000000"
                        }
                        if(this.grid[t][k].ate >= 1){
                            this.grid[t][k].color = "#00FFFF"
                            // if(this.grid[t][k].color == "cyan" && this.grid[t][k].tail <= 1){
                            //     this.grid[t][k].ate = 0
                            //     this.grid[t][k].color = "black"
                            // }

                        }
                        // if(this.grid[t][k].tail <= 1){
                        //     this.grid[t][k].color = "black"
                        //     this.grid[t][k].ate = 0
                        // }
                    }else{
                        this.grid[t][k].color = "#000000"
                        if(this.grid[t][k].color == "#00FFFF" ){
                            this.grid[t][k].color = "#000000"
                        }

                        if(this.grid[t][k].tail <= 1){
                            this.grid[t][k].color = "#000000"
                            this.grid[t][k].ate = 0
                        }
                    }
                    // if(this.path.includes(this.grid[t][k])){
                        // this.grid[t][k].color = "red"
                    // }
                    this.grid[t][k].draw()
                }
            }
        }
    }

    let gridx = new Grid(40)

    function main(){
        canvas_context.clearRect(0,0,800,800)
        gridx.draw()
    }

})