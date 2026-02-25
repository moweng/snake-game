// 引入渲染模块和工具模块（通过script标签引入，无需显式导入）
// <script src="renderer.js"></script>
// <script src="utils.js"></script>

// 游戏主要类
class SnakeGame {
    constructor() {
        // 获取DOM元素
        this.canvas = document.getElementById('gameCanvas');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.lengthElement = document.getElementById('length');
        this.gameStatusElement = document.getElementById('gameStatus');

        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // 初始化渲染器
        this.renderer = new Renderer(this.canvas);

        // 游戏状态
        this.gameState = 'stopped'; // stopped, playing, paused, gameover
        this.score = 0;
        this.highScore = GameUtils.loadHighScore();
        this.snake = [];
        this.food = {};
        this.direction = { x: 1, y: 0 }; // 初始向右
        this.nextDirection = { x: 1, y: 0 };
        this.gameSpeed = 150; // 毫秒
        this.lastUpdateTime = 0;
        this.gridSize = 20; // 每个格子20像素
        this.gameWidth = this.canvas.width / this.gridSize;
        this.gameHeight = this.canvas.height / this.gridSize;

        // 初始化游戏
        this.initGame();
        this.bindEvents();
        this.updateDisplay();
    }

    initGame() {
        // 初始化蛇的位置（在中心）
        this.snake = [
            { x: Math.floor(this.gameWidth / 2), y: Math.floor(this.gameHeight / 2) },
            { x: Math.floor(this.gameWidth / 2) - 1, y: Math.floor(this.gameHeight / 2) },
            { x: Math.floor(this.gameWidth / 2) - 2, y: Math.floor(this.gameHeight / 2) }
        ];

        this.generateFood();
        this.score = 0;
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.gameSpeed = 150;
        this.gameState = 'stopped';
    }

    bindEvents() {
        // 按钮事件
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetGame());

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
    }

    handleKeyDown(event) {
        if (this.gameState === 'gameover' && event.code === 'Space') {
            this.resetGame();
            return;
        }

        // 如果是暂停状态，空格键继续游戏
        if (this.gameState === 'paused' && event.code === 'Space') {
            this.togglePause();
            return;
        }

        // 如果是停止状态，空格键开始游戏
        if (this.gameState === 'stopped' && event.code === 'Space') {
            this.startGame();
            return;
        }

        // 方向控制
        switch(event.code) {
            case 'ArrowUp':
            case 'KeyW':
                if (this.direction.y === 0 && GameUtils.isValidDirectionChange(this.direction, { x: 0, y: -1 }))
                    this.nextDirection = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
            case 'KeyS':
                if (this.direction.y === 0 && GameUtils.isValidDirectionChange(this.direction, { x: 0, y: 1 }))
                    this.nextDirection = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
            case 'KeyA':
                if (this.direction.x === 0 && GameUtils.isValidDirectionChange(this.direction, { x: -1, y: 0 }))
                    this.nextDirection = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
            case 'KeyD':
                if (this.direction.x === 0 && GameUtils.isValidDirectionChange(this.direction, { x: 1, y: 0 }))
                    this.nextDirection = { x: 1, y: 0 };
                break;
            case 'Space':
                if (this.gameState === 'playing') {
                    this.togglePause();
                }
                break;
        }
    }

    startGame() {
        if (this.gameState === 'gameover') {
            this.resetGame();
        }
        this.gameState = 'playing';
        this.gameStatusElement.textContent = '游戏中...';
        this.gameStatusElement.className = 'game-status playing';
        this.startBtn.disabled = true;
        this.resetBtn.disabled = true;
        this.lastUpdateTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.gameStatusElement.textContent = '游戏暂停 - 按空格键继续';
            this.gameStatusElement.className = 'game-status paused';
            this.pauseBtn.textContent = '继续';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.gameStatusElement.textContent = '游戏中...';
            this.gameStatusElement.className = 'game-status playing';
            this.pauseBtn.textContent = '暂停';
            this.lastUpdateTime = performance.now();
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
    }

    resetGame() {
        this.initGame();
        this.updateDisplay();
        this.gameStatusElement.textContent = '按开始游戏按钮或空格键开始';
        this.gameStatusElement.className = 'game-status';
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = false;
        this.pauseBtn.textContent = '暂停';
        this.resetBtn.disabled = false;
    }

    gameLoop(timestamp) {
        if (this.gameState !== 'playing') return;

        const elapsed = timestamp - this.lastUpdateTime;

        if (elapsed >= this.gameSpeed) {
            this.update();
            this.render();
            this.lastUpdateTime = timestamp;
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update() {
        // 更新方向
        this.direction = { ...this.nextDirection };

        // 计算新的头部位置
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // 检查碰撞边界
        if (GameUtils.checkBoundaryCollision(head, this.gameWidth, this.gameHeight)) {
            this.gameOver();
            return;
        }

        // 检查碰撞自己
        if (GameUtils.checkSelfCollision(head, this.snake)) {
            this.gameOver();
            return;
        }

        // 添加新的头部
        this.snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            // 增加分数
            this.score += 10;
            // 更新长度显示
            this.lengthElement.textContent = this.snake.length;
            // 生成新食物
            this.generateFood();
            // 提高速度（但不低于50ms）
            this.gameSpeed = Math.max(50, this.gameSpeed - 2);
        } else {
            // 没吃到食物，移除尾巴
            this.snake.pop();
        }

        this.updateDisplay();
    }

    render() {
        this.renderer.renderGame(this.snake, this.food, this.direction, this.gameWidth, this.gameHeight);
    }

    generateFood() {
        this.food = GameUtils.generateFoodPosition(this.snake, this.gameWidth, this.gameHeight);
    }

    gameOver() {
        this.gameState = 'gameover';
        this.gameStatusElement.textContent = `游戏结束! 最终得分: ${this.score} - 按空格键重新开始`;
        this.gameStatusElement.className = 'game-status game-over';
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = true;
        this.resetBtn.disabled = false;

        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            GameUtils.saveHighScore(this.highScore);
        }
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.highScoreElement.textContent = this.highScore;
        this.lengthElement.textContent = this.snake.length;
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});