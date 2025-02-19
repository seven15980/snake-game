class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.canvas.width = 600;
        this.canvas.height = 600;
        
        // 游戏网格大小
        this.gridSize = 25;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // 初始化游戏状态
        this.reset();
        
        // 绑定按钮事件
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.tutorialBtn = document.getElementById('tutorialBtn');
        this.closeTutorialBtn = document.getElementById('closeTutorialBtn');
        this.tutorialModal = document.getElementById('tutorialModal');
        
        this.startBtn.addEventListener('click', () => this.start());
        this.restartBtn.addEventListener('click', () => this.restart());
        this.tutorialBtn.addEventListener('click', () => this.showTutorial());
        this.closeTutorialBtn.addEventListener('click', () => this.hideTutorial());
        
        // 绑定键盘事件
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    
    reset() {
        // 蛇的初始位置和方向
        this.snake = [
            { x: 5, y: 5 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        
        // 食物位置
        this.food = this.generateFood();
        
        // 游戏状态
        this.isRunning = false;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.baseSpeed = 200;
        
        // 更新分数显示
        this.updateScore();
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.style.display = 'none';
            this.restartBtn.style.display = 'inline-block';
            this.gameLoop();
        }
    }
    
    restart() {
        this.reset();
        this.start();
    }
    
    handleKeyPress(event) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        
        const newDirection = keyMap[event.key];
        if (!newDirection) return;
        
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        
        if (opposites[this.direction] !== newDirection) {
            this.nextDirection = newDirection;
        }
    }
    
    update() {
        if (!this.isRunning) return;
        
        // 更新方向
        this.direction = this.nextDirection;
        
        // 计算新的头部位置
        const head = { ...this.snake[0] };
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        // 移动蛇
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    checkCollision(head) {
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // 检查自身碰撞
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }
    
    gameOver() {
        this.isRunning = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScore();
        }
        alert(`游戏结束！得分：${this.score}`);
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#2c2c2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制食物
        this.ctx.fillStyle = '#ff453a';
        this.ctx.beginPath();
        this.ctx.arc(
            (this.food.x + 0.5) * this.gridSize,
            (this.food.y + 0.5) * this.gridSize,
            this.gridSize / 2.5,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // 绘制蛇
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#32d74b' : '#30d158';
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
    }
    
    getCurrentSpeed() {
        const speedReduction = Math.floor(this.score / 100) * 20;
        return Math.max(50, this.baseSpeed - speedReduction);
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => requestAnimationFrame(() => this.gameLoop()), this.getCurrentSpeed());
    }
    
    showTutorial() {
        this.tutorialModal.style.display = 'flex';
    }
    
    hideTutorial() {
        this.tutorialModal.style.display = 'none';
    }
}

// 初始化游戏
const game = new SnakeGame(); 